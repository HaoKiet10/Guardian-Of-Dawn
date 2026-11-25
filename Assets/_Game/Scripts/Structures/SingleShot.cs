using UnityEngine;

namespace GuardianOfDawn
{
    // Machine gun: instant single-target hit that never misses.
    public class SingleShot : StructureAction
    {
        public override void Act(Structure structure, Wax target)
        {
            Vector2 from = structure.transform.position;
            Vector2 to = target.transform.position;
            Vector2 direction = (to - from).normalized;

            target.TakeHit(new Hit(structure.Damage, structure.Definition.DamageType, direction));

            // Placeholder shot visual, Scene view only.
            Debug.DrawLine(from, to, Color.yellow, 0.05f);
        }
    }
}
