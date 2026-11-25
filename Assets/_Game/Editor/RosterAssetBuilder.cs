using System.IO;
using UnityEditor;
using UnityEngine;

namespace GuardianOfDawn.Editor
{
    // Creates the data assets and placeholder prefabs for the full roster (GDD 4.6): 11 structures,
    // 10 wax types, 5 bosses and the 7 wax traits. It only creates what is missing, so assets you
    // already made or tuned by hand are never touched. Numbers are starting values for balancing.
    // A structure whose upgrade list is empty also gets starting values for tier 1 and tier 2.
    //
    // Run from the menu: Guardian Of Dawn > Create Missing Roster Assets
    // or in batch mode: -executeMethod GuardianOfDawn.Editor.RosterAssetBuilder.CreateMissing
    public static class RosterAssetBuilder
    {
        private const string StructureFolder = "Assets/_Game/Data/Structure";
        private const string WaxFolder = "Assets/_Game/Data/Wax";
        private const string TraitFolder = "Assets/_Game/Data/WaxTraits";
        private const string PrefabFolder = "Assets/_Game/Prefabs";
        private const string SpriteSourcePrefab = "Assets/_Game/Prefabs/Machine Gun.prefab";

        [MenuItem("Guardian Of Dawn/Create Missing Roster Assets")]
        public static void CreateMissing()
        {
            EnsureFolder(StructureFolder);
            EnsureFolder(WaxFolder);
            EnsureFolder(TraitFolder);
            EnsureFolder(PrefabFolder);

            CreateStructures();
            CreateWax();

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
            Debug.Log("RosterAssetBuilder: done");
        }

        // ── Structures ──

        private static void CreateStructures()
        {
            // name, range, TBA, damage, damage type, action, prefab color
            Structure("Machine Gun", 5f, 0.2f, 3f, DamageType.Bullet, typeof(SingleShot), new Color(0.3f, 0.5f, 1f));
            Structure("Flame Thrower", 2.5f, 4f, 4f, DamageType.Fire, typeof(ConeSpray), new Color(1f, 0.5f, 0f));
            Structure("Mortar", 6f, 2f, 8f, DamageType.Explosive, typeof(SplashShell), new Color(0.45f, 0.45f, 0.45f));
            Structure("Fortifier", 2f, 1f, 0f, DamageType.Bullet, typeof(WallFortify), new Color(0.9f, 0.8f, 0.5f));
            Structure("Chain Tesla", 4f, 1.5f, 6f, DamageType.Electric, typeof(ChainLightning), new Color(0.6f, 0.8f, 1f));
            Structure("Sun Rod", 2.5f, 1f, 0f, DamageType.Bullet, typeof(LightningRod), new Color(1f, 0.95f, 0.4f));
            Structure("Net Launcher", 4f, 3f, 0f, DamageType.Bullet, typeof(NetLauncher), new Color(0.2f, 0.9f, 0.9f));
            Structure("Cryo Aura", 3f, 0.25f, 0f, DamageType.Bullet, typeof(CryoAura), new Color(0.7f, 0.95f, 1f));
            Structure("Solvent Sprayer", 4.5f, 3f, 1f, DamageType.Solvent, typeof(SolventSprayer), new Color(0.6f, 1f, 0.3f));
            Structure("Heat Decoy", 3f, 7f, 0f, DamageType.Bullet, typeof(HeatLure), new Color(1f, 0.3f, 0.2f));
            Structure("Piercing Cannon", 7f, 4f, 2f, DamageType.Piercing, typeof(PiercingShot), new Color(0.75f, 0.75f, 0.85f));
        }

