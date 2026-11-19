using UnityEngine;

namespace GuardianOfDawn
{
    // Sáp gương: salt-crystal skin reflects part of every single-target bullet.
    // Fire, electricity, explosions and piercing rounds are not reflected.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Mirror")]
    public class Mirror : WaxTrait
    {
        [SerializeField, Range(0f, 1f)] private float reflectedShare = 0.5f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly Mirror trait;

            public Instance(Mirror trait, Wax wax) : base(wax)
            {
                this.trait = trait;
            }

            public override Hit ModifyHit(Hit hit)
            {
                if (hit.damageType != DamageType.Bullet) return hit;

                // Placeholder: a short white flash back along the shot, Scene view only.
                Vector2 position = this.wax.transform.position;
                Debug.DrawLine(position, position - hit.direction * 0.6f, Color.white, 0.1f);

                return hit.WithAmount(hit.amount * (1f - this.trait.reflectedShare));
            }
        }
    }
}
