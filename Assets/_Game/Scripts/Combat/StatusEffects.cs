using UnityEngine;

namespace GuardianOfDawn
{
    // Flamethrower. Damage over time; burning wax cannot heal.
    public class Burning : StatusEffect
    {
        private float damagePerSecond;

        public Burning(float damagePerSecond, float duration) : base(duration)
        {
            this.damagePerSecond = damagePerSecond;
        }

        public override bool BlocksHealing => true;

        protected override void OnTick(Wax wax, float deltaTime)
        {
            wax.TakeHit(new Hit(this.damagePerSecond * deltaTime, DamageType.Fire, Vector2.zero));
        }

        protected override void OnRefresh(StatusEffect fresh)
        {
            this.damagePerSecond = Mathf.Max(this.damagePerSecond, ((Burning)fresh).damagePerSecond);
        }
    }

    // Solvent puddle. Damage over time, blocks healing and melts armor (Sáp vỏ cua).
    public class Solvent : StatusEffect
    {
        private float damagePerSecond;

        public Solvent(float damagePerSecond, float duration) : base(duration)
        {
            this.damagePerSecond = damagePerSecond;
        }

        public override bool BlocksHealing => true;
        public override bool MeltsArmor => true;

        protected override void OnTick(Wax wax, float deltaTime)
        {
            wax.TakeHit(new Hit(this.damagePerSecond * deltaTime, DamageType.Solvent, Vector2.zero));
        }

        protected override void OnRefresh(StatusEffect fresh)
        {
            this.damagePerSecond = Mathf.Max(this.damagePerSecond, ((Solvent)fresh).damagePerSecond);
        }
    }

    // Cryo tower, or a net on a large wax. Keeps the strongest slow.
    public class Slowed : StatusEffect
    {
        private float multiplier;

        public Slowed(float multiplier, float duration) : base(duration)
        {
            this.multiplier = multiplier;
        }

        public override float SpeedMultiplier => multiplier;

        protected override void OnRefresh(StatusEffect fresh)
        {
            this.multiplier = Mathf.Min(this.multiplier, ((Slowed)fresh).multiplier);
        }
    }

    // Net launcher. Pinned in place.
    public class Netted : StatusEffect
    {
        public Netted(float duration) : base(duration) { }

        public override float SpeedMultiplier => 0f;
    }

    // Cryo tower on a lens wax. Pinned in place and interrupts convergence.
    public class Frozen : StatusEffect
    {
        public Frozen(float duration) : base(duration) { }

        public override float SpeedMultiplier => 0f;
        public override bool IsFrozen => true;
    }

    // Sáp kích động's shout. Keeps the strongest boost.
    public class Hastened : StatusEffect
    {
        private float multiplier;

        public Hastened(float multiplier, float duration) : base(duration)
        {
            this.multiplier = multiplier;
        }

        public override float SpeedMultiplier => multiplier;

        protected override void OnRefresh(StatusEffect fresh)
        {
            this.multiplier = Mathf.Max(this.multiplier, ((Hastened)fresh).multiplier);
        }
    }
}
