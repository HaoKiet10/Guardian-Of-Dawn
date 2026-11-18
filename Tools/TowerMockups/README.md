<!-- PROTOTYPE - NOT FOR PRODUCTION -->
# Tower mockups (prototype)

**Status:** in-progress (2026-11-18). Mortar redone in the v2 art direction (hand-painted
cartoon, painted-steel materials, wear, grounded dirt skirt, thick silhouette outline — see
art bible §1 "Điều chỉnh art direction"). 11 towers to follow.

Layers: every frame renders ground skirt (no outline) → tower body (thick outline, solid
pixels only) → effects (smoke, flash; no outline). Use `G.ground` and `G.fx` / `G.puff` so
these land on the right layer. `contact.ps1 <Folder>` builds review contact sheets.

## Hypothesis
Each tower tier can read as a clearly different structure (art bible §3), not tier 0 plus
accessories, while the tower family stays recognisable. Code-drawn placeholder sheets let us
check silhouettes, heights and every animation (build, fire, upgrade, destroy) at real sprite
size before real art is produced.

## What it produces
`out/<Folder>/` — PNG sprite sheets with the exact names, sizes and frame counts from
`design/assets/specs/<tower>-assets.md`, plus `Preview~/_preview_tower.png`. VFX sheets are not
drawn yet. Nothing here is copied into `Assets/` until the design is approved.

## Layout
| File | Role |
|---|---|
| `lib/draw.js` | Shared primitives: 3/4 view, `#2c2240` outline, 3 tones per colour, cell 128, ground y = 80 |
| `lib/anim.js` | Shared animations for every tower: build (t0), upgrade (into t1/t2), destroy (all tiers) |
| `lib/sheet.js` | Sheet assembly (1 file = 1 tier/layer/anim, Head = 5 direction rows) and the preview sheet |
| `towers/<id>.js` | One file per tower: `sheets`, `state()`, `base()`, `head()`, `rubble()`, `foot` |
| `preview.html?t=<id>` | Tiers, silhouettes, preview sheet, every sheet with live playback |
| `export.html` + `export.ps1` | Headless Chrome render → PNG files in `out/` |

## How to run
- View: open `preview.html?t=mortar` in Chrome (needs `--allow-file-access-from-files`, or serve
  the folder with any static server).
- Export: `powershell -File prototypes/tower-mockups/export.ps1 mortar` (no argument = all towers).

## Findings
_To be filled when the prototype concludes._

## Destroy effects (2026-11-18)

The collapse (flash → cracks → squash → rubble) stays shared in `lib/anim.js`. On top of it,
`lib/destroy_fx.js` adds a per-tower signature layer keyed by tower id: flash colour, smoke tint,
debris colours and an fx overlay per frame (what is *inside* the tower goes off: shell cook-off,
belt sparks + casings, fuel fireball + burning puddle, ice shards + frost cloud, tesla arcs, etc.).
Add a new tower by adding an entry to `window.DESTROY_FX`; towers without an entry fall back to the generic collapse.
