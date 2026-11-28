# Squad sprite stills – Google Flow prompts

Design reference: `Assets/Art/_ArtDirection/sheets/squads_concept_final.png` (locked 2026-11-27).

The squads are not drawn frame by frame. Each soldier gets a few **still poses** in 3 directions; Unity
animates them (bob, lean, recoil, fall, fade) and adds effects on top.

## Stills needed

| Soldier | Sheet 1 | Sheet 2 | Sheet 3 | Sheet 4 |
|---|---|---|---|---|
| Warden | idle | fire | skill: Hold | – |
| Hunter | idle | fire | skill: Execute | – |
| Engineer | idle | fire (pistol) | skill: Emergency Build | repair |

Each sheet = one image with the same pose in 3 directions, left to right: **S** (toward camera),
**E** (facing right), **N** (facing away). W is E flipped in Unity. Walk and die are made in Unity from
the idle still, so they need no sheet.

Total: 13 images. Start with **Warden – idle** and check it before making the rest.

## How to generate in Flow

1. Attach `squads_concept_final.png` **and** `Assets/Art/_ArtDirection/refs/style_anchor_towers.png`.
2. Paste the **shared block**, then the **pose block** for the sheet.
3. Generate a fresh image (do not edit an earlier one: edits keep the old camera and pose).
4. Save the image as it comes from Flow into `Assets/Art/_ArtDirection/squad_raw/<soldier>_<pose>.png`
   (e.g. `warden_idle.png`). Do **not** put it in `Assets/Art/Squads/`: the sprite importer there would
   slice it into 128 px cells. A script cuts the 3 figures, removes the magenta and the watermark, scales
   them to the 128 px cell and writes the game sprites into `Assets/Art/Squads/`.

### Shared block (paste first, every time)

```
Character turnaround sprite sheet for a 2D top-down tower defense game. ONE soldier, drawn THREE times in a single row, evenly spaced, same size, same pose, feet on the same baseline:
1) left: facing toward the camera (front),
2) middle: facing right (side profile),
3) right: facing away from the camera (back).

Copy the soldier design EXACTLY from the attached concept image: chunky proportions about 3 heads tall, steel-blue-grey fatigues, gunmetal plate carrier, orange stripe on the helmet, cool white sun cloak #eef2f5 with blue-grey shadows, small yellow-amber visor #ffc94a flipped UP on the helmet so the face is visible.

Match the attached tower art style: flat cel shading, 3 tones per colour, one soft highlight max, thick dark-violet outline #2c2240, broad flat colour areas, few small details, one light from the top-left.

Camera looks down from above at about 40 degrees, the same angle as the attached towers: tops of helmet and shoulders visible, body foreshortened. Each figure has a small soft dark contact shadow under the feet.

Background: one flat solid pure magenta #FF00FF, no gradient, no floor, no texture, nothing else in the image. No text, no labels, no watermark.
```

### Warden – older man, dark skin, short grey beard, long cloak to the knees, big rectangular shield with a yellow-black hazard border, short rifle

**idle**
```
Pose: WARDEN standing guard, calm and planted, feet wide. Shield held upright at his side, resting on the ground, rifle held low in the other hand. Cloak hanging still. From the back: the cloak covers most of the body, the shield edge visible at the side.
```

**fire**
```
Pose: WARDEN firing from behind cover: shield planted on the ground in front of him, crouched slightly, rifle resting across the top edge of the shield and aimed forward. Same pose turned for each direction (in the back view we see him aiming away, shield in front of him).
```

**skill_hold** (Hold: the whole wall takes no damage for a few seconds)
```
Pose: WARDEN in his defining moment: shield slammed down hard into the ground in front of him, both hands bracing it, body leaning into it, head down, cloak blown back. The shield face glows with a soft warm yellow light (flat glow shape, hard edge, no bloom).
```

### Hunter – young man, light skin, short shoulder cape, long rifle with an injector spike under the barrel, small acid-green #a6ff4d solvent canister on the hip with a hose into the rifle

**idle**
```
Pose: HUNTER alert and ready, weight on the front foot, rifle held diagonally across the body pointing down-forward, head turned slightly as if scanning for targets.
```

**fire**
```
Pose: HUNTER aiming down the sights, rifle raised to the shoulder and pointed forward, legs braced, leaning in.
```

**skill_execute** (Execute: one big hit, extra damage on healing wax)
```
Pose: HUNTER mid-lunge, stabbing forward with the injector spike under the barrel, rifle thrust out at full arm length, front knee bent deep, cape flying behind. The spike tip and the hose glow acid green #a6ff4d.
```

