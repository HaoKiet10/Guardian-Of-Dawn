using UnityEngine;

namespace GuardianOfDawn
{
    public enum SoldierPose { Idle, Fire, Skill }

    // Which way a soldier looks. The sprite sheets hold S, E and N; W is the E sprite flipped.
    public enum Facing { S, E, N, W }

    // The poses of one soldier type. Stills have one sprite per direction (index 0 = S, 1 = E, 2 = N),
    // as cut by Tools/ArtGen/build_squads_from_poses.py. The walk is a loop of frames per direction,
    // cut by Tools/ArtGen/build_squad_walk_from_video.py. Extra motion is added by SoldierAnimator.
    [System.Serializable]
    public class SoldierPoses
    {
        [SerializeField] private Sprite[] idle = new Sprite[3];
        [SerializeField] private Sprite[] fire = new Sprite[3];
        [SerializeField] private Sprite[] skill = new Sprite[3];

        [Header("Walk loops (empty = idle still with a code bob)")]
        [SerializeField] private Sprite[] walkS = new Sprite[0];
        [SerializeField] private Sprite[] walkE = new Sprite[0];
        [SerializeField] private Sprite[] walkN = new Sprite[0];

        // The sprite for a pose and facing, and whether to flip it. A missing pose falls back to idle.
        public Sprite Get(SoldierPose pose, Facing facing, out bool flipX)
        {
            flipX = facing == Facing.W;
            int row = facing == Facing.W ? 1 : (int)facing;
            Sprite found = Pick(Row(pose), row);
            return found != null ? found : Pick(this.idle, row);
        }

        public bool HasAny => Pick(this.idle, 0) != null;

        // Whether a drawn walk loop exists for this facing.
        public bool HasWalk(Facing facing) => WalkFrames(facing).Length > 0;

        // Frame `index` of the walk loop (wraps around), or null when this facing has no loop.
        public Sprite GetWalk(Facing facing, int index, out bool flipX)
        {
            flipX = facing == Facing.W;
            Sprite[] frames = WalkFrames(facing);
            if (frames.Length == 0) return null;
            int i = ((index % frames.Length) + frames.Length) % frames.Length;
            return frames[i];
        }

        private Sprite[] WalkFrames(Facing facing)
        {
            Sprite[] frames;
            switch (facing)
            {
                case Facing.S: frames = this.walkS; break;
                case Facing.N: frames = this.walkN; break;
                default: frames = this.walkE; break;
            }
            return frames ?? System.Array.Empty<Sprite>();
        }

        private Sprite[] Row(SoldierPose pose)
        {
            switch (pose)
            {
                case SoldierPose.Fire: return this.fire;
                case SoldierPose.Skill: return this.skill;
                default: return this.idle;
            }
        }

        private static Sprite Pick(Sprite[] sprites, int row) =>
            sprites != null && row < sprites.Length ? sprites[row] : null;
    }
}
