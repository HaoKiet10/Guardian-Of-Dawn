# Asset Specs — Entity: machine-gun (Súng máy)

> **Source**: `Assets/Art/Towers/MachineGun/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: full — art-director + technical-artist)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung)
> **Status**: 20 assets specced / 20 approved / 0 in production / 0 done

## Thiết kế theo cấp

| | t0 · Súng máy dã chiến | t1 · Ụ súng đôi có khiên | t2 · Tháp pháo xoay nhiều nòng |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Base | Vòng bao cát tròn méo, ván pallet, chân chống rebar | Bệ bê tông bát giác sọc vàng-đen, trụ thép đỡ giá, tủ đạn dự phòng | 3 tầng: sàn thép, vòng xoay hình trống + hộp động cơ, ống dẫn, máng cấp đạn |
| Head | 1 súng nòng đơn mảnh, hộp đạn hở | 2 nòng song song, khiên thép tán đinh xoay theo súng, hộp đạn thép | Cụm 6 nòng xoay trong vỏ thép, kẹp nòng, xy-lanh nâng, băng đạn dài |
| Vật liệu | Bao cát `#eabb5c`, gỗ, rebar, dây | Bê tông, thép tán đinh, sọc cảnh báo | Thép cắt máy, thủy lực, ống dẫn |
| Silhouette | Gò tròn + 1 gạch ngang mảnh | Hình thang bát giác + khiên + 2 gạch ngang | Tháp bậc thang + khối nòng ngang dày |

**Sợi chỉ họ súng máy (§3):**
1. Nòng ngang, dài, mảnh hơn khối nền, ở mọi cấp (khác họ cối: ống chĩa trời, không Head).
2. Thép súng `#323845` + đồng thau `#d9a441` chỉ ở băng đạn / hộp đạn / vỏ đạn.
3. Hộp đạn có băng đồng thau luôn ở bên trái thân súng (trên Head, xoay theo súng) + chấm
   lóe kính ngắm hổ phách `#ff9f1c` trên đỉnh thân súng.

**Head / Base:** Head = nòng, thân súng, hộp đạn và băng (t1 thêm khiên, t2 thêm vỏ xoay và
xy-lanh). Base = mọi thứ còn lại. Không vẽ xạ thủ (tháp tự động).

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 hai nòng bắn luân phiên; t2 liên thanh nhanh
hơn, có độ trễ quay nòng (spin-up).

## Quyết định đã chốt (2026-11-18)

- t1 head fire: 8 frame 24 fps (nòng A f1, nòng B f5), sheet 1024×640; code luân phiên A/B.
- t2 head fire tách `fire_start` (6f, tăng tốc quay nòng) + `fire_loop` (4f). Súng máy = 16
  sheet tháp (ngoại lệ công thức, art bible §8).
- Đồng thau `#d9a441` giữ, chỉ cho băng đạn / vỏ đạn (art bible §4).
- Nòng ngang được thò ≤ 10 px ngoài độ chiếm ô, vẫn cách mép ô ≥ 2 px (art bible §3).

## Prompt nền

**BASE / NEG:** dùng nguyên văn từ `mortar-assets.md`.

**T0:** `low round irregular improvised machine gun nest, ragged ring of sandbags #eabb5c, wooden pallet planks, rebar tripod, one long thin gunmetal #323845 machine gun barrel pointing horizontally, small open ammo box with brass #d9a441 cartridge belt on left side of receiver, amber scope glint, no gunner, about 70px wide 40px tall`

**T1:** `octagonal chamfered concrete plinth with yellow-black hazard stripes #f0b429, steel pedestal, riveted steel gun shield, twin parallel gunmetal #323845 machine gun barrels pointing horizontally, riveted steel ammo box with brass #d9a441 belt on left side of receiver, amber scope glint, no sandbags, no gunner, about 90px wide 56px tall`

