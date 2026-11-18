# Asset Specs — Entity: cryo-tower (Tháp làm lạnh)

> **Source**: `Assets/Art/Towers/CryoTower/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.4 (hội tụ thấu kính), §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md`
> **Status**: 17 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

Vai trò (GDD): làm chậm mọi Dị Thể Sáp trong vùng tròn, đóng băng hoàn toàn Dị Thể Sáp thấu
kính (bậc 4) và ngắt hội tụ của nó, không gây sát thương. Tháp không xoay: chỉ có lớp Base, không
Head, không flipX.

**Sợi chỉ họ làm lạnh (giữ cả 3 cấp, §3):**
1. **Dạng nguyên thủy:** vòm tròn bo cứng (cung lồi, mép dưới là một vành thẳng nằm ngang) +
   cánh tản nhiệt là tấm phẳng dựng đứng quanh vòm. Ngoại lệ bo cạnh duy nhất của roster: không
   bao giờ võng, không giọt, không phình xệ xuống dưới vành.
2. **Màu riêng:** cyan `#7fd6ff` (3 tông) chỉ nằm ở phần "vũ khí" — lỗ thông, ống làm lạnh, lõi
   phát sáng — và luôn đi kèm hình **tinh thể băng có cạnh** (stencil trên mặt trước vòm ở mọi
   cấp; §4 "luôn kèm hình"). Vỏ vòm là thép lạnh xám xanh, không trắng.
3. **Motif:** bình khí lạnh luôn ở **sau-trái**, nắp van cyan + đèn trạng thái hổ phách
   `#ff9f1c` nhỏ (ánh sáng con người). Bình là nguồn bất đối xứng duy nhất của một tháp gần đối
   xứng.

Cấp đọc bằng khối và chevron, không bằng màu (§4).

| | t0 · Tủ lạnh dã chiến | t1 · Trạm làm lạnh bát giác | t2 · Tổ hợp làm lạnh công nghiệp |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Khối nền | Ụ bao cát tròn méo, thấp, pallet gỗ ở giữa | Bệ bát giác bê tông vát cạnh, một bậc nâng, sọc vàng-đen | 3 tầng: sàn thép rộng có ống góp → trống máy nén hình trụ → cột thủy lực đỡ vòm |
| Vòm | Bán cầu thấp ~34 px cắt từ nắp đáy bình gas, vết hàn lộ, quạt điện nhỏ trên đỉnh | Bán cầu đầy ~50 px thép tán đinh, nắp thông gió tròn có vòng sáng cyan | Vòm lớn ~64 px chia múi bằng gân thép, **nâng tách khỏi thân** bởi khe lõi cyan phát sáng |
| Cánh tản nhiệt | 5 tấm két nước ô tô buộc dây quanh vòm, cao thấp không đều | Vương miện 8 cánh phẳng đều nhau quanh nửa dưới vòm | 8 lưỡi cánh cao đứng quanh trống máy nén, đỉnh cánh cao hơn vành vòm |
| Bình khí sau-trái | 1 bình gas móp, ống cao su, van cyan, đèn hổ phách buộc dây | 2 bình trong lồng thép tán đinh, ống thép cứng | Bồn cách nhiệt lớn bám sương, ống dẫn đóng tuyết nối vào trống |
| Cơ chế lộ ra | Không (đồ chắp vá) | Nắp thông gió | Pít-tông máy nén lộ qua khung trống, lõi cyan ở khe vòm |
| Vật liệu | Bao cát `#eabb5c`, gỗ, sắt vụn, dây, ống cao su | Bê tông, thép tán đinh, sọc cảnh báo | Thép cắt máy, thủy lực, ống dẫn, bồn cách nhiệt |
| Silhouette | Gò tròn thấp + bán cầu nhỏ có răng lược | Hình thang bát giác + vòm đầy đội vương miện cánh đều | Bậc thang cao + hàng cánh dựng + vòm lớn "lơ lửng" trên khe sáng |

