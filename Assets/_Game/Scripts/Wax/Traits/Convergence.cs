using UnityEngine;

namespace GuardianOfDawn
{
    // Bậc 4 – Dị Thể Sáp thấu kính (GDD 4.4, proposal): its watery body focuses sunlight. When it reaches a standing
    // structure it stops and channels; after enough seconds next to the same structure, that structure is
    // destroyed as if hit by a storm. A sun rod in range takes the strike instead. Freezing it (cryo tower)
    // interrupts the channel and resets it.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Convergence")]
    public class Convergence : WaxTrait
    {
        [SerializeField, Min(0.1f)] private float channelTime = 5f;
        [SerializeField, Min(0.1f)] private float reach = 1.2f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly Convergence trait;
            private Structure channelTarget;
            private float progress;

            public Instance(Convergence trait, Wax wax) : base(wax)
            {
                this.trait = trait;
            }

            public override void OnUpdate(float deltaTime)
            {
                if (this.wax.HasEffect<Frozen>() || this.wax.State != WaxState.Walking)
                {
                    Reset();
                    return;
                }

                Structure nearest = NearestActiveStructure();
                if (nearest == null)
                {
                    Reset();
                    return;
                }
                if (nearest != this.channelTarget)
                {
                    this.channelTarget = nearest;
                    this.progress = 0f;
                }

                this.wax.HoldPosition(0.1f);
                this.progress += deltaTime;
                Debug.DrawLine(this.wax.transform.position, nearest.transform.position, new Color(1f, 1f, 0.6f));

                if (this.progress >= this.trait.channelTime)
                {
                    LightningRod.Redirect(this.channelTarget).Shatter();
                    Reset();
                }
            }

            private Structure NearestActiveStructure()
            {
                Structure nearest = null;
                float nearestDistance = this.trait.reach;
                Vector2 position = this.wax.transform.position;

                foreach (Structure structure in StructureRegistry.Structures)
                {
                    if (!structure.IsActive) continue;
                    float distance = Vector2.Distance(position, structure.transform.position);
                    if (distance <= nearestDistance)
                    {
                        nearest = structure;
                        nearestDistance = distance;
                    }
                }
                return nearest;
            }

            private void Reset()
            {
                this.channelTarget = null;
                this.progress = 0f;
            }
        }
    }
}
