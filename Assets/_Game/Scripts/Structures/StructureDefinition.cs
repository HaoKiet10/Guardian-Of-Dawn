using UnityEngine;

namespace GuardianOfDawn
{
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Structure Definition")]

    public class StructureDefinition : ScriptableObject
    {
        [SerializeField] private string displayName = "Structure";
        [SerializeField, Min(1)] private int buildCost = 50;

        // Tier 0 stats
        [SerializeField, Min(0.1f)] private float range = 5f;
        //tba = time between attack
        [SerializeField, Min(0.01f)] private float tba = 0.2f;
        [SerializeField, Min(0f)] private float damage = 3f;
        [SerializeField] private DamageType damageType = DamageType.Bullet;

        // Tier 1, tier 2 (GDD 4.9: each structure has its own upgrade tree, lost when a storm destroys it)
        [SerializeField] private StructureUpgrade[] upgrades = new StructureUpgrade[0];

        public string DisplayName => displayName;
        public int BuildCost => buildCost;
        public float Range => range;
        public float TBA => tba;
        public float Damage => damage;
        public DamageType DamageType => damageType;

        // Highest tier this structure can reach (0 when it has no upgrades).
        public int MaxTier => this.upgrades.Length;

        public float RangeAt(int tier) => IsBase(tier) ? this.range : Upgrade(tier).Range;
        public float TBAAt(int tier) => IsBase(tier) ? this.tba : Upgrade(tier).TBA;
        public float DamageAt(int tier) => IsBase(tier) ? this.damage : Upgrade(tier).Damage;

        // Cost to go from this tier to the next one.
        public int UpgradeCostFrom(int tier) => tier < 0 || tier >= this.MaxTier ? 0 : this.upgrades[tier].Cost;

        // Tiers above the max fall back to the highest one.
        private bool IsBase(int tier) => Mathf.Min(tier, this.MaxTier) <= 0;
        private StructureUpgrade Upgrade(int tier) => this.upgrades[Mathf.Min(tier, this.MaxTier) - 1];
    }
}