### Engineer – woman in her thirties, tan skin, short ponytail, short shoulder cape, big backpack with a folding mechanical arm, oversized wrench, teal #2fa39a tool accents, small pistol on the thigh

Lessons from the Hunter and Warden: draw every hold as a real-life carry with no hand hanging free (a free
hand is what swings in the walk video), do not draw muzzle flashes (Unity adds them), and keep the shadow
centred under the feet. Save as `squad_raw/engineer_idle.png`, `engineer_fire.png`, `engineer_skill.png`,
`engineer_repair.png`.

**idle**
```
Pose: ENGINEER standing relaxed but ready, feet shoulder-width apart, weight even. The oversized wrench rests on her right shoulder, her RIGHT hand gripping its handle near the head. Her LEFT hand holds the left shoulder strap of her backpack at chest height. Both hands are busy; no hand hangs free. The small pistol stays holstered on her right thigh. The mechanical arm is folded up tight above the backpack, claw closed. From the back the backpack, tool rack and folded arm are the main shape, the wrench head showing above her right shoulder. Contact shadow centred under her feet.
```

**fire**
```
Pose: ENGINEER firing her small pistol in a real two-handed grip: arms extended forward at shoulder height, right hand on the grip, left hand wrapped around it, sights at eye level, feet apart and knees slightly bent, leaning in. The wrench hangs clipped to the side of her backpack. The mechanical arm stays folded. No muzzle flash, no smoke. In the back view we see her aiming away, both elbows out at her sides. Contact shadow centred under her feet.
```

**skill_build** (Emergency Build: instantly rebuilds a destroyed structure). Five options to test; save each as
`squad_raw/engineer_skill_<option>.png`, then copy the one you pick to `engineer_skill.png`.

Option `drone` – Build drone throw
```
Pose: ENGINEER mid-throw like a grenade toss: back foot pushing off, body twisting forward, her LEFT arm stretched forward at shoulder height having just released a small teal #2fa39a quad-drone, which hangs in the air just past her hand with its four rotors unfolding and a glowing teal eye. Her RIGHT hand keeps the wrench on her right shoulder. The mechanical arm stays folded on the backpack. Ponytail and cape swing with the throw. In the back view she throws away from the camera, the drone small beyond her arm. Contact shadow centred under her feet.
```

Option `foam` – Foam cannon
```
Pose: ENGINEER spraying construction foam: a thick hose runs from her backpack to a chunky nozzle held in BOTH hands at hip height like a fire hose, legs braced wide, leaning back against the push. A thick curved arc of teal #2fa39a fast-setting foam shoots forward from the nozzle and hardens into lumpy blocks at its end (flat cel-shaded shapes, hard edges, no glow blur). The wrench hangs clipped to the side of her backpack; the mechanical arm stays folded. In the back view the foam arc goes away from the camera. Contact shadow centred under her feet.
```

Option `blueprint` – Hologram blueprint
```
Pose: ENGINEER directing a build: she holds a rugged tablet up in her LEFT hand, and a flat teal #2fa39a wireframe of a small wall section projects forward from it in the air in front of her (thin straight lines, hard edges, no glow blur). Her RIGHT hand points at the wireframe. The mechanical arm is unfolded over her shoulder, its claw reaching toward the wireframe as if placing it. The wrench hangs clipped to the side of her backpack. In the back view the wireframe floats beyond her, away from the camera. Contact shadow centred under her feet.
```

Option `weld` – Power-tool weld
```
Pose: ENGINEER welding at full power: the mechanical arm swings forward over her right shoulder holding a big welding torch, and she braces the arm with BOTH hands like a jackhammer, legs wide, leaning in. A short sharp teal #2fa39a flame shoots forward from the torch and a spray of small flat teal and white sparks bursts back around it (flat shapes, hard edges, no glow blur). The wrench hangs clipped to the side of her backpack. In the back view the torch points away from the camera. Contact shadow centred under her feet.
```

Option `rally` – Rally signal
```
Pose: ENGINEER rallying the squad: her RIGHT fist thrusts the wrench straight up overhead, her LEFT fist clenched at her chest, mouth open shouting, feet planted wide. The mechanical arm is raised high beside the wrench and a teal #2fa39a flare pops from its open claw (a flat star-burst shape, hard edges, no glow blur). Cape flicked back. In the back view the wrench and the arm rise above her helmet. Contact shadow centred under her feet.
```

**repair** (stands next to the wall and heals it; no code uses it yet, so this sheet can wait)
```
Pose: ENGINEER working: leaning forward, wrench held in both hands turning a bolt in front of her at waist height, the mechanical arm reaching forward beside her holding a small welding torch with a tiny teal #2fa39a spark (flat shape, no glow blur). Contact shadow centred under her feet.
```

