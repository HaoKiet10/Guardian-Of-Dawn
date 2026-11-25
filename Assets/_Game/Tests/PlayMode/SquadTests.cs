using System.Collections;
using System.Linq;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace GuardianOfDawn.Tests
{
    public class SquadTests : GameplayTestBase
    {
        private SquadDefinition SquadDef(int members = 3, float hp = 30f, float range = 3f, float tba = 0.2f, float damage = 5f)
        {
            SquadDefinition def = Track(ScriptableObject.CreateInstance<SquadDefinition>());
            SetField(def, "displayName", "Test Squad");
            SetField(def, "memberCount", members);
            SetField(def, "soldierMaxHp", hp);
            SetField(def, "range", range);
            SetField(def, "tba", tba);
            SetField(def, "damage", damage);
            return def;
        }

        private Squad MakeSquad(SquadDefinition def, Vector2 position)
        {
            var go = new GameObject("Test Squad");
            go.SetActive(false);
            go.transform.position = position;
            Squad squad = go.AddComponent<Squad>();
            SetField(squad, "definition", def);
            go.SetActive(true);
            Track(go);
            return squad;
        }

        [UnityTest]
        public IEnumerator Squad_SpawnsItsMembers()
        {
            Squad squad = MakeSquad(SquadDef(members: 3), new Vector2(1f, 2f));
            yield return null;

            Assert.AreEqual(3, squad.AliveCount);
            Assert.AreEqual(3, SoldierRegistry.Soldiers.Count(s => s.Squad == squad));
            foreach (Soldier soldier in squad.Members)
            {
                Assert.AreEqual(30f, soldier.Hp);
                Assert.Less(Vector2.Distance(soldier.transform.position, squad.transform.position), 1f,
                            "soldiers should stand around the squad's point");
            }
        }

        [UnityTest]
        public IEnumerator Soldiers_ShootWaxInRange()
        {
            Wax wax = Park(WaxDef(maxHp: 1000f), new Vector2(2f, 0f));
            MakeSquad(SquadDef(members: 2, range: 4f, tba: 10f, damage: 5f), Vector2.zero);

            yield return Seconds(0.3f);
            Assert.AreEqual(990f, wax.Hp, "2 soldiers x one shot of 5 damage each");
        }

        [UnityTest]
        public IEnumerator Soldiers_IgnoreWaxOutOfRange()
        {
            Wax wax = Park(WaxDef(maxHp: 100f), new Vector2(6f, 0f));
            MakeSquad(SquadDef(range: 3f), Vector2.zero);

            yield return Seconds(0.3f);
            Assert.AreEqual(100f, wax.Hp);
        }

        [UnityTest]
        public IEnumerator SoldierDeath_RemovesMember_LastOneWipesSquad()
        {
            Squad squad = MakeSquad(SquadDef(members: 2, hp: 20f), Vector2.zero);
            yield return null;
            int wipedEvents = 0;
            squad.Wiped += _ => wipedEvents++;

            Soldier first = squad.Members[0];
            Soldier second = squad.Members[1];

            first.TakeDamage(5f);
            Assert.AreEqual(15f, first.Hp);
            Assert.AreEqual(2, squad.AliveCount);

            first.TakeDamage(50f);
            yield return null;
            Assert.IsTrue(IsGone(first));
            Assert.AreEqual(1, squad.AliveCount);
            Assert.AreEqual(0, wipedEvents);

            second.TakeDamage(20f);
            yield return null;
            Assert.IsTrue(squad.IsWiped);
            Assert.AreEqual(1, wipedEvents);
            Assert.AreEqual(0, SoldierRegistry.Soldiers.Count(s => s != null && s.Squad == squad));
        }
    }
}
