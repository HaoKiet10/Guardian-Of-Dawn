# Guardian of Dawn – Interesting Choices Exercise

**Techniques selected:** Strategic versus Tactical · Supporting Investments

## 1. Game Concept

**Guardian of Dawn** is a 2D strategy / tower defense game with roguelite progression. The sun has mutated: any living thing touched by its light melts into a *wax anomaly*. The player is the commander of **Dawnhold**, one of humanity's last safe zones. They build at night, defend during the day, and research the wax to find a way back into the light.

## 2. Core Gameplay Loop

1. **Night (Prepare):** spend resources on towers, squads, wall upgrades and squad healing; spend specimens on research.
2. **Dawn (Warning):** the light sweeps the map and reveals today's lit zones. Towers inside lit zones shut down; soldiers inside them lose health over time.
3. **Day (Defend):** towers fight automatically. The player moves Hunters and Shade Bearers and times their active skills. Killed wax drop resources and specimens.
4. **End of day:** return to night. Each wave is stronger, and the wax evolve over time.

## 3. Improvement 1 – Strategic versus Tactical: "Commit at night, adapt by day"

**Existing mechanics used:** towers are built at night and stay in place; lit zones are revealed only at **dawn, after** building is finished; during the day only Hunters and Shade Bearers can move, and squad skills are triggered manually.

**Improvement:** separate the two phases into two clearly different kinds of decisions.

- **Night = strategic.** Long-term commitments made without knowing today's light: tower placement, which 3 squads to field, the next research node, and whether the wall follows the human or the wax upgrade path.
- **Day = tactical.** Short-term reactions to what dawn revealed: where to move Hunters and Shade Bearers, and when to use *Hold the Line*, *Eclipse* and *Kill Shot*.

### Choices, trade-offs and expected consequences

| Choice | Trade-off | Expected consequence |
|---|---|---|
| Spread towers out | Some towers are always in shadow, but there is no strong kill zone | Safe and consistent, but lower damage |
| Concentrate towers | Powerful kill zone, but one bad dawn can shut it all down | High reward, high risk |
| Squad mix with 2 Shade Bearers | Can rescue towers from almost any light, but low damage | Flexible against light, weak against tough waves |
| Squad mix with Wardens + Hunters | High damage, but no answer when key towers are lit | Strong on good days, vulnerable on bad ones |

**Result:** a bad dawn is a problem to solve, not an automatic loss. A good night plan gives the player more tactical options during the day.

## 4. Improvement 2 – Supporting Investments: "Not everything should shoot"

**Existing mechanics used:** several existing options strengthen something else instead of dealing damage.

| Supporting investment | What it supports |
|---|---|
| Reinforcement Tower | The wall: repairs it and reduces damage taken |
| Shade Generator | Other towers: keeps them working in lit zones |
| Shade Bearers | Squads and towers inside their darkness bubble |
| Wall upgrades | More building space for future towers |
| Night healing of squads | Keeps a veteran squad's rank |
| Underground Infirmary (research) | Cheaper squad healing |
| Permanent upgrade: wax pool visibility | Better planning in every future run |

**Improvement:** these supporting options compete with damage for the **same limited resources, building space and squad slots**. Every night the player must decide: *more damage now, or support that makes everything else better later?*

### Choices, trade-offs and expected consequences

| Choice | Trade-off | Expected consequence |
|---|---|---|
| Invest in support early | Weaker early waves | Stronger defense later (e.g. a wall upgrade today means room for two more towers tomorrow) |
| Invest only in damage | Strong immediately | No answer when the light grows or a veteran squad is wounded |
| Heal a veteran squad | Resources not spent on towers | Keeps the squad's rank and skill power |
| Let the squad recover alone / risk it | More towers now | Risk of losing the squad and its rank entirely |

**Result:** players learn to judge *when* to invest. Support pays off over several waves, so investing right before a dangerous wave is a gamble.

## 5. Example Gameplay Situation (Night 12 → Wave 13)

The player can afford only **one** of the following:

- a third **Mortar** (damage),
- a **Shade Generator** (support),
- healing their **rank-2 Hunter squad**, which has only one member left (support).

Their east-side towers have been caught in the light for two days in a row.

1. **Strategic choice (night):** the player builds the **Shade Generator** next to the east towers and leaves the Hunters wounded, accepting the risk of losing their rank.
2. **Dawn:** this time the light falls on the **west** side. The new Shade Generator does not help today.
3. **Tactical response (day):** the player moves the **Shade Bearers** west to save the west towers and fires **Eclipse** just as the tiger wax rush in. The wounded Hunters are kept behind the wall, out of the light: they survive, but kill less.
4. **Next night:** the Hunters still have their rank, and the Shade Generator will pay off the next time the east side is lit.

### What makes it interesting

- The night decision was a reasonable bet that did **not** pay off immediately; the day phase let the player recover through **skill rather than luck** (Strategic vs Tactical).
- The support investment did not win this wave, but it keeps paying off in the following waves (Supporting Investments).
- There is no single correct answer: the best choice depends on the light, the wall's condition, squad health and the upcoming wax evolution.
