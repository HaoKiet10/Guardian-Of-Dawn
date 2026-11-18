# Asset Specs — Entity: solvent-sprayer (Tháp phun dung môi)

> **Source**: `Assets/Art/Towers/SolventSprayer/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director; technical-artist chưa duyệt)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md` (bố cục Head / Base)
> **Status**: 20 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

| | t0 · Bình phun chắp vá | t1 · Trạm bơm hóa chất | t2 · Xưởng dung môi |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Khối nền | Ụ bao cát tròn méo, thấp | Bệ bê tông bát giác vát cạnh + gờ chắn tràn thấp | 3 tầng: sàn thép rộng, vòng xoay hình trống, chân đỡ + sàn đi vòng quanh bình |
| Bình (Base, sau-trái) | Bình thủy tinh to bụng phình trong lồng nan gỗ, cao ~34 px | Bình áp lực thép tán đinh dựng đứng, thân phình nhiều mặt, đầu vát, trên chân yên ngựa, cao ~52 px | Quả cầu áp lực mặt cắt bát giác, ghép tấm tán đinh, dựng trên vòng chân thép, đỉnh ~70 px |
| Head | Bơm tay cần gạt + ống sắt vụn 1 khúc gấp 45°, buộc dây | Hộp bơm màng kín trên mâm xoay + cổ ngỗng 2 khúc có mặt bích | Khối tháp pháo có 2 piston bơm lộ + cần phun khớp 2 đoạn với xy-lanh thủy lực |
| Vật liệu | Bao cát `#eabb5c`, ván pallet, sắt vụn, dây, ống dẫn vá | Bê tông, thép tán đinh, sọc vàng-đen | Thép cắt máy, thủy lực, ống góp có van, bánh đà |
| Silhouette | Gò tròn + cột bình phình sau-trái + gạch xiên ngắn | Hình thang bát giác + viên nang đứng sau-trái + cổ ngỗng 2 khúc | Tháp bậc thang + khối cầu bát giác trên chân + cần trục 2 khúc |

**Sợi chỉ họ phun dung môi (§3):**
1. **Bình phình dựng đứng ở sau-trái, là khối lớn nhất của tháp ở mọi cấp** (≥ 35% diện
   tích silhouette), nằm trong Base nên không xoay. Vòi là ống mảnh, đầu hẹp, gấp khúc 45°,
   miệng chếch lên ~30° (phóng vòng cầu). Khác Phun lửa: bên đó đầu thấp rộng, vòi ngắn loe
   nằm ngang, bình đỏ nằm ngang phía sau.
2. **Màu họ:** dung môi xanh acid `#a6ff4d` luôn thấy được qua dải kính thăm mức trên bình
   và ở giọt nơi miệng vòi; vỏ bình sơn xanh chai `#4a9a52`. Không dùng cam/đỏ (thuộc Phun
   lửa), không dùng teal (thuộc Sửa chữa).
3. **Motif:** nhãn hóa chất hình thoi vàng `#f0b429` viền tím than, luôn ở mặt trước bình
   (hướng người xem), ngay cạnh dải kính thăm mức thẳng đứng.

**Head / Base:** Head = bơm + vòi (xoay theo mục tiêu). Base = bình, ống cấp, khớp xoay ở
tâm, bệ và mọi thứ còn lại. Ống mềm từ bình vào khớp xoay vẽ trong Base, dừng ở mép khớp.

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 chu kỳ phun ngắn hơn (~1.6 s thay vì ~2 s),
vũng bán kính ×1.2; t2 vũng ×1.45, tồn tại 6 s thay vì 5 s. Không cấp nào thêm cơ chế mới,
nên VFX dùng lại với scale.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** dung môi sáng `#d4ff9a` / gốc
`#a6ff4d` / tối `#5fa82a`; vỏ bình xanh chai `#7cc47a` / `#4a9a52` / `#2f6b3a`. Thép, bê
tông, vàng cảnh báo dùng hex phái sinh của `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Bỏ thép sơn xanh ngọc `#35c2a4` của README cũ**, thay bằng xanh chai `#4a9a52`: `#35c2a4`
  gần như trùng teal Sửa chữa `#3fbf9f` (§4 màu ngữ nghĩa).