## Drawn frames: walk cycle and death

For real leg movement the walk is drawn, not faked: **4 drawings per direction**, the same cycle the
wax sprites use (`Tools/ArtGen/build_wax_from_poses.py`). Unity still adds the bob, lean and timing.

| Soldier | Images | File names in `squad_raw/` |
|---|---|---|
| Warden | 3 walk (S, E, N) + 1 death | `warden_walk_s.png`, `warden_walk_e.png`, `warden_walk_n.png`, `warden_death.png` |
| Hunter | 3 walk + 1 death | `hunter_walk_s.png` … `hunter_death.png` |
| Engineer | 3 walk + 1 death | `engineer_walk_s.png` … `engineer_death.png` |

Make **one direction per image** (4 figures in a row): one image with all 12 drifts more between frames.
Generate the **E row first**: the side view shows the leg swap most clearly, so it is the one to judge.

### Walk block (paste after the shared block, replacing its "three times" layout line)

```
Layout override: ONE soldier drawn FOUR times in a single row, evenly spaced, identical size, feet on the
same baseline: a 4-frame walk cycle, left to right:
1) CONTACT: right leg forward with heel touching the ground, left leg back on its toes, body at its lowest,
   left arm forward, right arm back.
2) PASSING: right leg straight under the body carrying the weight, left knee lifted and passing forward,
   body at its highest, arms close to the body.
3) CONTACT (opposite): left leg forward heel down, right leg back on its toes, body lowest, right arm forward.
4) PASSING (opposite): left leg straight under the body, right knee lifted passing forward, body highest.
The two contact frames are mirror steps, not copies; legs must clearly swap. The upper body, helmet,
gear and weapon stay the same in all four, only a small cloak sway following the step.
Direction for all four: <DIRECTION>.
```
`<DIRECTION>` is one of:
- `walking toward the camera (front view)`
- `walking to the right (side profile)`
- `walking away from the camera (back view)`

Per soldier, add one line:
- Warden: `Shield carried upright at his side, rifle held low; heavy, steady steps.`
- Hunter: `Rifle held at low ready across the body, leaning forward; quick, light steps.`
- Engineer: `Wrench resting on her shoulder, backpack and folded mechanical arm bouncing slightly.`

### With a Blender pose guide (recommended)

`Tools/ArtGen/source/squad_pose_guides/<soldier>_walk_<s|e|n>_guide.png` shows a grey mannequin in the
4 walk poses, from the game camera. Render them with:
```
E:/Blender/blender.exe -b --factory-startup -P Tools/ArtGen/blender/squad_pose_guides.py -- --soldier warden --out <frames dir>
python Tools/ArtGen/blender/compose_pose_guides.py <frames dir> Tools/ArtGen/source/squad_pose_guides
```
In Flow attach **three** images: the guide for the direction, `squads_concept_final.png` and
`style_anchor_towers.png`. Paste the shared block, the walk block, then:
```
POSE GUIDE: the attached grey mannequin image shows the exact 4 poses, in order, left to right. Match each
figure's leg positions, knee bends, arm swing, body height, facing and spacing EXACTLY, and keep the feet on
the same baseline as in the guide. The guide is only a pose reference: do not copy its grey blocky look,
its colours or its numbers. The dark limbs are the soldier's LEFT arm and leg, the light limbs his RIGHT.
Draw the real soldier from the concept image over these poses.
```

### Walk from a video (image-to-video)

The video keeps whatever grip the start frame shows, so the start frame must already hold the weapon the
right way. Two steps:

**Step 1: fix the start frame (image edit).** In Flow, edit
`Tools/ArtGen/source/squad_video/hunter_walk_e_start.png` (frame 1 of the approved walk sheet, alone on
magenta) with:
```
Edit only his arms, hands and rifle; keep everything else identical (pose of the legs, helmet, face,
cape, canister, colours, outline, size, position, magenta background).
He carries the rifle at a real military LOW READY, side view facing right:
- the stock butt tucked into his right shoulder,
- his right hand wrapped around the pistol grip, index finger straight along the side of the gun above
  the trigger guard (not on the trigger),
- his left hand under the handguard, in the middle of the barrel, palm up, clearly BEHIND the injector
  spike; nothing at all in front of the hand except the barrel and the spike,
- elbows tucked in close to the body, rifle angled about 30 degrees down, muzzle pointing at the ground
  a few steps ahead,
- the green hose still runs from the canister on his hip into the rifle.
Exactly two hands, five fingers each, both on the rifle. No hand or fingers near the muzzle.
```
Save it as `hunter_walk_e_start_v2.png` next to the original and check it before step 2.

