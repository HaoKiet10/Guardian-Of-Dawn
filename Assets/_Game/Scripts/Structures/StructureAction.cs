using UnityEngine;

namespace GuardianOfDawn
{
    // What a structure does when it fires. Each tower prefab has a Structure plus exactly one StructureAction.
    public abstract class StructureAction : MonoBehaviour
    {
        // Towers that shoot need a wax to aim at. Auras (fortifier, cryo, heat lure) act on their own
        // every interval: they override this to false and receive target = null.
        public virtual bool NeedsTarget => true;

        public abstract void Act(Structure structure, Wax target);
    }
}
