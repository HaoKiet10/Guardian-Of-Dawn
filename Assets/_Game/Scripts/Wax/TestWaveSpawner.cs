using UnityEngine;

namespace GuardianOfDawn
{
    // Temporary spawner for milestone 1: sends a fixed number of wax down one path.
    // The real WaveSpawner (wave data, wax pool, day/night) replaces it later.
    public class TestWaveSpawner : MonoBehaviour
    {
        [SerializeField] private Wax waxPrefab;
        [SerializeField] private WaxDefinition definition;
        [SerializeField] private WaxPath path;
        [SerializeField, Min(1)] private int count = 10;
        [SerializeField, Min(0.1f)] private float interval = 1f;

        private int spawned;
        private int killed;
        private float timer;

        private void Start()
        {
            if (this.waxPrefab == null || this.definition == null || this.path == null)
            {
                Debug.LogError("TestWaveSpawner is missing wax prefab, definition or path", this);
                enabled = false;
            }
        }

        private void Update()
        {
            if (this.spawned >= this.count) return;

            this.timer -= Time.deltaTime;
            if (this.timer > 0f) return;

            Wax wax = Instantiate(this.waxPrefab);
            wax.Init(this.definition, this.path);
            wax.Died += OnWaxDied;

            this.spawned++;
            this.timer = this.interval;
        }

        private void OnWaxDied(Wax wax)
        {
            this.killed++;
            Debug.Log($"Killed {this.killed} / {this.count}");
        }
    }
}
