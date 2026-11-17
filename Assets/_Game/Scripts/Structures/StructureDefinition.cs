using UnityEngine;

namespace GuardianOfDawn
{
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Structure Definition")]

    public class StructureDefinition : ScriptableObject
    {
        [SerializeField] private string displayName = "Structure";
        [SerializeField, Min(1)] private int buildCost = 50;
        [SerializeField, Min(0.1f)] private float range = 5f;
        //tba = time between attack
        [SerializeField, Min(0.01f)] private float tba = 0.2f;
        [SerializeField, Min(0f)] private float damage = 3f; 
        [SerializeField] private DamageType damageType = DamageType.Bullet;

        public string DisplayName => displayName;
        public int BuildCost => buildCost;
        public float Range => range;
        public float TBA => tba;
        public float Damage => damage;
        public DamageType DamageType => damageType;
    }
}