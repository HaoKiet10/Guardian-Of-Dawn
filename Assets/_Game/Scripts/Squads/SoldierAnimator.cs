using System.Collections;
using UnityEngine;

namespace GuardianOfDawn
{
    // Brings a soldier's still poses to life with code-driven motion: facing, idle breathing,
    // walking bob and lean, fire recoil with a muzzle flash, a hurt tint, the skill pose and a
    // fall-and-fade death. Every number is a tunable below.
    //
    // It moves only the "Body" child (the sprite), never the soldier itself, so targeting and
    // formation positions are untouched. The sprite pivot is at the feet, so tilting the body
    // tips the soldier over his feet.
    public class SoldierAnimator : MonoBehaviour
    {
        // World units per sprite pixel (sprites are 128 px per unit).
        private const float Px = 1f / 128f;

        [Header("Idle")]
        [SerializeField] private float bobHeight = 1.5f * Px;
        [SerializeField] private float bobPeriod = 2f;

        [Header("Walk (used once squads move)")]
        // Frames per second of the drawn walk loop; 8 frames at 8 fps = one stride per second.
        [SerializeField] private float walkFps = 8f;
        // Used only where a facing has no drawn walk loop: the idle still bobs and leans instead.
        [SerializeField] private float walkBobHeight = 3f * Px;
        [SerializeField] private float walkBobPeriod = 0.36f;
        [SerializeField] private float walkLean = 6f;

        [Header("Fire")]
        [SerializeField] private float fireHold = 0.35f;
        [SerializeField] private float recoilDistance = 3f * Px;
        [SerializeField] private float recoilTime = 0.09f;
        [SerializeField] private float flashTime = 0.06f;
        [SerializeField] private float flashScale = 0.4f;
        [SerializeField] private Color flashColor = new Color(1f, 0.85f, 0.45f);

        [Header("Hurt")]
        [SerializeField] private Color hurtTint = new Color(1f, 0.55f, 0.55f);
        [SerializeField] private float hurtTime = 0.1f;

        [Header("Skill")]
        [SerializeField] private float skillPop = 1.12f;
        [SerializeField] private float skillPopTime = 0.18f;

        [Header("Death")]
        [SerializeField] private float deathTipAngle = 80f;
        [SerializeField] private float deathTipTime = 0.35f;
        [SerializeField] private float deathFadeTime = 0.3f;

        private SquadDefinition definition;
        private SpriteRenderer body;
        private SpriteRenderer flash;
        private float phase;
        private float fireUntil = -1f;
        private float skillStart = -1f;
        private float skillUntil = -1f;
        private float recoilStart = -1f;
        private Vector2 recoilDirection;
        private float flashUntil = -1f;
        private float hurtUntil = -1f;
        private Vector2 velocity;

        public Facing Facing { get; private set; } = Facing.S;
        public SoldierPose Pose { get; private set; } = SoldierPose.Idle;
        public bool IsDying { get; private set; }
        // True while the drawn walk loop is playing (moving, not firing, and a loop exists for the facing).
        public bool Walking { get; private set; }
        public float DeathDuration => this.deathTipTime + this.deathFadeTime;

        public void Init(SquadDefinition definition, SpriteRenderer body)
        {
            this.definition = definition;
            this.body = body;
            // Out of step with the rest of the squad, so they don't breathe in unison.
            this.phase = Random.value * 10f;

            if (definition.MuzzleFlash != null)
            {
                var go = new GameObject("Muzzle Flash");
                go.transform.SetParent(this.transform, false);
                this.flash = go.AddComponent<SpriteRenderer>();
                this.flash.sprite = definition.MuzzleFlash;
                this.flash.color = this.flashColor;
                this.flash.sortingOrder = body.sortingOrder + 1;
                this.flash.enabled = false;
            }
            Apply();
        }

        // S, E, N or W for a direction, using the camera's 3/4 squash so diagonals split evenly.
        public static Facing FacingFor(Vector2 direction)
        {
            if (direction.sqrMagnitude < 1e-6f) return Facing.S;
            int k = Mathf.RoundToInt(Mathf.Atan2(direction.y / 0.72f, direction.x) * Mathf.Rad2Deg / 90f);
            switch (k)
            {
                case 0: return Facing.E;
                case 1: return Facing.N;
                case -1: return Facing.S;
                default: return Facing.W;
            }
        }

        public void Face(Vector2 direction)
        {
            if (direction.sqrMagnitude > 1e-6f) Facing = FacingFor(direction);
        }

        // A shot toward `direction`: fire pose, recoil and muzzle flash.
        public void PlayFire(Vector2 direction)
        {
            if (IsDying) return;
            Face(direction);
            this.fireUntil = Time.time + this.fireHold;
            this.recoilStart = Time.time;
            this.recoilDirection = direction.normalized;
            this.flashUntil = Time.time + this.flashTime;
        }

        public void PlayHurt()
        {
            if (!IsDying) this.hurtUntil = Time.time + this.hurtTime;
        }

        // Holds the skill pose for `duration` seconds, with a short pop as it starts.
        public void PlaySkill(float duration)
        {
            if (IsDying) return;
            this.skillStart = Time.time;
            this.skillUntil = Time.time + Mathf.Max(duration, this.skillPopTime);
        }

