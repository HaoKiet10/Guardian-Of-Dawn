using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    public static class WaxRegistry
    {
        private static readonly List<Wax> waxes = new List<Wax>();
        public static IReadOnlyList<Wax> Waxes => waxes;

        public static void Register(Wax wax)
        {
            waxes.Add(wax);
        }

        public static void Unregister(Wax wax)
        {
            waxes.Remove(wax);
        }
    }
}