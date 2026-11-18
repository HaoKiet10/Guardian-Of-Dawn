using UnityEngine;

namespace GuardianOfDawn
{
    // Net launcher: pins one wax in place for a few seconds. No damage.
    // Large wax (tier 5, bosses) break free too easily to be pinned, so they are only slowed.
    public class NetLauncher : StructureAction
    {
        [SerializeField, Min(0.1f)] private float netDuration = 2f;
        [SerializeField, Range(0f, 1f)] private float largeSlowMultiplier = 0.5f;

        public override void Act(Structure structure, Wax target)
        {
            if (target.Definition.IsLarge)
            {
                target.AddEffect(new Slowed(this.largeSlowMultiplier, this.netDuration));
            }
            else
            {
                target.AddEffect(new Netted(this.netDuration));
            }

            // Placeholder shot visual, Scene view only.
            Debug.DrawLine(structure.transform.position, target.transform.position, Color.cyan, 0.2f);
        }
    }
}
