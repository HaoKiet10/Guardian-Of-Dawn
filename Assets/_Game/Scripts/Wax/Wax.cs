using UnityEngine;

namespace GuardianOfDawn
{
    public class Wax : MonoBehaviour
    {
        [SerializeField] private WaxDefinition definition;
        [SerializeField] private WaxPath path;
        [SerializeField] private float hp;
        [SerializeField] private int nextWayPoint;
        [SerializeField] private WaxState state;

        public WaxState State => state;
        public event System.Action<Wax> Died;

        public void Init(WaxDefinition definition, WaxPath path)
        {
            this.definition = definition;
            this.path = path;
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
            this.nextWayPoint = 1;
            this.state = WaxState.Walking;
            this.transform.position = this.path.GetPoint(0);
        }

        private void Update()
        {
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

        private void Walk()
        {
            Vector2 target = this.path.GetPoint(this.nextWayPoint);
            this.transform.position = Vector2.MoveTowards(this.transform.position, target, this.definition.Speed * Time.deltaTime);

            if ((Vector2)this.transform.position == target)
            {
                this.nextWayPoint++;
                if (nextWayPoint >= path.Count)
                {
                    this.state = WaxState.AttackingTheWall;
                    Debug.Log(this.definition.DisplayName + "has reached the wall");
                }
            }
        }

        private void AttackWall()
        {
            
        }

        public void TakeHit(Hit hit)
        {
            if(this.state == WaxState.Dead)
                return;
            float remainingHp = this.hp - hit.amount;
            if (remainingHp <= 0f)
            {
                this.Die();
                return;
            }
            this.hp = remainingHp;
        }

        private void Die()
        {
            this.state = WaxState.Dead;
            Died?.Invoke(this);
            Destroy(gameObject);
        }

        [ContextMenu("Test: hit for 10")]
        private void TestHit() => TakeHit(new Hit(10f, DamageType.Bullet, Vector2.right));
    }
}