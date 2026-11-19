using UnityEngine;

namespace GuardianOfDawn
{
    // Bậc 5 – Dị Thể Sáp tối thượng: slowly heals itself all the time, unless it is burning or covered in solvent.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Traits/Self Regen")]
    public class SelfRegen : WaxTrait
    {
        [SerializeField, Min(0f)] private float regenPerSecond = 3f;

        public override WaxTraitInstance CreateInstance(Wax wax) => new Instance(this, wax);

        private class Instance : WaxTraitInstance
        {
            private readonly SelfRegen trait;

            public Instance(SelfRegen trait, Wax wax) : base(wax)
            {
                this.trait = trait;
            }

            public override void OnUpdate(float deltaTime)
            {
                // Heal refuses on its own while healing is blocked.
                this.wax.Heal(this.trait.regenPerSecond * deltaTime);
            }
        }
    }
}