**Step 2: the video.** In Flow use **Frames to Video**, set the fixed image as the first **and** last
frame (so the clip loops), 16:9, 8 s, sound off if offered. Save the clip as
`Assets/Art/_ArtDirection/squad_raw/<soldier>_walk_<dir>.mp4`. Pick one stride by hand (8 evenly spaced
frames, skipping any with ghost limbs), list them in `WALKS` in `Tools/ArtGen/build_squad_walk_from_video.py`
and run it: it writes `Assets/Art/Squads/<Soldier>/squad_<soldier>_walk_<dir>.png` (one row of 8 cells),
which goes into the squad asset's `poses.walkS / walkE / walkN`.

Hunter, facing right:
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The soldier walks IN PLACE in a steady looping walk cycle, facing right, like a sprite on a
treadmill: he stays in the centre of the frame and never moves across it.

ONLY THE LEGS AND THE CAPE MOVE. His legs alternate step after step: front heel down, back leg pushing
off, back knee lifting and passing forward, then the other leg. Quick, light, alert steps, a small
up-and-down bounce on each step. The short white cape sways slightly behind him.

The upper body is locked: torso, both arms, both hands and the rifle are one rigid piece that only rides
the small bounce. He holds the rifle at military low ready exactly as in the start frame: stock in the
right shoulder, right hand on the pistol grip with the finger straight off the trigger, left hand under
the middle of the handguard, rifle angled down at the ground ahead. The hands never slide, never let go,
never change position along the gun, and the arms never swing. The acid-green canister on his hip and
the green hose into the rifle stay attached. Head and helmet steady, eyes forward.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under his body and staying in that exact spot the whole clip. Style, colours, outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, extra hands or fingers, fingers on the muzzle or the spike, hands
sliding along the rifle, the rifle changing length or angle, other characters, text, motion blur,
lighting changes.
```
Other directions: replace "facing right" with "facing toward the camera" or "facing away from the camera"
and use that direction's still as the start frame (fixed the same way first). The front and back start
frames are cut from the idle sheet: `hunter_walk_s_start.png`, `hunter_walk_n_start.png`. Their step-1
edits:

Hunter, toward the camera (`hunter_walk_s_start.png` → `hunter_walk_s_start_v2.png`):
```
Edit only his legs, arms, hands and rifle; keep everything else identical (helmet, visor, face, cape,
vest, canister, colours, outline, size, magenta background). He faces straight toward the camera.
Legs: mid-step of a walk, his right foot a short step forward, left foot behind, both boots on the ground.
Rifle at a real military LOW READY across his body: stock tucked into his right shoulder, right hand on the
pistol grip with the index finger straight off the trigger, LEFT hand under the middle of the handguard,
rifle diagonal across the front of his body, muzzle pointing down at the ground in front of his left foot,
the spike tip ending above his boots. Elbows tucked in. The green hose still runs from the canister on
his hip into the rifle.
Exactly two hands, both on the rifle; no hand hanging free at his side.
Shadow: move the soft dark oval shadow so it is centred exactly under his body, its middle halfway
between his two boots and right under the centre of his helmet; same size, softness and colour as now.
```

Hunter, away from the camera (`hunter_walk_n_start.png` → `hunter_walk_n_start_v2.png`):
```
Edit only his legs, arms and rifle; keep everything else identical (helmet with the orange stripe,
cape, colours, outline, size, magenta background). He faces straight away from the camera.
Legs: mid-step of a walk, his right foot a short step forward, left foot behind, both boots on the ground.
Rifle at a real military LOW READY, held in front of him and mostly hidden by his body and cape: only the
stock at his right shoulder and the muzzle end with the spike showing low beside his left hip, pointing
down and forward, away from the camera. Both elbows tucked in, both hands in front of him on the rifle
(not visible); no hand hanging free at his side. Nothing sticks up above his shoulders.
Shadow: move the soft dark oval shadow so it is centred exactly under his body, its middle halfway
between his two boots and right under the centre of his helmet; same size, softness and colour as now.
```

Hunter video, toward the camera (start and end frame: `hunter_walk_s_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The soldier walks IN PLACE in a steady looping walk cycle, facing toward the camera, like a
sprite on a treadmill: he stays in the centre of the frame, never moves across it, never comes closer
and never grows or shrinks.

