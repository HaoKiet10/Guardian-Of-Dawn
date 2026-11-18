using System.Collections.Generic;
using UnityEngine;

namespace GuardianOfDawn
{
    // Temporary spawner for testing: sends a mixed list of wax down one path.
    // The real WaveSpawner (wave data, wax pool, day/night) replaces it later.
    public class TestWaveSpawner : MonoBehaviour
    {
        [System.Serializable]
        private class WaveEntry
        {
            public WaxDefinition definition;
            [Min(1)] public int count = 5;
            // Wax in one group spawn close together (Sáp vụn swarms use 10-20).
            [Min(1)] public int groupSize = 1;
        }

        [SerializeField] private Wax waxPrefab;
        [SerializeField] private WaxPath path;
        [SerializeField] private WaveEntry[] entries = new WaveEntry[0];
        [SerializeField, Min(0.1f)] private float interval = 1f;
        [SerializeField, Min(0f)] private float groupSpacing = 0.15f;

        private readonly Queue<(WaxDefinition definition, float delay)> queue = new Queue<(WaxDefinition, float)>();
        private int total;
        private int killed;
        private float timer;

        private void Start()
        {
            if (this.waxPrefab == null || this.path == null)
            {
                Debug.LogError("TestWaveSpawner is missing wax prefab or path", this);
                enabled = false;
                return;
            }

            foreach (WaveEntry entry in this.entries)
            {
                if (entry.definition == null) continue;
                // Rows added in the Inspector start at 0, so treat a group size below 1 as 1.
                int groupSize = Mathf.Max(1, entry.groupSize);
                for (int i = 0; i < entry.count; i++)
                {
                    bool firstOfGroup = i % groupSize == 0;
                    this.queue.Enqueue((entry.definition, firstOfGroup ? this.interval : this.groupSpacing));
                }
            }
            this.total = this.queue.Count;
            if (this.total == 0)
            {
                Debug.LogWarning("TestWaveSpawner has nothing to spawn: set Count on at least one entry", this);
            }
        }

        private void Update()
        {
            if (this.queue.Count == 0) return;

            this.timer -= Time.deltaTime;
            if (this.timer > 0f) return;

            var (definition, _) = this.queue.Dequeue();
            Wax wax = Instantiate(this.waxPrefab);
            wax.Init(definition, this.path);
            wax.Died += OnWaxDied;

            this.timer = this.queue.Count > 0 ? this.queue.Peek().delay : 0f;
        }

        private void OnWaxDied(Wax wax)
        {
            this.killed++;
            Debug.Log($"Killed {this.killed} / {this.total}");
        }
    }
}
