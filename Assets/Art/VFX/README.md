# VFX – hiệu ứng cho Dị Thể Sáp

Sprite sheet hiệu ứng của 16 Dị Thể Sáp và các trạng thái (cháy, băng, dung môi, lưới, chậm, hắc ín), vẽ bằng code
(`Tools/ArtGen/gen_vfx.py`). Cùng style với tháp và bản đồ: viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ
trên bên trái. Mọi hiệu ứng có viền tối nên đọc được trên cả nền tối (cầu cảng) lẫn nền sáng (đồng muối, tuyết).

- Mỗi file là **một hàng frame**, chạy từ trái sang phải. Ô (cell), số frame, fps, lặp, pivot, kiểu blend, scale gợi ý
  và lúc dùng nằm trong `vfx_manifest.json` (code và prototype HTML đọc file này, không chép số bằng tay)
- Pivot theo Unity: x tính từ trái, y tính từ **dưới** (0..1). `anchor_px` là cùng điểm đó tính bằng px từ góc trên trái
- `layer`: `ground` vẽ dưới chân quái · `over` vẽ đè lên quái · `icon` trên đầu, cạnh thanh máu · `screen` phủ cả màn hình
- `tintable = true`: sáp trắng trung tính, nhân màu (multiply) với màu nhấn của từng con
- 1 ô xây = 128 px. Scale gợi ý tính cho quái bậc 1; Sáp vụn và hổ con khoảng 0.5–0.6, trùm khoảng 1.6–2.0

## Màu dành riêng cho trạng thái
Cháy đỏ cam `#ef5b31` · dung môi xanh axit `#a6ff4d` · băng `#93cdd9` / `#8ff1ff` · hồi máu xanh lá `#58dd7c`.
Chỉ dùng cho đúng trạng thái đó. Cảnh báo kỹ năng dùng vàng nhạt `#fff6d8`, vạch nguy hiểm của trùm 2 dùng đỏ hồng `#ff3b55`.

## Biểu tượng trạng thái (GDD 8.5)
`Status/vfx_status_icons.png`, ô 40×40, không phải animation: mỗi frame là một huy hiệu, **mỗi cái một hình nền riêng**
để không phụ thuộc vào màu: 0 cháy (tròn, ngọn lửa) · 1 băng (lục giác, bông tuyết) · 2 dung môi (giọt, bong bóng) ·
3 lưới (vuông, mắt lưới) · 4 chậm (thoi, đồng hồ cát) · 5 hắc ín (khiên sáng, vệt đen chảy) · 6 tăng tốc (mũi tên lên) ·
7 đang hồi máu (chữ thập). Đặt cạnh nhau phía trên thanh máu, giữ nguyên cỡ 40 px cho mọi loại quái.

## Ưu tiên hiển thị (GDD 6.6, 8.3)
Vòng bão và thanh hội tụ luôn vẽ trên cùng. Hiệu ứng trạng thái bám quanh chân và hai bên thân để không che quái;
vũng tan chảy khi chết dài 0,4 giây và nằm dưới chân. `vfx_screen_edge_pulse` trong suốt ở giữa màn hình.

## Dùng chung cho mọi Dị Thể Sáp (`Shared/`)

