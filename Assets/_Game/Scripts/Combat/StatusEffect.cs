using UnityEngine;

namespace GuardianOfDawn
{
    // A timed condition on a wax (burning, slowed, netted...). Plain C# class: each wax owns its own copies.
    // Applying an effect the wax already has refreshes the existing one instead of stacking a second copy.
    public abstract class StatusEffect
    {
        private float remainingTime;

        protected StatusEffect(float duration)
        {
            this.remainingTime = duration;
        }

        public float RemainingTime => remainingTime;
        public bool IsExpired => remainingTime <= 0f;

        // 1 = normal speed, 0 = cannot move (or act).
        public virtual float SpeedMultiplier => 1f;
        public virtual bool BlocksHealing => false;
        public virtual bool MeltsArmor => false;
        public virtual bool IsFrozen => false;

        public void Tick(Wax wax, float deltaTime)
        {
            OnTick(wax, deltaTime);
            this.remainingTime -= deltaTime;
        }

        public void Refresh(StatusEffect fresh)
        {
            this.remainingTime = Mathf.Max(this.remainingTime, fresh.remainingTime);
            OnRefresh(fresh);
        }

        protected virtual void OnTick(Wax wax, float deltaTime) { }

        // Called with a new effect of the same type; keep whichever values are stronger.
        protected virtual void OnRefresh(StatusEffect fresh) { }
    }
}
