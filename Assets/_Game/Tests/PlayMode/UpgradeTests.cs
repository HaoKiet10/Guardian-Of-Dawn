using System.Collections;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace GuardianOfDawn.Tests
{
    public class UpgradeTests : GameplayTestBase
    {
        // t0: range 3, damage 5. t1: range 4, damage 10. t2: range 5, damage 20.
        private StructureDefinition UpgradableDef(float tba = 10f)
        {
            StructureDefinition def = StructDef(3f, tba, 5f);
            SetField(def, "upgrades", new[]
            {
                new StructureUpgrade(30, 4f, tba, 10f),
                new StructureUpgrade(60, 5f, tba, 20f),
            });
            return def;
        }

        [UnityTest]
        public IEnumerator Upgrade_RaisesTierAndStats_UpToMax()
        {
            Structure gun = MakeStructure<SingleShot>(UpgradableDef(), Vector2.zero);
            yield return null;

            Assert.AreEqual(0, gun.Tier);
            Assert.AreEqual(5f, gun.Damage);
            Assert.AreEqual(30, gun.NextUpgradeCost);

            int upgradedEvents = 0;
            gun.Upgraded += _ => upgradedEvents++;

            Assert.IsTrue(gun.Upgrade());
            Assert.AreEqual(1, gun.Tier);
            Assert.AreEqual(4f, gun.Range);
            Assert.AreEqual(10f, gun.Damage);
            Assert.AreEqual(60, gun.NextUpgradeCost);

            Assert.IsTrue(gun.Upgrade());
            Assert.AreEqual(2, gun.Tier);
            Assert.AreEqual(20f, gun.Damage);
            Assert.IsFalse(gun.CanUpgrade);
            Assert.IsFalse(gun.Upgrade(), "must not go past the last tier");
            Assert.AreEqual(2, gun.Tier);
            Assert.AreEqual(2, upgradedEvents);
        }

        [UnityTest]
        public IEnumerator Upgrade_ActionUsesTierDamageAndRange()
        {
            // At range 3.5 the wax is out of reach at t0 (range 3) and in reach at t1 (range 4).
            Wax wax = Park(WaxDef(maxHp: 100f), new Vector2(3.5f, 0f));
            Structure gun = MakeStructure<SingleShot>(UpgradableDef(), Vector2.zero);
            yield return Seconds(0.2f);
            Assert.AreEqual(100f, wax.Hp, "out of range at tier 0");

            gun.Upgrade();
            yield return Seconds(0.2f);
            Assert.AreEqual(90f, wax.Hp, "one tier-1 shot = 10 damage");
        }

        [UnityTest]
        public IEnumerator Shatter_LosesUpgrades()
        {
            Structure gun = MakeStructure<SingleShot>(UpgradableDef(), Vector2.zero);
            yield return null;
            gun.Upgrade();
            gun.Upgrade();

            gun.Shatter();
            Assert.AreEqual(0, gun.Tier);
            Assert.IsFalse(gun.CanUpgrade, "rubble can't be upgraded");

            gun.Rebuild();
            Assert.AreEqual(0, gun.Tier, "rebuilt at tier 0");
            Assert.AreEqual(5f, gun.Damage);
            Assert.IsTrue(gun.CanUpgrade);
        }

        [UnityTest]
        public IEnumerator NoUpgrades_StaysAtTierZero()
        {
            Structure gun = MakeStructure<SingleShot>(StructDef(3f, 10f, 5f), Vector2.zero);
            yield return null;

            Assert.IsFalse(gun.CanUpgrade);
            Assert.IsFalse(gun.Upgrade());
            Assert.AreEqual(0, gun.NextUpgradeCost);
            Assert.AreEqual(5f, gun.Damage);
        }
    }
}