- **Bỏ thùng hóa chất trắng `#eef2ee`**: trùng đồ trắng binh lính `#eef2f5` và mất trên Đồng
  bằng trắng (rủi ro §5); bình xanh chai giữ tương phản cả ngày lẫn đêm.
- **Bình đặt trong Base, không trong Head** (README cũ có bình trong Head): bình là khối trội
  nhất phải đứng yên để silhouette ổn định ở mọi hướng, và đỡ tốn 5 hàng vẽ.
- **"Phình" vẽ bằng mặt cắt nhiều cạnh (45°), không bo tròn:** §3 chỉ cho tháp Làm lạnh được
  bo cạnh; bụng phình bằng đoạn thẳng giữ ngữ pháp con người và không lẫn vòm Làm lạnh.
- **Cổ ngỗng = đoạn ống thẳng nối khớp 45°**, không cong mềm: §3 cấm đường cong võng ở tháp.
- **Mọi anim `spray`: frame 0 = tư thế nghỉ** (README cũ dùng F0 = nén giữ 0.25 s): theo quy
  tắc §8; khoảng nén chuyển vào F1–2, nhịp tổng giữ gần như cũ.
- **Mỗi cấp số frame `spray` khác nhau** (6 / 6 / 8): t2 cần thêm 2 frame để piston lộ ra
  chạy hết hành trình (§3 cơ chế lộ ra).
- **Vũng vẽ một lần ở cỡ t2, scale xuống cho t0/t1** (0.69 / 0.83 / 1.0): thu nhỏ giữ nét,
  phóng to làm nhòe mép.
- **Đổi tên VFX sang chủ sở hữu đầy đủ** `vfx_solvent_sprayer_*` (§8 `vfx_<owner>_<effect>`,
  owner = tên snake của thư mục), như MachineGun đã đổi `vfx_muzzle_flash`.
- **Ngoại lệ nòng ngang (§3) áp dụng cho vòi hàng E:** thò ≤ 10 px ngoài độ chiếm ô, cách mép
  ô ≥ 2 px; chiều cao không có ngoại lệ.
- **Đống đổ nát có vệt dung môi đã tắt:** xanh tối `#2f6b3a` 2 tông, không phát sáng, không
  bọt, để không bị đọc là vũng đang gây sát thương.
- t0 theo art bible §3 (bao cát, gỗ, sắt vụn), **không** theo README cũ (bệ bê tông, sàn thép).

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**NEG-SOLVENT (thêm sau NEG):** `flamethrower, fire, flames, orange or red fuel tanks, horizontal tanks, flared nozzle, smooth rounded blobby shapes, soft curves, dripping wax, teal paint, white chemical drum`

**T0:** `low round irregular improvised solvent sprayer nest, ragged ring of sandbags #eabb5c, wooden pallet planks, rope and scrap plates, large bulging glass chemical carboy with faceted octagonal outline caged in a wooden slat crate standing at back-left as the tallest element, glowing acid green solvent #a6ff4d visible inside, yellow hazmat diamond label #f0b429 on crate front, patched hose to a central swivel, hand lever pump, scrap pipe nozzle with one 45-degree elbow tied with rope, narrow tip angled up about 30 degrees, about 70px wide 40px tall`

**T1:** `octagonal chamfered concrete plinth with yellow-black hazard stripes #f0b429 and a low concrete spill curb, tall riveted steel pressure tank with bulging faceted barrel profile and chamfered heads painted bottle green #4a9a52 on steel saddle legs at back-left as the dominant mass, vertical sight-glass strip with glowing acid green solvent #a6ff4d, yellow hazmat diamond label, enclosed diaphragm pump box on steel swivel mount, flanged gooseneck nozzle of straight segments with two 45-degree joints, narrow tip angled up about 30 degrees, no sandbags, about 90px wide 56px tall`