**Lối chơi theo cấp (đề xuất, chờ GDD):** t0 theo bản mẫu README (R = 186 px, chậm còn 45%, xả
mỗi ~3 s, đóng băng thấu kính 1.5 s). t1 R ×1.15 (~214 px), chậm còn 40%, đóng băng 1.75 s. t2
R ×1.3 (~242 px), chậm còn 35%, xả mỗi ~2.4 s, đóng băng 2.0 s. Không cấp nào thêm cơ chế mới →
mọi VFX dùng lại, chỉ đổi scale (§8).

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** cyan sáng `#bdeeff` / gốc `#7fd6ff` /
tối `#3f9fcf`; thép lạnh (vỏ vòm, cánh) `#c3d0da` / `#93a8b8` / `#66798a`; hơi lạnh `#d4f1ff`
(alpha, chỉ trong anim pulse và VFX). Thép, bê tông, vàng cảnh báo dùng hex phái sinh trong
`mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Đổi cơ chế + thiết kế (yêu cầu người dùng, chờ GDD cập nhật):** tháp **phả hơi băng hình nón về
  một hướng** thay vì xả vòng làm chậm quanh tháp. Vì vậy tháp có **Head xoay 5 hướng**, nhưng **không
  phải nòng dài như súng**: đầu là vòm thép lạnh tròn, đỉnh có cửa kính lõi tinh thể băng phát sáng
  (t2: vương miện 3 tinh thể), phía trước là **miệng thổi loe ngắn và rộng có lưới**. Khi bắn, miệng
  phả ra luồng hơi băng hình nón (sương trắng-cyan, cụm hơi mềm, tinh thể lấp lánh); luồng hơi dài là
  VFX riêng, mockup vẽ phần đầu luồng để duyệt. Bệ: cùng một trống thép lạnh ở mọi cấp,
  vành phủ sương trắng, cánh tản nhiệt, bình khí sau-trái + đèn hổ phách, **cụm tinh thể băng mọc
  quanh bệ** (1 → 2 → 3 cụm, to dần). Bộ file mới: base idle/build/destroy/upgrade + head idle (2f)
  + head fire (4f loop) mỗi cấp = **15 sheet tháp** (thay 12 sheet có `base_pulse`).
  Mockup: `prototypes/tower-mockups/towers/cryo_tower.js` (v4). Các mục ASSET-091/096/100
  (`base_pulse`) và VFX `frost_ring` cần thay bằng `head_fire` + `vfx_cryo_tower_beam` khi chốt.

- **Vỏ vòm thép lạnh `#93a8b8`, bỏ bồn trắng `#f3f8fb` của README** — trắng lớn sẽ lẫn Sáp gương
  (tinh thể muối trắng), đồ trắng binh lính `#eef2f5` và nền ngày bị tẩy trắng.
- **Bỏ `#93cdd9`, `#9ff6ff`, `#8ff1ff` của README, thay bằng 3 tông cyan quanh `#7fd6ff`** —
  `#8ff1ff`/`#9ff6ff` ngả xanh lá, gần teal sửa chữa `#3fbf9f`; giữ đúng màu ngữ nghĩa §4.
- **Cyan chỉ ở diện tích nhỏ (lỗ thông, ống, lõi) và luôn kèm tinh thể có cạnh** — để cyan vẫn
  mang nghĩa "lạnh" trên toàn sân, không thành màu nền của một tháp.
- **VFX băng (`slow`, `frozen`, `frost_ring`) có viền `#2c2240` 1 px** — Sáp gương không có viền
  tím than (§5), nên viền + cyan + tinh thể có cạnh tách băng của tháp khỏi Sáp gương.
- **Cùng nhịp pulse cho cả 3 cấp: 6 frame, 8 fps (0.75 s), xả ở F2** — số liệu thời gian khớp
  bản mẫu (tích 0.25 s + xả 0.5 s); cấp cao chỉ rút ngắn idle trong data, không phải vẽ lại nhịp.
