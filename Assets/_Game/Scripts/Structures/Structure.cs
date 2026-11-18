using UnityEngine;

namespace GuardianOfDawn
{
    public class Structure : MonoBehaviour
    {
        [SerializeField] private StructureDefinition definition;

        private StructureAction action;
        private float cooldown;
        private StructureState state = StructureState.Active;
        private SpriteRenderer[] sprites;
        private Color[] originalColors;

        public StructureDefinition Definition => definition;
        public StructureState State => state;
        public bool IsActive => this.state == StructureState.Active && enabled;
        public event System.Action<Structure> Shattered;

        private void Awake()
        {
            this.action = GetComponent<StructureAction>();
            this.sprites = GetComponentsInChildren<SpriteRenderer>();
            this.originalColors = new Color[this.sprites.Length];
            for (int i = 0; i < this.sprites.Length; i++)
            {
                this.originalColors[i] = this.sprites[i].color;
            }

            if (this.definition == null)
            {
                Debug.LogError("Structure is missing definition", this);
                enabled = false;
                return;
            }
            if (this.action == null)
            {
                Debug.LogError("Structure has no StructureAction component", this);
                enabled = false;
            }
        }

        private void OnEnable()
        {
            StructureRegistry.Register(this);
        }

        private void OnDisable()
        {
            StructureRegistry.Unregister(this);
        }

        private void Update()
        {
            if (this.state != StructureState.Active) return;

            this.cooldown -= Time.deltaTime;
            if (this.cooldown > 0f) return;

            if (this.action.NeedsTarget)
            {
                Wax target = TargetSelector.ClosestToWall(this.transform.position, this.definition.Range);
                if (target == null) return;
                this.action.Act(this, target);
            }
            else
            {
                this.action.Act(this, null);
            }
            this.cooldown = this.definition.TBA;
        }

        // Destroyed by a solar storm or a lens wax's convergence: leaves rubble and stops working.
        public void Shatter()
        {
            if (this.state == StructureState.Rubble) return;

            this.state = StructureState.Rubble;
            SetColorMultiplier(0.3f);
            Debug.Log(this.definition.DisplayName + " was shattered", this);
            Shattered?.Invoke(this);
        }

        public void Rebuild()
        {
            if (this.state == StructureState.Active) return;

            this.state = StructureState.Active;
            this.cooldown = 0f;
            SetColorMultiplier(1f);
        }

        private void SetColorMultiplier(float brightness)
        {
            for (int i = 0; i < this.sprites.Length; i++)
            {
                Color c = this.originalColors[i];
                this.sprites[i].color = new Color(c.r * brightness, c.g * brightness, c.b * brightness, c.a);
            }
        }

        private void OnDrawGizmosSelected()
        {
            if (this.definition == null) return;

            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(this.transform.position, this.definition.Range);
        }

        [ContextMenu("Test: shatter")]
        private void TestShatter() => Shatter();

        [ContextMenu("Test: rebuild")]
        private void TestRebuild() => Rebuild();
    }
}
