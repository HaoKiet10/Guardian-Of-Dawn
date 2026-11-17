using UnityEngine;

namespace GuardianOfDawn {
    public readonly struct Hit
    {
        public readonly float amount;
        public readonly DamageType damageType;
        public readonly Vector2 direction;

        public Hit (float amount, DamageType damageType, Vector2 direction)
        {
            this.amount = amount;
            this.damageType = damageType;
            this.direction = direction;
        }

        public Hit WithAmount(float newAmount)
        {
            return new Hit(newAmount, this.damageType, this.direction);
        }
    }
}