ONLY THE LEGS AND THE CAPE MOVE. His legs alternate step after step: one boot steps forward toward the
camera while the other pushes off behind, knee lifting and passing forward, then the other leg. Quick,
light, alert steps, a small up-and-down bounce on each step. The short white cape sways slightly at his
sides.

The upper body is locked: torso, both arms, both hands and the rifle are one rigid piece that only rides
the small bounce. He holds the rifle at military low ready exactly as in the start frame, diagonally
across the front of his body: stock in the right shoulder, right hand on the pistol grip with the finger
straight off the trigger, left hand under the middle of the handguard, muzzle and spike pointing down
beside his left boot. The hands never slide, never let go, never change position along the gun, and the
arms never swing. The acid-green canister on his hip and the green hose into the rifle stay attached.
Head and helmet steady, face looking straight at the camera.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under his body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, extra hands or fingers, fingers on the muzzle or the spike, hands
sliding along the rifle, the rifle changing length or angle, the spike hitting the boots, turning to the
side, other characters, text, motion blur, lighting changes.
```

Hunter video, away from the camera (start and end frame: `hunter_walk_n_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The soldier walks IN PLACE in a steady looping walk cycle, facing away from the camera, like a
sprite on a treadmill: he stays in the centre of the frame, never moves across it, never walks away into
the distance and never grows or shrinks.

ONLY THE LEGS AND THE CAPE MOVE. Below the cape his legs alternate step after step: one boot steps
forward away from the camera while the other pushes off, the heel of the back boot lifting toward the
camera, then the other leg. Quick, light, alert steps, a small up-and-down bounce on each step. The short
white cape on his back sways gently from side to side with each step.

The upper body is locked: torso, both arms, the helmet and the rifle are one rigid piece that only rides
the small bounce. He holds the rifle at military low ready in front of him exactly as in the start frame:
mostly hidden by his body and cape, only the stock end at his right shoulder and the muzzle with the spike
showing low beside his left hip, pointing down. The rifle never moves, never rises, never swings, and no
hand or arm ever comes out from behind the cape. Helmet steady, facing straight ahead, away from the
camera.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under his body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a hand appearing at his side, the rifle moving or rising onto his shoulder, the
rifle stock rising above his shoulder, the spike swinging, turning around or showing his face, other
characters, text, motion blur, lighting changes.
```

Warden start frames are cut by `python Tools/ArtGen/cut_walk_start_frames.py warden` (S, E and N from
his idle sheet). A real riot-shield carry for the walk: shield on the LEFT forearm by its arm strap,
held upright and lifted off the ground, the gun in the RIGHT hand at low ready. Step-1 edits:

Warden, facing right (`warden_walk_e_start.png` → `warden_walk_e_start_v2.png`):
```
Edit only his legs, arms, hands, shield and gun; keep everything else identical (helmet, goggles, face and beard, cape, vest, colours, outline, size,
magenta background). He faces right.
Legs: mid-step of a walk, front (right-hand) boot a short step forward, back boot behind, both on the ground.
Shield: on his LEFT forearm (the far side), held upright in front of him and slightly forward, its top
edge at chin height and its bottom edge at knee height, lifted clear of the ground, so both lower legs and
boots show below it. His left hand is hidden behind the shield on its handle; no hand on the top edge.
Gun: compact rifle in his RIGHT hand (the near side) at low ready, stock against his right shoulder,
index finger straight off the trigger, muzzle angled down at the ground ahead, past the shield's edge.
Shadow: move the soft dark oval shadow so it is centred exactly under his body, its middle halfway
between his two boots and right under the centre of his helmet; same size, softness and colour as now.
```

Warden, toward the camera (`warden_walk_s_start.png` → `warden_walk_s_start_v2.png`):
```
Edit only his legs, arms, hands, shield and gun; keep everything else identical (helmet, goggles, face and beard, cape, vest, colours, outline, size,
magenta background). He faces straight toward the camera.
Legs: mid-step of a walk, his right foot a short step forward, left foot behind, both boots on the ground.
Shield: on his LEFT forearm, held upright in front of his left side (screen right), its top edge at
shoulder height and its bottom edge at knee height, lifted clear of the ground, so both boots show. His
left hand is hidden behind the shield on its handle; no hand on the top edge.
Gun: compact rifle in his RIGHT hand at low ready across his body, stock in his right shoulder, index
finger straight off the trigger, muzzle pointing down, resting against the shield's inner edge.
Exactly two hands; no hand hanging free.
Shadow: move the soft dark oval shadow so it is centred exactly under his body, its middle halfway
between his two boots and right under the centre of his helmet; same size, softness and colour as now.
```

Warden, away from the camera (`warden_walk_n_start.png` → `warden_walk_n_start_v2.png`):
```
Edit only his legs, arms, shield and gun; keep everything else identical (helmet with the orange stripe,
cape, colours, outline, size, magenta background). He faces straight away from the camera.
Legs: mid-step of a walk, his right foot a short step forward, left foot behind, both boots on the ground.
Shield: on his LEFT forearm (screen left), held upright beside and slightly in front of him, we see its
back with the arm straps and handle; top edge at shoulder height, bottom edge at knee height, lifted
clear of the ground. His left forearm goes through the strap; no hand on the top edge.
Gun: in his RIGHT hand in front of him, mostly hidden by his body and cape; at most the muzzle shows low
beside his right hip, pointing down. No hand hanging free. Nothing sticks up above his shoulders.
Shadow: move the soft dark oval shadow so it is centred exactly under his body, its middle halfway
between his two boots and right under the centre of his helmet; same size, softness and colour as now.
```

Warden videos: Frames to Video, the v2 frame as both the first and the last frame, 16:9, 8 s. Save as
`squad_raw/warden_walk_e.mp4`, `warden_walk_s.mp4`, `warden_walk_n.mp4`.

Warden video, facing right (`warden_walk_e_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The heavy shield soldier walks IN PLACE in a steady looping walk cycle, facing right, like a
sprite on a treadmill: he stays in the centre of the frame, never moves across it and never grows
or shrinks.

