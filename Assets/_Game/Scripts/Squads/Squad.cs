using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // A squad of soldiers (GDD 4.6). Place the Squad object where the squad should stand; on Start it
    // creates its soldiers around that point. Later batches add moving, skills and rank.
    public class Squad : MonoBehaviour
    {
        [SerializeField] private SquadDefinition definition;

        private readonly List<Soldier> members = new List<Soldier>();

        public SquadDefinition Definition => this.definition;
        public IReadOnlyList<Soldier> Members => this.members;
        public int AliveCount => this.members.Count;
        public bool IsWiped => this.members.Count == 0;

        // Raised when the last soldier dies (GDD 4.9: the squad loses its rank).
        public event System.Action<Squad> Wiped;

        private void Start()
        {
            if (this.definition == null)
            {
                Debug.LogError("Squad is missing definition", this);
                enabled = false;
                return;
            }
            SpawnMembers();
        }

        private void SpawnMembers()
        {
            int count = this.definition.MemberCount;
            for (int i = 0; i < count; i++)
            {
                var go = new GameObject($"{this.definition.DisplayName} {i + 1}");
                go.transform.SetParent(this.transform, false);
                go.transform.localPosition = FormationOffset(i, count, this.definition.Spacing);
                // The sprite sits on a child so the animator can bob and tilt it without moving
                // the soldier. Soldiers standing lower in the row draw in front.
                var body = new GameObject("Body");
                body.transform.SetParent(go.transform, false);
                body.AddComponent<SpriteRenderer>().sortingOrder = i % 2;
                go.AddComponent<SoldierAnimator>(); // before Soldier, which looks it up in Awake

                Soldier soldier = go.AddComponent<Soldier>();
                soldier.Init(this, this.definition);
                soldier.Died += OnSoldierDied;
                this.members.Add(soldier);
            }
        }

        // Soldiers stand in a small row, centred on the squad.
        private static Vector2 FormationOffset(int index, int count, float spacing)
        {
            float x = (index - (count - 1) * 0.5f) * spacing;
            float y = (index % 2 == 0) ? 0f : -spacing * 0.3f;
            return new Vector2(x, y);
        }

        private void OnSoldierDied(Soldier soldier)
        {
            soldier.Died -= OnSoldierDied;
            this.members.Remove(soldier);
            if (this.members.Count == 0)
            {
                Debug.Log(this.definition.DisplayName + " squad was wiped out", this);
                Wiped?.Invoke(this);
            }
        }

        private void OnDrawGizmosSelected()
        {
            if (this.definition == null) return;

            Gizmos.color = Color.cyan;
            Gizmos.DrawWireSphere(this.transform.position, this.definition.Range);
        }
    }
}
