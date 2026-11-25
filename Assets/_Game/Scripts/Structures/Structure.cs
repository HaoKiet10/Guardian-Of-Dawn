using UnityEngine;

namespace GuardianOfDawn
{
    public class Structure : MonoBehaviour
    {
        [SerializeField] private StructureDefinition definition;

        private StructureAction action;
        private float cooldown;
        private int tier;
        private StructureState state = StructureState.Active;
        private SpriteRenderer[] sprites;
        private Color[] originalColors;

        public StructureDefinition Definition => definition;
        public StructureState State => state;
        public bool IsActive => this.state == StructureState.Active && enabled;
        public event System.Action<Structure> Shattered;
        public event System.Action<Structure> Upgraded;

        // Current tier (0 = just built). Actions read their stats from here, not from the definition,
        // so every number follows the tier.
        public int Tier => this.tier;
        public float Range => this.definition.RangeAt(this.tier);
        public float TBA => this.definition.TBAAt(this.tier);
        public float Damage => this.definition.DamageAt(this.tier);
        public bool CanUpgrade => this.IsActive && this.tier < this.definition.MaxTier;
        public int NextUpgradeCost => this.definition.UpgradeCostFrom(this.tier);

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
                Wax target = TargetSelector.ClosestToWall(this.transform.position, this.Range);
                if (target == null) return;
                this.action.Act(this, target);
            }
            else
            {
                this.action.Act(this, null);
            }
            this.cooldown = this.TBA;
        }

        // Destroyed by a solar storm or a lens wax's convergence: leaves rubble and stops working.
        public void Shatter()
        {
            if (this.state == StructureState.Rubble) return;

            this.state = StructureState.Rubble;
            // GDD 4.9: the upgrades belong to this structure, so a storm takes them too.
            this.tier = 0;
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

        // Resources and research checks come later with the economy; for now this only raises the tier.
        public bool Upgrade()
        {
            if (!CanUpgrade) return false;

            this.tier++;
            Upgraded?.Invoke(this);
            return true;
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
            Gizmos.DrawWireSphere(this.transform.position, this.definition.RangeAt(this.tier));
        }

        [ContextMenu("Test: shatter")]
        private void TestShatter() => Shatter();

        [ContextMenu("Test: rebuild")]
        private void TestRebuild() => Rebuild();

        [ContextMenu("Test: upgrade")]
        private void TestUpgrade()
        {
            if (Upgrade()) Debug.Log($"{this.definition.DisplayName} is now tier {this.tier}", this);
            else Debug.Log($"{this.definition.DisplayName} can't upgrade (tier {this.tier} of {this.definition.MaxTier})", this);
        }
    }
}