- **Vẽ lại `frost_ring` ở ô 384×288 (bán kính 180 px ở frame cuối), thay ô 256×192** — scale
  theo cấp thành 1.03 / 1.19 / 1.34 thay vì 1.55–2.02, vòng không nhòe ở t2; 5 frame = 1920 px
  vẫn ≤ 2048.
- **Đổi tên VFX theo §8: `vfx_cryo_tower_*`** — `vfx_frost_ring/slow/frozen` thiếu chủ sở hữu;
  hiện chỉ tháp làm lạnh gây chậm/đóng băng.
- **t2 vòm nâng 4 px khi pulse, idle đỉnh vòm ở 68 px** — cơ chế lộ ra (§3 t2) mà vẫn ≤ 72 px.
- **Hơi lạnh t2 thoát ngang từ khe lõi và chân cánh, không bốc lên** — đỉnh vòm đã ở 72 px, chỉ
  còn 6 px tới trần 78 px.
- **t0 theo art bible §3 (bao cát, sắt vụn), không theo README cũ (bệ bê tông tròn có sọc cảnh
  báo — thuộc t1)** — giống quyết định của Mortar.
- **Icon UI dùng vòm vát 45° (nửa bát giác), không dùng cung tròn** — giữ quy tắc icon chỉ góc
  90°/45° (§7); ở 32 px nửa bát giác vẫn đọc là vòm, không cần sửa art bible.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**CRYO-NEG (thêm sau NEG ở mọi prompt của tháp này):** `white tank, white salt crystals, teal, green-cyan, melting, dripping, sagging curves, soft blob shapes, round snowflakes, dark navy blue`

**T0:** `low round irregular improvised cryo cooler nest, ragged ring of sandbags #eabb5c, wooden pallet in the middle, squat cold-grey steel #93a8b8 hemisphere dome cut from a gas tank end cap with visible weld seam, crisp hard rounded dome edge on a straight horizontal rim, five scavenged car-radiator cooling fins strapped vertically around the dome with wire at uneven heights, small electric fan on top, hand-sprayed angular ice crystal stencil on the dome front, dented gas cylinder back-left with cyan #7fd6ff valve and small amber lamp, rubber hose, cyan glow only in vents and hose joints, about 70px wide 40px tall`

**T1:** `octagonal chamfered concrete plinth with yellow-black hazard stripes #f0b429, one raised step, full riveted cold-grey steel #93a8b8 hemisphere dome on a straight steel rim, crown of eight evenly spaced flat vertical cooling fins around the lower half of the dome, round vent cap on top with cyan #7fd6ff glow ring, angular ice crystal stencil plate on the dome front, caged pair of coolant cylinders back-left with cyan valves and amber lamp, rigid steel pipes, no sandbags, about 90px wide 56px tall`

**T2:** `three-level stepped industrial cryo plant, wide machined steel deck with pipe manifold, cylindrical compressor drum with exposed pistons behind an open steel frame, eight tall flat vertical cooling fin blades standing around the drum, large segmented cold-grey steel #93a8b8 dome with steel ribs raised on a hydraulic column above an exposed glowing cyan #7fd6ff core gap, angular ice crystal stencil on the dome front, large frosted insulated coolant tank back-left with frosted pipes and amber lamp, about 109px wide 72px tall, Stålenhag-style industrial materials`

**ICE-VFX (thêm vào prompt VFX băng):** `cyan #7fd6ff 3 tones (#bdeeff, #7fd6ff, #3f9fcf), hard-edged angular ice crystals, 1px indigo outline #2c2240, no white salt, no teal`