| File | Ô | Frame | fps | Lặp | Pivot | Blend | Lớp | Dùng khi |
|---|---|---|---|---|---|---|---|---|
| `vfx_step_dust.png` | 64×48 | 6 | 14 | không | (0.5, 0.2) | alpha | ground | walk: spawn at a foot on every step (walk frames 0 and half-cycle). Map: Outskirts road, Old Town cobbles (default) — grey-brown dust puff; scale 0.6 for shard/cub, 1.8 for bosses |
| `vfx_step_splash.png` | 64×48 | 6 | 14 | không | (0.5, 0.2) | alpha | ground | walk: spawn at a foot on every step (walk frames 0 and half-cycle). Map: Harbor (wet planks, water edge) — water ripple and droplets; scale 0.6 for shard/cub, 1.8 for bosses |
| `vfx_step_salt.png` | 64×48 | 6 | 14 | không | (0.5, 0.2) | alpha | ground | walk: spawn at a foot on every step (walk frames 0 and half-cycle). Map: White Plains — white salt puff with square crystals; scale 0.6 for shard/cub, 1.8 for bosses |
| `vfx_step_snow.png` | 64×48 | 6 | 14 | không | (0.5, 0.2) | alpha | ground | walk: spawn at a foot on every step (walk frames 0 and half-cycle). Map: Observatory — lavender snow puff with flakes; scale 0.6 for shard/cub, 1.8 for bosses |
| `vfx_wax_drip.png` | 32×32 | 6 | 12 | không | (0.5, 0.2) | alpha | ground | walk: wax drop falling off the creature every 0.4-0.8 s, leaves a small splat — neutral white wax; tint (multiply) with the creature accent colour |
| `vfx_hit_splash.png` | 96×96 | 6 | 20 | không | (0.5, 0.5) | alpha | over | hit: at the impact point when a creature takes damage (with vfx_hit_flash) — wax shards and droplets; tint with the creature accent colour |
| `vfx_hit_flash.png` | 64×64 | 3 | 30 | không | (0.5, 0.5) | alpha | over | hit: one short white impact flash at the impact point — draw above the splash |
| `vfx_attack_slash.png` | 128×128 | 5 | 20 | không | (0.5, 0.5) | alpha | over | attack: claw swipe in front of tiger, tiger cub, alpha tiger, frenzy, crab (attack frame 2-3) — drawn swiping toward +x (east); rotate to the attack direction, flipX for west |
| `vfx_attack_swipe.png` | 128×128 | 5 | 20 | không | (0.5, 0.5) | alpha | over | attack: weapon swing arc for armed creatures (standard, primordial, healer, spore, mother tree, lens, mirror, prism, ultimate, myriad) — drawn swinging toward +x; rotate to the attack direction; scale 1.8 for bosses |
| `vfx_attack_impact.png` | 96×96 | 5 | 20 | không | (0.5, 0.5) | alpha | over | attack: burst at the target (wall or squad) on the hit frame of any creature attack — scale 0.6 for shard/cub, 1.6 for bosses |
| `vfx_death_melt.png` | 128×64 | 8 | 20 | không | (0.5, 0.5) | alpha | ground | death: wax puddle that spreads then evaporates (0.4 s) under any creature, starts with the die animation — neutral white wax; tint with the accent colour; scale 0.5 shard/cub, 2.0 bosses |
| `vfx_drop_resource.png` | 48×64 | 8 | 16 | không | (0.5, 0.15) | alpha | over | death: gold 4-point star rising where a creature dropped resources — shape = star (resource) |
| `vfx_drop_specimen.png` | 48×64 | 8 | 16 | không | (0.5, 0.15) | alpha | over | death: lilac hexagon gem rising where a creature dropped a research specimen — shape = hexagon gem (specimen), so it does not rely on colour |
| `vfx_shadow_blob.png` | 128×64 | 1 | – | không | (0.5, 0.5) | alpha | ground | always: soft blob shadow under a unit that has no baked shadow (flying shards, pouncing boss, pods) — scale x to the unit width; shrink while the unit is in the air |

## Trạng thái (`Status/`)

