using UnityEngine;

namespace GuardianOfDawn
{
    // One member of a squad. It has its own health and shoots the wax closest to the wall within range,
    // like a small tower. The Squad creates soldiers and calls Init; nothing else should.
    public class Soldier : MonoBehaviour
    {
        private Squad squad;
        private SquadDefinition definition;
        private float hp;
        private float cooldown;
        private SpriteRenderer spriteRenderer;
        private SoldierAnimator animator;

        public Squad Squad => this.squad;
        public float Hp => this.hp;
        public float MaxHp => this.definition.SoldierMaxHp;
        public bool IsAlive => this.hp > 0f;
        public event System.Action<Soldier> Died;

        public void Init(Squad squad, SquadDefinition definition)
        {
            this.squad = squad;
            this.definition = definition;
            this.hp = definition.SoldierMaxHp;
        }

        private void Awake()
        {
            this.spriteRenderer = GetComponentInChildren<SpriteRenderer>();
            this.animator = GetComponent<SoldierAnimator>();
        }

        private void Start()
        {
            if (this.definition == null)
            {
                Debug.LogError("Soldier was not created by a Squad (Init was not called)", this);
                enabled = false;
                return;
            }
            if (this.spriteRenderer == null) return;
            if (this.animator != null) this.animator.Init(this.definition, this.spriteRenderer);
            else this.spriteRenderer.sprite = this.definition.Sprite;
        }

        private void OnEnable()
        {
            SoldierRegistry.Register(this);
        }

        private void OnDisable()
        {
            SoldierRegistry.Unregister(this);
        }

        private void Update()
        {
            if (this.definition == null || !IsAlive) return;

            this.cooldown -= Time.deltaTime;
            if (this.cooldown > 0f) return;

            Wax target = TargetSelector.ClosestToWall(this.transform.position, this.definition.Range);
            if (target == null) return;

            Vector2 direction = ((Vector2)(target.transform.position - this.transform.position)).normalized;
            target.TakeHit(new Hit(this.definition.Damage, this.definition.DamageType, direction));
            if (this.animator != null) this.animator.PlayFire(direction);
            this.cooldown = this.definition.TBA;
        }

        public void TakeDamage(float amount)
        {
            if (!IsAlive || amount <= 0f) return;

            this.hp = Mathf.Max(0f, this.hp - amount);
            if (this.animator != null) this.animator.PlayHurt();
            if (this.hp <= 0f) Die();
        }

        // Leaves the squad and the registry at once; the body stays for the death animation
        // (about half a second) when there is an animator, then the animator destroys it.
        private void Die()
        {
            Died?.Invoke(this);
            enabled = false; // stops shooting; OnDisable unregisters the soldier
            if (this.animator != null) this.animator.PlayDeath();
            else Destroy(this.gameObject);
        }

        [ContextMenu("Test: take 10 damage")]
        private void TestDamage() => TakeDamage(10f);
    }
}