**T2:** `three-level stepped industrial solvent plant, wide machined steel deck, motorized turntable drum, large riveted pressure globe with faceted octagonal profile painted bottle green #4a9a52 raised on a ring of steel legs with a catwalk ring at back-left as the dominant mass, vertical sight-glass with glowing acid green solvent #a6ff4d, yellow hazmat diamond label, valve manifold, pipes and exposed flywheel, turret block with twin exposed pump pistons, articulated two-segment spray boom with hydraulic cylinder, narrow nozzle angled up about 30 degrees, about 109px wide 72px tall, Stålenhag-style industrial materials`

**HEAD (thêm cuối prompt Head):** `weapon only, no emplacement, no ground, no tank, centered, facing <direction>`.
**BASE-ONLY (thêm cuối prompt Base):** `base only, empty swivel mount`.

Head sheet: 5 hàng S, SE, E, NE, N (flipX cho SW, W, NW). Hàng S thấy miệng vòi chĩa về người
xem (ngắn nhất); hàng E vòi dài nhất; hàng N thấy lưng bơm, vòi bị thân bơm che một phần.

Chung mọi sheet: theo `mortar-assets.md` (1 hàng mỗi anim, frame trái → phải, không padding,
RGBA32 sRGB alpha thẳng, ≥ 2 px lề trong suốt, giọt/bụi/mảnh destroy không chạm mép, Bilinear,
tắt mipmap, tắt Read/Write, Mesh Tight, BC7 HQ qua override Standalone của Atlas V2, ngoại lệ
None nếu vỡ khối viền).

---

## ASSET-190 — tower_solvent_sprayer_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t0_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Ụ bao cát tròn thấp, ván pallet; sau-trái là lồng nan gỗ ôm bình thủy
tinh bụng phình nhiều cạnh, dung môi xanh acid thấy qua khe nan, nhãn thoi vàng trước lồng. Ống
vá dây nối bình vào khớp xoay trống ở tâm (Head gắn riêng). F0 có 2 bọt trong bình ở nửa dưới,
F1 bọt lên nửa trên.

**Art Bible Anchors:** §3 t0 (≤ 40 px, bao cát chỉ ở t0, gắn tay lộ thiên); §3 sợi chỉ (bình
sau-trái); §4 viền, 3 tông.

**Generation Prompt:** BASE + T0 + BASE-ONLY + `idle, bubbles in carboy`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-191 — tower_solvent_sprayer_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây. F1 nền đất, nửa sau vòng bao cát. F2 xong vòng cát, ván
lát. F3 đặt lồng gỗ và bình rỗng ở sau-trái. F4 gắn bơm tay + vòi (Head SE vẽ sẵn), dung môi
dâng trong bình. F5 = base idle F0 + head idle F0 hàng SE.

**Art Bible Anchors:** §8 chỉ t0 có build; Head SE vẽ sẵn; frame cuối = idle F0.

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string, nozzle facing southeast`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-192 — tower_solvent_sprayer_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (Head SE vẽ sẵn), F1 bình nứt, F2 bình vỡ, lồng gỗ bung,
vòi văng, F3–4 khói và bắn tóe. F5 đống đổ nát: bao cát rải, nan gỗ gãy, mảnh thủy tinh, vệt
dung môi đã tắt xanh tối `#2f6b3a`; 2 tông, không viền, không phát sáng.

**Art Bible Anchors:** §7 đống đổ nát 2 tông, mất viền; §8 destroy mỗi cấp.

