using System.Collections.Generic;

namespace GuardianOfDawn
{
    // Every living soldier in the scene, so wax can find the ones blocking their path.
    public static class SoldierRegistry
    {
        private static readonly List<Soldier> soldiers = new List<Soldier>();
        public static IReadOnlyList<Soldier> Soldiers => soldiers;

        public static void Register(Soldier soldier)
        {
            soldiers.Add(soldier);
        }

        public static void Unregister(Soldier soldier)
        {
            soldiers.Remove(soldier);
        }
    }
}
