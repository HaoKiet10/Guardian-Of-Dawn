using System.Collections;
using System.Linq;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;

namespace GuardianOfDawn.Tests
{
    public class StructureTests : GameplayTestBase
    {
        // ── Machine gun / mortar / chain tesla ──

        [UnityTest]
        public IEnumerator MachineGun_KillsWax()
        {
            Wax wax = Park(WaxDef(maxHp: 20f), new Vector2(2f, 0f));
            bool died = false;
            wax.Died += _ => died = true;
            MakeStructure<SingleShot>(StructDef(5f, 0.1f, 5f), Vector2.zero);

            yield return Until(() => IsGone(wax), 3f);
            Assert.IsTrue(died, "Died event not raised");
            Assert.IsTrue(IsGone(wax), "wax should be destroyed");
        }

        [UnityTest]
        public IEnumerator MachineGun_IgnoresWaxOutOfRange()
        {
            Wax wax = Park(WaxDef(maxHp: 20f), new Vector2(8f, 0f));
            MakeStructure<SingleShot>(StructDef(5f, 0.1f, 5f), Vector2.zero);
            yield return Seconds(0.5f);
            Assert.AreEqual(20f, wax.Hp);
        }

        [UnityTest]
        public IEnumerator Mortar_SplashDamagesGroup()
        {
            WaxDefinition def = WaxDef(maxHp: 20f);
            Wax a = Park(def, new Vector2(5f, 0f)); // first registered = the target
            Wax b = Park(def, new Vector2(5.5f, 0f));
            Wax c = Park(def, new Vector2(5f, 0.5f));
            Wax outsideSplash = Park(def, new Vector2(2f, 0f));
            Wax outsideRange = Park(def, new Vector2(5f, 8f));
            yield return null;

            MakeStructure<SplashShell>(StructDef(6f, 100f, 5f, DamageType.Explosive), Vector2.zero);
            yield return Seconds(0.2f);

            Assert.AreEqual(15f, a.Hp, 0.001f);
            Assert.AreEqual(15f, b.Hp, 0.001f);
            Assert.AreEqual(15f, c.Hp, 0.001f);
            Assert.AreEqual(20f, outsideSplash.Hp, 0.001f);
            Assert.AreEqual(20f, outsideRange.Hp, 0.001f);
        }

        [UnityTest]
        public IEnumerator ChainLightning_HitsUpToMaxTargets_WithFalloff()
        {
            WaxDefinition def = WaxDef(maxHp: 100f);
            Wax w1 = Park(def, new Vector2(3f, 0f));
            Wax w2 = Park(def, new Vector2(4f, 0f));
            Wax w3 = Park(def, new Vector2(5f, 0f));
            Wax w4 = Park(def, new Vector2(6f, 0f));
            yield return null;

            MakeStructure<ChainLightning>(StructDef(10f, 100f, 10f, DamageType.Electric), Vector2.zero, chain =>
            {
                SetField(chain, "maxTargets", 3);
                SetField(chain, "jumpRange", 1.5f);
                SetField(chain, "damageFalloff", 0.5f);
            });
            yield return Seconds(0.2f);

            Assert.AreEqual(90f, w1.Hp, 0.001f);
            Assert.AreEqual(95f, w2.Hp, 0.001f);
            Assert.AreEqual(97.5f, w3.Hp, 0.001f);
            Assert.AreEqual(100f, w4.Hp, 0.001f, "beyond maxTargets");
        }

        [UnityTest]
        public IEnumerator ChainLightning_DoesNotHitSameWaxTwice()
        {
            WaxDefinition def = WaxDef(maxHp: 100f);
            Wax w1 = Park(def, new Vector2(3f, 0f));
            Wax w2 = Park(def, new Vector2(4f, 0f));
            yield return null;

            MakeStructure<ChainLightning>(StructDef(10f, 100f, 10f, DamageType.Electric), Vector2.zero, chain =>
            {
                SetField(chain, "maxTargets", 4);
                SetField(chain, "jumpRange", 1.5f);
                SetField(chain, "damageFalloff", 0.5f);
            });
            yield return Seconds(0.2f);

            Assert.AreEqual(90f, w1.Hp, 0.001f);
            Assert.AreEqual(95f, w2.Hp, 0.001f);
        }