ONLY THE LEGS AND THE CAPE MOVE. His legs alternate step after step: front heel down, back leg pushing
off, back knee lifting and passing forward, then the other leg. Steady, heavy, deliberate steps of a
man carrying a shield, a small up-and-down bounce on each step. The short white cape sways slightly
behind him.

The upper body is locked: torso, both arms, the shield and the gun are one rigid piece that only rides
the small bounce. The shield stays on his left forearm in front of him exactly as in the start frame,
upright, its bottom edge at knee height, never touching the ground, never tilting, his left fist on its
handle. The compact rifle stays in his right hand exactly as in the start frame, finger straight off
the trigger. The hands never let go, never slide, and the arms never swing. Head and helmet steady,
eyes forward, goggles on the helmet.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under his body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, a hand on the top edge of the shield, the shield swinging, tilting,
changing size or touching the ground, the gun moving, extra hands or fingers, other characters, text,
motion blur, lighting changes.
```

Warden video, toward the camera (`warden_walk_s_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The heavy shield soldier walks IN PLACE in a steady looping walk cycle, facing toward the camera, like a
sprite on a treadmill: he stays in the centre of the frame, never moves across it, never comes closer and never grows
or shrinks.

ONLY THE LEGS AND THE CAPE MOVE. Below the shield his legs alternate step after step: one boot steps
forward toward the camera while the other pushes off behind, knee lifting and passing forward, then the
other leg. Steady, heavy, deliberate steps, a small up-and-down bounce on each step. The short white
cape sways slightly at his sides.

The upper body is locked: torso, both arms, the shield and the gun are one rigid piece that only rides
the small bounce. The shield stays on his left forearm in front of his left side exactly as in the start
frame, upright, its bottom edge above his boots, never touching the ground, never tilting; his left
hand stays hidden behind it. The compact rifle stays in his right hand across his body exactly as in
the start frame, finger straight off the trigger. The hands never let go, never slide, and the arms
never swing. Head and helmet steady, face looking straight at the camera.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under his body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, a hand on the top edge of the shield, the shield swinging, tilting,
changing size, covering his boots or touching the ground, the gun moving, turning to the side, extra
hands or fingers, other characters, text, motion blur, lighting changes.
```

Warden video, away from the camera (`warden_walk_n_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The heavy shield soldier walks IN PLACE in a steady looping walk cycle, facing away from the camera, like a
sprite on a treadmill: he stays in the centre of the frame, never moves across it, never walks away into the distance and never grows
or shrinks.

ONLY THE LEGS AND THE CAPE MOVE. Below the cape his legs alternate step after step: one boot steps
forward away from the camera while the other pushes off, the heel of the back boot lifting toward the
camera, then the other leg. Steady, heavy, deliberate steps, a small up-and-down bounce on each step.
The short white cape on his back sways gently from side to side with each step.