**T2:** `three-level stepped industrial machine gun turret, wide machined steel deck, round motorized turntable drum with motor housing, pipes, six-barrel rotary gunmetal #323845 gun with clamp rings pointing horizontally in steel housing, hydraulic riser, long brass #d9a441 ammo belt feeding from left side, amber scope glint, no gunner, about 109px wide 72px tall, Stålenhag-style industrial materials`

**HEAD (thêm cuối prompt Head):** `weapon only, no emplacement, no ground, centered, facing <direction>`.
**BASE-ONLY (thêm cuối prompt Base idle):** `base only, empty mount`.

Head sheet: 5 hàng S, SE, E, NE, N (flipX cho SW, W, NW). Hàng S thấy mặt nòng; hàng E nòng
dài nhất; hàng N thấy lưng thân súng, hộp đạn bị che một phần.

Chung mọi sheet: theo `mortar-assets.md` (RGBA32, ≥ 2 px lề trong suốt, Bilinear, tắt
mipmap, tắt Read/Write, Mesh Tight, BC7 HQ qua Atlas V2 Standalone override).

---

## ASSET-020 — tower_machine_gun_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 4 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t0_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Vòng bao cát tròn thấp, ván và chân chống rebar trống (Head gắn
riêng). F0 đèn nhỏ sáng, F1 tắt.

**Art Bible Anchors:** §3 t0 (≤ 40 px, bao cát chỉ ở t0); §4 viền, 3 tông.

**Generation Prompt:** BASE + T0 + BASE-ONLY + `idle`. NEG.

**Status:** Needed

## ASSET-021 — tower_machine_gun_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây. F1 nền đất, nửa sau vòng bao cát. F2 xong vòng cát.
F3 dựng chân chống rebar. F4 gắn súng (Head SE vẽ sẵn). F5 = base idle F0 + Head SE.

**Art Bible Anchors:** §8 chỉ t0 có build; Head SE vẽ sẵn.

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string, gun facing southeast`. NEG.

**Status:** Needed

## ASSET-022 — tower_machine_gun_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (Head SE vẽ sẵn), F1 nứt, F2 súng bật văng và bao cát
tung, F3–4 khói. F5 đống đổ nát: bao cát rải, súng nằm nghiêng, hộp đạn vỡ; 2 tông, không viền.

**Art Bible Anchors:** §7 đống đổ nát; §8 destroy mỗi cấp.

**Generation Prompt:** F0–4 BASE + T0 + `explosion, debris flying`; F5 BASE + `rubble of improvised sandbag machine gun nest, gun lying on its side, broken ammo box, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-023 — tower_machine_gun_t0_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 3 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t0_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Súng nòng đơn, hộp đạn và băng đồng thau bên trái thân. F0 kính ngắm
lóe hổ phách, F1 tắt.

**Art Bible Anchors:** §8 Head 5 hàng; §3 sợi chỉ nòng ngang.

**Generation Prompt:** BASE + T0 + HEAD + `idle, scope glint on`. NEG.

**Engine:** Head nhô ≤ 18 px trên tâm xoay (40 − 22).

**Status:** Needed

## ASSET-024 — tower_machine_gun_t0_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 24 fps, loop khi bắn |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t0_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ. F1 chớp đầu nòng và sinh đạn, thân giật lùi 2 px. F2 giật
lùi, vỏ đạn bay. F3 về nghỉ. Chớp không chạm mép ô.

**Art Bible Anchors:** §8 chớp không chạm mép; README bắn ở F1.

**Generation Prompt:** BASE + T0 + HEAD + `firing frame, muzzle flash, recoil`. NEG.

**Status:** Needed

## ASSET-025 — tower_machine_gun_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t0 (base idle F0 + head idle F0 SE) phủ giàn giáo. F1–2 bụi,
tháo bao cát. F3 bệ bát giác nhô lên. F4 trụ thép và khiên đặt vào, Head SE vẽ sẵn. F5 trùng
từng pixel với ghép t1 (base idle F0 + head idle F0 SE tại Head localPosition t1).

**Art Bible Anchors:** §1 nguyên tắc 1; §8 upgrade.