        // World velocity of the squad; zero when standing. Drives the walk bob and lean.
        public void SetVelocity(Vector2 velocity)
        {
            this.velocity = velocity;
            if (velocity.sqrMagnitude > 1e-4f && Time.time > this.fireUntil) Face(velocity);
        }

        // Tips the soldier over, fades him out, then destroys the soldier's GameObject.
        public void PlayDeath()
        {
            if (IsDying) return;
            IsDying = true;
            StartCoroutine(Die());
        }

        private void Update()
        {
            if (this.body == null || IsDying) return;
            Apply();
        }

        private void Apply()
        {
            float t = Time.time;
            Pose = t < this.skillUntil ? SoldierPose.Skill : t < this.fireUntil ? SoldierPose.Fire : SoldierPose.Idle;

            bool moving = this.velocity.sqrMagnitude > 1e-4f && Pose == SoldierPose.Idle;
            // A drawn walk loop carries its own steps and bounce, so it gets no code bob or lean.
            Walking = moving && this.definition.Poses.HasWalk(Facing);

            Sprite sprite;
            bool flipX;
            if (Walking)
                sprite = this.definition.Poses.GetWalk(Facing, Mathf.FloorToInt((t + this.phase) * this.walkFps), out flipX);
            else if (this.definition.Poses.HasAny)
                sprite = this.definition.Poses.Get(Pose, Facing, out flipX);
            else
                sprite = FallbackSprite(out flipX);
            this.body.sprite = sprite;
            this.body.flipX = flipX;

            bool codeWalk = moving && !Walking;
            float height = Walking ? 0f : codeWalk ? this.walkBobHeight : this.bobHeight;
            float period = codeWalk ? this.walkBobPeriod : this.bobPeriod;
            float wave = Mathf.Sin((t + this.phase) * Mathf.PI * 2f / period);
            Vector2 offset = new Vector2(0f, codeWalk ? Mathf.Abs(wave) * height : (wave * 0.5f + 0.5f) * height);

            if (this.recoilStart >= 0f && t - this.recoilStart < this.recoilTime)
            {
                float k = 1f - Ease.OutCubic((t - this.recoilStart) / this.recoilTime);
                offset -= this.recoilDirection * this.recoilDistance * k;
            }
            this.body.transform.localPosition = offset;

            float lean = codeWalk ? -Mathf.Sign(this.velocity.x) * this.walkLean * Mathf.Min(1f, Mathf.Abs(this.velocity.x) * 4f) : 0f;
            this.body.transform.localRotation = Quaternion.Euler(0f, 0f, lean);

            float pop = 1f;
            if (Pose == SoldierPose.Skill && t - this.skillStart < this.skillPopTime)
            {
                float k = (t - this.skillStart) / this.skillPopTime;
                pop = 1f + (this.skillPop - 1f) * Mathf.Sin(Ease.OutCubic(k) * Mathf.PI);
            }
            this.body.transform.localScale = new Vector3(pop, pop, 1f);

            this.body.color = t < this.hurtUntil ? this.hurtTint : Color.white;

            if (this.flash != null)
            {
                this.flash.enabled = t < this.flashUntil;
                if (this.flash.enabled) PlaceFlash();
            }
        }

        private void PlaceFlash()
        {
            // The gun tip moves with the recoil, so the flash stays on the barrel.
            this.flash.transform.localPosition = this.definition.MuzzleOffset(Facing) + (Vector2)this.body.transform.localPosition;
            this.flash.transform.localScale = Vector3.one * this.flashScale;
            this.flash.sortingOrder = Facing == Facing.N ? this.body.sortingOrder - 1 : this.body.sortingOrder + 1;
        }

        private Sprite FallbackSprite(out bool flipX)
        {
            flipX = Facing == Facing.W;
            return this.definition.Sprite;
        }

        private IEnumerator Die()
        {
            if (this.flash != null) this.flash.enabled = false;
            Transform tr = this.body.transform;
            // Fall away from the way he faces; S and N pick a side.
            float side = Facing == Facing.E ? 1f : Facing == Facing.W ? -1f : (Random.value < 0.5f ? 1f : -1f);

            // The fade starts while he is still falling: the contact shadow is drawn into the
            // sprite, so it tips with him, and fading early keeps the tilted shadow faint.
            float total = DeathDuration;
            float fadeFrom = this.deathTipTime * 0.4f;
            for (float time = 0f; time < total; time += Time.deltaTime)
            {
                float tip = Ease.OutCubic(time / this.deathTipTime);
                tr.localRotation = Quaternion.Euler(0f, 0f, side * this.deathTipAngle * tip);
                float alpha = 1f - Mathf.Clamp01((time - fadeFrom) / (total - fadeFrom));
                // The hurt tint of the killing blow fades out during the fall.
                Color c = Color.Lerp(this.hurtTint, Color.white, Mathf.Clamp01(time / this.deathTipTime));
                c.a = alpha;
                this.body.color = c;
                yield return null;
            }
            Destroy(this.gameObject);
        }
    }
}
