using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Sáp kích động: shouts every few seconds, speeding up the other wax around it for a while.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Rally")]
    public class Rally : WaxTrait
    {
        [SerializeField, Min(0.1f)] private float shoutInterval = 4f;
        [SerializeField, Min(0.1f)] private float shoutRadius = 2.5f;
        [SerializeField, Min(1f)] private float speedMultiplier = 1.4f;
        [SerializeField, Min(0.1f)] private float boostDuration = 2.5f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly Rally trait;
            private readonly List<Wax> nearby = new List<Wax>();
            private float cooldown;

            public Instance(Rally trait, Wax wax) : base(wax)
            {
                this.trait = trait;
                this.cooldown = trait.shoutInterval * 0.5f;
            }

            public override void OnUpdate(float deltaTime)
            {
                this.cooldown -= deltaTime;
                if (this.cooldown > 0f) return;
                this.cooldown = this.trait.shoutInterval;

                Vector2 center = this.wax.transform.position;
                TargetSelector.InRange(center, this.trait.shoutRadius, this.nearby);
                foreach (Wax other in this.nearby)
                {
                    if (other == this.wax) continue;
                    other.AddEffect(new Hastened(this.trait.speedMultiplier, this.trait.boostDuration));
                    Debug.DrawLine(center, other.transform.position, Color.yellow, 0.3f);
                }
            }
        }
    }
}