**Generation Prompt:** F0–4 BASE + T0 + `glass carboy bursting, debris flying`; F5 BASE + `rubble of improvised sandbag sprayer nest, broken wooden crate, glass shards, dull dark green dried stain, two-tone, no outline, no glow`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-193 — tower_solvent_sprayer_t0_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t0_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bơm tay cần gạt bằng sắt vụn, ống sắt 1 khúc gấp 45°, chỗ nối quấn dây,
miệng hẹp chếch lên. F0 giọt xanh acid treo ở miệng vòi, F1 giọt rơi khỏi miệng.

**Art Bible Anchors:** §8 Head 5 hàng; §3 sợi chỉ (vòi gấp 45°, chếch lên); §4 màu họ ở vũ khí.

**Generation Prompt:** BASE + T0 + HEAD + `idle, drop hanging at nozzle tip`. NEG + NEG-SOLVENT.

**Engine:** Head nhô ≤ 21 px trên tâm xoay (40 − 19).

**Status:** Needed

## ASSET-194 — tower_solvent_sprayer_t0_head_spray

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 10 fps, 1 lần (0.6 s) |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t0_head_spray.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ. F1–2 cần gạt kéo lên rồi ép xuống, ống phồng nhẹ 1 px. F3 khối
dung môi vừa rời miệng vòi (phần của sprite) và sinh glob, vòi giật lùi 2 px. F4 giật về. F5 nhỏ
giọt, về gần nghỉ. Không chạm mép ô.

**Art Bible Anchors:** §8 frame 0 = nghỉ; §3 gắn tay, lộ thiên.

**Generation Prompt:** BASE + T0 + HEAD + `spraying frame, lever pumped, solvent glob leaving nozzle`. NEG + NEG-SOLVENT.

**Engine:** Animation Event sinh glob ở F3. Chu kỳ phun trong data, không bake vào fps.

**Status:** Needed

## ASSET-195 — tower_solvent_sprayer_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t0 (base idle F0 + head idle F0 SE) phủ giàn giáo. F1–2 bụi,
tháo bao cát, nhấc lồng gỗ đi. F3 bệ bát giác và gờ chắn tràn nhô lên, bình áp lực xanh chai
được hạ xuống sau-trái. F4 hộp bơm màng + cổ ngỗng lắp vào (Head SE vẽ sẵn). F5 trùng từng
pixel với ghép t1.

**Art Bible Anchors:** §1 nguyên tắc 1 (đổi khối, không thêm phụ kiện); §8 upgrade.

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, sandbag nest and crated carboy replaced by octagonal concrete plinth and tall faceted bottle green pressure tank, gooseneck nozzle facing southeast`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-196 — tower_solvent_sprayer_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bê tông bát giác sọc vàng-đen, gờ chắn tràn thấp quanh mép. Sau-trái:
bình áp lực thép tán đinh dựng đứng, thân phình nhiều mặt, đầu vát 45°, sơn xanh chai, trên chân
yên ngựa; dải kính thăm mức dọc thân, nhãn thoi vàng bên cạnh; đồng hồ áp suất đồng `#cc823f`.
Ống cấp vào khớp xoay ở tâm (Head trống). F0 bọt dưới + đèn hổ phách sáng, F1 bọt trên + đèn tắt.
Không bao cát.

**Art Bible Anchors:** §3 t1 (~70%, ≤ 56 px, giá cố định); §9 Stålenhag; §3 sợi chỉ.

**Generation Prompt:** BASE + T1 + BASE-ONLY + `idle`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-197 — tower_solvent_sprayer_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp (Head SE vẽ sẵn), bình rách mối hàn phụt tia, bê tông nứt, cổ ngỗng
văng. F5: bệ vỡ nửa, mảnh sọc vàng còn thấy, bình nằm nghiêng méo, vệt dung môi đã tắt; 2 tông,
không viền, không phát sáng.

**Art Bible Anchors:** §7; §3 ≤ 56 px.

