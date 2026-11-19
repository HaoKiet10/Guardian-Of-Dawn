using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TestTools;
using Object = UnityEngine.Object;

namespace GuardianOfDawn.Tests
{
    // Builds every scenario in code: definitions/traits via CreateInstance, private serialized fields via reflection,
    // GameObjects for path points, wall, wax and structures. Everything is destroyed in TearDown.
    public abstract class GameplayTestBase
    {
        private readonly List<Object> created = new List<Object>();
        private WaxPath parkPath;

        [UnityTearDown]
        public IEnumerator TearDownWorld()
        {
            Time.timeScale = 1f;
            foreach (Wax wax in WaxRegistry.Waxes.ToList())
            {
                if (wax != null) Object.Destroy(wax.gameObject);
            }
            foreach (Structure structure in StructureRegistry.Structures.ToList())
            {
                if (structure != null) Object.Destroy(structure.gameObject);
            }
            foreach (GameObject root in SceneManager.GetActiveScene().GetRootGameObjects())
            {
                if (root.GetComponentInChildren<SolventPuddle>(true) != null || root.GetComponentInChildren<Wax>(true) != null)
                {
                    Object.Destroy(root);
                }
            }
            foreach (Object o in this.created)
            {
                if (o != null) Object.Destroy(o);
            }
            this.created.Clear();
            this.parkPath = null;
            yield return null;
            yield return null;
            Assert.AreEqual(0, WaxRegistry.Waxes.Count, "wax left over after teardown");
            Assert.AreEqual(0, StructureRegistry.Structures.Count, "structures left over after teardown");
        }

        // ── reflection ──

        protected static void SetField(object target, string name, object value)
        {
            FieldInfo field = FindField(target.GetType(), name);
            field.SetValue(target, value);
        }

        protected static T GetField<T>(object target, string name)
        {
            return (T)FindField(target.GetType(), name).GetValue(target);
        }

        private static FieldInfo FindField(Type type, string name)
        {
            for (Type t = type; t != null; t = t.BaseType)
            {
                FieldInfo f = t.GetField(name, BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
                if (f != null) return f;
            }
            throw new MissingFieldException(type.Name, name);
        }

        protected T Track<T>(T o) where T : Object
        {
            this.created.Add(o);
            return o;
        }

        // ── data ──

        protected WaxDefinition WaxDef(float maxHp = 100f, float speed = 1f, float wallDps = 1f, bool isLarge = false,
                                       WaxTrait traits = null)
        {
            WaxDefinition def = Track(ScriptableObject.CreateInstance<WaxDefinition>());
            SetField(def, "displayName", "Test Wax");
            SetField(def, "maxHp", maxHp);
            SetField(def, "speed", speed);
            SetField(def, "wallDamagePerSecond", wallDps);
            SetField(def, "isLarge", isLarge);
            SetField(def, "traits", traits != null ? new[] { traits } : new WaxTrait[0]);
            return def;
        }

        protected T Trait<T>(params (string field, object value)[] fields) where T : WaxTrait
        {
            T trait = Track(ScriptableObject.CreateInstance<T>());
            foreach (var (field, value) in fields) SetField(trait, field, value);
            return trait;
        }

        protected StructureDefinition StructDef(float range, float tba, float damage, DamageType type = DamageType.Bullet)
        {
            StructureDefinition def = Track(ScriptableObject.CreateInstance<StructureDefinition>());
            SetField(def, "displayName", "Test Structure");
            SetField(def, "range", range);
            SetField(def, "tba", tba);
            SetField(def, "damage", damage);
            SetField(def, "damageType", type);
            return def;
        }

        // ── scene objects ──

        protected Wall MakeWall(Vector2 position, float maxHp = 100f)
        {
            var go = new GameObject("Test Wall");
            go.SetActive(false);
            go.transform.position = position;
            Wall wall = go.AddComponent<Wall>();
            SetField(wall, "maxHp", maxHp);
            go.SetActive(true);
            Track(go);
            return wall;
        }

        protected WaxPath MakePath(Wall wall, params Vector2[] points)
        {
            var go = new GameObject("Test Path");
            var transforms = new Transform[points.Length];
            for (int i = 0; i < points.Length; i++)
            {
                var p = new GameObject("Point " + i).transform;
                p.SetParent(go.transform, false);
                p.position = points[i];
                transforms[i] = p;
            }
            WaxPath path = go.AddComponent<WaxPath>();
            SetField(path, "waypoints", transforms);
            SetField(path, "wall", wall);
            Track(go);
            return path;
        }

        // Starts at the first point of the path.
        protected Wax SpawnWax(WaxDefinition def, WaxPath path)
        {
            var go = new GameObject("Test Wax");
            Wax wax = go.AddComponent<Wax>();
            wax.Init(def, path);
            return wax;
        }

        protected Wax SpawnWaxAt(WaxDefinition def, WaxPath path, Vector2 position, int nextWayPoint, float distance = 0f)
        {
            var go = new GameObject("Test Wax");
            Wax wax = go.AddComponent<Wax>();
            wax.InitPartway(def, path, position, nextWayPoint, distance);
            return wax;
        }

        // A wax that stands still: on a one-point path with no wall it goes straight to "attacking" a missing wall.
        protected Wax Park(WaxDefinition def, Vector2 position)
        {
            if (this.parkPath == null) this.parkPath = MakePath(null, new Vector2(-1000f, -1000f));
            return SpawnWaxAt(def, this.parkPath, position, 1);
        }

        protected Structure MakeStructure<TAction>(StructureDefinition def, Vector2 position,
                                                   Action<TAction> configure = null) where TAction : StructureAction
        {
            var go = new GameObject("Test " + typeof(TAction).Name);
            go.SetActive(false);
            go.transform.position = position;
            Structure structure = go.AddComponent<Structure>();
            TAction action = go.AddComponent<TAction>();
            SetField(structure, "definition", def);
            configure?.Invoke(action);
            go.SetActive(true);
            Track(go);
            return structure;
        }

        // ── waiting ──

        protected static IEnumerator Seconds(float seconds)
        {
            float end = Time.time + seconds;
            while (Time.time < end) yield return null;
        }

        protected static IEnumerator Until(Func<bool> condition, float timeout)
        {
            float end = Time.time + timeout;
            while (!condition() && Time.time < end) yield return null;
        }

        protected static List<SolventPuddle> Puddles()
        {
            var result = new List<SolventPuddle>();
            foreach (GameObject root in SceneManager.GetActiveScene().GetRootGameObjects())
            {
                result.AddRange(root.GetComponentsInChildren<SolventPuddle>());
            }
            return result;
        }

        protected static bool IsGone(Object o) => o == null;
    }
}
