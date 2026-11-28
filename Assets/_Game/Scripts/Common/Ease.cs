using UnityEngine;

namespace GuardianOfDawn
{
    // Easing curves for code-driven motion (formulas from easings.net). Input and output 0..1.
    public static class Ease
    {
        public static float OutCubic(float t)
        {
            t = Mathf.Clamp01(t);
            float u = 1f - t;
            return 1f - u * u * u;
        }

        // Overshoots to about 1.1 before settling at 1.
        public static float OutBack(float t)
        {
            t = Mathf.Clamp01(t);
            const float c1 = 1.70158f;
            const float c3 = c1 + 1f;
            float u = t - 1f;
            return 1f + c3 * u * u * u + c1 * u * u;
        }
    }
}