        private static void Structure(string name, float range, float tba, float damage, DamageType type,
                                      System.Type action, Color color)
        {
            string assetPath = $"{StructureFolder}/{name}.asset";
            StructureDefinition definition = AssetDatabase.LoadAssetAtPath<StructureDefinition>(assetPath);
            if (definition == null)
            {
                definition = ScriptableObject.CreateInstance<StructureDefinition>();
                var so = new SerializedObject(definition);
                so.FindProperty("displayName").stringValue = name;
                so.FindProperty("range").floatValue = range;
                so.FindProperty("tba").floatValue = tba;
                so.FindProperty("damage").floatValue = damage;
                so.FindProperty("damageType").enumValueIndex = (int)type;
                so.ApplyModifiedPropertiesWithoutUndo();
                AssetDatabase.CreateAsset(definition, assetPath);
                Debug.Log($"RosterAssetBuilder: created {assetPath}");
            }
            FillUpgradesIfEmpty(definition, assetPath);

            string prefabPath = $"{PrefabFolder}/{name}.prefab";
            // Also accept a hand-made prefab saved without spaces (e.g. CryoAura.prefab).
            string noSpacesPath = $"{PrefabFolder}/{name.Replace(" ", "")}.prefab";
            if (AssetDatabase.LoadAssetAtPath<GameObject>(prefabPath) != null
                || AssetDatabase.LoadAssetAtPath<GameObject>(noSpacesPath) != null) return;

            var root = new GameObject(name);
            var art = new GameObject("Sprite");
            art.transform.SetParent(root.transform, false);
            var sprite = art.AddComponent<SpriteRenderer>();
            sprite.sprite = PlaceholderSprite();
            sprite.color = color;

            var structure = root.AddComponent<Structure>();
            root.AddComponent(action);
            var structureSo = new SerializedObject(structure);
            structureSo.FindProperty("definition").objectReferenceValue = definition;
            structureSo.ApplyModifiedPropertiesWithoutUndo();

            PrefabUtility.SaveAsPrefabAsset(root, prefabPath);
            Object.DestroyImmediate(root);
            Debug.Log($"RosterAssetBuilder: created {prefabPath}");
        }

        // Starting values only: tune them in the Inspector after playtesting.
        // Tier 1: damage x1.5, range +0.5, 10% faster.  Tier 2: damage x2.2, range +1, 20% faster.
        // Cost: 75% then 125% of the build cost.
        private static readonly (float damage, float range, float tba, float cost)[] UpgradeSteps =
        {
            (1.5f, 0.5f, 0.9f, 0.75f),
            (2.2f, 1f, 0.8f, 1.25f),
        };

        private static void FillUpgradesIfEmpty(StructureDefinition definition, string assetPath)
        {
            var so = new SerializedObject(definition);
            SerializedProperty upgrades = so.FindProperty("upgrades");
            if (upgrades.arraySize > 0) return;

            upgrades.arraySize = UpgradeSteps.Length;
            for (int i = 0; i < UpgradeSteps.Length; i++)
            {
                var step = UpgradeSteps[i];
                SerializedProperty tier = upgrades.GetArrayElementAtIndex(i);
                tier.FindPropertyRelative("cost").intValue = Mathf.RoundToInt(definition.BuildCost * step.cost);
                tier.FindPropertyRelative("range").floatValue = definition.Range + step.range;
                tier.FindPropertyRelative("tba").floatValue = definition.TBA * step.tba;
                tier.FindPropertyRelative("damage").floatValue = definition.Damage * step.damage;
            }
            so.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(definition);
            Debug.Log($"RosterAssetBuilder: added tier 1 and tier 2 to {assetPath}");
        }

        private static Sprite PlaceholderSprite()
        {
            var source = AssetDatabase.LoadAssetAtPath<GameObject>(SpriteSourcePrefab);
            var renderer = source != null ? source.GetComponentInChildren<SpriteRenderer>() : null;
            return renderer != null ? renderer.sprite : null;
        }

        // ── Wax and traits ──

