# Asset Specs — Entity: fortifier (Tháp gia cố)

> **Source**: `Assets/Art/Towers/Fortifier/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md`
> **Status**: 21 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

Vai trò: hỗ trợ, không gây sát thương. Từ vựng roster (§3): **thấp, rộng, đối xứng, gần
phẳng** ở cả 3 cấp. Quy tắc đo: tỉ lệ rộng / cao (thân + nền, tính cả ngàm) ≥ 1.6 ở mọi cấp, trục
đối xứng dọc qua tâm ô. Cấp vẫn đổi khối nền, độ chiếm ô và chiều cao (§1 nguyên tắc 1); không
cấp nào lên bằng cách thêm phụ kiện.

**Sợi chỉ họ gia cố (giữ cả 3 cấp, §3):**
1. **Dạng nguyên thủy và góc của "vũ khí":** ngàm cờ lê mở (hàm chữ U, vát 45°) dựng **thẳng
   đứng 90°**, miệng ngàm hướng lên trời, đặt đối xứng qua trục giữa (t0: 1 ngàm ở giữa; t1: 2
   ngàm đối xứng; t2: 2 ngàm đối xứng trên giàn). Đây là nơi phát tia sửa. Hai vai có **thanh
   chống chéo 45° hướng xuống ra ngoài** (dáng `/‾‾\`), vật liệu đổi theo cấp.
2. **Màu riêng trên "vũ khí":** teal sửa chữa `#3fbf9f` (3 tông) chỉ sơn trên ngàm cờ lê và tay
   đỡ ngàm. Thân dùng thép/bê tông/gỗ theo cấp; không mảng teal lớn trên thân.
3. **Motif cùng vị trí:** chồng tấm thép vá dự phòng luôn ở **trước-trái**, có đèn làm việc hổ
   phách `#ff9f1c` (t0 tấm tôn buộc dây, t1 giá thép có kẹp, t2 khay nạp tấm tự động). Motif nhỏ,
   không phá đối xứng silhouette.

Cấp đọc bằng khối và chevron, không bằng màu (§4). Ánh sáng teal (phát sáng) chỉ xuất hiện khi
đang sửa (`repair_loop`, `repair_pulse`) và trong VFX; khi idle đèn chờ là hổ phách.

| | t0 · Trạm vá dã chiến | t1 · Xưởng gia cố | t2 · Giàn gia cố công nghiệp |
|---|---|---|---|
| Chiếm ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px (thân ~26, đỉnh ngàm ~36) | ~90 px (70%) / ≤ 56 px (mái ~36, đỉnh ngàm ~52) | ~109 px (85%) / ≤ 72 px (xà giàn ~58, đỉnh ngàm ~68) |
| Khối nền | Vệt nền tròn méo, thấp: sàn pallet dẹt ép trên một vòng bao cát lùn | Bệ bê tông chữ nhật vát góc 45° một bậc, trên đó xưởng hộp mái bằng thấp | 3 tầng: sàn thép rộng có 4 chân chống thủy lực xòe 45° → khung cổng chữ Π bắc ngang hết sàn → xe trượt ép tấm ở giữa xà |
| Vật liệu | Bao cát `#eabb5c`, ván pallet, 2 ngựa gỗ kê bàn, tôn vụn, dây, bình ắc-quy xe | Bê tông, thép tán đinh, sọc vàng-đen `#f0b429`, cửa cuốn thấp | Thép cắt máy, xy-lanh thủy lực, ống dẫn, hộp tụ, ray trượt |
| Vũ khí (ngàm teal) | 1 ngàm cờ lê hàn chế trên ống nước, đấu dây vào ắc-quy | 2 ngàm đúc trên 2 cột thép tán đinh ở hai góc mái | 2 ngàm lớn trên đầu 2 cột giàn + đầu ép tấm vá trên xe trượt (cơ chế lộ ra) |
| Thanh chống vai | 2 tấm tôn dựng chéo 45°, chèn bao cát | 2 giằng thép tán đinh 45° tì vào bệ | 4 chân chống thủy lực 45° tì xuống đất (2 trước, 2 sau, nhìn thấy cả 4) |
| Motif trước-trái | Chồng tôn buộc dây + đèn kẹp | Giá thép đứng có kẹp tấm + đèn lồng sắt | Khay nạp tấm tự động nối ray + đèn xoay |
| Silhouette | Gò dẹt + 1 chấm đứng ở giữa | Hình thang dẹt có 2 vai chéo + 2 sừng đối xứng | Chữ Π rộng trên bệ bậc thang + 4 chân xòe |

**Lối chơi theo cấp (đề xuất, chờ GDD):** t0 một tia sửa vào đoạn tường máu thấp nhất trong
vùng + khiên. t1 hai tia, sửa đồng thời 2 đoạn thấp nhất. t2 hai tia + "tấm vá khẩn": ở mỗi đợt
gia cố (4 s), đoạn nào dưới ngưỡng (đề xuất 25%) được ép một tấm vá cộng máu ngay. Giảm sát thương
của khiên tăng theo cấp (đề xuất 30/40/50%), nhưng hình khiên giữ nguyên ở mọi cấp. R19 "Pháo đài
cuối" tăng tốc sửa là nghiên cứu, không phải cấp: không đổi sprite.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** teal sáng `#7fdcc0` / gốc `#3fbf9f` /
tối `#2a8a72`; lõi tia/khiên trắng-teal `#d8fff4`. Thép, bê tông, vàng cảnh báo dùng bộ hex phái
sinh đã đề xuất trong `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Đọc bằng biểu tượng, không bằng máy móc thật (quyết định của người dùng, thay thế "ngàm cờ
  lê" bên dưới):** trên đỉnh tháp là **cờ lê** (= sửa chữa) và **khiên** (= giảm sát thương tường).
  Biểu tượng lớn dần theo cấp: t0 một biển cờ lê trên cột · t1 khiên + cờ lê chéo trên mái xưởng ·
  t2 khiên lớn + 2 cờ lê bắt chéo trên xà giàn. Teal nằm trên cờ lê và vành khiên, phát sáng khi
  đang sửa. Bệ vẫn đổi khối theo cấp. Mockup: `prototypes/tower-mockups/towers/fortifier.js`.

- **Màu họ = teal sửa chữa `#3fbf9f`**, thay `#3fc79a` của README (gần trùng, giữ một mã duy nhất
  cho nghĩa "sửa chữa", §4).