The upper body is locked: torso, both arms, the helmet, the shield and the gun are one rigid piece that
only rides the small bounce. The shield stays on his left forearm beside and in front of him exactly as
in the start frame, its back with the handle facing us, upright and lifted off the ground, never
tilting. The gun muzzle stays low beside his right hip, pointing down. Nothing swings, and no hand or
arm moves. Helmet steady, facing straight ahead, away from the camera.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under his body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a hand appearing at his side, the shield swinging, tilting, changing size or
touching the ground, the gun moving or rising, anything rising above his shoulders, turning around or
showing his face, other characters, text, motion blur, lighting changes.
```

Engineer start frames: `python Tools/ArtGen/cut_walk_start_frames.py engineer`. Her idle already carries
the wrench on her left shoulder; the edit gives her free right hand the backpack strap and puts her mid-step.

Engineer, facing right (`engineer_walk_e_start.png` → `engineer_walk_e_start_v2.png`):
```
Edit only her legs, arms and hands; keep everything else identical (helmet, visor, face, ponytail, cape, backpack, folded mechanical arm,
colours, outline, size, magenta background). She faces right.
Legs: mid-step of a walk, front boot a short step forward, back boot behind with the heel lifting.
The wrench stays exactly where it is, resting on her LEFT shoulder with her LEFT hand gripping the handle.
Her RIGHT hand grips the right shoulder strap of her backpack at chest height, elbow tucked in.
Both hands are busy; no hand hangs free at her side. The mechanical arm stays folded, claw closed.
Shadow: keep the soft dark oval shadow centred exactly under her body, its middle halfway between her
two boots and right under the centre of her helmet; same size, softness and colour.
```

Engineer, toward the camera (`engineer_walk_s_start.png` → `engineer_walk_s_start_v2.png`). Her idle front
view is turned three-quarters to the side; this edit squares her up to the camera like the Hunter and Warden:
```
Redraw her turned to face STRAIGHT toward the camera, square and symmetric like a front view: shoulders
level and square to the camera, chest and plate carrier facing us head-on, face centred and looking straight
at the camera, both boots pointing toward the camera. The backpack shows equally on both sides behind her
shoulders, the folded mechanical arm rising straight up behind her head. Keep her design identical (helmet,
visor, face, ponytail, cape, backpack, folded mechanical arm, colours, outline, size, magenta background).
Legs: mid-step of a walk toward the camera, her right foot a short step forward, left foot behind, both
boots on the ground.
The wrench rests on her LEFT shoulder (screen right), her LEFT hand gripping the handle, the wrench head
just behind her shoulder.
Her RIGHT hand (screen left) grips the right shoulder strap of her backpack at chest height, elbow tucked in.
Both hands are busy; no hand hangs free at her side. The mechanical arm stays folded, claw closed.
Not turned to the side, not three-quarter view.
Shadow: keep the soft dark oval shadow centred exactly under her body, its middle halfway between her
two boots and right under the centre of her helmet; same size, softness and colour.
```

Engineer, away from the camera (`engineer_walk_n_start.png` → `engineer_walk_n_start_v2.png`):
```
Edit only her legs, arms and hands; keep everything else identical (helmet with the orange stripe,
ponytail, cape, backpack with its tool pockets, folded mechanical arm, colours, outline, size, magenta
background). She faces straight away from the camera.
Legs: mid-step of a walk, her right foot a short step forward, left foot behind, both boots on the ground.
The wrench stays exactly where it is, resting on her LEFT shoulder with her LEFT hand gripping the handle.
Her RIGHT hand grips the right shoulder strap in front of her chest, hidden by her body; only the right
elbow shows, tucked against her side. No hand hangs free. The mechanical arm stays folded, claw closed.
Shadow: keep the soft dark oval shadow centred exactly under her body, its middle halfway between her
two boots and right under the centre of her helmet; same size, softness and colour.
```

Engineer videos: Frames to Video, the v2 frame as both the first and the last frame, 16:9, 8 s. Save as
`squad_raw/engineer_walk_e.mp4`, `engineer_walk_s.mp4`, `engineer_walk_n.mp4`.

Engineer video, facing right (`engineer_walk_e_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The engineer walks IN PLACE in a steady looping walk cycle, facing right, like a sprite on a
treadmill: she stays in the centre of the frame, never moves across it and never grows or shrinks.

ONLY THE LEGS, THE CAPE AND THE PONYTAIL MOVE. Her legs alternate step after step: front heel down, back
leg pushing off, back knee lifting and passing forward, then the other leg. Brisk, light, purposeful
steps, a small up-and-down bounce on each step. The short white cape sways slightly behind her and the
ponytail bobs a little with each step.

