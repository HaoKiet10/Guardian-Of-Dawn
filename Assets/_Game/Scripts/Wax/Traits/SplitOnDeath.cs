using UnityEngine;

namespace GuardianOfDawn
{
    // Sáp bào tử: bursts into several smaller wax when it dies - unless it dies while burning or covered in solvent.
    // The new wax start where it died and carry on along the same path.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Split On Death")]
    public class SplitOnDeath : WaxTrait
    {
        [SerializeField] private WaxDefinition spawnDefinition;
        [SerializeField, Min(0)] private int count = 3;
        [SerializeField, Min(0f)] private float spread = 0.4f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly SplitOnDeath trait;

            public Instance(SplitOnDeath trait, Wax wax) : base(wax)
            {
                this.trait = trait;
            }

            public override void OnDeath()
            {
                if (this.trait.spawnDefinition == null) return;
                if (this.wax.HasEffect<Burning>() || this.wax.HasEffect<Solvent>()) return;

                Vector2 position = this.wax.transform.position;
                for (int i = 0; i < this.trait.count; i++)
                {
                    // Copy this wax's GameObject (same components and art), then turn the copy into the new type.
                    Wax child = Object.Instantiate(this.wax);
                    Vector2 offset = Random.insideUnitCircle * this.trait.spread;
                    child.InitPartway(this.trait.spawnDefinition, this.wax.Path, position + offset,
                                      this.wax.NextWayPoint, this.wax.DistanceTraveled);
                }
            }
        }
    }
}