        // ── Net launcher / cryo ──

        [UnityTest]
        public IEnumerator Net_PinsNormalWax()
        {
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(20f, 0f));
            Wax wax = SpawnWax(WaxDef(speed: 2f), path);
            yield return null;
            MakeStructure<NetLauncher>(StructDef(10f, 100f, 0f), new Vector2(0f, 2f),
                                       net => SetField(net, "netDuration", 1f));
            yield return Seconds(0.1f);

            Assert.IsTrue(wax.HasEffect<Netted>());
            Assert.IsFalse(wax.HasEffect<Slowed>());
            Vector2 pinned = wax.transform.position;
            yield return Seconds(0.5f);
            Assert.AreEqual(pinned, (Vector2)wax.transform.position, "netted wax moved");

            yield return Seconds(1f);
            Assert.IsFalse(wax.HasEffect<Netted>());
            Assert.Greater(wax.transform.position.x, pinned.x, "wax should walk again after the net");
        }

        [UnityTest]
        public IEnumerator Net_OnlySlowsLargeWax()
        {
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(20f, 0f));
            Wax wax = SpawnWax(WaxDef(speed: 2f, isLarge: true), path);
            yield return null;
            MakeStructure<NetLauncher>(StructDef(10f, 100f, 0f), new Vector2(0f, 2f), net =>
            {
                SetField(net, "netDuration", 2f);
                SetField(net, "largeSlowMultiplier", 0.5f);
            });
            yield return Seconds(0.1f);