The upper body is locked: torso, both arms, both hands, the wrench and the backpack are one rigid piece
that only rides the small bounce. The wrench stays resting on her LEFT shoulder with her LEFT hand gripping
the handle, exactly as in the start frame. Her RIGHT hand stays gripping the backpack shoulder strap at
her chest, exactly as in the start frame. The hands never let go, never slide, and the arms never swing.
The mechanical arm stays folded above the backpack, claw closed, rigid; it never unfolds or waves.
Head and helmet steady, eyes forward.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under her body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, the right hand letting go of the strap, the wrench moving, sliding or
changing shoulder, the mechanical arm unfolding, moving or waving, extra hands or fingers, other
characters, text, motion blur, lighting changes.
```

Engineer video, toward the camera (`engineer_walk_s_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The engineer walks IN PLACE in a steady looping walk cycle, facing toward the camera, like a sprite on a
treadmill: she stays in the centre of the frame, never moves across it, never comes closer and never grows or shrinks.

ONLY THE LEGS, THE CAPE AND THE PONYTAIL MOVE. Her legs alternate step after step: one boot steps
forward toward the camera while the other pushes off behind, knee lifting and passing forward, then the
other leg. Brisk, light, purposeful steps, a small up-and-down bounce on each step. The short white cape
sways slightly at her sides.

The upper body is locked: torso, both arms, both hands, the wrench and the backpack are one rigid piece
that only rides the small bounce. The wrench stays resting on her LEFT shoulder with her LEFT hand gripping
the handle, exactly as in the start frame. Her RIGHT hand stays gripping the backpack shoulder strap at
her chest, exactly as in the start frame. The hands never let go, never slide, and the arms never swing.
The mechanical arm stays folded above the backpack, claw closed, rigid; it never unfolds or waves.
Head and helmet steady, face looking straight at the camera, square to the camera the whole clip.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under her body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, the right hand letting go of the strap, the wrench moving, sliding or
changing shoulder, the mechanical arm unfolding, moving or waving, extra hands or fingers, other
characters, text, motion blur, lighting changes, turning to the side.
```

Engineer video, away from the camera (`engineer_walk_n_start_v2.png`):
```
A 2D cartoon game sprite animation, flat cel-shaded with thick dark outlines, matching the start frame
exactly. The engineer walks IN PLACE in a steady looping walk cycle, facing away from the camera, like a sprite on a
treadmill: she stays in the centre of the frame, never moves across it, never walks away into the distance and never grows or shrinks.

ONLY THE LEGS, THE CAPE AND THE PONYTAIL MOVE. Below the backpack and cape her legs alternate step after
step: one boot steps forward away from the camera while the other pushes off, the heel of the back boot
lifting toward the camera, then the other leg. Brisk, light, purposeful steps, a small up-and-down bounce
on each step. The cape sways gently from side to side and the ponytail swings a little.

The upper body is locked: torso, both arms, both hands, the wrench and the backpack are one rigid piece
that only rides the small bounce. The wrench stays resting on her LEFT shoulder with her LEFT hand gripping
the handle, exactly as in the start frame. Her RIGHT hand stays in front of her on the strap, hidden, the right elbow
tucked at her side. The hands never let go, never slide, and the arms never swing.
The mechanical arm stays folded above the backpack, claw closed, rigid; it never unfolds or waves.
Helmet steady, facing straight ahead, away from the camera.

Camera completely locked: no zoom, no pan, no rotation, no shake. Same viewing angle from above as the
start frame. Background: one flat solid pure magenta #FF00FF the whole clip, only the soft dark oval
shadow, centred right under her body and staying in that exact spot the whole clip. Style, colours,
outline thickness and size identical in every frame.

Avoid: arm swinging, a free hand, the right hand letting go of the strap, the wrench moving, sliding or
changing shoulder, the mechanical arm unfolding, moving or waving, extra hands or fingers, other
characters, text, motion blur, lighting changes, turning around or showing her face.
```

### Death block (optional, paste after the shared block)

Death already works in code (tip over and fade). Draw it only if that looks too stiff.
```
Layout override: ONE soldier drawn THREE times in a single row, a short death in the side view (facing right):
1) HIT: knocked back, head thrown back, weapon slipping from the hands.
2) FALLING: knees buckling, body tilting backward, cloak lifting.
3) DOWN: lying on his back on the ground, weapon beside him, cloak spread under him.
Same size and baseline as the walk frames. No blood, no gore.
```

## What Unity adds (no extra art needed)

| Action | From | Motion |
|---|---|---|
| idle | idle still | slow up-down breathing bob |
| walk | idle still | faster bob + slight forward lean + small side-to-side tilt |
| fire | fire still | short backward recoil each shot + muzzle flash effect |
| skill | skill still | snap into the pose, hold it while the skill lasts, plus the skill effect |
| repair | repair still | small rhythmic nudge + spark effect |
| die | idle still | tip over, flash, fade out |
