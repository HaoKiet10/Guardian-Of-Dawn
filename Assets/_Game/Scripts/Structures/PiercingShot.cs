using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Piercing cannon: a very slow shot that flies in a straight line through every wax in its way.
    // Damage is a share of each wax's max HP (plus the definition's flat Damage), so it is strong against
    // big wax and bosses and wasted on tiny swarms.
    public class PiercingShot : StructureAction
    {
        [SerializeField, Range(0f, 1f)] private float percentOfMaxHp = 0.25f;
        // How close to the line a wax must be to get hit.
        [SerializeField, Min(0.05f)] private float beamWidth = 0.35f;

        private readonly List<Wax> hits = new List<Wax>();

        public override void Act(Structure structure, Wax target)
        {
            Vector2 start = structure.transform.position;
            Vector2 direction = ((Vector2)target.transform.position - start).normalized;
            Vector2 end = start + direction * structure.Range;

            // Collect first, damage after: a dying wax can spawn new ones, which changes WaxRegistry.
            this.hits.Clear();
            foreach (Wax wax in WaxRegistry.Waxes)
            {
                if (wax.State == WaxState.Dead) continue;
                if (DistanceToSegment(wax.transform.position, start, end) <= this.beamWidth) this.hits.Add(wax);
            }

            foreach (Wax wax in this.hits)
            {
                float damage = structure.Damage + this.percentOfMaxHp * wax.MaxHp;
                wax.TakeHit(new Hit(damage, structure.Definition.DamageType, direction));
            }

            Debug.DrawLine(start, end, Color.white, 0.2f);
        }

        private static float DistanceToSegment(Vector2 point, Vector2 a, Vector2 b)
        {
            Vector2 ab = b - a;
            float t = Mathf.Clamp01(Vector2.Dot(point - a, ab) / ab.sqrMagnitude);
            return Vector2.Distance(point, a + ab * t);
        }
    }
}
