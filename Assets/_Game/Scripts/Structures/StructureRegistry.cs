using System.Collections.Generic;

namespace GuardianOfDawn
{
    // Every structure in the scene, standing or rubble. Same idea as WaxRegistry.
    public static class StructureRegistry
    {
        private static readonly List<Structure> structures = new List<Structure>();
        public static IReadOnlyList<Structure> Structures => structures;

        public static void Register(Structure structure)
        {
            structures.Add(structure);
        }

        public static void Unregister(Structure structure)
        {
            structures.Remove(structure);
        }
    }
}