Chung mọi sheet (§8): 1 hàng, frame trái → phải, không padding, ≥ 2 px trong suốt sát mép ô
(trần thực tế 78 px trên mặt đất); hơi lạnh, sương chân, mảnh destroy không chạm mép. PNG RGBA32
sRGB alpha thẳng; Sprite Mode Multiple; Bilinear; tắt mipmap; tắt Read/Write; Mesh Tight; nén BC7
HQ đặt trong override Standalone của Sprite Atlas V2 (ngoại lệ None nếu vỡ khối viền). Không
Head: không có sheet 5 hướng, không flipX.

---

## ASSET-090 — tower_cryo_tower_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128 (ô 128), 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Ụ bao cát tròn thấp, pallet gỗ ở giữa đỡ bán cầu thép lạnh nhỏ cắt từ
nắp bình gas (vết hàn lộ), 5 tấm két nước buộc dây dựng quanh vòm cao thấp không đều, quạt điện
nhỏ trên đỉnh. Tinh thể băng phun sơn tay ở mặt trước vòm. Bình gas móp sau-trái, ống cao su,
van cyan, đèn hổ phách. F0 lỗ thông sáng cyan, cánh quạt ở 0°; F1 lỗ thông tối một tông, cánh
quạt 45°. Đèn hổ phách giữ sáng.

**Art Bible Anchors:**
- §3: hàng cấp 0 (~55%, ≤ 40 px, bao cát chỉ ở cấp này); vòm bo cứng, không võng
- §4: 3 tông, viền `#2c2240`; cyan kèm tinh thể

**Generation Prompt:** BASE + T0 + `idle pose`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-091 — tower_cryo_tower_t0_base_pulse

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 8 fps, 1 lần (0.75 s) |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t0_base_pulse.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0–1 tích: ống cao su và chân cánh sáng cyan từ dưới lên, quạt quay
nhanh (vệt mờ). F2 xả: vòm giật xuống 1 px, lỗ thông chớp `#bdeeff`, 3–4 mảnh tinh thể nhỏ bắn
ra quanh vành. F3–5 hơi lạnh `#d4f1ff` bốc lên ≤ 20 px trên đỉnh rồi tan, sương mỏng ở chân bao
cát; F5 = idle F0.

**Art Bible Anchors:**
- §4: lạnh = cyan + tinh thể có cạnh
- §8: hơi và sương không chạm mép; §3 thân ≤ 40 px

**Generation Prompt:** BASE + T0 + `cold pulse frame, vents flashing pale cyan, angular ice shards, cold vapour` (đổi dòng cuối theo frame). NEG + CRYO-NEG.

**Engine:** Animation Event ở F2 sinh `vfx_cryo_tower_frost_ring` (ASSET-104); code tính bán
kính sóng theo thời gian, không theo sprite.

**Status:** Needed

## ASSET-092 — tower_cryo_tower_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu. F1 nền đất, nửa sau vòng bao cát. F2 xong vòng
cát, pallet và bình gas sau-trái. F3 dựng tấm két nước, nối ống cao su. F4 thả vòm xuống vành,
quạt gắn trên đỉnh. F5 = idle F0.

