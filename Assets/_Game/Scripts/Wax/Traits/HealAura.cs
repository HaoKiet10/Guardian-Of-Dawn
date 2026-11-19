using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Bậc 3 – Dị Thể Sáp hồi phục: every so often it stops and heals the other wax around it for a short time.
    // Weak points: it stands still while healing (easy mortar target), and burning or solvent-covered wax
    // can't be healed.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Heal Aura")]
    public class HealAura : WaxTrait
    {
        [SerializeField, Min(0.1f)] private float healInterval = 6f;
        [SerializeField, Min(0.1f)] private float healDuration = 1.5f;
        [SerializeField, Min(0.1f)] private float healRadius = 2f;
        [SerializeField, Min(0f)] private float healPerSecond = 6f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly HealAura trait;
            private readonly List<Wax> nearby = new List<Wax>();
            private float cooldown;
            private float healTimeLeft;

            public Instance(HealAura trait, Wax wax) : base(wax)
            {
                this.trait = trait;
                this.cooldown = trait.healInterval * 0.5f;
            }

            public override void OnUpdate(float deltaTime)
            {
                if (this.healTimeLeft > 0f)
                {
                    this.healTimeLeft -= deltaTime;
                    HealNearby(deltaTime);
                    return;
                }

                this.cooldown -= deltaTime;
                if (this.cooldown > 0f || this.wax.State != WaxState.Walking) return;

                this.healTimeLeft = this.trait.healDuration;
                this.wax.HoldPosition(this.trait.healDuration);
                this.cooldown = this.trait.healInterval;
            }

            private void HealNearby(float deltaTime)
            {
                Vector2 center = this.wax.transform.position;
                TargetSelector.InRange(center, this.trait.healRadius, this.nearby);
                foreach (Wax other in this.nearby)
                {
                    if (other == this.wax) continue;
                    if (other.Heal(this.trait.healPerSecond * deltaTime))
                    {
                        Debug.DrawLine(center, other.transform.position, Color.green);
                    }
                }
            }
        }
    }
}