        private static void CreateWax()
        {
            WaxDefinition sapVun = Wax("Sap Vun", "Sáp vụn", 3f, 2.2f, 0.3f, 1, false, 0.5f, new Color(1f, 0.5f, 0.75f));

            WaxTrait frontShell = Trait<FrontShell>("Front Shell");
            WaxTrait mirror = Trait<Mirror>("Mirror");
            WaxTrait healAura = Trait<HealAura>("Heal Aura");
            WaxTrait selfRegen = Trait<SelfRegen>("Self Regen");
            WaxTrait rally = Trait<Rally>("Rally");
            WaxTrait convergence = Trait<Convergence>("Convergence");
            WaxTrait splitOnDeath = Trait<SplitOnDeath>("Split On Death", so =>
            {
                so.FindProperty("spawnDefinition").objectReferenceValue = sapVun;
            });

            // Evolution tiers (map N introduces tier N)
            Wax("Standard Wax", "Dị Thể Sáp tiêu chuẩn", 20f, 2f, 1f, 5, false, 1f, Color.red);
            Wax("Tiger Wax", "Dị Thể Sáp hổ", 12f, 4f, 1f, 4, false, 0.9f, new Color(1f, 0.55f, 0f));
            Wax("Healer Wax", "Dị Thể Sáp hồi phục", 30f, 1.6f, 1.5f, 6, false, 1.1f, new Color(0.3f, 0.8f, 0.3f), healAura);
            Wax("Lens Wax", "Dị Thể Sáp thấu kính", 35f, 1.8f, 1.5f, 7, false, 1.1f, new Color(0.3f, 0.7f, 1f), convergence);
            Wax("Ultimate Wax", "Dị Thể Sáp tối thượng", 150f, 0.8f, 4f, 15, true, 1.6f, new Color(0.55f, 0.3f, 0.8f), selfRegen);

            // Variants (one per map)
            Wax("Shell Wax", "Sáp vỏ cua", 25f, 1.2f, 1f, 5, false, 1f, new Color(0.6f, 0.4f, 0.2f), frontShell);
            Wax("Spore Wax", "Sáp bào tử", 20f, 1.6f, 1f, 5, false, 1f, new Color(0.6f, 0.7f, 0.2f), splitOnDeath);
            Wax("Mirror Wax", "Sáp gương", 30f, 1.8f, 1.5f, 6, false, 1f, new Color(0.85f, 0.9f, 0.95f), mirror);
            Wax("Rally Wax", "Sáp kích động", 15f, 3.5f, 1f, 5, false, 0.9f, new Color(1f, 0.9f, 0.2f), rally);

            // Bosses: Dị Thể Sáp nguồn, a large version of each map's new tier. The map 3 boss never stops
            // moving (GDD: "Trùm luôn di chuyển, không đứng yên"), so it regenerates instead of using the healing aura.
            Wax("Source Wax 1", "Dị Thể Sáp nguồn – Sáp Nguyên Thủy", 400f, 0.9f, 5f, 60, true, 2f, new Color(0.6f, 0f, 0f));
            Wax("Source Wax 2", "Dị Thể Sáp nguồn – bậc 2", 250f, 2.5f, 5f, 60, true, 1.8f, new Color(0.7f, 0.35f, 0f));
            Wax("Source Wax 3", "Dị Thể Sáp nguồn – bậc 3", 500f, 0.9f, 6f, 70, true, 2f, new Color(0.1f, 0.5f, 0.1f), selfRegen);
            Wax("Source Wax 4", "Dị Thể Sáp nguồn – bậc 4", 550f, 1f, 6f, 70, true, 2f, new Color(0.1f, 0.4f, 0.7f), convergence);
            Wax("Source Wax 5", "Dị Thể Sáp nguồn – bậc 5", 1200f, 0.6f, 8f, 100, true, 2.4f, new Color(0.35f, 0.15f, 0.55f), selfRegen);
        }

        private static WaxDefinition Wax(string fileName, string displayName, float maxHp, float speed, float wallDps,
                                         int drop, bool isLarge, float scale, Color tint, params WaxTrait[] traits)
        {
            string path = $"{WaxFolder}/{fileName}.asset";
            WaxDefinition existing = AssetDatabase.LoadAssetAtPath<WaxDefinition>(path);
            if (existing != null) return existing;

            WaxDefinition definition = ScriptableObject.CreateInstance<WaxDefinition>();
            var so = new SerializedObject(definition);
            so.FindProperty("displayName").stringValue = displayName;
            so.FindProperty("maxHp").floatValue = maxHp;
            so.FindProperty("speed").floatValue = speed;
            so.FindProperty("wallDamagePerSecond").floatValue = wallDps;
            so.FindProperty("resourceDrop").intValue = drop;
            so.FindProperty("isLarge").boolValue = isLarge;
            so.FindProperty("scale").floatValue = scale;
            so.FindProperty("tint").colorValue = tint;
            SerializedProperty traitList = so.FindProperty("traits");
            traitList.arraySize = traits.Length;
            for (int i = 0; i < traits.Length; i++)
            {
                traitList.GetArrayElementAtIndex(i).objectReferenceValue = traits[i];
            }
            so.ApplyModifiedPropertiesWithoutUndo();

            AssetDatabase.CreateAsset(definition, path);
            Debug.Log($"RosterAssetBuilder: created {path}");
            return definition;
        }

        private static WaxTrait Trait<T>(string fileName, System.Action<SerializedObject> setup = null) where T : WaxTrait
        {
            string path = $"{TraitFolder}/{fileName}.asset";
            T existing = AssetDatabase.LoadAssetAtPath<T>(path);
            if (existing != null) return existing;

            T trait = ScriptableObject.CreateInstance<T>();
            if (setup != null)
            {
                var so = new SerializedObject(trait);
                setup(so);
                so.ApplyModifiedPropertiesWithoutUndo();
            }
            AssetDatabase.CreateAsset(trait, path);
            Debug.Log($"RosterAssetBuilder: created {path}");
            return trait;
        }

        private static void EnsureFolder(string path)
        {
            if (AssetDatabase.IsValidFolder(path)) return;
            string parent = Path.GetDirectoryName(path).Replace('\\', '/');
            EnsureFolder(parent);
            AssetDatabase.CreateFolder(parent, Path.GetFileName(path));
        }
    }
}