**Art Bible Anchors:**
- §8: chỉ t0 có build; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-093 — tower_cryo_tower_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng. F1 vòm nứt, bình gas xì một tia hơi lạnh ngang. F2 vòm
bật nghiêng, tấm két văng, bao cát tung. F3–4 hơi lạnh và khói tan. F5 đống đổ nát: bao cát rải,
vòm nằm ngửa lệch, tấm két cong, bình gas đổ; 2 tông, không viền tím, **không còn sáng cyan**
(tháp chết). Chevron mờ và 4 dấu góc ô do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + T0 + `explosion, cold vapour burst, debris flying`; F5 BASE + `rubble of improvised sandbag cryo nest, small steel dome lying tilted, bent radiator fins, fallen gas cylinder, no glow, two-tone, no outline`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-094 — tower_cryo_tower_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t0 idle F0 bị giàn giáo thép bao quanh. F1–2 bụi che, tháo bao cát
và vòm chắp vá. F3 bệ bê tông bát giác nhô lên, lồng 2 bình khí đặt sau-trái. F4 vòm thép tán
đinh hạ xuống, vương miện 8 cánh lắp quanh. F5 = t1 idle F0. Đổi khối nền và vòm, không chồng
phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, improvised sandbag cooler replaced by octagonal concrete plinth with riveted steel dome and crown of cooling fins`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-095 — tower_cryo_tower_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bát giác bê tông có sọc vàng-đen và một bậc nâng. Bán cầu thép tán
đinh đầy ~50 px ngồi trên vành thép thẳng; 8 cánh phẳng đều nhau quanh nửa dưới vòm tạo thành
vương miện. Nắp thông gió tròn trên đỉnh có vòng sáng cyan; tấm stencil tinh thể ở mặt trước.
Lồng 2 bình khí sau-trái, đèn hổ phách. F0 vòng sáng cyan đủ, F1 tối một tông. Không bao cát.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px, bát giác có bệ)
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + `idle`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-096 — tower_cryo_tower_t1_base_pulse

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 8 fps, 1 lần (0.75 s) |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t1_base_pulse.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0–1 tích: 8 cánh sáng cyan lần lượt theo vòng (F0 nửa trước, F1 đủ 8),
lồng bình rung 1 px. F2 xả: nắp thông gió bật lên 2 px, vòng sáng chớp `#bdeeff`, mảnh tinh thể
bắn ra từ khe giữa các cánh. F3–5 hơi lạnh bốc lên ≤ 20 px rồi tan, sương chân bệ; nắp hạ về;
F5 = idle F0.

**Art Bible Anchors:**
- §3: ≤ 56 px; vòm bo cứng
- §4: cyan + tinh thể; §8 hơi không chạm mép

**Generation Prompt:** BASE + T1 + `cold pulse frame, fins glowing cyan in sequence, vent cap popped, angular ice shards, cold vapour` (đổi theo frame). NEG + CRYO-NEG.

**Engine:** Animation Event ở F2 sinh frost ring (ASSET-104), scale t1.

**Status:** Needed

## ASSET-097 — tower_cryo_tower_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, vòm nứt dọc đường tán đinh, hai bình xì hơi ngang, cánh văng ra
ngoài, bụi bê tông. F5: bệ bát giác vỡ nửa, mảnh sọc vàng còn thấy, vòm nằm nghiêng nứt đôi, vài
cánh cắm xuống đất; 2 tông, không viền, không sáng cyan.

**Art Bible Anchors:**
- §7: đống đổ nát
- §3: ≤ 56 px

**Generation Prompt:** F5 BASE + `shattered octagonal concrete plinth, hazard stripe fragments, cracked riveted steel dome on its side, scattered flat cooling fins, no glow, two-tone, no outline`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-098 — tower_cryo_tower_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t1 idle F0 bị giàn giáo che. F1–2 bụi, bệ bê tông bị phá. F3 sàn
thép tầng 1 và trống máy nén trồi lên, bồn cách nhiệt đặt sau-trái. F4 8 lưỡi cánh cao dựng
quanh trống, cột thủy lực đẩy vòm lớn lên, khe lõi bật sáng. F5 = t2 idle F0.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by stepped machined steel deck with compressor drum, tall fin blades and raised segmented dome`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-099 — tower_cryo_tower_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1 sàn thép rộng có ống góp (0–12 px). Tầng 2 trống máy nén hình trụ
(12–40 px), khung hở thấy 2 pít-tông; 8 lưỡi cánh phẳng cao dựng quanh trống, đỉnh cánh ~52 px.
Tầng 3: cột thủy lực, khe lõi cyan phát sáng (40–48 px), vòm lớn chia múi bằng gân thép
(48–68 px), stencil tinh thể mặt trước. Bồn cách nhiệt bám sương sau-trái, ống đóng tuyết, đèn hổ
phách. F0 lõi sáng đủ, pít-tông trên; F1 lõi tối một tông, pít-tông dưới 1 px.

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, ≤ 72 px, nhiều tầng, cơ chế lộ ra); test silhouette

**Generation Prompt:** BASE + T2 + `idle`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-100 — tower_cryo_tower_t2_base_pulse

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 8 fps, 1 lần (0.75 s) |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t2_base_pulse.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0–1 tích: pít-tông nén hết hành trình, ống góp và lưỡi cánh sáng cyan
từ chân lên đỉnh. F2 xả: cột thủy lực đẩy vòm lên 4 px (đỉnh vòm chạm 72 px), khe lõi mở rộng chớp
`#bdeeff`, mảnh tinh thể bắn ngang từ khe. F3–5 vòm hạ dần về 68 px, hơi lạnh thoát **ngang** từ
khe lõi và chân cánh rồi tan, sương chân sàn trong x 4–124 px; F5 = idle F0.

