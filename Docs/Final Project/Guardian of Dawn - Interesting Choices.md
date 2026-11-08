# Guardian of Dawn – Interesting Choices Exercise

## 1. Game Concept

**Guardian of Dawn**: a roguelite strategy / tower defense game. The sun has mutated, and any living thing its light touches melts into a **Wax Anomaly**. The player commands **Dawnhold**, one of humanity's last safe zones. At night they build and research. By day they defend against waves of wax anomalies while sunlight sweeps across the map.

## 2. Core Gameplay Loop

1. **Night (Prepare):** spend resources to build and upgrade structures, train soldiers, repair walls and research specimens.
2. **Dawn (Warning):** the map shows which zones will be irradiated today. Structures in light shut down, and soldiers in light lose HP over time.
3. **Day (Defend):** structures and soldiers fight automatically. Each kill drops resources and research specimens.
4. **End of Day:** turn specimens into research and unlock new tech.
5. **Run end:** a win neutralizes the Sun Anomaly. A loss still earns permanent roguelite upgrades for the next run.

## 3. Techniques Chosen

| Technique | Why it fits Guardian of Dawn |
|---|---|
| **Impermanence** | The light zones already change every day, but players can't respond to that yet. Making some defenses temporary on purpose turns the sunlight into a planning puzzle. |
| **Shadow Costs** | The lore says anomalies are *"attracted to the warmth of life."* Right now that has no effect in play. Making that warmth a hidden cost gives each night action a second price. |

---

## 4. Improvement 1: Umbra Generators (Impermanence)

### The mechanic
At night the player can see **tomorrow's light forecast**, and they get a new way to fight the light:

- **Permanent structures** (towers, barracks, labs) work as they do now. They are strong and cost-efficient, but they **can't move**. If they end up in light, they shut down for the day.
- **Umbra Generators** are a new structure type. Each one is a cheap generator that casts a shadow dome over a radius, which cancels the light inside it. It **burns out at the end of the day** and has to be rebuilt every night.
- **Relocate:** a permanent structure can be packed up and moved. This costs 50% of its build cost and leaves it inactive for the first half of the next day.

### Player choices
| Choice | Benefit | Trade-off |
|---|---|---|
| Build another permanent tower | Lasting value. Upgrades stack. | It might sit in the light tomorrow and do nothing. |
| Spend on Umbra Generators | Fits today's light map exactly. Shields soldiers too. | The money is gone tomorrow. It doesn't make Dawnhold stronger over time. |
| Relocate a key tower | Keeps the upgrades and gets out of the light. | Costs money, and the tower is offline for half the day. |
| Leave a zone unshielded | Saves resources. | That lane loses its defenses for the day. |

### Expected consequences
- Players have to weigh **today's survival against long-term growth**. Spending too much on generators keeps a player alive but stuck in place. Spending too much on permanent towers leaves gaps on bad-light days.
- Where to place a permanent building becomes a real decision. Players learn the light patterns and build in spots that are usually shaded.
- Late-game research can extend generator duration (e.g. 2 days) or shrink the relocate penalty. That gives the research tree direct, readable value.

### Example situation
> **Night 6.** The forecast shows a band of sunlight crossing the east wall tomorrow, right over the player's two upgraded *Flame Towers* (level 3). They have 300 resources.
> - **Option A:** relocate both towers west (2 × 150 = 300). They keep their level-3 upgrades for the rest of the run, but both are **offline until midday**, so the morning wave hits a thin east wall.
> - **Option B:** build 2 Umbra Generators (2 × 100 = 200). Both towers stay fully active all day, and 100 is left over to train soldiers. But tomorrow night the generators are gone, and if the light stays east the player pays again.
> - **Option C:** build a new tower on the west side (300) and let the east towers go dark for a day. This bets on the light moving away on Day 8.
>
> **What's interesting:** none of the options is always right. The answer depends on how the player reads the light pattern, how much they trust their walls, and whether they are playing for today or for Day 15. A real tactical choice (where to put shadow today) is tied to a strategic one (what Dawnhold should become).

---

## 5. Improvement 2: Warmth (Shadow Costs)

### The mechanic
Dawnhold gets a **Warmth** meter. Everything alive or active gives off warmth:

| Source | Warmth |
|---|---|
| Each trained soldier | +1 |
| Each research lab running overnight | +5 |
| Each stored, unresearched specimen | +2 |
| Repairing walls (forges) | +3 |

At dawn, Warmth sets **how many extra anomalies spawn** and **which sector they target**. The wave heads for the **warmest sector**. The Warmth meter is shown, but the bonus spawn count only appears in the dawn warning. That keeps the cost "in the shadows" while the player is making decisions.

New counterplay options:
- **Cold Storage:** a building that holds specimens at 0 Warmth but costs upkeep each night.
- **Heat Beacon:** a decoy that adds Warmth on purpose to **pull** the wave into a chosen kill zone.

### Player choices
| Choice | Benefit | Shadow Cost |
|---|---|---|
| Train many soldiers | Stronger defense | Bigger waves, aimed at the barracks sector |
| Run all labs overnight | Faster research, closer to the good ending | A large Warmth spike and a heavier assault the next day |
| Hoard specimens to research later | Flexibility | Each stored specimen keeps adding Warmth |
| Build a Heat Beacon | Controls where the wave goes | Adds even more enemies overall |
| Build Cold Storage | Hoarding stops adding heat | Ongoing upkeep cost |

### Expected consequences
- **Racing the research tree** (the win condition) now has a visible risk, so players can't just maximize research.
- More enemies also means **more drops and specimens**. Confident players can choose to run hot to farm resources, and cautious players can play cold. Both are valid styles.
- Heat Beacons let skilled players **use the shadow cost as a weapon**, turning a penalty into a tool.
- The mechanic puts the story into the gameplay: life attracts death, so every soldier saved and every experiment run has a price.

### Example situation
> **Night 10.** Research toward *"Solar Spectrum Analysis"* (a key good-ending node) needs 3 labs running tonight. Current Warmth is 20. Running all 3 labs makes it **35**, and the dawn warning would show **+40% anomalies** aimed at the north sector, where the labs are.
> - **Option A:** run 1 lab only (Warmth 25). The wave stays manageable, but the key research takes 3 more nights.
> - **Option B:** run all 3 labs, then build a **Heat Beacon** in the south canyon where the Flame Towers and an Umbra Generator are already set up. The beacon pushes Warmth to 40 (+55% enemies), but the warmest point is now the canyon. The huge wave walks straight into the kill zone, and the player collects a big haul of specimens.
> - **Option C:** run all 3 labs and hope the north wall holds.
>
> **What's interesting:** the hidden price of research shows up the next morning as a real threat. Option B combines both improvements: an impermanent shadow dome protects the kill zone, and a deliberate shadow cost steers the enemy into it. The player turns two drawbacks into a plan that pays off.

---

## 6. Summary

| | Improvement 1 – Umbra Generators | Improvement 2 – Warmth |
|---|---|---|
| Technique | Impermanence | Shadow Costs |
| Core tension | Temporary fit vs permanent growth | Progress now vs danger tomorrow |
| Main decision | Where to place shadow, and whether to build to last | How much life and research to run each night |
| Ties to theme | Light is the enemy | "Attracted to the warmth of life" |
| Skill expression | Reading and predicting light patterns | Steering waves with Heat Beacons |