**Generation Prompt:** BASE + `construction transition, scaffolding and dust, sandbag nest replaced by octagonal concrete plinth with riveted shield mount, twin-barrel gun facing southeast`. NEG.

**Status:** Needed

## ASSET-026 — tower_machine_gun_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 4 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bát giác sọc vàng-đen, trụ thép đội mâm xoay trống, tủ đạn thép
bên trái-sau. Đèn tủ nháy F0/F1. Không bao cát.

**Art Bible Anchors:** §3 t1 (~70%, ≤ 56 px); §9 Stålenhag.

**Generation Prompt:** BASE + T1 + BASE-ONLY + `idle`. NEG.

**Status:** Needed

## ASSET-027 — tower_machine_gun_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp (Head SE vẽ sẵn), nứt bê tông, khiên và 2 nòng văng. F5: bệ vỡ
nửa, mảnh sọc vàng còn thấy, trụ gãy; 2 tông, không viền.

**Art Bible Anchors:** §7; §3 ≤ 56 px.

**Generation Prompt:** F5 BASE + `shattered octagonal concrete plinth, hazard stripe fragments, bent steel shield and twin barrels fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-028 — tower_machine_gun_t1_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 3 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t1_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** 2 nòng song song sau khiên thép tán đinh, hộp đạn thép bên trái. Khiên
xoay theo hướng; hàng N thấy lưng khiên (tấm phẳng). F0 kính lóe, F1 tắt.

**Art Bible Anchors:** §3 t1 (giá cố định, thêm nòng); §9 Stålenhag.

**Generation Prompt:** BASE + T1 + HEAD + `idle, scope glint on`. NEG.

**Status:** Needed

## ASSET-029 — tower_machine_gun_t1_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 1024×640 (5 hàng × 8 frame), 24 fps, loop khi bắn |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t1_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ. F1 nòng A chớp và sinh đạn, khiên rung 1 px. F2–4 nòng A giật
rồi về. F5 nòng B chớp và sinh đạn. F6–7 nòng B giật rồi về. Đề xuất, chờ GDD.

**Art Bible Anchors:** §3; §8.

**Generation Prompt:** BASE + T1 + HEAD + `firing, left barrel flash and recoil` (F5 đổi `right barrel`). NEG.

**Engine:** sự kiện bắn F1 → MuzzleA, F5 → MuzzleB. Với flipX, A/B đổi bên màn hình: luân
phiên theo chỉ số nòng, không theo trái/phải.

**Status:** Needed

## ASSET-030 — tower_machine_gun_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t1 phủ giàn giáo. F1–2 bụi, đập bệ bê tông. F3 sàn thép 3
tầng và vòng xoay trồi lên. F4 lắp ống dẫn và máng đạn, Head SE vẽ sẵn. F5 trùng từng pixel
với ghép t2.

**Art Bible Anchors:** §1 nguyên tắc 1; §8; §3 ≤ 72 px.

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by stepped machined steel deck with turntable drum, rotary gun facing southeast`. NEG.

**Status:** Needed

## ASSET-031 — tower_machine_gun_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 4 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Sàn thép tầng 1, trống xoay có hộp động cơ tầng 2, bệ nâng xy-lanh
tầng 3 (Head trống). Ống dẫn và máng cấp đạn đồng thau ở trái; đèn nháy F0/F1.

**Art Bible Anchors:** §3 t2 (~85%, ≤ 72 px, cơ chế lộ ra); test silhouette.

**Generation Prompt:** BASE + T2 + BASE-ONLY + `idle, empty turret ring`. NEG.

**Status:** Needed

## ASSET-032 — tower_machine_gun_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp (Head SE vẽ sẵn), khung thép nổ, cụm nòng bật văng, xy-lanh gãy.
F5: sàn thép nghiêng, vòng xoay vỡ, vỏ súng nằm nghiêng; 2 tông, không viền.

**Art Bible Anchors:** §7; §3 ≤ 72 px.