**Art Bible Anchors:**
- §3: cơ chế lộ ra; thân ≤ 72 px, chỉ còn 6 px tới trần 78 px
- §8: hơi, sương không chạm mép; ≤ 16 frame/hàng

**Generation Prompt:** BASE + T2 + `cold pulse frame, hydraulic column lifting dome, exposed cyan core flaring, angular ice shards, sideways cold vapour` (đổi theo frame). NEG + CRYO-NEG.

**Engine:** Animation Event ở F2 sinh frost ring (ASSET-104), scale t2. Hơi vượt trần phải làm
VFX riêng, không vẽ vào sheet.

**Status:** Needed

## ASSET-101 — tower_cryo_tower_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_cryo_tower_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, lõi tắt, cột thủy lực gãy, vòm rơi lệch xuống trống, bồn xì hơi
ngang, lưỡi cánh đổ như domino. F5: sàn thép nghiêng, trống máy nén bẹp, vòm nằm nghiêng cạnh,
lưỡi cánh rải; 2 tông, không viền, không sáng cyan.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px

**Generation Prompt:** F5 BASE + `wrecked stepped cryo plant, broken hydraulic column, dented compressor drum, large dome fallen sideways, toppled fin blades, no glow, two-tone, no outline`. NEG + CRYO-NEG.

**Status:** Needed

## ASSET-102 — vfx_cryo_tower_slow

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 96×32 (ô 32×32), 3 frame, 6 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_cryo_tower_slow.png` (đổi tên từ `vfx_slow.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** 2–3 tinh thể băng 6 cánh **có cạnh** (không phải bông tuyết tròn) bám vai
kẻ địch, xoay nhẹ và lóe `#bdeeff` lần lượt qua 3 frame. Cyan 3 tông, viền `#2c2240` 1 px. Dùng
lại mọi cấp; scale theo cỡ kẻ địch, không theo cấp tháp.

**Art Bible Anchors:**
- §4: lạnh = cyan + tinh thể có cạnh; §5: Sáp gương trắng, không viền → không lẫn

**Generation Prompt:** `small status effect sprite sheet, 3 frames, two or three angular six-point ice crystals clinging and glinting, 32x32 cells, transparent background` + ICE-VFX.

**Engine:** pivot Center, đặt trên vai kẻ địch (~(6, 30) px trên chân, theo cỡ). Con của kẻ địch
để sort theo kẻ địch.

**Status:** Needed

## ASSET-103 — vfx_cryo_tower_frozen

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 144×48 (ô 48×48), 3 frame, không fps (code giữ frame), 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_cryo_tower_frozen.png` (đổi tên từ `vfx_frozen.png`) |
| Texture Res | Bội số 32 — ngoại lệ ô 48 giữ theo file cũ (§8 yêu cầu bội số 32: xem câu hỏi mở) |

**Visual Description:** Khối băng nhiều mặt phẳng, cạnh thẳng, bọc kẻ địch từ chân. F0 tinh thể
mọc từ đất. F1 khối đầy, mặt sáng `#bdeeff` trên-trái, mặt tối `#3f9fcf`, viền `#2c2240` 1 px, lõi
hơi trong để thấy silhouette kẻ địch. F2 nứt và vỡ thành 4–5 mảnh có cạnh. Không trắng, không
tròn (khác Sáp gương và Bậc 4 thân nước).

