using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Flamethrower: short-range sustained spray. Each attack sprays a cone for a few seconds,
    // following the wax closest to the wall, then rests until the next attack (TBA = time between spray starts).
    // The definition's Damage is damage per second while spraying. Wax in the flame also burn
    // for a while after they leave it, and burning wax cannot heal.
    public class ConeSpray : StructureAction
    {
        [SerializeField, Range(1f, 180f)] private float coneAngle = 50f;
        [SerializeField, Min(0.1f)] private float sprayDuration = 2.5f;
        [SerializeField, Min(0f)] private float burnDamagePerSecond = 3f;
        [SerializeField, Min(0.1f)] private float burnDuration = 2f;

        private readonly List<Wax> hits = new List<Wax>();
        private Structure structure;
        private float sprayTimeLeft;
        private Vector2 aim;

        public bool IsSpraying => this.sprayTimeLeft > 0f;

        // Called by Structure once per TBA: only starts the spray. Update does the spraying.
        public override void Act(Structure structure, Wax target)
        {
            this.structure = structure;
            this.aim = AimAt(target);
            this.sprayTimeLeft = this.sprayDuration;
        }

        private void Update()
        {
            if (!this.IsSpraying) return;

            // Stop at once if the tower was shattered mid-spray.
            if (!this.structure.IsActive)
            {
                this.sprayTimeLeft = 0f;
                return;
            }

            this.sprayTimeLeft -= Time.deltaTime;

            Vector2 origin = this.structure.transform.position;
            float range = this.structure.Definition.Range;

            // Follow the wax closest to the wall; with nobody in range, keep spraying the same way.
            Wax target = TargetSelector.ClosestToWall(origin, range);
            if (target != null) this.aim = AimAt(target);

            float damageThisFrame = this.structure.Definition.Damage * Time.deltaTime;
            TargetSelector.InRange(origin, range, this.hits);

            foreach (Wax wax in this.hits)
            {
                Vector2 toWax = ((Vector2)wax.transform.position - origin).normalized;
                // The cone spreads half its angle to each side of the aim.
                if (Vector2.Angle(this.aim, toWax) > this.coneAngle / 2f) continue;

                wax.TakeHit(new Hit(damageThisFrame, this.structure.Definition.DamageType, toWax));
                wax.AddEffect(new Burning(this.burnDamagePerSecond, this.burnDuration));
            }

            DrawCone(origin, range);
        }

        private Vector2 AimAt(Wax target)
        {
            return ((Vector2)target.transform.position - (Vector2)this.structure.transform.position).normalized;
        }

        // Placeholder: the two edges of the cone, Scene view only.
        private void DrawCone(Vector2 origin, float range)
        {
            float half = this.coneAngle / 2f;
            Vector2 left = Quaternion.Euler(0f, 0f, half) * this.aim;
            Vector2 right = Quaternion.Euler(0f, 0f, -half) * this.aim;
            Debug.DrawLine(origin, origin + left * range, new Color(1f, 0.5f, 0f));
            Debug.DrawLine(origin, origin + right * range, new Color(1f, 0.5f, 0f));
        }
    }
}