            Assert.IsFalse(wax.HasEffect<Netted>(), "large wax must not be pinned");
            Assert.IsTrue(wax.HasEffect<Slowed>());
            Assert.AreEqual(0.5f, wax.SpeedMultiplier, 0.001f);
            float x = wax.transform.position.x;
            yield return Seconds(0.5f);
            Assert.AreEqual(0.5f, wax.transform.position.x - x, 0.15f, "large wax should move at half speed");
        }

        [UnityTest]
        public IEnumerator Cryo_SlowsNormalWax_AndFreezesConvergenceWax()
        {
            Wax normal = Park(WaxDef(), new Vector2(2f, 0f));
            Wax lens = Park(WaxDef(traits: Trait<Convergence>()), new Vector2(-2f, 0f));
            Wax outside = Park(WaxDef(), new Vector2(8f, 0f));
            yield return null;

            MakeStructure<CryoAura>(StructDef(5f, 0.1f, 0f), Vector2.zero, cryo =>
            {
                SetField(cryo, "slowMultiplier", 0.5f);
                SetField(cryo, "effectDuration", 0.5f);
            });
            yield return Seconds(0.3f);

            Assert.IsTrue(normal.HasEffect<Slowed>());
            Assert.IsFalse(normal.HasEffect<Frozen>());
            Assert.AreEqual(0.5f, normal.SpeedMultiplier, 0.001f);

            Assert.IsTrue(lens.HasEffect<Frozen>(), "convergence wax should be frozen");
            Assert.IsFalse(lens.HasEffect<Slowed>());
            Assert.AreEqual(0f, lens.SpeedMultiplier);

            Assert.IsFalse(outside.HasEffect<Slowed>());
            Assert.IsFalse(outside.HasEffect<Frozen>());
        }

        // ── Flamethrower ──

        [UnityTest]
        public IEnumerator Flamethrower_SpraysForSprayDuration_ThenStops()
        {
            Wax wax = Park(WaxDef(maxHp: 1000f), new Vector2(3f, 0f));
            yield return null;

            Structure tower = MakeStructure<ConeSpray>(StructDef(5f, 100f, 10f, DamageType.Fire), Vector2.zero, cone =>
            {
                SetField(cone, "sprayDuration", 0.5f);
                SetField(cone, "burnDamagePerSecond", 0f);
                SetField(cone, "burnDuration", 0.1f);
            });
            ConeSpray spray = tower.GetComponent<ConeSpray>();

            yield return Until(() => spray.IsSpraying, 1f);
            Assert.IsTrue(spray.IsSpraying, "never started spraying");
            float start = Time.time;
            yield return Until(() => !spray.IsSpraying, 3f);
            Assert.IsFalse(spray.IsSpraying, "never stopped spraying");
            Assert.AreEqual(0.5f, Time.time - start, 0.15f, "spray should last sprayDuration");
            Assert.AreEqual(995f, wax.Hp, 0.5f, "damage = dps * sprayDuration");

            float hp = wax.Hp;
            yield return Seconds(1f);
            Assert.AreEqual(hp, wax.Hp, 0.001f, "no damage after the spray ended");
        }

        [UnityTest]
        public IEnumerator Flamethrower_OnlyHitsInsideCone()
        {
            WaxDefinition def = WaxDef(maxHp: 1000f);
            Wax target = Park(def, new Vector2(3f, 0f));
            Wax insideCone = Park(def, new Vector2(3f, 1f)); // ~18 degrees off the aim
            Wax outsideCone = Park(def, new Vector2(0f, 3f)); // 90 degrees off
            yield return null;

            MakeStructure<ConeSpray>(StructDef(5f, 100f, 10f, DamageType.Fire), Vector2.zero, cone =>
            {
                SetField(cone, "coneAngle", 50f);
                SetField(cone, "sprayDuration", 0.5f);
            });
            yield return Seconds(0.8f);

            Assert.Less(target.Hp, 1000f);
            Assert.IsTrue(target.HasEffect<Burning>());
            Assert.Less(insideCone.Hp, 1000f);
            Assert.IsTrue(insideCone.HasEffect<Burning>());
            Assert.AreEqual(1000f, outsideCone.Hp, "wax outside the cone was hit");
            Assert.IsFalse(outsideCone.HasEffect<Burning>());
        }

        [UnityTest]
        public IEnumerator Flamethrower_StopsWhenShattered()
        {
            Wax wax = Park(WaxDef(maxHp: 1000f), new Vector2(3f, 0f));
            yield return null;
            Structure tower = MakeStructure<ConeSpray>(StructDef(5f, 100f, 10f, DamageType.Fire), Vector2.zero, cone =>
            {
                SetField(cone, "sprayDuration", 5f);
                SetField(cone, "burnDamagePerSecond", 0f);
                SetField(cone, "burnDuration", 0.1f);
            });
            ConeSpray spray = tower.GetComponent<ConeSpray>();
            yield return Seconds(0.2f);
            Assert.IsTrue(spray.IsSpraying);
            tower.Shatter();
            yield return null;
            yield return null;
            Assert.IsFalse(spray.IsSpraying);
            float hp = wax.Hp;
            yield return Seconds(0.3f);
            Assert.AreEqual(hp, wax.Hp, 0.001f);
        }

        // ── Fortifier ──

        [UnityTest]
        public IEnumerator Fortifier_HealsWall()
        {
            Wall wall = MakeWall(Vector2.zero);
            wall.TakeDamage(50f);
            Assert.AreEqual(50f, wall.Hp, 0.001f);

            MakeStructure<WallFortify>(StructDef(2f, 0.1f, 0f), new Vector2(1f, 0f), f =>
            {
                SetField(f, "wall", wall);
                SetField(f, "healPerSecond", 10f);
                SetField(f, "damageReduction", 0.2f);
            });
            yield return Seconds(1f);
            Assert.AreEqual(60f, wall.Hp, 2.5f, "fortifier should heal about healPerSecond");

            MakeStructure<WallFortify>(StructDef(2f, 0.1f, 0f), new Vector2(1f, 0f), f =>
            {
                SetField(f, "wall", wall);
                SetField(f, "healPerSecond", 1000f);
            });
            yield return Seconds(0.3f);
            Assert.AreEqual(100f, wall.Hp, 0.001f, "heal is capped at max hp");
        }

        [UnityTest]
        public IEnumerator Fortifier_ReductionStacksUpToCap()
        {
            Wall wall = MakeWall(Vector2.zero);
            System.Action<WallFortify> setup = f =>
            {
                SetField(f, "wall", wall);
                SetField(f, "healPerSecond", 0f);
                SetField(f, "damageReduction", 0.4f);
            };
            MakeStructure(StructDef(2f, 0.1f, 0f), new Vector2(1f, 0f), setup);
            yield return Seconds(0.2f);
            Assert.AreEqual(0.4f, wall.DamageReduction, 0.001f);

            MakeStructure(StructDef(2f, 0.1f, 0f), new Vector2(-1f, 0f), setup);
            yield return Seconds(0.2f);
            Assert.AreEqual(0.6f, wall.DamageReduction, 0.001f, "0.4 + 0.4 capped at maxDamageReduction 0.6");

            wall.TakeDamage(10f);
            Assert.AreEqual(96f, wall.Hp, 0.001f);
        }

        [UnityTest]
        public IEnumerator Fortifier_ShatterClearsReduction_RebuildRestoresIt()
        {
            Wall wall = MakeWall(Vector2.zero);
            System.Action<WallFortify> setup = f =>
            {
                SetField(f, "wall", wall);
                SetField(f, "healPerSecond", 0f);
                SetField(f, "damageReduction", 0.25f);
            };
            Structure a = MakeStructure(StructDef(2f, 0.1f, 0f), new Vector2(1f, 0f), setup);
            Structure b = MakeStructure(StructDef(2f, 0.1f, 0f), new Vector2(-1f, 0f), setup);
            yield return Seconds(0.2f);
            Assert.AreEqual(0.5f, wall.DamageReduction, 0.001f);

            a.Shatter();
            yield return Seconds(0.3f);
            Assert.AreEqual(0.25f, wall.DamageReduction, 0.001f, "shattered fortifier must stop reducing");

            b.Shatter();
            yield return Seconds(0.3f);
            Assert.AreEqual(0f, wall.DamageReduction, 0.001f);

            a.Rebuild();
            yield return Seconds(0.3f);
            Assert.AreEqual(0.25f, wall.DamageReduction, 0.001f, "rebuilt fortifier reduces again");
        }

        // ── Solvent sprayer ──

        [UnityTest]
        public IEnumerator SolventSprayer_LeavesPuddle_ThatAppliesSolvent()
        {
            Wax wax = Park(WaxDef(maxHp: 100f), new Vector2(3f, 0f));
            yield return null;

            MakeStructure<SolventSprayer>(StructDef(10f, 100f, 0f, DamageType.Solvent), Vector2.zero, s =>
            {
                SetField(s, "puddleRadius", 1f);
                SetField(s, "puddleLifetime", 1f);
                SetField(s, "damagePerSecond", 10f);
                SetField(s, "effectDuration", 0.5f);
            });
            yield return Seconds(0.2f);

            var puddles = Puddles();
            Assert.AreEqual(1, puddles.Count, "one puddle expected");
            Assert.Less(Vector2.Distance(puddles[0].transform.position, new Vector2(3f, 0f)), 0.01f);
            Assert.IsTrue(wax.HasEffect<Solvent>());
            Assert.IsFalse(wax.Heal(1f));

            yield return Seconds(2f);
            Assert.AreEqual(0, Puddles().Count, "puddle should dry up after its lifetime");
            Assert.IsFalse(wax.HasEffect<Solvent>());
            Assert.AreEqual(85f, wax.Hp, 2f, "about dps * (lifetime + effectDuration)");
        }

        [UnityTest]
        public IEnumerator SolventPuddle_MeltsFrontShell()
        {
            FrontShell shell = Trait<FrontShell>(("frontReduction", 0.75f), ("frontAngle", 120f));
            WaxPath path = MakePath(null, new Vector2(4f, 0f), new Vector2(-50f, 0f));
            Wax wax = SpawnWax(WaxDef(maxHp: 1000f, speed: 0.3f, traits: shell), path); // walks toward -x
            yield return Seconds(0.2f);

            // A shot from the front travels +x, against the way the wax is walking.
            float hp = wax.Hp;
            wax.TakeHit(new Hit(10f, DamageType.Bullet, Vector2.right));
            Assert.AreEqual(2.5f, hp - wax.Hp, 0.001f, "front shell should block 75%");

            MakeStructure<SolventSprayer>(StructDef(10f, 100f, 0f, DamageType.Solvent), Vector2.zero, s =>
            {
                SetField(s, "puddleRadius", 1f);
                SetField(s, "puddleLifetime", 3f);
                SetField(s, "damagePerSecond", 1f);
                SetField(s, "effectDuration", 1f);
            });
            yield return Seconds(0.2f);
            Assert.IsTrue(wax.HasEffect<Solvent>());

            hp = wax.Hp;
            wax.TakeHit(new Hit(10f, DamageType.Bullet, Vector2.right));
            Assert.AreEqual(10f, hp - wax.Hp, 0.001f, "solvent should melt the shell");
        }

        // ── Heat lure ──

        [UnityTest]
        public IEnumerator HeatLure_PullsWalkingWax_ThenReleases()
        {
            WaxPath path = MakePath(null, new Vector2(-10f, 0f), new Vector2(10f, 0f));
            Wax wax = SpawnWaxAt(WaxDef(speed: 1f), path, new Vector2(-1f, 0f), 1, 9f);
            yield return null;
            float distanceBefore = wax.DistanceTraveled;

            Structure tower = MakeStructure<HeatLure>(StructDef(5f, 100f, 0f), new Vector2(0f, 3f),
                                                      lure => SetField(lure, "activeDuration", 1f));
            HeatLure heat = tower.GetComponent<HeatLure>();
            yield return Seconds(0.8f);

            Assert.IsTrue(heat.IsActive);
            Assert.Greater(wax.transform.position.y, 0.4f, "wax should walk toward the lure");
            Assert.AreEqual(distanceBefore, wax.DistanceTraveled, 0.05f, "walking to the lure is not progress");

            yield return Until(() => !heat.IsActive, 2f);
            Assert.IsFalse(heat.IsActive);
            yield return Seconds(0.5f);
            Vector2 p1 = wax.transform.position;
            yield return Seconds(0.5f);
            Vector2 p2 = wax.transform.position;
            Assert.Greater(p2.x, p1.x, "released wax heads on toward its next waypoint");
            Assert.Less(p2.y, p1.y, "released wax heads back down toward the path");
        }

        // ── Piercing cannon ──

        [UnityTest]
        public IEnumerator PiercingShot_HitsWaxInLine_WithPercentOfMaxHp()
        {
            Wax a = Park(WaxDef(maxHp: 100f), new Vector2(3f, 0f)); // target
            Wax b = Park(WaxDef(maxHp: 40f), new Vector2(6f, 0f));
            Wax offLine = Park(WaxDef(maxHp: 100f), new Vector2(3f, 2f));
            Wax beyondRange = Park(WaxDef(maxHp: 100f), new Vector2(12f, 0f));
            Wax behind = Park(WaxDef(maxHp: 100f), new Vector2(-3f, 0f));
            yield return null;

            MakeStructure<PiercingShot>(StructDef(10f, 100f, 2f, DamageType.Piercing), Vector2.zero, p =>
            {
                SetField(p, "percentOfMaxHp", 0.25f);
                SetField(p, "beamWidth", 0.35f);
            });
            yield return Seconds(0.2f);

            Assert.AreEqual(73f, a.Hp, 0.001f, "2 + 25% of 100");
            Assert.AreEqual(28f, b.Hp, 0.001f, "2 + 25% of 40");
            Assert.AreEqual(100f, offLine.Hp, 0.001f);
            Assert.AreEqual(100f, beyondRange.Hp, 0.001f);
            Assert.AreEqual(100f, behind.Hp, 0.001f);
        }

        // ── Sun rod and convergence ──

        [UnityTest]
        public IEnumerator LightningRod_RedirectsToClosestActiveRodInRange()
        {
            Structure target = MakeStructure<SingleShot>(StructDef(0.1f, 1f, 0f), Vector2.zero);
            Structure near = MakeStructure<LightningRod>(StructDef(2.5f, 1f, 0f), new Vector2(1f, 0f));
            Structure further = MakeStructure<LightningRod>(StructDef(2.5f, 1f, 0f), new Vector2(-2f, 0f));
            MakeStructure<LightningRod>(StructDef(2.5f, 1f, 0f), new Vector2(10f, 0f)); // out of its range
            yield return null;

            Assert.AreSame(near, LightningRod.Redirect(target));
            near.Shatter();
            Assert.AreSame(further, LightningRod.Redirect(target), "shattered rods don't count");
            further.Shatter();
            Assert.AreSame(target, LightningRod.Redirect(target));
        }

        [UnityTest]
        public IEnumerator Convergence_ShattersStructureAfterChannelTime()
        {
            Convergence convergence = Trait<Convergence>(("channelTime", 1f), ("reach", 1.2f));
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(20f, 0f));
            Structure target = MakeStructure<SingleShot>(StructDef(0.1f, 1f, 0f), new Vector2(0f, 1f));
            float shatteredAt = -1f;
            target.Shattered += _ => shatteredAt = Time.time;

            Wax lens = SpawnWax(WaxDef(speed: 0.5f, traits: convergence), path);
            float start = Time.time;
            yield return Seconds(0.7f);
            Assert.AreEqual(StructureState.Active, target.State, "shattered before channelTime");
            Assert.Less(lens.transform.position.x, 0.05f, "lens wax should stand still while channeling");

            yield return Until(() => target.State == StructureState.Rubble, 3f);
            Assert.AreEqual(StructureState.Rubble, target.State, "structure was never shattered");
            Assert.AreEqual(1f, shatteredAt - start, 0.3f);

            float x = lens.transform.position.x;
            yield return Seconds(0.5f);
            Assert.Greater(lens.transform.position.x, x, "lens wax walks on after the strike");
        }

        [UnityTest]
        public IEnumerator Convergence_IsInterruptedByCryoFreeze()
        {
            Convergence convergence = Trait<Convergence>(("channelTime", 1f), ("reach", 1.2f));
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(20f, 0f));
            Structure target = MakeStructure<SingleShot>(StructDef(0.1f, 1f, 0f), new Vector2(0f, 1f));
            MakeStructure<CryoAura>(StructDef(5f, 0.1f, 0f), new Vector2(0f, -4f),
                                    cryo => SetField(cryo, "effectDuration", 0.5f));

            Wax lens = SpawnWax(WaxDef(speed: 0.5f, traits: convergence), path);
            yield return Seconds(2.5f);
            Assert.IsTrue(lens.HasEffect<Frozen>());
            Assert.AreEqual(StructureState.Active, target.State, "frozen lens wax must not finish converging");
        }

        [UnityTest]
        public IEnumerator Convergence_RodTakesTheStrike()
        {
            Convergence convergence = Trait<Convergence>(("channelTime", 1f), ("reach", 1.2f));
            WaxPath path = MakePath(null, Vector2.zero, new Vector2(20f, 0f));
            Structure target = MakeStructure<SingleShot>(StructDef(0.1f, 1f, 0f), new Vector2(0f, 1f));
            Structure rod = MakeStructure<LightningRod>(StructDef(2.5f, 1f, 0f), new Vector2(0f, 3f));
            StructureState? targetStateWhenRodHit = null;
            rod.Shattered += _ => targetStateWhenRodHit = target.State;
            bool targetHitFirst = false;
            target.Shattered += _ => { if (targetStateWhenRodHit == null) targetHitFirst = true; };

            SpawnWax(WaxDef(speed: 0.5f, traits: convergence), path);
            yield return Until(() => rod.State == StructureState.Rubble || targetHitFirst, 3f);

            Assert.IsFalse(targetHitFirst, "the target was shattered although a rod covered it");
            Assert.AreEqual(StructureState.Rubble, rod.State, "rod should take the strike");
            Assert.AreEqual(StructureState.Active, targetStateWhenRodHit);
        }
    }
}