**Art Bible Anchors:**
- §4: cyan + tinh thể; §5: Bậc 4 bán trong suốt, Sáp gương tinh thể muối trắng

**Generation Prompt:** `ice block encasing effect, 3 frames: forming from ground, solid faceted block, shattering into angular shards, flat planar faces, 48x48 cells, transparent background` + ICE-VFX.

**Engine:** pivot Custom (0.5, 0.0625), đặt ở chân kẻ địch, scale theo cỡ kẻ địch. Code dừng
animation kẻ địch và tint bằng vertex color (không MaterialPropertyBlock, §8). Thời gian F0 0.15
s / giữ F1 / F2 0.2 s trong data.

**Status:** Needed

## ASSET-104 — vfx_cryo_tower_frost_ring

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 1920×288 (ô 384×288), 5 frame, 10 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `vfx_cryo_tower_frost_ring.png` (đổi tên từ `vfx_frost_ring.png`, vẽ lại cỡ mới) |
| Texture Res | Bội số 32 — §8; bán kính x ở F4 = 180 px, ellipse 360×260, lề ≥ 12 px |

**Visual Description:** Vòng băng lan trên mặt đất, ép dẹt 0.72, nét **liền** (nét đứt dành cho
bão, §7). Mép vòng là dải tinh thể có cạnh chĩa ra ngoài, bên trong để lại lớp sương cyan mờ
`#d4f1ff`. F0 vòng nhỏ sáng nhất, F1–3 lan rộng và mỏng dần, F4 chạm bán kính 180 px và tan. Viền
`#2c2240` 1 px chỉ ở dải tinh thể. Dùng lại mọi cấp, scale theo R của cấp.

**Art Bible Anchors:**
- §4: cyan + tinh thể; §7: nét đứt dành cho bão
- §8: VFX dùng lại, chỉ đổi scale; ≤ 2048 px

**Generation Prompt:** `ground frost shockwave ring sprite sheet, 5 frames expanding outward, flat squashed ellipse 0.72, solid ring edge made of outward-pointing angular ice crystals, faint cyan frost film inside, top-down 3/4, 384x288 cells, transparent background` + ICE-VFX.

**Engine:** pivot Center, đặt ở pivot Base, sort dưới tháp và kẻ địch (lớp decal). `localScale = R
/ 180`. Vùng đóng băng/làm chậm lấy từ data, không từ sprite.

**Status:** Needed

## ASSET-105 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/CryoTower/Preview~/_preview_tower.png` |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle và t2 pulse F2. Hàng 2: cùng 4 ô tô kín
`#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng ban ngày (bản đồ 4 là nơi tháp
này ra mắt — phải đọc được trên nền trắng). Ghép thêm một ô `vfx_cryo_tower_frozen` F1 cạnh một ô
Sáp gương để kiểm tra không lẫn.

**Art Bible Anchors:**
- §3: test silhouette; §8: Preview~; §6: Đồng bằng trắng

**Generation Prompt:** không cần — ghép từ sheet đã export (không dựng bằng code).

**Status:** Needed

## ASSET-106 — ui_icon_tower_cryo_tower_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, vẽ 64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_cryo_tower_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Vòm vát 45° (nửa bát giác) trên vành thẳng, 4 cánh dọc dưới vành, đế chữ
nhật nhỏ; nét 2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°. Một icon cho mọi cấp; nhận
ra ở 32 px, khác icon cối (ống nghiêng) và súng máy (nòng ngang).

**Art Bible Anchors:**
- §7: icon = dạng vũ khí gốc, lưới 32 px, chỉ 90°/45°

**Generation Prompt:** `flat monochrome UI icon, chamfered half-octagon dome on a straight rim with four vertical cooling fins below on a small rectangular base, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Mode Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ nguyên | giữ nguyên |
| Head | không | không | không |
| Trần thân | ≤ 40 px (y ≤ 0.3125) | ≤ 56 px (y ≤ 0.4375) | ≤ 72 px (y ≤ 0.5625), idle 68 px |
| Pulse | 6f 8 fps, event F2 | 6f 8 fps, event F2 | 6f 8 fps, event F2 |
| R vùng (đề xuất) | 186 px | ~214 px | ~242 px |
| Scale frost ring (R/180) | 1.03 | 1.19 | 1.34 |
| Scale slow / frozen | theo cỡ kẻ địch | giữ | giữ |

