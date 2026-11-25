using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Cryo tower: an aura with no target. Every wax inside its range is slowed while it stays there.
    // Lens wax (tier 4, Convergence trait) are frozen solid instead, which also interrupts their convergence.
    public class CryoAura : StructureAction
    {
        [SerializeField, Range(0f, 1f)] private float slowMultiplier = 0.5f;
        // A little longer than the tower's TBA, so the slow doesn't flicker off between pulses.
        [SerializeField, Min(0.05f)] private float effectDuration = 0.5f;

        private readonly List<Wax> hits = new List<Wax>();

        public override bool NeedsTarget => false;

        public override void Act(Structure structure, Wax target)
        {
            TargetSelector.InRange(structure.transform.position, structure.Range, this.hits);

            foreach (Wax wax in this.hits)
            {
                if (wax.HasTrait<Convergence>())
                {
                    wax.AddEffect(new Frozen(this.effectDuration));
                }
                else
                {
                    wax.AddEffect(new Slowed(this.slowMultiplier, this.effectDuration));
                }
            }
        }
    }
}
