# Guardian of Dawn – Class Design (MVP)

Class design for the 50% MVP in GDD v2 §14.2: maps 1–2, 6 structures, tier 1–2 wax plus Sáp vụn and Sáp vỏ cua, Lính trấn thủ and Thợ săn squads, research tiers 1–2, basic solar storms. Engine: Unity 2D (GDD §12.1).

## 1. Overview: four layers

```mermaid
flowchart TB
    SYS["Game systems<br/>plain C# classes: rules and state"]
    SCN["Scene objects<br/>MonoBehaviours on GameObjects"]
    DEF["Definitions<br/>ScriptableObject data assets"]
    BEH["Behaviour pieces<br/>actions, traits, status effects"]
    SYS -->|creates and controls| SCN
    SCN -->|reads stats from| DEF
    SCN -->|uses| BEH
```

| Layer | What it is | Examples |
|---|---|---|
| Game systems | Plain C# (`new`), or one manager MonoBehaviour | `DayNightCycle`, `WaveSpawner`, `ResearchNetwork` |
| Scene objects | Components on GameObjects in the scene, created with `Instantiate` | `Structure`, `Wax`, `Squad`, `WallSegment` |
| Definitions | Data assets edited in the Inspector, shared by every copy | `MachineGun.asset`, `TigerWax.asset`, `Map1.asset` |
| Behaviour pieces | Small swappable classes that vary behaviour | `SingleShot`, `FrontShell`, `Burning` |

## 2. Design decisions

| # | Decision | Reason |
|---|---|---|
| D1 | Data-driven: stats live in ScriptableObject definitions, not in subclasses | GDD tables map straight to assets; new units are mostly new data |
| D2 | One `Structure` class for every tower; its attack is a `StructureAction` component on the tower prefab (e.g. `MachineGun.prefab` = `Structure` + `SingleShot`) | Normal Unity composition; visible and editable in the Inspector |
| D3 | `Structure` is not damageable and has no HP | GDD §4.7: structures are never attacked; only storms destroy them |
| D4 | Damage is a `Hit` record (amount, type, direction, source), not a plain number | Counters depend on *how* a wax is hit (front shell vs. mortar from above, fire blocks healing) |
| D5 | Special wax behaviour is a `WaxTrait`; plain wax is data only | Sáp vụn and tiger wax need no code; later variants plug in without changing `Wax` |
| D6 | Bosses are `WaxDefinition`s with `isLarge = true`, not a separate class | Sáp Nguyên Thủy is "tier 1, but huge"; `isLarge` makes nets slow instead of pin |
| D7 | `CampaignState` (kept between maps) is separate from `MapSession` (rebuilt each map) | Matches the carry-over table in GDD §4.8; losing a map = discard the session |

## 3. Wax and Structure

```mermaid
classDiagram
  direction LR
  class StructureDefinition {
    <<ScriptableObject>>
    +string id
    +Vector2Int footprint
    +int buildCost
    +float range
    +float cooldown
    +int damage
    +DamageType damageType
    +UpgradeLevel[] upgrades
    +string unlockResearchId
  }
  class UpgradeLevel {
    +int cost
    +float damageMult
    +float rangeMult
    +string requiredResearchId
  }
  StructureDefinition *-- UpgradeLevel

  class Structure {
    <<MonoBehaviour>>
    +StructureDefinition def
    +Vector2Int cell
    +int upgradeLevel
    +StructureState state
    -float cooldownLeft
    -StructureAction action
    +Init(def, cell)
    +Upgrade()
    +Shatter()
    +Rebuild()
  }
  class StructureState {
    <<enumeration>>
    Active
    Rubble
  }
  class StructureAction {
    <<abstract MonoBehaviour>>
    +Act(Structure s, Wax target)
  }
  class TargetSelector {
    +Pick(Vector2 pos, float range) Wax
  }
  Structure --> StructureDefinition
  Structure --> StructureState
  Structure o-- StructureAction
  Structure --> TargetSelector
  StructureAction <|-- SingleShot
  StructureAction <|-- ConeSpray
  StructureAction <|-- SplashShell
  StructureAction <|-- ChainLightning
  StructureAction <|-- NetLauncher
  StructureAction <|-- WallRepairAura

  class Hit {
    <<struct>>
    +int amount
    +DamageType type
    +Vector2 direction
    +Structure source
  }
  class DamageType {
    <<enumeration>>
    Bullet
    Fire
    Explosive
    Electric
  }
  Hit --> DamageType
  StructureAction ..> Hit : creates

  class WaxDefinition {
    <<ScriptableObject>>
    +string id
    +int tier
    +int maxHp
    +float speed
    +float wallDps
    +int resourceDrop
    +SpecimenType specimen
    +bool isLarge
    +WaxTrait[] traits
  }
  class Wax {
    <<MonoBehaviour>>
    +WaxDefinition def
    +int hp
    +WaxState state
    +float pathProgress
    -List~StatusEffect~ effects
    +Init(def, path)
    +TakeHit(Hit h)
    +AddEffect(StatusEffect e)
    +event Died
  }
  class WaxState {
    <<enumeration>>
    Walking
    AttackingWall
    AttackingSquad
    Dead
  }
  class WaxTrait {
    <<abstract ScriptableObject>>
    +ModifyHit(Wax w, Hit h) Hit
  }
  class FrontShell {
    +float frontReduction
  }
  class StatusEffect {
    <<abstract>>
    +float timeLeft
    +Tick(Wax w)
    +bool blocksHealing
    +float speedMult
  }
  Wax --> WaxDefinition
  Wax --> WaxState
  Wax o-- StatusEffect
  WaxDefinition o-- WaxTrait
  WaxTrait <|-- FrontShell
  StatusEffect <|-- Burning
  StatusEffect <|-- Netted
  Wax ..> Hit : receives
  class WaxRegistry {
    <<static>>
    +List~Wax~ alive
  }
  TargetSelector ..> WaxRegistry : searches
```

