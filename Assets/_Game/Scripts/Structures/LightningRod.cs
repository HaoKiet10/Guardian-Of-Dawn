using UnityEngine;

namespace GuardianOfDawn
{
    // Sun rod (Cột thu sáng): passive. A solar storm bolt or a lens wax's convergence aimed at a structure
    // inside an active rod's range strikes the rod instead, so only the rod is destroyed.
    // Anything that destroys a structure with light must call Redirect first.
    public class LightningRod : StructureAction
    {
        public override bool NeedsTarget => false;

        public override void Act(Structure structure, Wax target)
        {
            // Passive: it does nothing on its own.
        }

        // Returns the structure that really gets hit: the closest active rod covering the target, or the target itself.
        public static Structure Redirect(Structure target)
        {
            Structure rod = null;
            float rodDistance = float.MaxValue;

            foreach (Structure structure in StructureRegistry.Structures)
            {
                if (!structure.IsActive || structure.GetComponent<LightningRod>() == null) continue;

                float distance = Vector2.Distance(structure.transform.position, target.transform.position);
                if (distance > structure.Definition.Range || distance >= rodDistance) continue;

                rod = structure;
                rodDistance = distance;
            }
            return rod != null ? rod : target;
        }
    }
}
