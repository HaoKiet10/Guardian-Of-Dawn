using UnityEngine;

namespace GuardianOfDawn
{
    // One upgrade tier of a structure (t1, t2). Tier 0 is the definition's own range / TBA / damage.
    [System.Serializable]
    public class StructureUpgrade
    {
        [SerializeField, Min(0)] private int cost = 50;
        [SerializeField, Min(0.1f)] private float range = 5f;
        [SerializeField, Min(0.01f)] private float tba = 0.2f;
        [SerializeField, Min(0f)] private float damage = 3f;

        public StructureUpgrade(int cost, float range, float tba, float damage)
        {
            this.cost = cost;
            this.range = range;
            this.tba = tba;
            this.damage = damage;
        }

        public int Cost => this.cost;
        public float Range => this.range;
        public float TBA => this.tba;
        public float Damage => this.damage;
    }
}
