using UnityEngine;

namespace GuardianOfDawn
{
    // Sáp vỏ cua: a hard shell on its front strongly reduces hits that come from ahead.
    // Not reduced: shells from above (Explosive), piercing rounds, solvent - and nothing at all
    // once solvent has melted the shell.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Front Shell")]
    public class FrontShell : WaxTrait
    {
        [SerializeField, Range(0f, 1f)] private float frontReduction = 0.75f;
        // Width of the "front" in degrees, centered on the way the wax is walking.
        [SerializeField, Range(0f, 360f)] private float frontAngle = 120f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly FrontShell trait;
            // Last direction it walked; kept while it stands still so the shell still faces forward.
            private Vector2 facing;

            public Instance(FrontShell trait, Wax wax) : base(wax)
            {
                this.trait = trait;
            }

            public override void OnUpdate(float deltaTime)
            {
                if (this.wax.MoveDirection != Vector2.zero) this.facing = this.wax.MoveDirection;
            }

            public override Hit ModifyHit(Hit hit)
            {
                if (hit.damageType == DamageType.Explosive
                    || hit.damageType == DamageType.Piercing
                    || hit.damageType == DamageType.Solvent) return hit;
                if (this.wax.HasEffect<Solvent>()) return hit;
                if (hit.direction == Vector2.zero || this.facing == Vector2.zero) return hit;

                // A shot from the front travels against the way the wax is facing.
                if (Vector2.Angle(-hit.direction, this.facing) > this.trait.frontAngle / 2f) return hit;

                return hit.WithAmount(hit.amount * (1f - this.trait.frontReduction));
            }
        }
    }
}