**Generation Prompt:** F5 BASE + `shattered octagonal concrete plinth, hazard stripe fragments, ruptured faceted pressure tank lying on its side, dull dark green dried stain, two-tone, no outline, no glow`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-198 — tower_solvent_sprayer_t1_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t1_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hộp bơm màng thép tán đinh trên mâm xoay, cổ ngỗng 2 khúc thẳng nối khớp
45° có mặt bích, miệng hẹp chếch lên. F0 giọt treo ở miệng, F1 giọt rơi; đèn trạng thái nhỏ trên
hộp bơm nháy cùng nhịp.

**Art Bible Anchors:** §3 t1 (giá cố định, cỡ to hơn); §3 sợi chỉ vòi.

**Generation Prompt:** BASE + T1 + HEAD + `idle, drop hanging at nozzle tip`. NEG + NEG-SOLVENT.

**Engine:** Head nhô ≤ 28 px trên tâm xoay (56 − 28).

**Status:** Needed

## ASSET-199 — tower_solvent_sprayer_t1_head_spray

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 12 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t1_head_spray.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ. F1 nắp hộp bơm lõm vào (màng nén), cổ ngỗng căng. F2 sinh glob,
khối dung môi rời miệng vòi, vòi giật 2 px. F3 giật về, hộp rung 1 px. F4 nhỏ giọt. F5 nắp hộp
bơm bật lại, gần nghỉ. Đề xuất (phun nhanh hơn), chờ GDD.

**Art Bible Anchors:** §3; §8 frame 0 = nghỉ, không chạm mép.

**Generation Prompt:** BASE + T1 + HEAD + `spraying frame, pump compressed, solvent glob leaving nozzle`. NEG + NEG-SOLVENT.

**Engine:** Animation Event sinh glob ở F2.

**Status:** Needed

## ASSET-200 — tower_solvent_sprayer_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t1 phủ giàn giáo. F1–2 bụi, đập bệ bê tông, cẩu bình t1 đi. F3
sàn thép 3 tầng và vòng chân trồi lên, quả cầu áp lực được hạ lên chân. F4 lắp ống góp, bánh đà,
khối tháp pháo + cần phun (Head SE vẽ sẵn). F5 trùng từng pixel với ghép t2.

