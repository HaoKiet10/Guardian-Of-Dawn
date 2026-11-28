using UnityEngine;

namespace GuardianOfDawn
{
    // One type of soldier squad (GDD 4.6): Lính trấn thủ, Thợ săn, Công binh.
    // Every number is per soldier; a squad is several soldiers standing close together.
    [CreateAssetMenu(menuName = "Guardian Of Dawn/Squad Definition")]
    public class SquadDefinition : ScriptableObject
    {
        [SerializeField] private string displayName = "Squad";
        [SerializeField, Min(1)] private int trainCost = 60;
        [SerializeField, Min(1)] private int memberCount = 3;

        [SerializeField, Min(1f)] private float soldierMaxHp = 30f;
        [SerializeField, Min(0.1f)] private float range = 3f;
        //tba = time between attack
        [SerializeField, Min(0.01f)] private float tba = 0.8f;
        [SerializeField, Min(0f)] private float damage = 3f;
        [SerializeField] private DamageType damageType = DamageType.Bullet;

        // Distance between soldiers in the formation.
        [SerializeField, Min(0.1f)] private float spacing = 0.45f;
        // Icon and fallback look (idle, facing the camera).
        [SerializeField] private Sprite sprite;

        [Header("Look")]
        [SerializeField] private SoldierPoses poses = new SoldierPoses();
        [SerializeField] private Sprite muzzleFlash;
        // Gun tip in the fire pose, from the soldier's feet in world units, for S, E and N (W mirrors E).
        // Taken from the drawings: the S drawings aim to the right, the N drawings up and to the left.
        [SerializeField] private Vector2[] muzzleOffsets =
            { new Vector2(0.2f, 0.2f), new Vector2(0.22f, 0.27f), new Vector2(-0.16f, 0.35f) };

        public string DisplayName => this.displayName;
        public int TrainCost => this.trainCost;
        public int MemberCount => this.memberCount;
        public float SoldierMaxHp => this.soldierMaxHp;
        public float Range => this.range;
        public float TBA => this.tba;
        public float Damage => this.damage;
        public DamageType DamageType => this.damageType;
        public float Spacing => this.spacing;
        public Sprite Sprite => this.sprite;
        public SoldierPoses Poses => this.poses;
        public Sprite MuzzleFlash => this.muzzleFlash;
        public Vector2 MuzzleOffset(Facing facing)
        {
            int row = facing == Facing.W ? 1 : (int)facing;
            Vector2 tip = this.muzzleOffsets != null && row < this.muzzleOffsets.Length ? this.muzzleOffsets[row] : Vector2.up * 0.2f;
            if (facing == Facing.W) tip.x = -tip.x;
            return tip;
        }
    }
}