**Generation Prompt:** F5 BASE + `wrecked stepped steel turret emplacement, broken hydraulic risers, rotary gun housing fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-033 — tower_machine_gun_t2_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 3 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t2_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Cụm 6 nòng trong vỏ thép, kẹp nòng, xy-lanh nâng bên dưới, băng đồng
thau dài vắt bên trái. F0/F1 nòng xoay lệch 1/12 vòng (động cơ chờ), kính lóe F0.

**Art Bible Anchors:** §3 t2 (cơ chế lộ ra, tháp pháo có động cơ).

**Generation Prompt:** BASE + T2 + HEAD + `idle, barrels slightly rotated`. NEG.

**Status:** Needed

## ASSET-034 — tower_machine_gun_t2_head_fire_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 24 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t2_head_fire_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Nòng đã quay hết tốc. Mỗi frame nòng xoay 1/6 vòng, 4 frame lặp liền
mạch. F1 chớp lớn và sinh đạn; băng đạn lắc, vỏ đạn bay F1–2, thân giật 3 px.

**Art Bible Anchors:** §3; §8.

**Generation Prompt:** BASE + T2 + HEAD + `firing, large muzzle flash, barrels mid-rotation`. NEG.

**Engine:** nhịp bắn (số phát/chu kỳ) đặt trong data, không bake vào fps. 1 điểm sinh đạn ở trục
giữa cụm nòng.

**Status:** Needed

## ASSET-035 — vfx_machine_gun_muzzle_flash

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 96×32 (ô 32×32, vẽ trong 28×28), 3 frame, ~40 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_machine_gun_muzzle_flash.png` (đổi tên từ `vfx_muzzle_flash.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Chớp ngắn hình sao dẹt hướng phải, lõi trắng, rìa hổ phách `#ff9f1c`,
không dùng `#ef5b31`. Dùng lại mọi cấp, scale đề xuất 1.0 / 1.2 / 1.5.

**Art Bible Anchors:** §8 VFX dùng lại, đổi scale; §4.

**Generation Prompt:** `muzzle flash sprite sheet, 3 frames, flat star burst pointing right, white core amber #ff9f1c edge, 32x32 cells, transparent background`.

**Status:** Needed

## ASSET-036 — vfx_machine_gun_casing

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 128×32 (ô 32×32), 4 frame, 16 fps, theo particle |
| Format | PNG RGBA32 |
| Naming | `vfx_machine_gun_casing.png` (mới) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Vỏ đạn đồng thau `#d9a441` nhỏ bật ra, xoay, rơi, nằm lại trên đất.
Code đặt hướng ngẫu nhiên và scale theo cấp.

**Art Bible Anchors:** §8 VFX tách khỏi sprite tháp; §4 đồng thau.

**Generation Prompt:** `small brass bullet casing tumbling and landing, 4 frames, cel-shaded 3 tones, indigo outline #2c2240, 32x32 cells, transparent background`.

**Engine:** trần số hạt chưa đặt (chưa có ngân sách VFX); dùng pool.

**Status:** Needed

## ASSET-037 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/MachineGun/Preview~/_preview_tower.png` (tạo mới) |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle (Head SE) và t2 đang bắn. Hàng 2: cùng ô tô
kín `#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng.

**Art Bible Anchors:** §3 test silhouette; §8 Preview~.

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-038 — ui_icon_tower_machine_gun_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_machine_gun_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Hộp thân súng + nòng dài nằm ngang bên phải trên đế chữ nhật nhỏ, nét
2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°. Nhận ra ở 32 px, khác icon cối (ống
nghiêng 45°).

**Art Bible Anchors:** §7 icon = dạng vũ khí gốc.

**Generation Prompt:** `flat monochrome UI icon, machine gun with long horizontal barrel on a small rectangular base, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

## ASSET-039 — tower_machine_gun_t2_head_fire_start

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 12 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_machine_gun_t2_head_fire_start.png` (mới) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tăng tốc quay nòng: nòng xoay chậm rồi nhanh dần qua 6 frame, chưa
bắn; ống dẫn rung nhẹ ở F4–5. F5 nối liền mạch sang `fire_loop` F0.

**Art Bible Anchors:** §3 cơ chế lộ ra; §8 (ngoại lệ công thức: start/loop tách file).

**Generation Prompt:** BASE + T2 + HEAD + `spinning up, barrels rotating with motion blur lines, no muzzle flash`. NEG.

**Engine:** độ trễ quay nòng trong data khớp 0.5 s; `fire_end` (quay chậm dần) chưa có, hỏi game-designer.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ | giữ |
| Pivot Head | Center (0.5, 0.5) | giữ | giữ |
| Head localPosition | (0, 0.171) = 22 px | (0, (m1 − 48)/128), đo từ art | (0, (m2 − 48)/128), đo từ art |
| Trần cả tháp | ≤ 40 px | ≤ 56 px | ≤ 72 px |
| Head nhô trên tâm xoay | ≤ 18 px | ≤ 56 − m1 | ≤ 72 − m2 |
| Điểm sinh đạn | 1 | 2 (MuzzleA, MuzzleB) | 1 (trục cụm nòng) |
| Frame sinh đạn | f1 | f1 → A, f5 → B | loop f1 (sau fire_start) |

- m = độ cao tâm xoay Head so với mặt đất (y = 48 px). Đề xuất art-director: m ≈ 20 / 30 / 44 px.
- Chọn hướng: `k = round(atan2(dy/0.72, dx)/45°)`; hàng S, SE, E, NE, N = k 2, 1, 0, 7, 6;
  k 3, 4, 5 dùng hàng của 1, 0, 7 với flipX.
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể.

### Điểm sinh đạn: dữ liệu

Đặt marker 1 px ở layer riêng của file nguồn; công cụ trong `tools/` xuất JSON; nạp vào một
ScriptableObject mỗi cấp:

```
TierMuzzleData { headLocalPos: Vector2;
  muzzles[5 hàng S,SE,E,NE,N][nòng]: Vector2 }   // nòng: t0=1, t1=2 (A,B), t2=1
```

Theo hệ tâm Head: `local = ((x_px − 64)/128, (y_từ_đáy_ô − 64)/128)`, đo ở frame bắn. flipX: đảo dấu x.

### Khớp frame khi nâng cấp / phá hủy

Frame cuối của `t1/t2_base_upgrade` trùng từng pixel với ghép (base idle F0 cấp đích + head
idle F0 hàng SE tại Head localPosition cấp đó). Frame đầu trùng ghép cấp trước. Destroy vẽ sẵn
Head SE của đúng cấp. Code ẩn Head thật suốt upgrade và destroy.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `MachineGun_t0` | 020–024 | 44 | 1024² sát giới hạn, dự phòng 2048² |
| `MachineGun_t1` | 025–029 | 64 | 2048² |
| `MachineGun_t2` | 030–034, 039 | 74 | 2048² |
| `MachineGun_VFX` | 035, 036 | 7 ô 32² | 128²–256² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tối đa ≈ 9 MB BC7 cho 3 atlas
tháp (ước tính). `MachineGun_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_machine_gun_base_{idle,build,destroy}.png` | Đổi tên → `..._t0_base_*` (kèm `.meta`); vẽ lại theo t0 mới |
| `tower_machine_gun_head_{idle,fire}.png` | Đổi tên → `..._t0_head_*` (kèm `.meta`) |
| `base_upgrade1/2.png`, `head_upgrade1/2.png` (+ `.meta`) | Xóa |
| `vfx_muzzle_flash.png` | Đổi tên → `vfx_machine_gun_muzzle_flash.png` (kèm `.meta`) |
| `Preview~/_preview_tower.png` | Tạo mới (hiện chưa có) |
| `README.md` | Viết lại theo template §8; sửa "Compression None" → BC7 qua atlas, "Head 22 px" → bảng theo cấp |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Nhịp bắn mỗi cấp, độ trễ quay nòng t2, có cần `fire_end`.
- Flash t2 dùng lại với scale hay cần `_t2` riêng.
- Trần particle cho vỏ đạn (chưa có ngân sách VFX).