**Art Bible Anchors:** §1 nguyên tắc 1; §8; §3 ≤ 72 px.

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by stepped machined steel deck with raised faceted pressure globe on steel legs, spray boom facing southeast`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-201 — tower_solvent_sprayer_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 4 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1 sàn thép cắt máy rộng; tầng 2 trống xoay có hộp động cơ; sau-trái
quả cầu áp lực mặt cắt bát giác (tấm tán đinh, xanh chai) trên vòng chân thép, sàn đi vòng quanh
eo cầu, dải kính thăm mức + nhãn thoi vàng mặt trước. Ống góp có van đỏ chạy từ đáy cầu vào khớp
xoay; bánh đà lộ ở trước-phải. F0–3 bánh đà quay 1/4 vòng mỗi frame, bọt dâng trong kính, đèn hổ
phách sáng F0–1, tắt F2–3.

**Art Bible Anchors:** §3 t2 (~85%, ≤ 72 px, nhiều tầng, cơ chế lộ ra); test silhouette.

**Generation Prompt:** BASE + T2 + BASE-ONLY + `idle, flywheel mid-rotation`. NEG + NEG-SOLVENT.

**Engine:** đỉnh cầu ≤ 70 px; chỉ còn 8 px tới trần 78 px, không vẽ hơi xả trên đỉnh cầu.

**Status:** Needed

## ASSET-202 — tower_solvent_sprayer_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp (Head SE vẽ sẵn), chân thép gãy một bên, quả cầu sụp nghiêng, cần
phun bật văng, ống góp đứt phụt tia. F5: sàn thép nghiêng, cầu móp nằm trên sàn, chân gãy, vệt
dung môi đã tắt; 2 tông, không viền, không phát sáng. Tia và mảnh không chạm mép ô.

**Art Bible Anchors:** §7; §3 ≤ 72 px.

**Generation Prompt:** F5 BASE + `wrecked stepped steel solvent plant, collapsed faceted pressure globe on broken legs, snapped spray boom, dull dark green dried stain, two-tone, no outline, no glow`. NEG + NEG-SOLVENT.

**Status:** Needed

## ASSET-203 — tower_solvent_sprayer_t2_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t2_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Khối tháp pháo thép cắt máy, 2 piston bơm lộ hai bên phía sau, cần phun
khớp 2 đoạn với xy-lanh thủy lực dưới đoạn đầu, miệng vòi hẹp chếch lên. F0 giọt treo, piston
ở giữa hành trình; F1 giọt rơi, piston lệch 1 px.

**Art Bible Anchors:** §3 t2 (tháp pháo có động cơ, cơ chế lộ ra).

**Generation Prompt:** BASE + T2 + HEAD + `idle, drop hanging at nozzle tip`. NEG + NEG-SOLVENT.

**Engine:** Head nhô ≤ 30 px trên tâm xoay (72 − 42). Hàng N: Head có thể vẽ đè lên mép phải
quả cầu (Head luôn trên Base trong Sorting Group); chấp nhận, quả cầu vẫn thấy ≥ 2/3.

**Status:** Needed

## ASSET-204 — tower_solvent_sprayer_t2_head_spray

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 1024×640 (5 hàng × 8 frame), 12 fps, 1 lần (0.667 s) |
| Format | PNG RGBA32 |
| Naming | `tower_solvent_sprayer_t2_head_spray.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ. F1–2 hai piston rút về (hút), xy-lanh cần phun nén, cần hạ 2 px.
F3 piston đẩy mạnh, sinh glob to, cần giật lên. F4 piston về giữa, cần hạ về. F5–6 xả hơi nhỏ ở
khớp piston, nhỏ giọt. F7 gần nghỉ. Đề xuất (vũng to hơn), chờ GDD.

**Art Bible Anchors:** §3 cơ chế lộ ra; §8 ≤ 16 frame/hàng, không chạm mép.

**Generation Prompt:** BASE + T2 + HEAD + `spraying frame, twin pistons driving, boom recoil, large solvent glob leaving nozzle`. NEG + NEG-SOLVENT.

**Engine:** Animation Event sinh glob ở F3. Hơi xả vượt trần Head phải làm VFX riêng, không vẽ vào sheet.

**Status:** Needed

