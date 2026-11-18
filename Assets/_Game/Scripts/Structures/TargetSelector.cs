using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    public static class TargetSelector
    {
        public static Wax ClosestToWall(Vector2 structurePosition, float range)
        {
            Wax target = null;

            foreach (Wax wax in WaxRegistry.Waxes)
            {
                if (wax.State == WaxState.Dead) continue;
                if (Vector2.Distance(structurePosition, wax.transform.position) > range) continue;
                if (target == null || wax.DistanceTraveled > target.DistanceTraveled) target = wax;
            }
            return target;
        }

        // Fills results with every living wax within range of a point (splash, cone, auras).
        // The caller owns the list and reuses it, so no new list is made every shot.
        public static void InRange(Vector2 position, float range, List<Wax> results)
        {
            results.Clear();
            foreach (Wax wax in WaxRegistry.Waxes)
            {
                if (wax.State == WaxState.Dead) continue;
                if (Vector2.Distance(position, wax.transform.position) > range) continue;
                results.Add(wax);
            }
        }
    }
}