### Structure

- One class for all 6 MVP towers. Prefab = `Structure` + one `StructureAction` component:

| Tower | Action | Damage type |
|---|---|---|
| Súng máy | `SingleShot` | Bullet |
| Súng phun lửa | `ConeSpray` (adds `Burning`) | Fire |
| Súng cối | `SplashShell` | Explosive |
| Tháp gia cố | `WallRepairAura` (no target) | – |
| Tháp điện chuỗi | `ChainLightning` (3–5 bounces, less damage per bounce) | Electric |
| Tháp phóng lưới | `NetLauncher` (adds `Netted`) | – |

- Each frame: cooldown runs out → `TargetSelector` picks the wax in range closest to the wall → `action.Act(this, target)`.
- `Shatter()` (solar storm): state → `Rubble`, `upgradeLevel` → 0. `Rebuild()` costs 50% of `buildCost`.
- `Upgrade()` checks the next `UpgradeLevel`'s cost and research requirement.

### Wax

| Wax | How it's built |
|---|---|
| Bậc 1 – tiêu chuẩn | Data only |
| Bậc 2 – hổ | Data only (high speed, low HP) |
| Sáp vụn | Data only (tiny HP); the wave spawns it in groups of 10–20 |
| Sáp vỏ cua | Data + `FrontShell` trait (cuts `Bullet` hits from the front) |
| Bosses (Sáp Nguyên Thủy, map 2 boss) | Data only: large HP, `isLarge = true` |

- States: `Walking` along the map path → `AttackingWall` / `AttackingSquad` → `Dead`.
- On death it raises `Died`; listeners give resources and specimens and count down the wave.

### How a hit flows

```mermaid
sequenceDiagram
    participant S as Structure
    participant T as TargetSelector
    participant A as StructureAction
    participant W as Wax
    participant Tr as WaxTrait
    S->>T: Pick(position, range)
    T-->>S: closest wax to the wall
    S->>A: Act(this, wax)
    A->>W: TakeHit(Hit)
    W->>Tr: ModifyHit(hit)
    Tr-->>W: reduced hit
    W->>W: hp -= amount, add effects
    W-->>W: if hp <= 0: raise Died
```

### Later maps plug in without changing `Wax` or `Structure`

- New traits: Sáp gương reflects single-target `Bullet` hits; Sáp bào tử splits on death unless `Burning`; Dị Thể Sáp hồi phục heals nearby wax (blocked by `blocksHealing`).
- New actions: `FreezeAura` (Tháp làm lạnh), `SolventPool`, `HeatLure`, `PiercingShot`; Cột thu sáng intercepts storm strikes.
- New state: `Overheated` for Giáp phản quang.

## 4. Combat classes overview