## ASSET-205 — vfx_solvent_sprayer_glob

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 96×32 (ô 32×32), 3 frame, 12 fps, loop khi bay |
| Format | PNG RGBA32 |
| Naming | `vfx_solvent_sprayer_glob.png` (đổi tên từ `vfx_solvent_glob.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Khối dung môi xanh acid hướng phải, đuôi kéo ngắn, chấm sáng `#d4ff9a`,
mép tối `#5fa82a`, viền tím than 1 px để đọc trên trời ngày. Khối căng, mép sắc, không chảy võng
như sáp. Dùng lại mọi cấp, scale 1.0 / 1.15 / 1.3 (đề xuất).

**Art Bible Anchors:** §8 VFX dùng lại, đổi scale; §4 tránh cam lửa; §3 sáp = võng (glob không võng).

**Generation Prompt:** `liquid solvent glob projectile, 3 frames, acid green #a6ff4d with light #d4ff9a highlight and dark #5fa82a edge, taut crisp shape with short tail pointing right, thin indigo outline #2c2240, 32x32 cells, transparent background`.

**Engine:** sorting layer "Projectile" như `vfx_mortar_shell`, không làm con của tháp; code xoay theo vận tốc.

**Status:** Needed

## ASSET-206 — vfx_solvent_sprayer_puddle

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 768×96 (ô 128×96), 6 frame; F0–2 10 fps 1 lần, F3–5 6 fps loop |
| Format | PNG RGBA32 |
| Naming | `vfx_solvent_sprayer_puddle.png` (đổi tên + vẽ lại từ `vfx_solvent_puddle.png`, ô cũ 128×64) |
| Texture Res | Vẽ ở cỡ t2: ellipse ~110×72 trong ô, bắn tóe cao ≤ 20 px, lề ≥ 2 px |

**Visual Description:** F0–2 chạm đất: bắn tóe hình vương miện bằng nét thẳng, lan thành vũng.
F3–5 vũng xanh acid dẹt, mép xanh chai tối `#2f6b3a` dày 2 px (đọc trên Đồng bằng trắng), bọt
nổi đổi chỗ mỗi frame (< 3 Hz mỗi bọt). Không viền tím than (không phải công trình), không ngà sáp.
Scale t0 0.69, t1 0.83, t2 1.0.

**Art Bible Anchors:** §4 màu kèm hình (bọt + mép); §7 nhấp nháy < 3 Hz; §6 Đồng bằng trắng.

**Generation Prompt:** `ground solvent puddle sprite sheet, flat squashed ellipse, acid green #a6ff4d with dark green #2f6b3a rim, crisp splash crown on impact frames, rising bubbles on loop frames, top-down 3/4, no outline, transparent background`.

**Engine:** pivot Center, lớp decal dưới mọi Y-sort; vùng tác dụng lấy từ data (ellipse 38×25 × hệ số cấp), không từ sprite; mờ dần 0.6 s cuối do code.

**Status:** Needed

## ASSET-207 — vfx_solvent_sprayer_melt

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 96×32 (ô 32×32), 3 frame, 8 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_solvent_sprayer_melt.png` (đổi tên từ `vfx_melt.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Giọt sáp ngà `#e9dfc4` chảy xuống, bọt xanh acid nhỏ, sợi khói xám. Không
viền tím than (thuộc Dị Thể). Không đổi theo cấp; code kéo giãn theo cỡ Dị Thể.

**Art Bible Anchors:** §2 nguyên tắc 2 (sáp = ngà); §3 sáp = chảy xuống.

**Generation Prompt:** `melting wax effect overlay, 3 frames, ivory wax drips #e9dfc4, small acid green bubbles #a6ff4d, thin grey smoke wisps, no outline, 32x32 cells, transparent background`.

**Engine:** hiện khi Dị Thể trong vũng và 0.5 s sau khi ra; tint theo vertex color, chung material với bầy Sáp vụn để batch.

**Status:** Needed

## ASSET-208 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/SolventSprayer/Preview~/_preview_tower.png` (chuyển từ gốc thư mục) |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle (Head SE) và t2 đang phun (F3). Hàng 2: cùng ô tô
kín `#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng. Đặt thêm cạnh preview Phun
lửa khi có, để kiểm tra hai họ không lẫn.

**Art Bible Anchors:** §3 test silhouette; §8 Preview~.

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-209 — ui_icon_tower_solvent_sprayer_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_solvent_sprayer_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Bình thân bát giác đứng (phình giữa) bên trái, vòi gấp 45° chếch lên bên
phải, một giọt hình thoi ở miệng vòi; nét 2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°.
Nhận ra ở 32 px; khác icon Phun lửa (đầu rộng, vòi ngang loe).

**Art Bible Anchors:** §7 icon = dạng vũ khí gốc.

**Generation Prompt:** `flat monochrome UI icon, upright octagonal bulging tank on the left with a nozzle bent at 45 degrees angled up to the right and a diamond droplet at the tip, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ | giữ |
| Pivot Head | Center (0.5, 0.5) | giữ | giữ |
| Head localPosition | (0, 0.148) = 19 px | (0, 0.219) = 28 px, đo lại từ art | (0, 0.328) = 42 px, đo lại từ art |
| Trần cả tháp | ≤ 40 px | ≤ 56 px | ≤ 72 px |
| Head nhô trên tâm xoay | ≤ 21 px | ≤ 28 px | ≤ 30 px |
| Đỉnh bình (Base) | ~34 px | ~52 px | ~70 px |
| Frame sinh glob | spray F3 | spray F2 | spray F3 |
| Scale glob / puddle | 1.0 / 0.69 | 1.15 / 0.83 | 1.3 / 1.0 |
| Bán kính vũng (data) | 38×25 | 46×30 (đề xuất) | 55×36 (đề xuất) |

- Chọn hướng: `k = round(atan2(dy/0.72, dx)/45°)`; hàng S, SE, E, NE, N = k 2, 1, 0, 7, 6; k 3, 4, 5
  dùng hàng của 1, 0, 7 với flipX.
- Điểm sinh glob: marker 1 px ở layer riêng file nguồn, xuất JSON bằng công cụ trong `tools/`, nạp
  vào `TierMuzzleData` (định nghĩa trong `machine-gun-assets.md`, 1 miệng vòi mỗi cấp). Thay giá trị
  cố định "47 px, cao 19 px" của README cũ.
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể; glob ở layer Projectile; vũng ở
  decal dưới Y-sort.

### Khớp frame khi nâng cấp / phá hủy

Như `machine-gun-assets.md`: frame cuối `t1/t2_base_upgrade` trùng từng pixel với ghép (base idle F0
cấp đích + head idle F0 hàng SE tại Head localPosition cấp đó); frame đầu trùng ghép cấp trước.
Build/destroy vẽ sẵn Head SE đúng cấp; code ẩn Head thật suốt build, upgrade, destroy.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `SolventSprayer_t0` | 190–194 | 54 | 1024² nếu Mesh Tight đủ, dự phòng 2048² |
| `SolventSprayer_t1` | 195–199 | 54 | 1024² nếu Mesh Tight đủ, dự phòng 2048² |
| `SolventSprayer_t2` | 200–204 | 68 | 2048² |
| `SolventSprayer_VFX` | 205–207 | 6 ô 32² + 6 ô 128×96 | 512² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 6–9 MB BC7 (ước tính).
`SolventSprayer_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`. Số sheet tháp = 12 + 3×1 = 15
(A = 1: head spray), đúng công thức §8.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_solvent_sprayer_base_{idle,build,destroy}.png` | Đổi tên → `..._t0_base_*` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_solvent_sprayer_head_{idle,spray}.png` | Đổi tên → `..._t0_head_*` (kèm `.meta`); vẽ lại (spray 4 → 6 frame, F0 = nghỉ) |
| `base_upgrade1/2.png`, `head_upgrade1/2.png` (+ `.meta`) | Xóa |
| `vfx_solvent_glob.png`, `vfx_melt.png` | Đổi tên → `vfx_solvent_sprayer_glob/melt.png` (kèm `.meta`) |
| `vfx_solvent_puddle.png` | Đổi tên → `vfx_solvent_sprayer_puddle.png`; vẽ lại ô 128×96 ở cỡ t2 |
| `_preview_tower.png` (gốc thư mục) | Chuyển vào `Preview~/` |
| `README.md` | Viết lại theo template §8; bỏ `#35c2a4` và thùng trắng `#eef2ee`; sửa "Compression None" → BC7 qua atlas; Head localPosition → bảng theo cấp; bình chuyển từ Head sang Base |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Chu kỳ phun, bán kính và thời gian sống vũng mỗi cấp (đề xuất ở trên).
- Vũng chồng nhau có cộng dồn sát thương/tan giáp không (ảnh hưởng số vũng tối đa cùng lúc và
  ngân sách overdraw decal).
- Art bible §4 cần bổ sung hex họ phun dung môi và cặp mù màu "dung môi xanh acid / lửa cam" (deutan).
- Kiểm tra lại khi viết spec Phun lửa: hai preview đặt cạnh nhau phải phân biệt trong < 1 s.