- Vùng: `(dx / R)² + (dy / 0.72R)² ≤ 1`; R, % làm chậm, chu kỳ xả, thời gian đóng băng đặt trong
  data từng cấp (tuning knob), không vẽ vào sprite.
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể. Frost ring ở lớp decal dưới
  Y-sort, không làm con của tháp (Sorting Group sẽ nuốt).
- Không có điểm sinh đạn. Tâm phát sóng = pivot Base.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `CryoTower_t0` | 090–093 | 20 ô 128 | 1024² |
| `CryoTower_t1` | 094–097 | 20 ô 128 | 1024² |
| `CryoTower_t2` | 098–101 | 20 ô 128 | 1024² |
| `CryoTower_VFX` | 102–104 | 5 ô 384×288 + 6 ô nhỏ | 1024² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 4 MB BC7 (ước tính).
`CryoTower_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_cryo_tower_base_{idle,pulse,build,destroy}.png` | Đổi tên → `tower_cryo_tower_t0_base_*.png` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_cryo_tower_base_upgrade1.png`, `_upgrade2.png` (+ `.meta`) | Xóa |
| `vfx_frost_ring.png` | Đổi tên → `vfx_cryo_tower_frost_ring.png` (kèm `.meta`); vẽ lại ô 384×288, sửa slice |
| `vfx_slow.png`, `vfx_frozen.png` | Đổi tên → `vfx_cryo_tower_slow/frozen.png` (kèm `.meta`); vẽ lại theo màu mới |
| `_preview_tower.png` (gốc thư mục, dựng bằng code) | Xóa; tạo mới trong `Preview~/` từ sheet thật |
| `README.md` | Viết lại theo template §8; sửa màu (bỏ `#f3f8fb`, `#93cdd9`, `#9ff6ff`, `#8ff1ff`), "Compression None" → BC7 qua atlas, `localScale = R/120` → `R/180` |

### Câu hỏi còn mở (chờ GDD / game-designer)

- R, % làm chậm, chu kỳ xả và thời gian đóng băng từng cấp (số ở trên là đề xuất).
- t2 có cơ chế mới không (vd. vùng băng lưu lại)? Nếu có: thêm `vfx_cryo_tower_*_t2` từ khối ID
  còn lại (107–114).
- `vfx_cryo_tower_slow/frozen` có dùng chung cho nguồn khác (vd. Tháp phóng lưới làm chậm)? Nếu có
  → đổi thành `tower_shared_*` / chủ sở hữu chung.
- `vfx_cryo_tower_frozen` ô 48 không phải bội số 32 (§8): giữ 48 (vừa Dị Thể 64) hay nâng lên 64
  — technical-artist quyết.
- Bậc 4 thấu kính bán trong suốt dùng khúc xạ (Camera Sorting Layer Texture): khi bị đóng băng có
  tắt material khúc xạ không — technical-artist.
- Hex phái sinh cyan / thép lạnh / hơi lạnh và quy tắc "VFX băng có viền `#2c2240`" cần đưa vào
  art bible §4.
