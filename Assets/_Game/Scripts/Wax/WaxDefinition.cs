using UnityEngine;

namespace GuardianOfDawn {
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Wax Definition")]
    public class WaxDefinition : ScriptableObject
    {
        [SerializeField] private string displayName = "Wax";
        [SerializeField, Min(1f)] private float maxHp = 20f;
        [SerializeField, Min(.1f)] private float speed = 2f;
        [SerializeField, Min(0f)] private float wallDamagePerSecond = 1f;
        [SerializeField, Min(1)] private int resourceDrop = 5;
        [SerializeField] private bool isLarge = false;

        public string DisplayName => displayName;
        public float MaxHp => maxHp;
        public float Speed => speed;
        public float WallDamagePerSecond => wallDamagePerSecond;
        public int ResourceDrop => resourceDrop;
        public bool IsLarge => isLarge;
    }
}
