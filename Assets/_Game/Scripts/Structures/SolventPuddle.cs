using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // A puddle left on the path by the solvent sprayer. Every wax standing in it keeps getting the Solvent effect:
    // damage over time, no healing, armor melted. The puddle dries up after its lifetime.
    public class SolventPuddle : MonoBehaviour
    {
        private float radius = 1f;
        private float timeLeft = 4f;
        private float damagePerSecond = 2f;
        private float effectDuration = 1.5f;

        private readonly List<Wax> hits = new List<Wax>();

        public void Init(float radius, float lifetime, float damagePerSecond, float effectDuration)
        {
            this.radius = radius;
            this.timeLeft = lifetime;
            this.damagePerSecond = damagePerSecond;
            this.effectDuration = effectDuration;
        }

        private void Update()
        {
            this.timeLeft -= Time.deltaTime;
            if (this.timeLeft <= 0f)
            {
                Destroy(gameObject);
                return;
            }

            TargetSelector.InRange(this.transform.position, this.radius, this.hits);
            foreach (Wax wax in this.hits)
            {
                wax.AddEffect(new Solvent(this.damagePerSecond, this.effectDuration));
            }

            DrawCircle();
        }

        // Placeholder outline, Scene view only.
        private void DrawCircle()
        {
            const int segments = 16;
            Vector2 center = this.transform.position;
            Color color = new Color(0.6f, 1f, 0.3f);
            for (int i = 0; i < segments; i++)
            {
                float a = i * Mathf.PI * 2f / segments;
                float b = (i + 1) * Mathf.PI * 2f / segments;
                Debug.DrawLine(center + new Vector2(Mathf.Cos(a), Mathf.Sin(a)) * this.radius,
                               center + new Vector2(Mathf.Cos(b), Mathf.Sin(b)) * this.radius, color);
            }
        }
    }
}
