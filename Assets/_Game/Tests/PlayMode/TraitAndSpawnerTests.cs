using System;
using System.Collections;
using System.Linq;
using System.Reflection;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace GuardianOfDawn.Tests
{
    public class TraitTests : GameplayTestBase
    {
        [UnityTest]
        public IEnumerator FrontShell_ReducesFrontalBullets_NotExplosivePiercingOrFromBehind()
        {
            FrontShell shell = Trait<FrontShell>(("frontReduction", 0.75f), ("frontAngle", 120f));
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(100f, 0f));
            Wax wax = SpawnWax(WaxDef(maxHp: 1000f, speed: 0.2f, traits: shell), path); // walks toward +x
            yield return Seconds(0.2f);

            // From the front, a shot travels -x (against the walking direction).
            Assert.AreEqual(2.5f, Damage(wax, new Hit(10f, DamageType.Bullet, Vector2.left)), 0.001f, "front bullet");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Bullet, Vector2.right)), 0.001f, "bullet from behind");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Explosive, Vector2.left)), 0.001f, "front explosive");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Piercing, Vector2.left)), 0.001f, "front piercing");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Solvent, Vector2.left)), 0.001f, "front solvent");
        }

        [UnityTest]
        public IEnumerator Mirror_ReducesBulletsOnly()
        {
            Mirror mirror = Trait<Mirror>(("reflectedShare", 0.5f));
            Wax wax = Park(WaxDef(maxHp: 1000f, traits: mirror), Vector2.zero);
            yield return null;

            Assert.AreEqual(5f, Damage(wax, new Hit(10f, DamageType.Bullet, Vector2.right)), 0.001f, "bullet");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Fire, Vector2.right)), 0.001f, "fire");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Explosive, Vector2.right)), 0.001f, "explosive");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Electric, Vector2.right)), 0.001f, "electric");
            Assert.AreEqual(10f, Damage(wax, new Hit(10f, DamageType.Piercing, Vector2.right)), 0.001f, "piercing");
        }

        [UnityTest]
        public IEnumerator HealAura_HealsOthers_NotBlockedOnes_NotItself_AndHoldsPosition()
        {
            HealAura aura = Trait<HealAura>(("healInterval", 1f), ("healDuration", 1f), ("healRadius", 2f),
                                            ("healPerSecond", 20f));
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(50f, 0f));
            Wax healer = SpawnWax(WaxDef(maxHp: 100f, speed: 0.2f, traits: aura), path);
            Wax friend = Park(WaxDef(maxHp: 100f), new Vector2(1f, 0f));
            Wax burning = Park(WaxDef(maxHp: 100f), new Vector2(0f, 1f));
            Wax far = Park(WaxDef(maxHp: 100f), new Vector2(6f, 0f));
            yield return null;

            healer.TakeHit(new Hit(50f, DamageType.Bullet, Vector2.right));
            friend.TakeHit(new Hit(50f, DamageType.Bullet, Vector2.right));
            burning.TakeHit(new Hit(50f, DamageType.Bullet, Vector2.right));
            far.TakeHit(new Hit(50f, DamageType.Bullet, Vector2.right));
            burning.AddEffect(new Burning(0f, 10f));

            yield return Until(() => friend.Hp > 50f, 2f);
            Assert.Greater(friend.Hp, 50f, "healer never healed its neighbour");
            Vector2 held = healer.transform.position;
            float friendHp = friend.Hp;

            yield return Seconds(0.4f);
            Assert.Less(Vector2.Distance(held, healer.transform.position), 0.0001f, "healer should stand still while healing");
            Assert.Greater(friend.Hp, friendHp);
            Assert.AreEqual(50f, burning.Hp, 0.001f, "burning wax must not be healed");
            Assert.AreEqual(50f, healer.Hp, 0.001f, "healer does not heal itself");
            Assert.AreEqual(50f, far.Hp, 0.001f, "out of radius");
        }

        [UnityTest]
        public IEnumerator SelfRegen_Regenerates_UnlessBurning()
        {
            SelfRegen regen = Trait<SelfRegen>(("regenPerSecond", 10f));
            WaxDefinition def = WaxDef(maxHp: 100f, traits: regen);
            Wax normal = Park(def, Vector2.zero);
            Wax burning = Park(def, new Vector2(3f, 0f));
            yield return null;

            normal.TakeHit(new Hit(50f, DamageType.Bullet, Vector2.right));
            burning.TakeHit(new Hit(50f, DamageType.Bullet, Vector2.right));
            burning.AddEffect(new Burning(0f, 5f));

            yield return Seconds(1f);
            Assert.AreEqual(60f, normal.Hp, 1.5f);
            Assert.AreEqual(50f, burning.Hp, 0.001f);

            yield return Seconds(5f);
            Assert.AreEqual(100f, normal.Hp, 0.001f, "regen caps at max hp");
        }

        [UnityTest]
        public IEnumerator SplitOnDeath_SpawnsChildrenPartwayAlongPath()
        {
            WaxDefinition childDef = WaxDef(maxHp: 5f, speed: 1f);
            SplitOnDeath split = Trait<SplitOnDeath>(("spawnDefinition", childDef), ("count", 3), ("spread", 0.4f));
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(2f, 0f), new Vector2(2f, 10f));
            Wax parent = SpawnWax(WaxDef(maxHp: 20f, speed: 2f, traits: split), path);

            yield return Seconds(1.25f); // past the corner, on the second segment
            Vector2 deathPosition = parent.transform.position;
            int nextWayPoint = parent.NextWayPoint;
            float distance = parent.DistanceTraveled;
            Assert.AreEqual(2, nextWayPoint, "test setup: parent should be on the second segment");

            parent.TakeHit(new Hit(1000f, DamageType.Bullet, Vector2.right));
            Assert.AreEqual(WaxState.Dead, parent.State);
            yield return null;

            Assert.IsTrue(IsGone(parent));
            var children = WaxRegistry.Waxes.Where(w => w.Definition == childDef).ToList();
            Assert.AreEqual(3, children.Count, "count children expected");
            Assert.AreEqual(3, WaxRegistry.Waxes.Count);
            foreach (Wax child in children)
            {
                Assert.AreEqual(WaxState.Walking, child.State);
                Assert.AreEqual(5f, child.Hp, 0.001f);
                Assert.AreEqual(nextWayPoint, child.NextWayPoint);
                Assert.GreaterOrEqual(child.DistanceTraveled, distance - 0.001f);
                Assert.Less(Vector2.Distance(deathPosition, child.transform.position), 0.4f + 0.1f,
                            "child should start where the parent died, not at the path start");
            }

            float[] before = children.Select(c => c.transform.position.y).ToArray();
            yield return Seconds(0.3f);
            for (int i = 0; i < children.Count; i++)
            {
                Assert.Greater(children[i].transform.position.y, before[i], "children carry on along the path");
            }
        }

        [UnityTest]
        public IEnumerator SplitOnDeath_NoChildrenIfBurningOrSolvent()
        {
            WaxDefinition childDef = WaxDef(maxHp: 5f);
            SplitOnDeath split = Trait<SplitOnDeath>(("spawnDefinition", childDef), ("count", 3));
            WaxDefinition def = WaxDef(maxHp: 20f, traits: split);
            Wax burning = Park(def, Vector2.zero);
            Wax solvent = Park(def, new Vector2(5f, 0f));
            yield return null;

            burning.AddEffect(new Burning(0f, 5f));
            solvent.AddEffect(new Solvent(0f, 5f));
            burning.TakeHit(new Hit(1000f, DamageType.Bullet, Vector2.right));
            solvent.TakeHit(new Hit(1000f, DamageType.Bullet, Vector2.right));
            yield return null;

            Assert.AreEqual(0, WaxRegistry.Waxes.Count(w => w.Definition == childDef));
        }

        [UnityTest]
        public IEnumerator Rally_HastensOthers()
        {
            Rally rally = Trait<Rally>(("shoutInterval", 1f), ("shoutRadius", 3f), ("speedMultiplier", 1.5f),
                                       ("boostDuration", 2f));
            Wax shouter = Park(WaxDef(traits: rally), Vector2.zero);
            Wax near = Park(WaxDef(), new Vector2(1f, 0f));
            Wax far = Park(WaxDef(), new Vector2(10f, 0f));

            yield return Seconds(0.8f);
            Assert.IsTrue(near.HasEffect<Hastened>(), "nearby wax should be hastened");
            Assert.AreEqual(1.5f, near.SpeedMultiplier, 0.001f);
            Assert.IsFalse(shouter.HasEffect<Hastened>(), "the shouter doesn't hasten itself");
            Assert.IsFalse(far.HasEffect<Hastened>());
        }

        private static float Damage(Wax wax, Hit hit)
        {
            float before = wax.Hp;
            wax.TakeHit(hit);
            return before - wax.Hp;
        }
    }

    public class SpawnerTests : GameplayTestBase
    {
        [UnityTest]
        public IEnumerator TestWaveSpawner_SpawnsEntries_GroupSizeZeroDoesNotCrash()
        {
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(50f, 0f));
            WaxDefinition a = WaxDef(speed: 0.1f);
            WaxDefinition b = WaxDef(speed: 0.1f);
            WaxDefinition c = WaxDef(speed: 0.1f);

            // The prefab stand-in sits under an inactive parent, so it never runs itself but its clones are active.
            var holder = Track(new GameObject("Prefab Holder"));
            holder.SetActive(false);
            var template = new GameObject("Wax Template");
            template.transform.SetParent(holder.transform, false);
            Wax waxPrefab = template.AddComponent<Wax>();

            Type entryType = typeof(TestWaveSpawner).GetNestedType("WaveEntry", BindingFlags.NonPublic);
            Array entries = Array.CreateInstance(entryType, 4);
            entries.SetValue(Entry(entryType, a, 3, 1), 0);
            entries.SetValue(Entry(entryType, b, 4, 2), 1);
            entries.SetValue(Entry(entryType, c, 2, 0), 2); // group size 0, as a fresh Inspector row
            entries.SetValue(Entry(entryType, null, 5, 1), 3); // no definition: skipped

            var go = new GameObject("Spawner");
            go.SetActive(false);
            TestWaveSpawner spawner = go.AddComponent<TestWaveSpawner>();
            SetField(spawner, "waxPrefab", waxPrefab);
            SetField(spawner, "path", path);
            SetField(spawner, "entries", entries);
            SetField(spawner, "interval", 0.1f);
            SetField(spawner, "groupSpacing", 0.05f);
            go.SetActive(true);
            Track(go);

            yield return Until(() => WaxRegistry.Waxes.Count >= 9, 5f);
            yield return Seconds(0.5f);

            Assert.AreEqual(9, WaxRegistry.Waxes.Count, "3 + 4 + 2 wax expected");
            Assert.AreEqual(3, WaxRegistry.Waxes.Count(w => w.Definition == a));
            Assert.AreEqual(4, WaxRegistry.Waxes.Count(w => w.Definition == b));
            Assert.AreEqual(2, WaxRegistry.Waxes.Count(w => w.Definition == c));
            Assert.IsTrue(WaxRegistry.Waxes.All(w => w.State == WaxState.Walking && w.Path == path));
            Assert.IsTrue(spawner.enabled);
        }

        private static object Entry(Type entryType, WaxDefinition def, int count, int groupSize)
        {
            object entry = Activator.CreateInstance(entryType, true);
            entryType.GetField("definition").SetValue(entry, def);
            entryType.GetField("count").SetValue(entry, count);
            entryType.GetField("groupSize").SetValue(entry, groupSize);
            return entry;
        }
    }
}
