using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Heat decoy: gives off fake body heat for a few seconds. Walking wax inside its range leave the path and
    // walk toward it, into the other towers' fire, then head back to the path once it cools down.
    // No damage and never attacked. TBA = time between activations (active time + cooldown).
    public class HeatLure : StructureAction
    {
        [SerializeField, Min(0.1f)] private float activeDuration = 3f;

        private readonly List<Wax> hits = new List<Wax>();
        private Structure structure;
        private float activeTimeLeft;

        public override bool NeedsTarget => false;
        public bool IsActive => this.activeTimeLeft > 0f;

        public override void Act(Structure structure, Wax target)
        {
            this.structure = structure;
            this.activeTimeLeft = this.activeDuration;
        }

        private void Update()
        {
            if (!this.IsActive) return;

            if (!this.structure.IsActive)
            {
                this.activeTimeLeft = 0f;
                return;
            }

            this.activeTimeLeft -= Time.deltaTime;

            Vector2 lurePoint = this.structure.transform.position;
            TargetSelector.InRange(lurePoint, this.structure.Definition.Range, this.hits);
            foreach (Wax wax in this.hits)
            {
                // Short and refreshed every frame, so the pull ends soon after the decoy cools down.
                wax.LureTowards(lurePoint, 0.25f);
                Debug.DrawLine(wax.transform.position, lurePoint, new Color(1f, 0.3f, 0.2f));
            }
        }
    }
}