```mermaid
classDiagram
  direction TB
  class Definition {
    <<ScriptableObject>>
    +string id
    +string displayName
  }
  Definition <|-- StructureDefinition
  Definition <|-- WaxDefinition
  Definition <|-- SquadDefinition

  class IDamageable {
    <<interface>>
    +TakeHit(Hit h)
  }
  class Combatant {
    <<abstract MonoBehaviour>>
    #int hp
    +TakeHit(Hit h)
    +AddEffect(StatusEffect e)
    #Die()
  }
  class Squad {
    +int rank
    +int xp
    +UseSkill()
  }
  IDamageable <|.. Combatant
  IDamageable <|.. WallSegment
  Combatant <|-- Wax
  Combatant <|-- Squad
  Wax --> WaxDefinition
  Squad --> SquadDefinition
  Structure --> StructureDefinition
```

`Wax` and `Squad` share `Combatant` because both have HP and both get hit. `Structure` is deliberately outside this tree (D3). `IDamageable` is what wax attack: squads and wall segments.

## 5. Game systems

```mermaid
classDiagram
  direction TB
  class GameManager {
    <<MonoBehaviour>>
    +StartMap(MapDefinition map)
    +OnWallDestroyed()
    +OnMapCompleted()
  }
  class CampaignState {
    +int currentMap
    +SpecimenWallet specimens
    +List~string~ specialMaterials
    +List~Squad~ squads
    +ResearchNetwork research
  }
  class MapSession {
    +int day
    +int resources
    +TrySpend(int cost) bool
  }
  GameManager *-- CampaignState : carries over
  GameManager *-- MapSession : reset each map

  class DayNightCycle {
    +Phase current
    +event PhaseChanged
    +Advance()
  }
  class Phase {
    <<enumeration>>
    Night
    Dawn
    Day
    DayEnd
  }
  DayNightCycle --> Phase
  MapSession *-- DayNightCycle
  MapSession *-- WaveSpawner
  MapSession *-- SolarStormSystem
  MapSession *-- PlacementGrid
  MapSession *-- Wall

  class WaveSpawner {
    +SpawnWave(WaveDefinition w)
  }
  class WaxPool {
    +Pick() WaxDefinition
  }
  WaveSpawner --> WaxPool
  class SolarStormSystem {
    +RollForToday() bool
    +MarkTargets()
    +Strike()
  }
  class PlacementGrid {
    +CanPlace(StructureDefinition d, Vector2Int cell) bool
    +Place(StructureDefinition d, Vector2Int cell)
  }
  class Wall {
    +int level
    +Upgrade()
  }
  class WallSegment {
    +int hp
    +TakeHit(Hit h)
    +Repair(int amount)
  }
  Wall *-- WallSegment

  class ResearchNetwork {
    +CanResearch(ResearchNode n) bool
    +StartResearch(ResearchNode n)
    +IsUnlocked(string id) bool
  }
  class ResearchNode {
    <<ScriptableObject>>
    +Branch branch
    +int tier
    +SpecimenCost[] cost
    +ResearchNode[] prerequisites
  }
  ResearchNetwork --> ResearchNode
  class MapDefinition {
    <<ScriptableObject>>
    +int startResources
    +float stormChance
    +WaveDefinition[] waves
  }
  class WaveDefinition {
    <<ScriptableObject>>
    +bool isBoss
    +PoolEntry[] pool
  }
  MapDefinition o-- WaveDefinition
  GameManager --> MapDefinition
```

One day: `DayNightCycle` raises `PhaseChanged` → at Dawn `SolarStormSystem.RollForToday()`; during Day `WaveSpawner` spawns from `WaxPool` and storms `MarkTargets()` 10 s before `Strike()`; at Night `PlacementGrid` allows building. Wall falls → `GameManager` discards the `MapSession` and starts a new one from the same `CampaignState`.

## 6. UML legend

| Arrow | Meaning | Example |
|---|---|---|
| `<\|--` solid, hollow triangle | Inheritance ("is-a") | `Wax` is a `Combatant` |
| `<\|..` dashed, hollow triangle | Implements an interface | `WallSegment` implements `IDamageable` |
| `*--` filled diamond | Composition: owns it, same lifetime | `MapSession` owns `Wall` |
| `o--` hollow diamond | Aggregation: has it, can be swapped | `Structure` has a `StructureAction` |
| `-->` plain arrow | Association: uses / reads | `Wax` reads `WaxDefinition` |
| `..>` dashed arrow | Dependency: creates or receives briefly | `StructureAction` creates a `Hit` |
