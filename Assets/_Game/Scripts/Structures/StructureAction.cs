using UnityEngine;

namespace GuardianOfDawn
{
    // What a structure does when it fires. Each tower prefab has a Structure plus exactly one StructureAction.
    public abstract class StructureAction : MonoBehaviour
    {
        public abstract void Act(Structure structure, Wax target);
    }
}