| File | Ô | Frame | fps | Lặp | Pivot | Blend | Lớp | Dùng khi |
|---|---|---|---|---|---|---|---|---|
| `vfx_status_burning.png` | 96×96 | 8 | 12 | có | (0.5, 0.08) | alpha | over | status burning (Flamethrower): loop on the creature while it burns — flames hug the feet and the sides so the body stays visible; scale = unit cell / 128 (0.5 shard, 2.0 boss). Replaces the 32 px placeholder Towers/Flamethrower/vfx_burning.png |
| `vfx_status_frozen.png` | 96×96 | 6 | 8 | có | (0.5, 0.08) | alpha | over | status frozen (Cryo Tower fully freezes the lens tier and interrupts focus): loop while frozen — ice crust at the feet plus a see-through frost sheen; also tint the unit pale blue in code |
| `vfx_status_frozen_break.png` | 96×96 | 6 | 20 | không | (0.5, 0.08) | alpha | over | status frozen ends: ice crust shatters — one shot, then remove vfx_status_frozen |
| `vfx_status_solvent.png` | 96×96 | 8 | 10 | có | (0.5, 0.08) | alpha | over | status solvent (Solvent Sprayer puddle, Hunter weapons): loop while the creature is dissolving (cannot heal, armour melts) — acid drips running down the body and bubbles at the feet |
| `vfx_status_netted.png` | 96×96 | 4 | 6 | có | (0.5, 0.08) | alpha | over | status netted (Net Launcher): loop while the creature is tied down (bosses and the ultimate tier are only slowed: use vfx_status_slowed for them) — see-through rope dome with weights; matches Towers/NetLauncher/vfx_net_trap |
| `vfx_status_slowed.png` | 96×64 | 8 | 10 | có | (0.5, 0.42) | alpha | ground | status slowed (Cryo Tower aura; Net Launcher on bosses and the ultimate tier): loop at the feet — frost ring with dragging chevrons and snowflakes; drawn under the unit |
| `vfx_status_tar.png` | 96×64 | 8 | 8 | có | (0.5, 0.42) | alpha | ground | status tar-stuck (Warden tar trap): loop at the feet while the creature is stuck — dark tar puddle with stretching strands; drawn under the unit, strands overlap the feet |
| `vfx_status_icons.png` | 40×40 | 8 | – | không | (0.5, 0) | alpha | icon | status: badge above the head of a creature for each active status (GDD 8.5: never colour alone). Frame index = 0 burning, 1 frozen, 2 solvent, 3 netted, 4 slowed, 5 tar, 6 haste, 7 regen — not an animation: pick one frame per status. Each badge has its own plate SHAPE: burning circle, frozen hexagon, solvent droplet, netted square, slowed diamond, tar light shield, haste up-arrow, regen cross. Place side by side 4 px above the health bar; keep at scale 1 (40 px) for all units |

## Kỹ năng từng loại (`Skills/`)

| File | Ô | Frame | fps | Lặp | Pivot | Blend | Lớp | Dùng khi |
|---|---|---|---|---|---|---|---|---|
| `vfx_heal_ring.png` | 256×192 | 8 | 10 | có | (0.5, 0.5) | alpha | ground | healer (tier 3) heal: green zone on the ground while it stands still and heals; radius = heal radius — ellipse 236x172 px in the cell; scale so the ring matches the heal radius (y squash 0.72) |
| `vfx_heal_sparkle.png` | 48×64 | 8 | 12 | có | (0.5, 0.1) | alpha | over | heal received: loop on every creature that is being healed by a healer or by the mother tree roots — green plus signs rising; pair with the regen badge (vfx_status_icons frame 7) |
| `vfx_lens_charge_bar.png` | 96×24 | 21 | 4 | không | (0.5, 0) | alpha | icon | lens (tier 4) focus: bar above the head filling over 5 s while it stands next to a tower; frame = round(progress * 20); frame 20 = full (tower destroyed) — 5 segments = 5 seconds; high visual priority (GDD 8.3). Reset to frame 0 when the Cryo Tower freezes the creature |
| `vfx_lens_beam.png` | 128×32 | 6 | 12 | có | (0, 0.5) | alpha | over | lens (tier 4) focus: light beam from the lens on its back to the tower it is destroying — tileable along x and seamless as a loop: anchor at the lens, rotate toward the tower and stretch or repeat x to the distance. Amber edge so it reads on the white salt flat |
| `vfx_lens_beam_hit.png` | 64×64 | 6 | 12 | có | (0.5, 0.5) | alpha | over | lens focus / prism focus: hot spot on the tower at the end of the beam — spinning sun rays; scale up with charge (0.7 -> 1.2) |
| `vfx_frenzy_howl.png` | 256×192 | 8 | 16 | không | (0.5, 0.5) | alpha | ground | frenzy howl: sound-wave rings expanding from the creature when it speeds up nearby creatures (howl frame 2); scale to the buff radius — crimson broken rings; buffed allies get the haste badge (vfx_status_icons frame 6) |
| `vfx_ultimate_regen.png` | 128×128 | 8 | 12 | không | (0.5, 0.1) | alpha | over | ultimate (tier 5) self-heal tick: pulse rising around the body every time it regenerates — one shot per tick; do not play while burning or under solvent (healing is blocked) |
| `vfx_spore_burst.png` | 128×128 | 7 | 18 | không | (0.5, 0.5) | alpha | over | spore death: purple spore cloud and 3 wax chunks flying out where the 3 shards will spawn (skip it when the spore dies burning or under solvent: it does not split) — chunks fly to 150, 30 and 270 degrees; spawn the shards at those offsets (about 40 px) |
| `vfx_crab_shell_soften.png` | 96×96 | 8 | 10 | có | (0.5, 0.08) | alpha | over | crab under solvent: shell flakes sliding off while its front armour is melted (optional overlay on top of vfx_status_solvent) — coral flakes; for the mother tree bark tint the flakes brown |
| `vfx_mirror_reflect.png` | 64×64 | 5 | 24 | không | (0.5, 0.5) | alpha | over | mirror reflect: spark on the salt-crystal skin when it bounces a single-target shot back (Machine Gun, Sniper, Hunter); also the prism boss mirror skin — the streak leaves toward +x: rotate toward the tower that fired |

