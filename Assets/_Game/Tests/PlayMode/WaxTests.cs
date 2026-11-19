using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace GuardianOfDawn.Tests
{
    public class WaxTests : GameplayTestBase
    {
        [UnityTest]
        public IEnumerator Wax_WalksPath_AndDamagesWall()
        {
            Wall wall = MakeWall(new Vector2(1f, 2f));
            WaxPath path = MakePath(wall, new Vector2(0f, 0f), new Vector2(1f, 0f), new Vector2(1f, 1f));
            Wax wax = SpawnWax(MakeWaxDef(speed: 5f, wallDps: 20f), path);

            yield return null;
            Assert.AreEqual(WaxState.Walking, wax.State);

            yield return Until(() => wax.State == WaxState.AttackingTheWall, 3f);
            Assert.AreEqual(WaxState.AttackingTheWall, wax.State, "wax never reached the wall");
            Assert.That(Vector2.Distance(wax.transform.position, new Vector2(1f, 1f)), Is.LessThan(0.001f));
            Assert.AreEqual(2f, wax.DistanceTraveled, 0.01f);
            Assert.AreEqual(3, wax.NextWayPoint);

            float hpBefore = wall.Hp;
            yield return Seconds(0.5f);
            Assert.Less(wall.Hp, hpBefore, "wall took no damage");
            Assert.AreEqual(hpBefore - 10f, wall.Hp, 3f, "wall damage should be about wallDps * time");
        }

        [UnityTest]
        public IEnumerator NettedWax_DealsNoWallDamage_UntilNetExpires()
        {
            Wall wall = MakeWall(Vector2.zero);
            WaxPath path = MakePath(wall, Vector2.zero); // one point: attacks the wall at once
            Wax wax = SpawnWax(MakeWaxDef(wallDps: 20f), path);
            wax.AddEffect(new Netted(1f));

            yield return null;
            Assert.AreEqual(WaxState.AttackingTheWall, wax.State);
            yield return Seconds(0.5f);
            Assert.AreEqual(100f, wall.Hp, "netted wax damaged the wall");

            yield return Seconds(1f);
            Assert.IsFalse(wax.HasEffect<Netted>());
            Assert.Less(wall.Hp, 100f, "wax should attack again after the net expires");
        }

        [UnityTest]
        public IEnumerator FrozenWax_DealsNoWallDamage()
        {
            Wall wall = MakeWall(Vector2.zero);
            WaxPath path = MakePath(wall, Vector2.zero);
            Wax wax = SpawnWax(MakeWaxDef(wallDps: 20f), path);
            wax.AddEffect(new Frozen(1f));

            yield return Seconds(0.5f);
            Assert.AreEqual(100f, wall.Hp, "frozen wax damaged the wall");
        }

        [UnityTest]
        public IEnumerator SlowedWax_StillDamagesWall()
        {
            Wall wall = MakeWall(Vector2.zero);
            WaxPath path = MakePath(wall, Vector2.zero);
            Wax wax = SpawnWax(MakeWaxDef(wallDps: 20f), path);
            wax.AddEffect(new Slowed(0.5f, 2f));

            yield return Seconds(0.5f);
            Assert.Less(wall.Hp, 100f);
        }

        [UnityTest]
        public IEnumerator NettedWax_DoesNotMove()
        {
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(20f, 0f));
            Wax wax = SpawnWax(MakeWaxDef(speed: 2f), path);
            wax.AddEffect(new Netted(1f));

            yield return null;
            Vector2 start = wax.transform.position;
            yield return Seconds(0.5f);
            Assert.AreEqual(start, (Vector2)wax.transform.position);
            Assert.AreEqual(0f, wax.SpeedMultiplier);
        }

        [UnityTest]
        public IEnumerator Burning_DamagesOverTime_AndBlocksHeal()
        {
            Wax wax = Park(MakeWaxDef(maxHp: 100f), Vector2.zero);
            yield return null;
            wax.TakeHit(new Hit(20f, DamageType.Bullet, Vector2.right));
            Assert.AreEqual(80f, wax.Hp, 0.001f);

            wax.AddEffect(new Burning(10f, 1f));
            Assert.IsTrue(wax.IsHealingBlocked);
            Assert.IsFalse(wax.Heal(5f), "Heal should be refused while burning");

            yield return Seconds(1.3f);
            Assert.IsFalse(wax.HasEffect<Burning>(), "burning should expire");
            Assert.AreEqual(70f, wax.Hp, 0.6f, "burning should deal dps * duration");

            Assert.IsTrue(wax.Heal(5f), "Heal should work after burning expires");
            Assert.AreEqual(75f, wax.Hp, 0.6f);
        }

        [UnityTest]
        public IEnumerator Burning_RefreshDoesNotStack()
        {
            Wax wax = Park(MakeWaxDef(maxHp: 100f), Vector2.zero);
            yield return null;

            wax.AddEffect(new Burning(10f, 1f));
            wax.AddEffect(new Burning(10f, 1f));
            wax.AddEffect(new Burning(5f, 0.5f)); // weaker: keeps the stronger dps and longer time

            yield return Seconds(1.3f);
            Assert.IsFalse(wax.HasEffect<Burning>());
            Assert.AreEqual(90f, wax.Hp, 0.6f, "two burns at once must not stack");
        }

        [UnityTest]
        public IEnumerator Solvent_DamagesOverTime_BlocksHeal_AndDoesNotStack()
        {
            Wax wax = Park(MakeWaxDef(maxHp: 100f), Vector2.zero);
            yield return null;
            wax.TakeHit(new Hit(20f, DamageType.Bullet, Vector2.right));

            wax.AddEffect(new Solvent(10f, 1f));
            wax.AddEffect(new Solvent(10f, 1f));
            Assert.IsFalse(wax.Heal(5f), "Heal should be refused under solvent");

            yield return Seconds(1.3f);
            Assert.IsFalse(wax.HasEffect<Solvent>());
            Assert.AreEqual(70f, wax.Hp, 0.6f);
            Assert.IsTrue(wax.Heal(5f));
        }

        [UnityTest]
        public IEnumerator Heal_IsCappedAtMaxHp()
        {
            Wax wax = Park(MakeWaxDef(maxHp: 50f), Vector2.zero);
            yield return null;
            wax.TakeHit(new Hit(10f, DamageType.Bullet, Vector2.right));
            Assert.IsTrue(wax.Heal(100f));
            Assert.AreEqual(50f, wax.Hp);
        }

        private WaxDefinition MakeWaxDef(float maxHp = 100f, float speed = 1f, float wallDps = 1f)
            => WaxDef(maxHp, speed, wallDps);
    }
}
