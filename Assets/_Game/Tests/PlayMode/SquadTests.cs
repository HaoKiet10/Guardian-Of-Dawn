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
            Assert.IsFalse(first.IsAlive);
            Assert.AreEqual(1, squad.AliveCount, "a dead soldier leaves the squad at once");
            Assert.IsFalse(SoldierRegistry.Soldiers.Contains(first), "and the registry, so wax stop targeting him");
            Assert.AreEqual(0, wipedEvents);

            second.TakeDamage(20f);
            yield return null;
            Assert.IsTrue(squad.IsWiped);
            Assert.AreEqual(1, wipedEvents);
            Assert.AreEqual(0, SoldierRegistry.Soldiers.Count(s => s != null && s.Squad == squad));

            yield return Seconds(1f);
            Assert.IsTrue(IsGone(first), "the body is removed after the death animation");
            Assert.IsTrue(IsGone(second));
        }

        [Test]
        public void Facing_FollowsDirection_WithCameraSquash()
        {
            Assert.AreEqual(Facing.E, SoldierAnimator.FacingFor(Vector2.right));
            Assert.AreEqual(Facing.W, SoldierAnimator.FacingFor(Vector2.left));
            Assert.AreEqual(Facing.N, SoldierAnimator.FacingFor(Vector2.up));
            Assert.AreEqual(Facing.S, SoldierAnimator.FacingFor(Vector2.down));
            // world y is foreshortened by the 3/4 camera (x 0.72), so it counts for more:
            // (1, 0.6) is still sideways, a 45 degree diagonal already faces up
            Assert.AreEqual(Facing.E, SoldierAnimator.FacingFor(new Vector2(1f, 0.6f)));
            Assert.AreEqual(Facing.N, SoldierAnimator.FacingFor(new Vector2(1f, 1f)));
        }

        [UnityTest]
        public IEnumerator Shooting_TurnsSoldierToTarget_AndShowsFirePose()
        {
            Park(WaxDef(maxHp: 1000f), new Vector2(-2f, 0f));
            Squad squad = MakeSquad(SquadDef(members: 1, range: 4f, tba: 10f), Vector2.zero);
            yield return Seconds(0.1f);

            SoldierAnimator anim = squad.Members[0].GetComponent<SoldierAnimator>();
            Assert.IsNotNull(anim);
            Assert.AreEqual(Facing.W, anim.Facing, "the wax is to the left");
            Assert.AreEqual(SoldierPose.Fire, anim.Pose);

            yield return Seconds(0.5f);
            Assert.AreEqual(SoldierPose.Idle, anim.Pose, "back to idle once the shot is over");
        }

        [UnityTest]
        public IEnumerator Idle_BodyBreathes_WhileSoldierStaysPut()
        {
            Squad squad = MakeSquad(SquadDef(members: 1), Vector2.zero);
            yield return null;
            Soldier soldier = squad.Members[0];
            Transform body = soldier.transform.Find("Body");
            Vector3 root = soldier.transform.position;

            float low = float.MaxValue, high = float.MinValue;
            for (float t = 0f; t < 2.2f; t += Time.deltaTime)
            {
                low = Mathf.Min(low, body.localPosition.y);
                high = Mathf.Max(high, body.localPosition.y);
                yield return null;
            }
            Assert.Greater(high - low, 0.5f / 128f, "the body bobs");
            Assert.AreEqual(root, soldier.transform.position, "the soldier itself does not move");
        }

        private Sprite TestSprite(string name)
        {
            Texture2D tex = Track(new Texture2D(4, 4));
            Sprite sprite = Track(Sprite.Create(tex, new Rect(0, 0, 4, 4), new Vector2(0.5f, 0.125f)));
            sprite.name = name;
            return sprite;
        }

        [UnityTest]
        public IEnumerator Walking_PlaysTheDrawnLoop_WhereOneExists_AndFallsBackToTheIdleStill()
        {
            Sprite[] idle = { TestSprite("idle S"), TestSprite("idle E"), TestSprite("idle N") };
            Sprite[] walkE = Enumerable.Range(0, 8).Select(i => TestSprite("walk E " + i)).ToArray();
            var poses = new SoldierPoses();
            SetField(poses, "idle", idle);
            SetField(poses, "walkE", walkE);
            SquadDefinition def = SquadDef(members: 1);
            SetField(def, "poses", poses);

            Squad squad = MakeSquad(def, Vector2.zero);
            yield return null;
            SoldierAnimator anim = squad.Members[0].GetComponent<SoldierAnimator>();
            SpriteRenderer body = squad.Members[0].transform.Find("Body").GetComponent<SpriteRenderer>();

            // Walking west: the east loop, flipped, frame after frame, with no code bob on top.
            anim.SetVelocity(Vector2.left);
            yield return null;
            var seen = new System.Collections.Generic.HashSet<Sprite>();
            for (float t = 0f; t < 1.1f; t += Time.deltaTime)
            {
                Assert.IsTrue(anim.Walking, "the drawn loop plays");
                Assert.Contains(body.sprite, walkE, "only walk frames are shown");
                Assert.IsTrue(body.flipX, "west is the east loop flipped");
                Assert.AreEqual(0f, body.transform.localPosition.y, 1e-5f, "the loop carries its own bounce");
                seen.Add(body.sprite);
                yield return null;
            }
            Assert.GreaterOrEqual(seen.Count, 6, "about a stride per second goes through most of the 8 frames");

            // Walking south: no loop drawn yet, so the idle still with the code bob.
            anim.SetVelocity(Vector2.down);
            yield return null;
            Assert.IsFalse(anim.Walking);
            Assert.AreSame(idle[0], body.sprite);

            // Standing still: back to the idle still for the last facing.
            anim.SetVelocity(Vector2.zero);
            yield return null;
            Assert.AreSame(idle[0], body.sprite);
        }
    }
}
