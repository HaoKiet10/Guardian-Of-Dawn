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
    }
}