## Trùm: cảnh báo và kỹ năng (`Boss/`)

| File | Ô | Frame | fps | Lặp | Pivot | Blend | Lớp | Dùng khi |
|---|---|---|---|---|---|---|---|---|
| `vfx_primordial_crack_glow.png` | 256×256 | 8 | 10 | có | (0.5, 0.5) | additive | over | boss 1 Shed warning (66% and 33% HP): cracks on the body glow pale white-yellow for 3 s before the wax plates fall off — centre on the chest (about 110 px above the feet); pulse gets faster in code (fps 10 -> 20). Additive, but also fine with normal alpha |
| `vfx_primordial_shed_burst.png` | 256×256 | 8 | 16 | không | (0.5, 0.5) | alpha | over | boss 1 Shed: wax plates blast off the body and become 8-10 shards around the boss — spawn the shards as the plates land (frame 5) |
| `vfx_tiger_pounce_line.png` | 128×32 | 4 | 12 | có | (0, 0.5) | alpha | ground | boss 2 Pounce warning (2 s crouch): red chevron line on the lane from the boss to the landing point — tileable along x and seamless as a loop: rotate toward the landing point and repeat x to the distance. Follows the lane; end it with vfx_tiger_pounce_marker |
| `vfx_tiger_pounce_marker.png` | 192×144 | 8 | 12 | có | (0.5, 0.5) | alpha | ground | boss 2 Pounce warning: landing marker on the lane for the 2 s crouch (blink faster near the end) — supersedes the 128x64 placeholder Wax/AlphaTiger/vfx_pounce_target.png; red target with a paw print |
| `vfx_tiger_land_dust.png` | 256×192 | 8 | 16 | không | (0.5, 0.5) | alpha | ground | boss 2 Pounce landing: dust ring and cracks where the boss lands — also usable for the primordial heavy step at scale 0.6 |
| `vfx_tiger_roar_ring.png` | 256×192 | 8 | 14 | không | (0.5, 0.5) | alpha | ground | boss 2 Call the Pack (50% HP): roar rings from the boss when it summons tiger cubs (roar frame 3), together with vfx_screen_edge_pulse — jagged gold and bone rings; scale 1.5 on the boss |
| `vfx_screen_edge_pulse.png` | 480×270 | 1 | – | không | (0.5, 0.5) | alpha | screen | boss 2 Call the Pack warning: screen edges blink red while the boss roars; also usable for the myriad Last Heart darkening with a dark tint — single frame: stretch over the whole viewport and animate alpha in code (0 -> 0.9 -> 0, 3 pulses of 0.5 s). Centre is fully transparent so it never hides enemies or the storm ring |
| `vfx_tiger_headbutt_impact.png` | 192×192 | 7 | 18 | không | (0.5, 0.5) | alpha | over | boss 2 Wall Ram (first hit on the wall, after a 1.5 s head-down warning): impact burst on the wall (headbutt frame 3) — also good for the primordial heavy wall hit |
| `vfx_tree_root_ring.png` | 384×288 | 8 | 8 | có | (0.5, 0.5) | alpha | ground | boss 3 Feeding Roots (always on): green ring on the ground around the walking boss; creatures inside heal slowly — ellipse 352x256 px; scale so it matches the aura radius. Loop |
| `vfx_tree_seed_pod_blink.png` | 64×64 | 4 | 6 | có | (0.5, 0.1) | alpha | over | boss 3 Seeding (66% and 33% HP): seed pod dropped on the lane, blinking for 5 s before it hatches into a healer — raise fps from 6 to 16 over the 5 s; pods can be destroyed by area damage |
| `vfx_tree_seed_pod_hatch.png` | 96×96 | 7 | 14 | không | (0.5, 0.2) | alpha | over | boss 3 Seeding: the pod swells, cracks and bursts; spawn the healer on frame 4 — play instead of the blink loop when the 5 s are over |
| `vfx_prism_charge_beam.png` | 128×48 | 6 | 12 | có | (0, 0.5) | alpha | over | boss 4 Focus and Multi-Focus: rainbow beam from the prism sceptre to each targeted tower, charging for 5 s — tileable along x and seamless as a loop: rotate and repeat x to the distance; scale y 0.4 -> 1.0 with charge progress |
| `vfx_prism_target_marker.png` | 128×96 | 8 | 12 | có | (0.5, 0.5) | alpha | ground | boss 4 Multi-Focus (50% HP): marker under each of the 3 targeted towers for the 5 s charge — high priority (same family as the storm ring): draw it above tower bases, never above the storm ring |
| `vfx_prism_mirror_glint.png` | 128×128 | 6 | 14 | không | (0.5, 0.5) | additive | over | boss 4 Mirror Skin (always on): glints running over the crystals every few seconds, and whenever a single-target shot is reflected — centre on the body; additive, also fine with normal alpha |
| `vfx_prism_core_glow.png` | 128×128 | 8 | 10 | có | (0.5, 0.5) | additive | over | boss 4 Open Core (while it charges a beam, it takes double damage): glowing core on the chest crystal — centre on the big chest crystal; additive, also fine with normal alpha |
| `vfx_myriad_absorb_trail.png` | 128×48 | 8 | 12 | có | (0, 0.5) | alpha | over | boss 5 Absorb (always on): wax of a creature that died nearby streams toward the boss and heals it — tileable along x and seamless as a loop; blobs travel toward +x: anchor at the corpse, rotate toward the boss, repeat x to the distance. Blocked by fire and solvent |
| `vfx_myriad_scream_wave.png` | 384×288 | 8 | 14 | không | (0.5, 0.5) | alpha | ground | boss 5 Ten Thousand (66% and 33% HP): the faces scream and a wave spreads out as it spawns a mixed pack with a frenzy — jagged violet rings; play on the scream frame |
| `vfx_myriad_heart_glow.png` | 128×128 | 8 | 10 | có | (0.5, 0.5) | alpha | over | boss 5 Last Heart (10% HP): the eclipsed-sun heart opens on its back and beats; only squads can damage it — centre on the heart on the boss back; heartbeat loop (two thumps per cycle) |


## Unity
- Pixels Per Unit = 128, Sprite Mode Multiple, Filter Bilinear, Compression None
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot theo `vfx_manifest.json` khi import lần đầu. Đổi kích thước ô
  hay pivot: chạy lại script rồi Tools > Units > Reapply Sprite Import Settings
- Sprite tên `<file>_r0_c<frame>`
- `blend = additive`: dùng material Particles/Additive (hoặc Sprites-Default cũng chấp nhận được)
- Các dải tia (`vfx_lens_beam`, `vfx_prism_charge_beam`, `vfx_tiger_pounce_line`, `vfx_myriad_absorb_trail`) lặp được theo
  chiều ngang: pivot ở giữa mép trái, xoay về phía mục tiêu, dùng Draw Mode Tiled hoặc xếp nhiều sprite nối nhau

## Dựng lại
```bash
python3 Tools/ArtGen/gen_vfx.py                      # tất cả (khoảng 1,5 phút)
python3 Tools/ArtGen/gen_vfx.py --only burning,heal  # vài hiệu ứng (manifest và README vẫn viết đủ)
python3 Tools/ArtGen/gen_vfx.py --board ~/Downloads/GuardianOfDawn-drafts/fable_vfx_board.png   # kèm bảng xem thử
```
