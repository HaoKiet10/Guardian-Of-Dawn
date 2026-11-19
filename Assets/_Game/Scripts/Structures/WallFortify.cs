using UnityEngine;

namespace GuardianOfDawn
{
    // Fortifier: no target and no damage. While standing it heals the wall and reduces the damage the wall takes.
    // Several fortifiers stack their reduction, up to the wall's own cap.
    public class WallFortify : StructureAction
    {
        // Leave empty to use the outpost's wall (there is one per map).
        [SerializeField] private Wall wall;
        [SerializeField, Min(0f)] private float healPerSecond = 1f;
        [SerializeField, Range(0f, 1f)] private float damageReduction = 0.2f;

        private Structure structure;

        public override bool NeedsTarget => false;

        private void Awake()
        {
            this.structure = GetComponent<Structure>();
            if (this.wall == null) this.wall = FindAnyObjectByType<Wall>();
            if (this.structure != null) this.structure.Shattered += OnShattered;
        }

        // Called once per TBA, so heal for that whole interval at once.
        public override void Act(Structure structure, Wax target)
        {
            if (this.wall == null) return;

            this.wall.SetDamageReduction(this, this.damageReduction);
            this.wall.Heal(this.healPerSecond * structure.Definition.TBA);
        }

        private void OnShattered(Structure shattered)
        {
            ClearReduction();
        }

        private void OnDisable()
        {
            ClearReduction();
        }

        private void ClearReduction()
        {
            if (this.wall != null) this.wall.ClearDamageReduction(this);
        }
    }
}
