using UnityEngine;

namespace GuardianOfDawn
{
    // A special ability of a wax type (front shell, healing aura, split on death...).
    // The trait asset holds the tuning numbers and is shared by every wax of that type,
    // so it creates one WaxTraitInstance per wax to hold that wax's own timers.
    public abstract class WaxTrait : ScriptableObject
    {
        public abstract WaxTraitInstance CreateInstance(Wax wax);
    }

    public abstract class WaxTraitInstance
    {
        protected readonly Wax wax;

        protected WaxTraitInstance(Wax wax)
        {
            this.wax = wax;
        }

        // Runs on every hit before HP goes down. Return the hit unchanged, reduced, or with amount 0.
        public virtual Hit ModifyHit(Hit hit) => hit;

        public virtual void OnUpdate(float deltaTime) { }

        // Runs once when the wax dies, before it is removed from the scene.
        public virtual void OnDeath() { }
    }
}
