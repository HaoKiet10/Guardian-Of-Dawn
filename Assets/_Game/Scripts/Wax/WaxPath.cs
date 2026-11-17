using UnityEngine;

namespace GuardianOfDawn {
    public class WaxPath : MonoBehaviour {
        [SerializeField] private Transform[] waypoints;
        [SerializeField] private Wall wall;
        public int Count => waypoints.Length;
        public Wall Wall => wall;

        public Vector2 GetPoint(int index)
        {
            return (Vector2)waypoints[index].position;
        }

        private void OnDrawGizmos()
        {
            if (waypoints == null) return;

            Gizmos.color = Color.yellow;
            for (int i = 0; i < waypoints.Length - 1; i++)
            {
                if (waypoints[i] == null || waypoints[i + 1] == null) continue;
                Gizmos.DrawLine(waypoints[i].position, waypoints[i + 1].position);
            }
        }
    }   
}