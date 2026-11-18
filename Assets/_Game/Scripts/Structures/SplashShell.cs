using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Mortar: long range, the shell lands on the target and damages every wax around it.
    public class SplashShell : StructureAction
    {
        [SerializeField, Min(0.1f)] private float splashRadius = 1.2f;

        private readonly List<Wax> hits = new List<Wax>();

        public override void Act(Structure structure, Wax target)
        {
            Vector2 impact = target.transform.position;
            TargetSelector.InRange(impact, this.splashRadius, this.hits);

            foreach (Wax wax in this.hits)
            {
                Vector2 direction = ((Vector2)wax.transform.position - impact).normalized;
                wax.TakeHit(new Hit(structure.Definition.Damage, structure.Definition.DamageType, direction));
            }

            // Placeholder impact mark, Scene view only.
            Debug.DrawLine(impact + new Vector2(-0.3f, -0.3f), impact + new Vector2(0.3f, 0.3f), Color.yellow, 0.2f);
            Debug.DrawLine(impact + new Vector2(-0.3f, 0.3f), impact + new Vector2(0.3f, -0.3f), Color.yellow, 0.2f);
        }
    }
}
