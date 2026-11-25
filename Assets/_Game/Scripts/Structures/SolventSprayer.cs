using UnityEngine;

namespace GuardianOfDawn
{
    // Solvent sprayer: lobs a glob at the target, which leaves a solvent puddle on the path.
    // The definition's Damage is the glob's direct hit (can be 0); the puddle does the real work.
    public class SolventSprayer : StructureAction
    {
        // Optional: a prefab with a SolventPuddle (and its art). Empty = a plain puddle object is made.
        [SerializeField] private SolventPuddle puddlePrefab;
        [SerializeField, Min(0.1f)] private float puddleRadius = 1f;
        [SerializeField, Min(0.1f)] private float puddleLifetime = 4f;
        [SerializeField, Min(0f)] private float damagePerSecond = 2f;
        // How long the effect lasts after a wax leaves the puddle.
        [SerializeField, Min(0.1f)] private float effectDuration = 1.5f;

        public override void Act(Structure structure, Wax target)
        {
            Vector2 impact = target.transform.position;

            if (structure.Damage > 0f)
            {
                Vector2 direction = (impact - (Vector2)structure.transform.position).normalized;
                target.TakeHit(new Hit(structure.Damage, structure.Definition.DamageType, direction));
            }

            SolventPuddle puddle = this.puddlePrefab != null
                ? Instantiate(this.puddlePrefab)
                : new GameObject("Solvent Puddle").AddComponent<SolventPuddle>();
            puddle.transform.position = impact;
            puddle.Init(this.puddleRadius, this.puddleLifetime, this.damagePerSecond, this.effectDuration);

            Debug.DrawLine(structure.transform.position, impact, new Color(0.6f, 1f, 0.3f), 0.2f);
        }
    }
}
