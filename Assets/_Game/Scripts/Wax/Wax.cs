using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    public class Wax : MonoBehaviour
    {
        [SerializeField] private WaxDefinition definition;
        [SerializeField] private WaxPath path;
        [SerializeField] private float hp;
        [SerializeField] private float distanceTraveled = 0f;
        [SerializeField] private int nextWayPoint;
        [SerializeField] private WaxState state;

        private readonly List<StatusEffect> effects = new List<StatusEffect>();
        private readonly List<WaxTraitInstance> traits = new List<WaxTraitInstance>();
        private Vector2 moveDirection;
        private float holdTimeLeft;
        private Vector2 lurePoint;
        private float lureTimeLeft;
        private bool startPartway;

        public WaxDefinition Definition => definition;
        public WaxPath Path => path;
        public WaxState State => state;
        public float Hp => hp;
        public float MaxHp => definition.MaxHp;
        public float DistanceTraveled => distanceTraveled;
        public int NextWayPoint => nextWayPoint;
        // Direction of the last step; zero while standing still. FrontShell uses it to tell front from back.
        public Vector2 MoveDirection => moveDirection;
        public event System.Action<Wax> Died;

        public bool IsHealingBlocked
        {
            get
            {
                foreach (StatusEffect effect in this.effects)
                {
                    if (effect.BlocksHealing) return true;
                }
                return false;
            }
        }

        public float SpeedMultiplier
        {
            get
            {
                float multiplier = 1f;
                foreach (StatusEffect effect in this.effects)
                {
                    multiplier *= effect.SpeedMultiplier;
                }
                return multiplier;
            }
        }

        public void Init(WaxDefinition definition, WaxPath path)
        {
            this.definition = definition;
            this.path = path;
        }

        // Starts the wax partway along its path instead of at the first point,
        // e.g. the Sáp vụn released where a Sáp bào tử died.
        public void InitPartway(WaxDefinition definition, WaxPath path, Vector2 position, int nextWayPoint, float distanceTraveled)
        {
            Init(definition, path);
            this.transform.position = position;
            this.nextWayPoint = nextWayPoint;
            this.distanceTraveled = distanceTraveled;
            this.startPartway = true;
        }

        private void Start()
        {
            if (this.definition == null)
            {
                Debug.LogError("Wax is missing definition", this);
                enabled = false;
                return;
            }
            else if (this.path == null)
            {
                Debug.LogError("Wax is missing path", this);
                enabled = false;
                return;
            }

            this.hp = this.definition.MaxHp;
            if (!this.startPartway)
            {
                this.nextWayPoint = 1;
                this.distanceTraveled = 0f;
                this.transform.position = this.path.GetPoint(0);
            }
            this.state = this.nextWayPoint >= this.path.Count ? WaxState.AttackingTheWall : WaxState.Walking;

            ApplyLook();
            foreach (WaxTrait trait in this.definition.Traits)
            {
                if (trait != null) this.traits.Add(trait.CreateInstance(this));
            }
        }

        private void ApplyLook()
        {
            this.transform.localScale = Vector3.one * this.definition.Scale;
            SpriteRenderer sprite = GetComponentInChildren<SpriteRenderer>();
            if (sprite != null) sprite.color = this.definition.Tint;
        }

        private void Update()
        {
            if (this.state == WaxState.Dead) return;

            TickEffects(Time.deltaTime);
            if (this.state == WaxState.Dead) return;

            for (int i = 0; i < this.traits.Count; i++)
            {
                this.traits[i].OnUpdate(Time.deltaTime);
            }
            if (this.state == WaxState.Dead) return;

            switch (this.state)
            {
                case WaxState.Walking:
                    this.Walk();
                    break;
                case WaxState.AttackingTheWall:
                    this.AttackWall();
                    break;
            }
        }

        private void TickEffects(float deltaTime)
        {
            // Backwards, so expired effects can be removed while looping.
            for (int i = this.effects.Count - 1; i >= 0; i--)
            {
                this.effects[i].Tick(this, deltaTime);
                if (this.state == WaxState.Dead) return;
                if (this.effects[i].IsExpired) this.effects.RemoveAt(i);
            }
        }

        private void Walk()
        {
            if (this.holdTimeLeft > 0f)
            {
                this.holdTimeLeft -= Time.deltaTime;
                this.moveDirection = Vector2.zero;
                return;
            }

            float step = this.definition.Speed * this.SpeedMultiplier * Time.deltaTime;
            Vector2 currentPosition = this.transform.position;

            if (this.lureTimeLeft > 0f)
            {
                // Lured off the path: walk toward the lure. Not progress toward the wall, so distance is unchanged.
                this.lureTimeLeft -= Time.deltaTime;
                MoveTo(currentPosition, Vector2.MoveTowards(currentPosition, this.lurePoint, step));
                return;
            }

            Vector2 target = this.path.GetPoint(this.nextWayPoint);
            Vector2 nextPosition = Vector2.MoveTowards(currentPosition, target, step);
            MoveTo(currentPosition, nextPosition);
            this.distanceTraveled += Vector2.Distance(currentPosition, nextPosition);

            if (nextPosition == target)
            {
                this.nextWayPoint++;
                if (nextWayPoint >= path.Count)
                {
                    this.state = WaxState.AttackingTheWall;
                    Debug.Log(this.definition.DisplayName + " has reached the wall");
                }
            }
        }

        private void MoveTo(Vector2 from, Vector2 to)
        {
            Vector2 delta = to - from;
            this.moveDirection = delta.sqrMagnitude > 0f ? delta.normalized : Vector2.zero;
            this.transform.position = to;
        }

        private void AttackWall()
        {
            if (this.path.Wall == null || this.path.Wall.IsDestroyed) return;
            // Netted or frozen wax can't attack either.
            if (this.SpeedMultiplier <= 0f) return;

            this.path.Wall.TakeDamage(definition.WallDamagePerSecond * Time.deltaTime);
        }

        public void TakeHit(Hit hit)
        {
            if (this.state == WaxState.Dead) return;

            for (int i = 0; i < this.traits.Count; i++)
            {
                hit = this.traits[i].ModifyHit(hit);
            }
            if (hit.amount <= 0f) return;

            this.hp -= hit.amount;
            if (this.hp <= 0f)
            {
                this.hp = 0f;
                this.Die();
            }
        }

        // Returns false if the wax couldn't be healed (dead, or burning / covered in solvent).
        public bool Heal(float amount)
        {
            if (this.state == WaxState.Dead || this.IsHealingBlocked) return false;

            this.hp = Mathf.Min(this.definition.MaxHp, this.hp + amount);
            return true;
        }

        public void AddEffect(StatusEffect effect)
        {
            if (this.state == WaxState.Dead) return;

            foreach (StatusEffect existing in this.effects)
            {
                if (existing.GetType() == effect.GetType())
                {
                    existing.Refresh(effect);
                    return;
                }
            }
            this.effects.Add(effect);
        }

        public bool HasEffect<T>() where T : StatusEffect
        {
            foreach (StatusEffect effect in this.effects)
            {
                if (effect is T) return true;
            }
            return false;
        }

        public bool HasTrait<T>() where T : WaxTrait
        {
            foreach (WaxTrait trait in this.definition.Traits)
            {
                if (trait is T) return true;
            }
            return false;
        }

        // Stand still for a while (healing wax, convergence).
        public void HoldPosition(float seconds)
        {
            this.holdTimeLeft = Mathf.Max(this.holdTimeLeft, seconds);
        }

        // Leave the path and walk toward a point for a while (heat lure). Afterwards it heads back to the path.
        public void LureTowards(Vector2 point, float seconds)
        {
            this.lurePoint = point;
            this.lureTimeLeft = Mathf.Max(this.lureTimeLeft, seconds);
        }

        private void Die()
        {
            this.state = WaxState.Dead;
            for (int i = 0; i < this.traits.Count; i++)
            {
                this.traits[i].OnDeath();
            }
            Died?.Invoke(this);
            Destroy(gameObject);
        }

        private void OnEnable()
        {
            WaxRegistry.Register(this);
        }

        private void OnDisable()
        {
            WaxRegistry.Unregister(this);
        }

        [ContextMenu("Test: hit for 10")]
        private void TestHit() => TakeHit(new Hit(10f, DamageType.Bullet, Vector2.right));

        [ContextMenu("Test: burn for 3 s")]
        private void TestBurn() => AddEffect(new Burning(5f, 3f));

        [ContextMenu("Test: net for 2 s")]
        private void TestNet() => AddEffect(new Netted(2f));
    }
}
