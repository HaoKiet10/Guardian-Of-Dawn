
using UnityEngine;

namespace GuardianOfDawn
{
    public class Wall : MonoBehaviour
    {
        [SerializeField, Min(1f)] private float maxHp = 100f;
        [SerializeField] private float hp;

        public float Hp => hp;
        public bool IsDestroyed => this.Hp <= 0f ? true : false;
        public event System.Action<Wall> Destroyed;

        private void Awake()
        {
            this.hp = this.maxHp;
        }

        public void TakeDamage(float amount)
        {
            if (IsDestroyed) return;
            this.hp -= amount;
            if (this.hp <= 0)
            {
                this.hp = 0f;
                Collapse();
                Debug.Log("The wall has fallen!!!");
            }
        }

        private void Collapse() 
        {
            Destroyed?.Invoke(this);
        }
    }
}