- **Bỏ xanh lục phát sáng `#7dffb8`**: tia, vòng, khiên dùng teal sáng `#7fdcc0` + lõi `#d8fff4`.
  Lý do: một nghĩa một màu; hai sắc xanh-lục khác nhau làm loãng tín hiệu sửa chữa.
- **Teal chỉ trên ngàm và tay đỡ**, không sơn cả nhà xưởng như README. Lý do: §3 sợi chỉ 2 (màu
  riêng nằm trên vũ khí) và tránh nghĩa "sửa chữa" phủ cả thân tháp.
- **Vàng cột/khớp `#ffcc33` → vàng cảnh báo `#f0b429`**, chỉ ở t1–t2 (sọc vàng-đen). Lý do: thống
  nhất với cối/súng máy.
- **Đèn chờ khi idle là hổ phách, không phải teal.** Lý do: teal phát sáng phải nghĩa là "đang
  sửa"; người chơi nhìn tháp là biết có đang làm việc không.
- **Silhouette theo art bible §3 (thấp, rộng, đối xứng), không theo README ("trạm kỹ thuật cao hơn
  rộng 86 × 100 px", cánh tay gập lệch phải).** Lý do: art bible là nguồn ràng buộc; README cũ vượt
  trần 40 px của t0.
- **t0: nền tròn méo nằm ở dấu chân (vòng bao cát lùn), silhouette dẹt hình thang.** Lý do: thỏa cả
  hàng cấp 0 (§3 "tròn, không đều, thấp") lẫn từ vựng roster "gần phẳng"; khác hẳn gò bao cát của
  cối và súng máy t0.
- **Khiên tường đổi họa tiết lục giác → lưới giằng chéo 45°.** Lý do: lục giác dùng góc 60/120°,
  ngoài ngữ pháp con người 90°/45° (§3); giằng chéo đọc là "gia cố".
- **Không có Head, tháp không xoay** (giữ như README). Công thức §8: 9 + 3 × 2 (repair_loop,
  repair_pulse) = **15 sheet tháp**.
- **t2 repair_loop: 6 frame 12 fps (768×128)** thay 4 frame, vì xe trượt chạy qua lại trên xà cần
  thêm frame. Vẫn 1 file, không phải ngoại lệ công thức.
- **"Tấm vá khẩn" t2 trùng nhịp với đợt gia cố**, không có anim tháp riêng. Lý do: không thêm sheet;
  `repair_pulse` t2 đã có cú ép của xe trượt. Cơ chế mới nên có VFX riêng `_t2` (§8).
- **VFX đổi tên** `vfx_repair_beam/spark`, `vfx_wall_shield` → `vfx_fortifier_*`. Lý do: mẫu
  `vfx_<owner>_<effect>` (§8), như tiền lệ `vfx_machine_gun_muzzle_flash`.
- **Vòng sáng lan ra hết vùng khi gia cố vẫn do code vẽ** (như README), không làm sheet.

## Prompt nền

**BASE / NEG:** dùng nguyên văn từ `mortar-assets.md`.

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**NEG thêm cho họ gia cố:** `gun barrel, cannon, weapon, tall tower, asymmetric crane arm, hexagon pattern, curved sagging shapes`

**T0:** `low wide flat symmetric improvised field repair station, irregular oval footprint of squat sandbags #eabb5c, flat wooden pallet deck on two sawhorses, two scrap tin sheets leaning at 45 degrees on both shoulders, one hand-welded open-end wrench jaw painted teal #3fbf9f standing vertical on a short water-pipe mast at center, wired to a car battery, stack of scrap patch plates tied with rope front-left with clip-on amber work lamp, about 70px wide 36px tall, wider than tall`

**T1:** `low wide symmetric engineered repair workshop, chamfered rectangular concrete plinth one step high with yellow-black hazard stripes #f0b429, low flat-roofed riveted steel workshop box with short roll-up door, two riveted steel diagonal braces at 45 degrees on both shoulders, two cast open-end wrench jaws painted teal #3fbf9f standing vertical on riveted steel posts at both roof corners, mirrored, standing steel rack of patch plates with clamps front-left with amber cage lamp, no sandbags, about 90px wide 52px tall, wider than tall`

**T2:** `low wide symmetric three-level industrial reinforcement gantry, wide machined steel deck with four hydraulic outrigger legs splayed at 45 degrees, flat portal gantry frame spanning the whole deck like a wide Pi shape, sliding trolley with patch-plate press head on the gantry beam, two large open-end wrench jaws painted teal #3fbf9f standing vertical on top of the gantry posts, mirrored, hydraulic cylinders, pipes, capacitor housing, automatic patch-plate feeder tray front-left with rotating amber lamp, about 109px wide 68px tall, wider than tall, Stålenhag-style industrial materials`

**REPAIR (thêm cuối prompt anim sửa):** `wrench jaws glowing teal #7fdcc0 with white-teal core #d8fff4, small sparks, glow stays inside the jaws`.

Chung mọi sheet (§8): 1 hàng, frame trái → phải, không padding, ≥ 2 px trong suốt sát mép ô
(trần thực tế 78 px trên mặt đất); tia lửa, bụi, mảnh destroy không chạm mép. Không vẽ tia sửa,
khiên, tia lửa trên tường hay vòng gia cố vào sheet tháp. PNG RGBA32 sRGB alpha thẳng; Sprite Mode
Multiple; Bilinear; tắt mipmap; tắt Read/Write; Mesh Tight; nén BC7 HQ trong override Standalone
của Sprite Atlas V2 (ngoại lệ None nếu vỡ khối viền).

---

## ASSET-065 — tower_fortifier_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128 (ô 128), 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Vệt bao cát lùn hình oval méo ôm một sàn pallet dẹt kê trên 2 ngựa gỗ. Hai
tấm tôn dựng chéo 45° ở hai vai, chân chèn bao cát. Giữa trục: ống nước ngắn đội ngàm cờ lê teal
hàn chế, dây điện vắt xuống bình ắc-quy dưới bàn. Trước-trái: chồng tôn vá buộc dây, đèn kẹp hổ
phách. F0 đèn kẹp sáng, F1 tắt; ngàm không phát sáng. Rộng ~70, đỉnh ngàm ~36 px.

**Art Bible Anchors:**
- §3: hàng cấp 0 (≤ 40 px, bao cát chỉ ở cấp này); roster hỗ trợ = thấp, rộng, đối xứng
- §4: 3 tông, viền `#2c2240`; teal = sửa chữa + hình cờ lê

**Generation Prompt:** BASE + T0 + `idle, wrench jaw unlit, amber work lamp on`. NEG + NEG họ gia cố.

**Status:** Needed

## ASSET-066 — tower_fortifier_t0_base_repair_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 8 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t0_base_repair_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Ngàm sáng teal. F0 ngàm sáng vừa. F1 hai càng ngàm khép vào 1 px, lõi
trắng-teal, 2–3 tia lửa nhỏ bật ra trong 6 px quanh ngàm. F2 sáng nhất, dây điện rung 1 px. F3 về
sáng vừa, nối liền F0. Đèn hổ phách giữ sáng. Không vẽ tia sửa (VFX riêng).

**Art Bible Anchors:**
- §4: teal chỉ phát sáng khi đang sửa; §7: nhấp nháy < 3 Hz (chu kỳ sáng 2 Hz)
- §3: ≤ 40 px kể cả tia lửa

**Generation Prompt:** BASE + T0 + REPAIR + `frame N of 4`. NEG + NEG họ gia cố.

**Engine:** tia sửa bật/tắt theo trạng thái, không theo frame.

**Status:** Needed

## ASSET-067 — tower_fortifier_t0_base_repair_pulse

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 10 fps, 1 lần (0.4 s) |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t0_base_repair_pulse.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 ngàm bùng trắng-teal, hai tấm tôn vai rung 1 px. F1 vòng sáng nhỏ dẹt
0.72 bung ra trên sàn (bán kính ≤ 30 px, không chạm mép ô), ống mast giật xuống 2 px. F2 vòng mờ
dần, mast về. F3 = trạng thái `repair_loop` F0.

**Art Bible Anchors:**
- §7: chớp ≤ 3 lần/giây (mỗi 4 s một lần)
- §8: vòng lớn hết vùng do code vẽ, không vẽ vào sheet

**Generation Prompt:** BASE + T0 + REPAIR + `pulse burst, small flat teal ring on the deck, frame N of 4`. NEG + NEG họ gia cố.

**Engine:** Animation Event ở F0 kích hoạt vòng code + alpha khiên 100% trong 0.5 s.

**Status:** Needed

## ASSET-068 — tower_fortifier_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu oval. F1 hàng bao cát lùn sau. F2 hai ngựa gỗ và sàn
pallet. F3 hai tấm tôn dựng chéo, bao cát trước. F4 ống mast + ngàm cờ lê, ắc-quy, chồng tôn vá. F5
= idle F0.

**Art Bible Anchors:**
- §8: chỉ t0 có build; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string`. NEG + NEG họ gia cố.

**Status:** Needed

## ASSET-069 — tower_fortifier_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng, F1 ngàm tắt và tóe tia lửa, F2 tôn vai bật ngửa và bao cát
tung, F3–4 khói. F5 đống đổ nát: sàn pallet gãy đôi, tấm tôn nằm phẳng, ngàm cờ lê nằm nghiêng, ắc-quy
lật; 2 tông, không viền tím. Chevron mờ, 4 dấu góc và icon cờ lê xây lại do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + T0 + `explosion, debris flying`; F5 BASE + `rubble of improvised repair station, broken pallet deck, flattened tin sheets, wrench jaw lying on its side, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-070 — tower_fortifier_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t0 idle F0 phủ giàn giáo thép. F1–2 bụi che, tháo bao cát và pallet.
F3 bệ bê tông chữ nhật vát góc nhô lên, rộng hơn hẳn t0. F4 hộp xưởng mái bằng và 2 giằng vai lắp
vào, 2 cột ngàm dựng ở góc mái. F5 = t1 idle F0. Đổi khối nền, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, improvised pallet repair station replaced by low chamfered concrete plinth with flat-roofed steel workshop`. NEG + NEG họ gia cố.

**Status:** Needed

## ASSET-071 — tower_fortifier_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bê tông chữ nhật vát góc 45°, mép sọc vàng-đen. Trên bệ: xưởng hộp thép
tán đinh mái bằng, cửa cuốn thấp ở mặt trước. Hai giằng thép 45° tì từ mép mái xuống bệ ở hai vai.
Hai cột thép ở hai góc mái đội 2 ngàm teal đối xứng (dáng "hai sừng"). Trước-trái: giá thép đứng kẹp
tấm vá, đèn lồng hổ phách nháy F0/F1. Rộng ~90, đỉnh ngàm ~52 px.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px); roster hỗ trợ đối xứng
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + `idle, wrench jaws unlit, amber lamp on`. NEG + NEG họ gia cố.

**Status:** Needed

## ASSET-072 — tower_fortifier_t1_base_repair_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 8 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t1_base_repair_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hai ngàm sáng teal, so le: F0 ngàm A (trái) sáng nhất, B vừa; F1 A khép 1 px
+ tia lửa; F2 B sáng nhất, A vừa; F3 B khép + tia lửa, nối F0. Cửa cuốn hé 2 px để lộ ánh hổ phách
bên trong (xưởng đang chạy). Đề xuất (2 tia), chờ GDD.

**Art Bible Anchors:**
- §4: teal chỉ sáng khi sửa; §7: < 3 Hz
- §3: ≤ 56 px kể cả tia lửa

**Generation Prompt:** BASE + T1 + REPAIR + `left jaw brightest` (F2 đổi `right jaw`). NEG + NEG họ gia cố.

**Engine:** 2 tia từ BeamOriginA/B; khi chỉ còn 1 đoạn hỏng thì chỉ bật tia A, sprite giữ nguyên.

**Status:** Needed

## ASSET-073 — tower_fortifier_t1_base_repair_pulse

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 10 fps, 1 lần (0.4 s) |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t1_base_repair_pulse.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cả 2 ngàm bùng trắng-teal cùng lúc, giằng vai rung 1 px. F1 vòng sáng dẹt
quanh bệ (≤ 40 px bán kính), sọc vàng-đen lóe teal phản chiếu. F2 tan dần. F3 = `repair_loop` F0.

**Art Bible Anchors:**
- §7: chớp ≤ 3/s; §8 vòng lớn do code

**Generation Prompt:** BASE + T1 + REPAIR + `pulse burst, both jaws flare, flat teal ring around plinth, frame N of 4`. NEG + NEG họ gia cố.

**Engine:** Animation Event F0 như ASSET-067.

**Status:** Needed

## ASSET-074 — tower_fortifier_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, mái xưởng bật lên, 2 cột ngàm gãy, bụi. F5: bệ bê tông vỡ nửa, mảnh
sọc vàng còn thấy, hộp xưởng sụp phẳng, một ngàm nằm nghiêng, cửa cuốn cong; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 56 px

**Generation Prompt:** F5 BASE + `collapsed flat-roofed steel workshop on cracked chamfered concrete plinth, hazard stripe fragments, wrench jaw fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-075 — tower_fortifier_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t1 idle F0 phủ giàn giáo. F1–2 bụi, tháo xưởng hộp và bệ bê tông. F3 sàn
thép rộng hạ xuống, 4 chân chống thủy lực xòe ra tì đất. F4 khung cổng chữ Π dựng lên, xe trượt lắp
vào xà, 2 ngàm lớn đặt lên đầu cột. F5 = t2 idle F0.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete workshop replaced by wide machined steel deck with hydraulic outriggers and portal gantry frame`. NEG + NEG họ gia cố.

**Status:** Needed

## ASSET-076 — tower_fortifier_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1: sàn thép cắt máy rộng ~109 px, mép sọc vàng-đen, 4 chân chống thủy
lực xòe 45° (2 trước thấy rõ, 2 sau ló sau sàn). Tầng 2: khung cổng chữ Π bắc ngang hết sàn, hai cột
có xy-lanh và ống dẫn chạy dọc, hộp tụ dưới xà. Tầng 3: xe trượt đỗ ở giữa xà với đầu ép tấm vá (cơ
chế lộ ra); 2 ngàm teal lớn trên đầu 2 cột. Trước-trái: khay nạp tấm tự động nối ray, đèn xoay hổ
phách F0 sáng / F1 tắt. Rộng ~109, xà ~58, đỉnh ngàm ~68 px. Mặt trên xà phẳng: đây là "gần phẳng"
của t2.

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, ≤ 72 px, nhiều tầng, cơ chế lộ ra); test silhouette
- §8: t2 72 px che hàng ô sau — chọn tháp theo ô

**Generation Prompt:** BASE + T2 + `idle, wrench jaws unlit, trolley parked at center, amber lamp on`. NEG + NEG họ gia cố.

**Status:** Needed

## ASSET-077 — tower_fortifier_t2_base_repair_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 12 fps, loop (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t2_base_repair_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hai ngàm sáng teal so le như t1 (A sáng F0–1, B sáng F3–4, tia lửa F1 và F4).
Xe trượt chạy qua lại trên xà: giữa F0 → trái 12 px F1–2 → giữa F3 → phải 12 px F4–5, nối F0. Xy-lanh
cột co giãn 1 px theo nhịp; ống dẫn rung nhẹ. Đề xuất, chờ GDD.

**Art Bible Anchors:**
- §3: cơ chế lộ ra; §7: < 3 Hz
- §8: ≤ 16 frame/hàng; đỉnh ngàm 68 px + tia lửa ≤ 78 px

**Generation Prompt:** BASE + T2 + REPAIR + `gantry trolley sliding, frame N of 6`. NEG + NEG họ gia cố.

**Engine:** 2 tia từ BeamOriginA/B (đầu 2 cột), không từ xe trượt.

**Status:** Needed

## ASSET-078 — tower_fortifier_t2_base_repair_pulse

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 10 fps, 1 lần (0.4 s) |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t2_base_repair_pulse.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 hai ngàm bùng trắng-teal, xe trượt về giữa. F1 đầu ép dập xuống 6 px, xy-lanh
nén, 4 chân chống lún 1 px, vòng sáng dẹt quanh sàn (≤ 50 px bán kính, không chạm mép). F2 đầu ép
nâng lên, hơi xả nhỏ từ ống dẫn. F3 = `repair_loop` F0. Đề xuất (tấm vá khẩn), chờ GDD.

**Art Bible Anchors:**
- §3: cơ chế lộ ra; §7: chớp ≤ 3/s; §8 vòng lớn do code

**Generation Prompt:** BASE + T2 + REPAIR + `pulse burst, press head stamping down, hydraulic cylinders compressed, flat teal ring around deck, frame N of 4`. NEG + NEG họ gia cố.

**Engine:** Animation Event F1 kích hoạt vòng code, alpha khiên 100%, và `vfx_fortifier_patch_plate_t2` trên các đoạn dưới ngưỡng.

**Status:** Needed

## ASSET-079 — tower_fortifier_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_fortifier_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, xà giàn gãy giữa, xe trượt rơi, chân chống bật. F5: sàn thép nghiêng,
khung Π gập chữ V, 2 ngàm nằm nghiêng, xy-lanh gãy; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px

**Generation Prompt:** F5 BASE + `wrecked steel deck, portal gantry collapsed into a V, broken hydraulic outriggers, wrench jaws fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-080 — vfx_fortifier_repair_beam

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×16 (ô 64×16), 3 frame, 12 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_fortifier_repair_beam.png` (đổi tên từ `vfx_repair_beam.png`) |
| Texture Res | Bội số 16/32; lát ngang được, chu kỳ 32 px |

**Visual Description:** Tia thẳng dày 6 px, lõi `#d8fff4`, rìa teal `#7fdcc0`, viền mỏng `#2a8a72`;
các vạch chéo 45° chạy dọc tia (không dùng sóng cong). Dùng lại mọi cấp; scale độ dày 1.0 / 1.0 /
1.25. t1–t2 code sinh 2 tia.

**Art Bible Anchors:**
- §4: teal = sửa chữa; §3 không đường cong võng
- §8: VFX dùng lại, đổi scale

**Generation Prompt:** `tileable straight repair beam segment, 64x16 cells, 3 frames, white-teal core #d8fff4, teal #7fdcc0 edge, dark teal #2a8a72 rim, 45 degree diagonal tick marks moving along the beam, no waves, transparent background`.

**Engine:** Draw Mode Tiled, gốc ở BeamOrigin, xoay theo góc thật tới tường; vẽ trên lớp tường.

**Status:** Needed

## ASSET-081 — vfx_fortifier_repair_spark

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 128×32 (ô 32×32), 4 frame, 12 fps, 1 lần (lặp khi tia bật) |
| Format | PNG RGBA32 |
| Naming | `vfx_fortifier_repair_spark.png` (đổi tên từ `vfx_repair_spark.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** F0 chớp teal nhỏ ở điểm chạm, F1 tia lửa thẳng bắn 45°, F2 icon cờ lê teal
(viền `#2c2240`) bật lên 6 px, F3 cờ lê mờ. Cờ lê là hình đi kèm bắt buộc của màu teal (§4, phân biệt
với đỏ nguy hiểm / cyan lạnh). Scale 1.0 / 1.0 / 1.25.

**Art Bible Anchors:**
- §4: teal + icon cờ lê; bảng mù màu deutan/tritan

**Generation Prompt:** `small repair impact sprite, 4 frames, teal #3fbf9f flash, straight sparks at 45 degrees, small wrench icon popping up with indigo outline #2c2240, 32x32 cells, transparent background`.

**Engine:** đáy ô chạm mép tường, tại điểm tia chạm.

**Status:** Needed

## ASSET-082 — vfx_fortifier_wall_shield

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×48 (ô 64×48), 3 frame, 6 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_fortifier_wall_shield.png` (đổi tên từ `vfx_wall_shield.png`) |
| Texture Res | Lát ngang được theo đoạn tường |

**Visual Description:** Màn chắn mờ dựng trên mặt tường: lưới giằng chéo 45° (hình thoi/chữ X, như
khung giằng thép), nét teal `#7fdcc0` alpha ~35%, mép trên là thanh ngang đặc hơn. Ánh sáng chạy chéo
qua lưới qua 3 frame. Không lục giác. Giống nhau ở mọi cấp (không đổi màu/alpha theo cấp).

**Art Bible Anchors:**
- §3: ngữ pháp 90°/45°; §4: cấp không báo bằng màu

**Generation Prompt:** `tileable translucent wall reinforcement shield, 64x48 cells, 3 frames, 45 degree diagonal cross-brace lattice, teal #7fdcc0 lines at low opacity, solid top bar, light sweep moving diagonally, no hexagons, transparent background`.

**Engine:** Draw Mode Tiled theo chiều dài đoạn tường, đáy ô ngang mặt trên tường; alpha nền do code, 100% trong 0.5 s sau đợt gia cố.

**Status:** Needed

## ASSET-083 — vfx_fortifier_patch_plate_t2

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 384×64 (ô 64×64), 6 frame, 12 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `vfx_fortifier_patch_plate_t2.png` (mới) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Tấm vá thép chữ nhật vát góc, viền teal, 4 đinh tán. F0 tấm rơi từ trên, F1
dập vào tường + chớp teal, F2 4 đinh tán lóe lần lượt, F3 cờ lê teal bật lên, F4–5 tấm mờ dần vào
tường. Đề xuất, chờ GDD.

**Art Bible Anchors:**
- §8: VFX `_t<N>` khi cấp có cơ chế mới (tấm vá khẩn t2)
- §4: teal + cờ lê

**Generation Prompt:** `steel patch plate slamming onto a wall segment, 6 frames, chamfered rectangle with four rivets, teal #3fbf9f rim, teal flash on impact, small wrench icon pops up, cel-shaded 3 tones, indigo outline #2c2240, 64x64 cells, transparent background`.

**Engine:** đặt ở tâm đoạn tường dưới ngưỡng, kích hoạt từ sự kiện ASSET-078 F1.

**Status:** Needed

## ASSET-084 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/Fortifier/Preview~/_preview_tower.png` |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle và t2 `repair_pulse` F1. Hàng 2: cùng 4 ô tô kín
`#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng ban ngày. Kiểm thêm: tỉ lệ rộng/cao
≥ 1.6 và đối xứng ở cả 3 cấp; đặt cạnh preview cối/súng máy để thấy họ gia cố là dáng "dẹt" duy nhất.

**Art Bible Anchors:**
- §3: test silhouette; §8: Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-085 — ui_icon_tower_fortifier_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, vẽ 64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_fortifier_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Ngàm cờ lê mở dựng đứng ở giữa trên một khối nền dẹt hình thang có hai vai
chéo 45°, nét 2 px, một màu hổ phách trên panel `#1a1528`, chỉ góc 90°/45°. Một icon cho mọi cấp;
nhận ra ở 32 px, khác icon cối (ống chéo) và súng máy (nòng ngang).

**Art Bible Anchors:**
- §7: icon = dạng vũ khí gốc, lưới 32 px, phẳng một màu

**Generation Prompt:** `flat monochrome UI icon, vertical open-end wrench jaw on a low wide trapezoid base with 45 degree shoulders, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot | (0.5, 0.375) | giữ nguyên | giữ nguyên |
| Trần thân | ≤ 40 px (y ≤ 0.3125) | ≤ 56 px (y ≤ 0.4375) | ≤ 72 px (y ≤ 0.5625) |
| Số tia / điểm phát | 1: `BeamOrigin` | 2: `BeamOriginA/B` | 2: `BeamOriginA/B` |
| Điểm phát đề xuất (đo lại từ art) | (0, 0.266) — ngàm giữa, 34 px | (∓0.203, 0.406) — ±26 px, 52 px | (∓0.3125, 0.516) — ±40 px, 66 px |
| repair_loop | 4f 8 fps | 4f 8 fps | 6f 12 fps |
| repair_pulse | 4f 10 fps (0.4 s), event F0 | 4f 10 fps, event F0 | 4f 10 fps, event F1 |
| Scale beam / spark | 1.0 / 1.0 | 1.0 / 1.0 | 1.25 / 1.25 |
| Shield | Tiled, giống mọi cấp | giống | giống |
| VFX riêng cấp | — | — | `vfx_fortifier_patch_plate_t2` |

Công thức điểm phát: `local = ((x_px − 64) / 128, (y_px_từ_đáy_ô − 48) / 128)`. Thay README cũ
(`BeamOrigin` (-0.156, 0.440) — 56 px, vượt trần t0). Điểm phát và số tia lưu trong data theo cấp,
không hard-code.

Nhịp hoạt động giữ như README: có đoạn chưa đầy máu → `repair_loop`; không có → `idle` (khiên vẫn
bật); mỗi 4 s `repair_pulse` chen vào; bị bão phá hoặc quá nhiệt → tắt tia và khiên ngay. Mọi giá trị
(hồi %/s, % mỗi đợt, giảm sát thương, R vùng) là dữ liệu tuning.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `Fortifier_t0` | 065–069 | 22 | 1024² |
| `Fortifier_t1` | 070–074 | 22 | 1024² |
| `Fortifier_t2` | 075–079 | 24 | 1024² |
| `Fortifier_VFX` | 080–083 | 3 ô 64×16, 4 ô 32², 3 ô 64×48, 6 ô 64² | 256²–512² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 3.2 MB BC7 (ước tính).
`Fortifier_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_fortifier_base_{idle,repair_loop,repair_pulse,build,destroy}.png` | Đổi tên → `tower_fortifier_t0_base_*.png` (kèm `.meta` nếu có, giữ GUID); vẽ lại theo t0 mới |
| `tower_fortifier_base_upgrade1.png`, `_upgrade2.png` (+ `.meta`) | Xóa |
| `vfx_repair_beam.png`, `vfx_repair_spark.png`, `vfx_wall_shield.png` | Đổi tên → `vfx_fortifier_*` (kèm `.meta`); vẽ lại beam (bỏ sóng) và shield (bỏ lục giác) |
| `_preview_tower.png` (gốc thư mục) | Chuyển vào `Preview~/`, làm lại theo ASSET-084 |
| `README.md` | Viết lại theo template §8: màu `#3fc79a` → `#3fbf9f`, bỏ `#7dffb8`, `#ffcc33` → `#f0b429`, bỏ "cao hơn rộng 86 × 100 px" và cánh tay lệch phải, BeamOrigin theo cấp, "Compression None" → BC7 qua atlas, bỏ mục phụ kiện |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Số tia mỗi cấp (1/2/2) và cách chọn đoạn tường cho tia thứ hai.
- Giảm sát thương khiên theo cấp (đề xuất 30/40/50%) hay giữ cố định.
- Tấm vá khẩn t2: ngưỡng máu, lượng hồi, có giới hạn số đoạn mỗi đợt.
- R vùng sửa có tăng theo cấp không (ảnh hưởng vòng code, không ảnh hưởng sprite).
- Hex teal phái sinh ở đầu file cần đưa vào art bible §4.
