using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Chain tesla: a bolt hits the target, then jumps to the nearest wax that hasn't been hit yet,
    // losing some damage on every jump. Great against groups, weak against wax walking alone.
    public class ChainLightning : StructureAction
    {
        [SerializeField, Range(1, 10)] private int maxTargets = 4;
        // How far the bolt can jump from one wax to the next.
        [SerializeField, Min(0.1f)] private float jumpRange = 1.5f;
        // Damage kept on each jump: 0.7 = the next wax takes 70% of what the previous one took.
        [SerializeField, Range(0f, 1f)] private float damageFalloff = 0.7f;

        private readonly List<Wax> alreadyHit = new List<Wax>();

        public override void Act(Structure structure, Wax target)
        {
            this.alreadyHit.Clear();
            Vector2 from = structure.transform.position;
            Wax current = target;
            float damage = structure.Damage;

            for (int i = 0; i < this.maxTargets && current != null; i++)
            {
                Vector2 to = current.transform.position;
                current.TakeHit(new Hit(damage, structure.Definition.DamageType, (to - from).normalized));
                this.alreadyHit.Add(current);

                // Placeholder bolt segment, Scene view only.
                Debug.DrawLine(from, to, new Color(0.6f, 0.8f, 1f), 0.15f);

                from = to;
                current = NearestNotHit(to);
                damage *= this.damageFalloff;
            }
        }

        private Wax NearestNotHit(Vector2 position)
        {
            Wax nearest = null;
            float nearestDistance = this.jumpRange;

            foreach (Wax wax in WaxRegistry.Waxes)
            {
                if (wax.State == WaxState.Dead || this.alreadyHit.Contains(wax)) continue;

                float distance = Vector2.Distance(position, wax.transform.position);
                if (distance <= nearestDistance)
                {
                    nearest = wax;
                    nearestDistance = distance;
                }
            }
            return nearest;
        }
    }
}
