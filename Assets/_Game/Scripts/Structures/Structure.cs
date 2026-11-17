using UnityEngine;

namespace GuardianOfDawn
{
    public class Structure : MonoBehaviour
    {
        [SerializeField] private StructureDefinition definition;

        private StructureAction action;
        private float cooldown;

        public StructureDefinition Definition => definition;

        private void Awake()
        {
            this.action = GetComponent<StructureAction>();

            if (this.definition == null)
            {
                Debug.LogError("Structure is missing definition", this);
                enabled = false;
                return;
            }
            if (this.action == null)
            {
                Debug.LogError("Structure has no StructureAction component", this);
                enabled = false;
            }
        }

        private void Update()
        {
            this.cooldown -= Time.deltaTime;
            if (this.cooldown > 0f) return;

            Wax target = TargetSelector.ClosestToWall(this.transform.position, this.definition.Range);
            if (target == null) return;

            this.action.Act(this, target);
            this.cooldown = this.definition.TBA;
        }

        private void OnDrawGizmosSelected()
        {
            if (this.definition == null) return;

            Gizmos.color = Color.red;
            Gizmos.DrawWireSphere(this.transform.position, this.definition.Range);
        }
    }
}
