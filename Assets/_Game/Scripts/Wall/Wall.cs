using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    public class Wall : MonoBehaviour
    {
        [SerializeField, Min(1f)] private float maxHp = 100f;
        [SerializeField] private float hp;
        // Fortifiers (and later Lính trấn thủ) stack their reduction up to this cap.
        [SerializeField, Range(0f, 1f)] private float maxDamageReduction = 0.6f;

        private readonly Dictionary<Object, float> damageReductions = new Dictionary<Object, float>();

        public float Hp => hp;
        public float MaxHp => maxHp;
        public bool IsDestroyed => this.Hp <= 0f ? true : false;
        public event System.Action<Wall> Destroyed;

        public float DamageReduction
        {
            get
            {
                float total = 0f;
                foreach (float reduction in this.damageReductions.Values)
                {
                    total += reduction;
                }
                return Mathf.Min(total, this.maxDamageReduction);
            }
        }

        private void Awake()
        {
            this.hp = this.maxHp;
        }

        public void TakeDamage(float amount)
        {
            if (IsDestroyed) return;
            this.hp -= amount * (1f - this.DamageReduction);
            if (this.hp <= 0)
            {
                this.hp = 0f;
                Collapse();
                Debug.Log("The wall has fallen!!!");
            }
        }

        public void Heal(float amount)
        {
            if (IsDestroyed) return;
            this.hp = Mathf.Min(this.maxHp, this.hp + amount);
        }

        // Each source (one fortifier) sets its own share; setting again replaces it.
        public void SetDamageReduction(Object source, float reduction)
        {
            this.damageReductions[source] = reduction;
        }

        public void ClearDamageReduction(Object source)
        {
            this.damageReductions.Remove(source);
        }

        private void Collapse()
        {
            Destroyed?.Invoke(this);
        }
    }
}
