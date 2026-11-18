# Asset Specs — Entity: heat-decoy (Mồi nhiệt)

> **Source**: `Assets/Art/Towers/HeatDecoy/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md`
> **Status**: 20 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

| | t0 · Lò mồi chắp vá | t1 · Trạm phát nhiệt | t2 · Lò mồi công nghiệp |
|---|---|---|---|
| Chiếm ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Khối nền | Vòng bao cát tròn méo, thấp, ôm một thùng phuy cắt ngắn | Bệ bát giác bê tông vát cạnh, một bậc, trụ thép tán đinh ở giữa | 3 tầng: sàn thép vát góc + 4 chân chống; trống máy nén lộ ống thổi (bellows) và piston; cổ phản xạ nâng lõi |
| Vật liệu | Bao cát `#eabb5c`, thùng phuy, tôn vụn sơn san hô, dây thép, cuộn dây nung | Bê tông, thép tán đinh, sọc vàng-đen, lá tản nhiệt dập | Thép cắt máy, xy-lanh thủy lực, ống góp, quạt lộ thiên |
| "Vũ khí" (lõi + lá) | 5 tấm tôn san hô bẻ xòe như cánh hoa; lồng dây chứa cuộn dây nung uốn hình tim | Vương miện 8 lá tản nhiệt san hô xòe ra như miệng chén; đèn kính có lồng chứa tim nung; ống xả ngắn sau-trái | 2 dàn lá tản nhiệt san hô trên tay thủy lực dang rộng như vòng tay mở; tim nung trong trụ kính bọc thép, đặt cao nhất |
| Silhouette | Gò thấp + bát xòe nông + 1 chấm sáng | Hình thang bát giác + chén chữ V + bóng đèn | Tháp bậc thang + chữ Y rộng (2 tay) + trụ lõi trên đỉnh |

**Sợi chỉ họ mồi nhiệt (giữ cả 3 cấp, §3):**
1. **Dạng nguyên thủy:** đối xứng qua trục dọc, không có hướng; lõi phát sáng ở chính giữa, cao
   nhất; lá san hô xòe **ra ngoài và lên trên** (≥ 30° so với phương đứng) thành hình "mời gọi"
   mở. Khác họ gây sát thương (bất đối xứng, có hướng) và khác tháp làm lạnh (vòm tròn, cánh ôm
   quanh vòm).
2. **Màu riêng:** lá san hô `#f2766b` (màu chỉ họ này dùng) + lõi hổ phách `#ff9f1c`. Lõi luôn là
   **tim nung hình tim dựng bằng mặt cắt 45°** (không cong võng), ở mọi cấp.
3. **Motif:** đồng hồ áp suất mặt tròn có kim + đèn trạng thái nhỏ, luôn ở **trước-phải** chân tháp.
   Kim báo trạng thái bằng hình: trái = sẵn sàng, phải = hoạt động, quét về = nguội.

Cấp đọc bằng khối và chevron, không bằng màu (§4): ba cấp dùng cùng bộ màu san hô / hổ phách /
thép.

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 bán kính ×1.25 (≈ 2.19 ô), hoạt động 6 s; t2 bán
kính ×1.5 (≈ 2.63 ô), nguội 3 s. Không cấp nào thêm cơ chế mới → VFX dùng lại mọi cấp, chỉ đổi
scale (§8).

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** san hô sáng `#f79a8f` / gốc `#f2766b`
/ tối `#b8524a`; lõi hổ phách sáng `#ffd27a` / gốc `#ff9f1c` / tối `#c26a0a`; lõi tắt rượu vang
`#6e3442` / tối `#4a2230`; hơi nước nguội `#d4dde8` / bóng `#9aa8ba`. Thép, bê tông, vàng cảnh
báo dùng hex phái sinh của `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Lõi dùng hổ phách `#ff9f1c` (3 tông trên), bỏ cam `#ff9a4a` và kem `#fff0c0` của README.**
  Lý do: cam lẫn tint quá nhiệt / sọc cam `#ff8a3d` / phun lửa `#ef5b31`; kem gần trắng nắng
  `#fff4d6` và ngà sáp `#e9dfc4`. Hổ phách = "ánh sáng người tạo" (§4) đúng nghĩa "hơi ấm giả".
- **Lá san hô không bao giờ đỏ dần khi hoạt động** (README cũ có). Lý do: đỏ-cam trên thân tháp là
  tín hiệu quá nhiệt (§4). Khi hoạt động chỉ lõi sáng lên và mặt trong của lá nhận viền sáng hổ
  phách 1–2 px.
- **Không có heat haze / méo hình trên tháp hay trong VFX của tháp.** Sóng nhiệt mặt đất là vòng
  vẽ nét liền, không dùng Camera Sorting Layer Texture. Lý do: heat haze dành riêng cho quá nhiệt
  (§4, §8).
- **Quầng sáng lõi vẽ bằng 1–2 vòng bậc cứng trong sprite, không gradient, không material
  additive/bloom.** Lý do: giữ cel-shading 3 tông và unlit (§2, §8); "ấm bệnh" mềm, mờ là của
  Dị Thể (§1 nguyên tắc 2).
- **Tim nung dựng bằng mặt cắt 45° và đoạn thẳng**, đặt trong lồng/kính có viền `#2c2240`. Lý do:
  giữ motif "sự sống giả" của README mà không phạm "tháp không dùng đường cong võng" (§3).
- **Thép dùng `#4a505e` (art bible), bỏ `#4e4862` của README.** Lý do: thống nhất kết cấu với
  roster.
- **Đèn trạng thái không dùng xanh lá / đỏ.** Sẵn sàng = đèn hổ phách nháy chậm + kim trái; hoạt
  động = đèn sáng đều + kim phải; nguội = đèn tắt + kim quét về. Lý do: đỏ = nguy hiểm, xanh lá
  ngoài palette, teal = sửa chữa (§4); trạng thái đọc bằng hình kim (an toàn mù màu).
- **t2 tay lá tản nhiệt cố định ở thế dang rộng ở mọi trạng thái**; cơ chế lộ ra là ống thổi,
  piston và quạt chạy theo nhịp tim. Lý do: mở/gập tay cần thêm file `active_start` (ngoại lệ
  công thức §8); không đáng chi phí.
- **Hơi nước nguội màu xám xanh lạnh `#d4dde8`, cụm tròn có viền, bay thẳng lên từ lỗ xả cố định.**
  Lý do: tách khỏi khói quá nhiệt (xám tối + tint + nhấp nháy) và khỏi ngà sáp ấm.
- **`vfx_heat_decoy_steam` đổi ô 48 → 64** (bội số 32, §8); **`vfx_heat_decoy_heat_wave` đổi ô
  128×96 → 256×192, bán kính vẽ tối đa 120 px.** Lý do: ở ô cũ (56 px) bán kính 1.75 ô cần scale 4×,
  nét 2 px nhòe thành 8 px; ô mới giữ scale ≤ 2.8 ở t2.
- **Đổi tên VFX theo mẫu `vfx_<owner>_<effect>`** (§8): `vfx_heat_decoy_heat_wave`,
  `vfx_heat_decoy_lure`, `vfx_heat_decoy_steam`.
- **t0 theo art bible §3 (bao cát, thùng phuy, tôn vụn), không theo README cũ (bệ bê tông tròn —
  thuộc vật liệu t1).**
- **Nhịp tim chung mọi cấp:** chu kỳ `active` = 0.667 s (t0/t1: 4 frame 6 fps; t2: 6 frame 9 fps),
  để đổi cấp không đổi "nhịp sống" của họ tháp.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**NEG-DECOY (thêm sau NEG):** `red-orange tint, reddened fins, heat haze, distortion, bloom, soft glow gradient, ivory, cream, wax, dripping, melting, sagging curves, rounded dome, cyan, gun barrel, weapon`

**T0:** `low round irregular improvised heat lure, ragged ring of sandbags #eabb5c around a cut-down steel oil drum, five scrap metal sheets painted coral #f2766b bent outward like open petals and lashed with wire, small wire cage on top holding a heating coil bent into a faceted heart shape built from 45-degree segments glowing amber #ff9f1c, round pressure gauge with needle and small amber lamp taped on front-right, radially symmetric, about 70px wide 40px tall`

**T1:** `octagonal chamfered concrete plinth with yellow-black hazard stripes #f0b429, riveted steel central column, crown of eight coral #f2766b radiator fins fanned outward like an open chalice, caged armored glass lamp on top holding a faceted heart-shaped heating element glowing amber #ff9f1c, short exhaust stack back-left, round pressure gauge with needle and small amber lamp on front-right of plinth, symmetric, no sandbags, about 90px wide 56px tall`

**T2:** `three-level stepped industrial heat lure reactor, wide machined steel deck with chamfered corners and four outrigger feet, compressor drum with exposed accordion bellows, pistons, exposed cooling fan and pipe manifold, two large banks of coral #f2766b radiator fins on hydraulic arms spread outward and upward like open arms, elevated faceted reflector collar holding an armored glass cylinder with a faceted heart-shaped core glowing amber #ff9f1c at the very top, twin vent pipes, round pressure gauge with needle and small amber lamp on front-right, symmetric, about 109px wide 72px tall, Stålenhag-style industrial materials`

**Đuôi trạng thái (thêm cuối prompt):**
- READY: `core dim deep wine #6e3442 with faint amber filament, gauge needle left`
- ACTIVE: `core glowing amber with one or two hard-edged stepped halo rings, inner faces of fins rim-lit amber, gauge needle right`
- COOLDOWN: `core fading to deep wine #6e3442, pale cool grey steam puffs #d4dde8 from vents, lamp off, gauge needle sweeping back`

Chung mọi sheet (§8): 1 hàng, frame trái → phải, không padding, ≥ 2 px trong suốt sát mép ô
(trần thực tế 78 px trên mặt đất); quầng lõi, mảnh destroy không chạm mép. PNG RGBA32 sRGB alpha
thẳng; Sprite Mode Multiple; Bilinear; tắt mipmap; tắt Read/Write; Mesh Tight; nén BC7 HQ đặt
trong override Standalone của Sprite Atlas V2 (ngoại lệ None nếu vỡ khối viền). Chỉ lớp `Base`,
không Head, không 8 hướng.

---

## ASSET-215 — tower_heat_decoy_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128 (ô 128), 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Vòng bao cát thấp méo ôm thùng phuy cắt ngắn; 5 tấm tôn sơn san hô (sơn
bong mép, đinh tán thô, buộc dây) bẻ xòe ra như cánh hoa mở; trên miệng thùng là lồng dây thép
chứa cuộn dây nung uốn hình tim gãy góc. Lõi tắt màu rượu vang, sợi nung hổ phách mờ. Đồng hồ áp
quấn băng dính ở trước-phải, kim chỉ trái. F0 đèn nhỏ hổ phách sáng, F1 tắt. Tổng thể là một "đóa
hoa sắt" nhỏ, gọn, đáng yêu vì sự chắp vá cẩn thận, không phải đống phế liệu.

**Art Bible Anchors:**
- §3: hàng cấp 0 (~55%, ≤ 40 px, bao cát chỉ ở cấp này); roster: lõi sáng ở giữa, hình mời gọi
- §4: 3 tông, viền `#2c2240`; cấp không báo bằng màu

**Generation Prompt:** BASE + T0 + READY + `idle`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-216 — tower_heat_decoy_t0_base_active

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 6 fps, loop (0.667 s/chu kỳ) |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t0_base_active.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Nhịp tim "thình-thịch": F0 nghỉ (lõi hổ phách gốc, 1 vòng quầng). F1 nhịp
mạnh: lõi lên tông sáng `#ffd27a`, 2 vòng quầng bậc cứng, cánh tôn rung 1 px ra ngoài. F2 nhịp
nhẹ: 1 vòng quầng, lõi gốc. F3 lắng: lõi tông gốc, quầng thu lại. Mặt trong các tấm tôn có viền
sáng hổ phách 1–2 px; màu san hô của tôn **không đổi**. Kim đồng hồ chỉ phải, rung ±1 px; đèn sáng
đều.

**Art Bible Anchors:**
- §4 / §1 nguyên tắc 2: không tint đỏ-cam, không heat haze, không "ấm bệnh" mềm
- §3: quầng ≤ 40 px trên mặt đất

**Generation Prompt:** BASE + T0 + ACTIVE + `heartbeat pulse frame N of 4`. NEG + NEG-DECOY.

**Engine:** Animation Event "Beat" ở F1 (dùng cho đồng bộ VFX nếu GDD chọn, xem câu hỏi mở).

**Status:** Needed

## ASSET-217 — tower_heat_decoy_t0_base_cooldown

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 4 fps, 1 lần, giữ F3 |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t0_base_cooldown.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 lõi hổ phách gốc, không quầng, đèn tắt. F1 lõi tông tối `#c26a0a`, tôn
co về 1 px. F2 lõi chuyển rượu vang, sợi nung còn đỏ sẫm mảnh. F3 lõi rượu vang tối, kim đồng hồ
đã quét về giữa (trên đường về trái). Hơi nước **không** vẽ vào sheet — dùng VFX ASSET-232.
F3 khác idle F0 chỉ ở vị trí kim và đèn.

**Art Bible Anchors:**
- §4: hơi nước nguội tách khỏi khói quá nhiệt
- §8: VFX tách khỏi sprite tháp

**Generation Prompt:** BASE + T0 + COOLDOWN + `cooling frame N of 4, no steam drawn`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-218 — tower_heat_decoy_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu. F1 thùng phuy lăn vào, nửa sau vòng bao cát. F2
xong vòng cát. F3 cắm và bẻ xòe 5 tấm tôn. F4 thả lồng dây chứa tim nung xuống bằng dây thừng (giữ
ý của README). F5 = idle F0.

**Art Bible Anchors:**
- §8: chỉ t0 có build; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-219 — tower_heat_decoy_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (trong ô, không chạm mép), F1 lồng dây bung, F2 tôn văng và
bao cát rách, F3–4 khói xám. F5 đống đổ nát: thùng phuy móp nằm nghiêng, tôn san hô cong queo rải
quanh, cuộn dây nung đứt; 2 tông, không viền tím, **lõi không còn phát sáng**. Chevron mờ và 4 dấu
góc ô do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + T0 + `explosion, debris flying`; F5 BASE + `rubble of improvised heat lure, dented oil drum on its side, bent coral painted scrap sheets, broken wire coil, unlit, two-tone, no outline`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-220 — tower_heat_decoy_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t0 idle F0 bị giàn giáo thép bao quanh. F1–2 bụi che, tháo bao cát và
thùng phuy. F3 bệ bê tông bát giác và trụ thép nhô lên. F4 vương miện 8 lá tản nhiệt lắp vào, đèn
kính có lồng hạ xuống đỉnh trụ. F5 = t1 idle F0. Đổi khối nền, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, old sandbag and oil drum lure replaced by octagonal concrete plinth with central steel column and fanned coral radiator fins`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-221 — tower_heat_decoy_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bát giác bê tông có sọc vàng-đen ở mặt trước; trụ thép tán đinh ở giữa;
8 lá tản nhiệt san hô dập, mép cắt thẳng, xòe ra như miệng chén (4 lá trước thấy rõ, 4 lá sau bị
che một phần). Trên đỉnh trụ: đèn kính bọc lồng thép 4 thanh, trong là tim nung gãy góc màu rượu
vang. Ống xả ngắn ở sau-trái. Đồng hồ áp trước-phải gắn vào bệ, kim trái; đèn nháy F0/F1. Không
bao cát. Cảm giác: thiết bị chế tạo tử tế, như một cái lò sưởi công cộng đáng tin.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px); khác tháp làm lạnh (lá xòe ra, không ôm vòm)
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + READY + `idle`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-222 — tower_heat_decoy_t1_base_active

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 6 fps, loop (0.667 s/chu kỳ) |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t1_base_active.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Cùng nhịp tim t0 (F1 mạnh, F2 nhẹ). Tim nung trong đèn kính sáng hổ phách,
F1 thêm vòng quầng thứ hai; lá tản nhiệt hé thêm 1 px ở F1; mặt trong lá viền hổ phách. Ống xả có
1 làn sóng nhiệt **vẽ bằng nét gợn cứng 2 px** (không méo hình). Kim phải, đèn sáng đều.

**Art Bible Anchors:**
- §4: không đỏ dần lá, không haze
- §3: ≤ 56 px gồm cả quầng

**Generation Prompt:** BASE + T1 + ACTIVE + `heartbeat pulse frame N of 4`. NEG + NEG-DECOY.

**Engine:** Animation Event "Beat" ở F1.

**Status:** Needed

## ASSET-223 — tower_heat_decoy_t1_base_cooldown

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 4 fps, 1 lần, giữ F3 |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t1_base_cooldown.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 lõi hổ phách gốc, đèn tắt. F1 lõi tối, lá thu về. F2 lõi rượu vang,
nắp ống xả bật hé (chỗ hơi nước VFX thoát ra). F3 lõi rượu vang tối, nắp ống xả còn hé, kim quét
về giữa.

**Art Bible Anchors:**
- §4: hơi nước nguội ≠ khói quá nhiệt; §8 VFX tách khỏi sprite

**Generation Prompt:** BASE + T1 + COOLDOWN + `cooling frame N of 4, exhaust cap open, no steam drawn`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-224 — tower_heat_decoy_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, đèn kính vỡ, lá tản nhiệt bung, bê tông nứt, bụi. F5: bệ bát giác vỡ
nửa, mảnh sọc vàng còn thấy, trụ thép gãy nghiêng, vài lá san hô rơi, mảnh kính; 2 tông, không
viền, không phát sáng.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 56 px

**Generation Prompt:** F5 BASE + `shattered octagonal concrete plinth, hazard stripe fragments, bent steel column, fallen coral radiator fins, broken glass lamp, unlit, two-tone, no outline`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-225 — tower_heat_decoy_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t1 idle F0 bị giàn giáo che. F1–2 bụi, bệ bê tông bị phá. F3 sàn thép
và trống máy nén trồi lên. F4 hai tay thủy lực dang ra mang dàn lá tản nhiệt, cổ phản xạ và trụ
kính lõi đặt lên đỉnh. F5 = t2 idle F0.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by stepped machined steel deck with compressor drum and two hydraulic arms carrying coral radiator banks`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-226 — tower_heat_decoy_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1: sàn thép rộng vát góc, 4 chân chống thò ra chéo. Tầng 2: trống máy
nén có ống thổi xếp nếp và 2 piston lộ ở mặt trước, quạt lộ thiên trong lồng ở sau, ống góp đồng
`#cc823f` nối lên trên. Tầng 3: cổ phản xạ nhiều mặt phẳng (gãy góc, không cong) đỡ trụ kính bọc
thép, trong là tim nung lớn màu rượu vang. Hai bên: 2 tay thủy lực dang rộng xiên lên, mỗi tay
mang một dàn lá tản nhiệt san hô xếp lớp, như vòng tay mở rộng đón. 2 ống xả đứng sau lõi. Đồng hồ
áp trước-phải ở tầng 2, kim trái, đèn nháy F0/F1. Ống thổi F0/F1 chênh 1 px (thở chậm). Cảm giác:
cỗ máy lớn đáng tin, đẹp vì cơ khí rõ ràng.

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, ≤ 72 px, nhiều tầng, cơ chế lộ ra); test silhouette chữ Y
- §9: Stålenhag

**Generation Prompt:** BASE + T2 + READY + `idle, bellows slightly expanded`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-227 — tower_heat_decoy_t2_base_active

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 9 fps, loop (0.667 s/chu kỳ) |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t2_base_active.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Nhịp tim cơ khí: F0 nghỉ. F1 nhịp mạnh: ống thổi nén 3 px, 2 piston đẩy
lên, lõi lên tông sáng + 2 vòng quầng bậc cứng, tay thủy lực rung 1 px. F2 hồi. F3 nhịp nhẹ: ống
thổi nén 1 px, 1 vòng quầng. F4–5 hồi về F0. Quạt quay 1/6 vòng mỗi frame. Mặt trong dàn lá viền
hổ phách; màu san hô không đổi. Kim phải, đèn sáng đều.

**Art Bible Anchors:**
- §3: cơ chế lộ ra; §4 không tint / haze
- §8: thân + quầng ≤ 72 px, còn 6 px tới trần 78 px — quầng không được vượt

**Generation Prompt:** BASE + T2 + ACTIVE + `mechanical heartbeat frame N of 6, bellows compressed, pistons up`. NEG + NEG-DECOY.

**Engine:** Animation Event "Beat" ở F1.

**Status:** Needed

## ASSET-228 — tower_heat_decoy_t2_base_cooldown

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 4 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t2_base_cooldown.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 lõi gốc, đèn tắt, quạt quay nhanh. F1–2 cửa chớp trên dàn lá mở (thấy
khe), lõi tối dần. F3 nắp 2 ống xả bật mở. F4 quạt chậm lại, lõi rượu vang. F5 lõi rượu vang tối,
ống thổi giãn hẳn, kim quét về giữa. Hơi nước là VFX.

**Art Bible Anchors:**
- §3: cơ chế lộ ra; §4 hơi nước nguội ≠ khói quá nhiệt

**Generation Prompt:** BASE + T2 + COOLDOWN + `cooling frame N of 6, fin louvers open, vent caps open, fan slowing, no steam drawn`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-229 — tower_heat_decoy_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_heat_decoy_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, trụ kính lõi nổ, tay thủy lực gãy gập, ống thổi rách, khói. F5: sàn
thép nghiêng, trống máy nén móp, một tay gãy nằm vắt ngang với dàn lá san hô, lõi vỡ tối; 2 tông,
không viền, không phát sáng.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px

**Generation Prompt:** F5 BASE + `wrecked stepped steel heat reactor, broken hydraulic arm lying across with coral fin bank, torn bellows, shattered glass core cylinder, unlit, two-tone, no outline`. NEG + NEG-DECOY.

**Status:** Needed

## ASSET-230 — vfx_heat_decoy_heat_wave

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 1024×192 (ô 256×192), 4 frame, 4 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_heat_decoy_heat_wave.png` (đổi tên + vẽ lại từ `vfx_heat_wave.png`) |
| Texture Res | Bội số 32 — §8; bán kính vẽ 30 / 60 / 90 / 120 px, elip dẹt 0.72 |

**Visual Description:** Vòng sóng trên mặt đất lan ra: nét liền hổ phách 2 px + 1 bậc mờ phía
trong (cel, không gradient), lặp 2 vòng gợn mảnh đồng tâm. F0 nhỏ và đậm, F3 lớn và mờ nhất. Không
méo hình nền, không tint đỏ-cam. Nét liền — nét đứt dành cho bão (§7). Dùng lại mọi cấp.

**Art Bible Anchors:**
- §8: VFX dùng lại mọi cấp, chỉ đổi scale
- §4 / §7: nét liền, không haze

**Generation Prompt:** `flat ground ripple ring sprite sheet, solid amber #ff9f1c 2px line with one inner stepped faint band, thin concentric echo ring, ellipse squashed to 0.72, expanding over 4 frames, no distortion, no gradient, top-down 3/4, transparent background`.

**Engine:** pivot Center, đặt tại pivot Base; `localScale = R_unit / 0.9375` (120 px = 0.9375 unit): t0 1.87, t1 2.33, t2 2.80 (theo bán kính đề xuất). Lớp decal dưới mọi Y-sort. Vùng hút lấy từ data, không từ sprite.

**Status:** Needed

## ASSET-231 — vfx_heat_decoy_lure

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 64×32 (ô 32×32), 2 frame, 4 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_heat_decoy_lure.png` (đổi tên từ `vfx_heat_lure.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Tim nhỏ gãy góc 45° màu hổ phách viền `#2c2240` + 2 vạch gợn ngắn phía
trên. F0 tim to, F1 tim co 2 px. Đây là tín hiệu do con người tạo trên đầu Dị Thể nên có viền tím
than, khác thân sáp không viền. Một kích thước cho mọi cấp.

**Art Bible Anchors:**
- §5: Dị Thể không viền — dấu có viền đọc là "thứ của tháp"
- §4: hổ phách, không ngà

**Generation Prompt:** `tiny faceted heart icon built from 45-degree segments, amber #ff9f1c, 2px indigo outline #2c2240, two short ripple marks above, 2 frames pulse, 32x32 cells, transparent background`.

**Engine:** pivot Center, con của kẻ địch (trong Sorting Group của kẻ địch), ~0.36 unit trên đầu Dị Thể Sáp thường; scale 1.0 mọi cấp.

**Status:** Needed

## ASSET-232 — vfx_heat_decoy_steam

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 256×64 (ô 64×64, vẽ trong 56×56), 4 frame, 4 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_heat_decoy_steam.png` (đổi tên + vẽ lại từ `vfx_steam.png`) |
| Texture Res | Bội số 32 — §8 (ô cũ 48 không hợp lệ) |

**Visual Description:** Cụm hơi nước tròn gãy khối, xám xanh lạnh `#d4dde8` / bóng `#9aa8ba`, viền
mảnh tông tối của chính nó (không tím than), to dần rồi tách thành 2–3 cụm nhỏ và tan. Không dùng
xám tối của khói quá nhiệt, không ngà.

**Art Bible Anchors:**
- §4: quá nhiệt = tint + haze + khói + nhấp nháy; hơi nước nguội phải khác cả bốn
- §8: VFX tách, dùng lại, đổi scale

**Generation Prompt:** `small steam puff sprite sheet, 4 frames grow then break apart and fade, cool pale grey-blue #d4dde8 with #9aa8ba shade, flat cel-shaded, no smoke, no gradient, 64x64 cells, transparent background`.

**Engine:** con của tháp (trong Sorting Group, order trên Base), sinh tại điểm xả theo cấp (bảng dưới), bay lên ~20 px; scale t0 0.75, t1 1.0, t2 1.25.

**Status:** Needed

## ASSET-233 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/HeatDecoy/Preview~/_preview_tower.png` |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle và t2 active F1. Hàng 2: cùng 4 ô tô kín
`#2c2240`, blur 2 px (phải đọc: bát thấp → chén chữ V → chữ Y bậc thang). Nền nửa đêm `#1e2a4a`,
nửa Đồng bằng trắng ban ngày. Nên đặt thêm ô tháp làm lạnh cạnh bên khi review để kiểm tra không lẫn.

**Art Bible Anchors:**
- §3: test silhouette; §8: Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-234 — ui_icon_tower_heat_decoy_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, vẽ 64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_heat_decoy_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Tim gãy góc ở giữa, 2 cặp lá thẳng xòe chéo 45° ra hai bên phía trên tim,
đế chữ nhật nhỏ; nét 2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°. Một icon cho mọi
cấp; nhận ra ở 32 px, khác icon nhiệt kế của quá nhiệt (§7).

**Art Bible Anchors:**
- §7: icon = dạng nguyên thủy của họ tháp, lưới 32 px

**Generation Prompt:** `flat monochrome UI icon, faceted heart in the center with two pairs of straight fins fanning out at 45 degrees above it on a small rectangular base, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Mode Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ nguyên | giữ nguyên |
| Trần thân + quầng | ≤ 40 px (y ≤ 0.3125) | ≤ 56 px (y ≤ 0.4375) | ≤ 72 px (y ≤ 0.5625) |
| Tâm lõi (đề xuất, đo lại từ art) | ~30 px trên mặt đất | ~46 px | ~62 px |
| Điểm xả hơi nước | 1: trên lõi | 2: trên lõi + miệng ống xả sau-trái | 3: trên lõi + 2 ống xả |
| Bán kính hút (đề xuất, chờ GDD) | 1.75 ô | 2.19 ô | 2.63 ô |
| Scale heat_wave / lure / steam | 1.87 / 1.0 / 0.75 | 2.33 / 1.0 / 1.0 | 2.80 / 1.0 / 1.25 |
| Frame active / fps | 4 / 6 | 4 / 6 | 6 / 9 |
| Frame cooldown / fps (giữ frame cuối) | 4 / 4 | 4 / 4 | 6 / 4 (1.5 s, giữ F5 tới hết nguội) |

Công thức điểm xả: `local = ((x_px − 64) / 128, (y_px_từ_đáy_ô − 48) / 128)`, lưu mỗi cấp một bộ
trong data (như `TierMuzzleData` của súng máy). Chỉ lớp Base, không Head; Sorting Group ở gốc
tháp; unlit, cùng sorting layer với Dị Thể.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `HeatDecoy_t0` | 215–219 | 22 | 1024² |
| `HeatDecoy_t1` | 220–224 | 22 | 1024² |
| `HeatDecoy_t2` | 225–229 | 26 | 1024² |
| `HeatDecoy_VFX` | 230–232 | 4 ô 256×192 + 2 ô 32² + 4 ô 64² | 1024×512 |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 3.5 MB BC7 (ước tính).
`HeatDecoy_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`. Công thức file §8 (chỉ Base, A =
2: active, cooldown): 9 + 3×2 = **15 sheet tháp** (215–229), khớp.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_heat_decoy_base_{idle,active,cooldown,build,destroy}.png` | Đổi tên → `tower_heat_decoy_t0_base_*.png` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_heat_decoy_base_upgrade1.png`, `_upgrade2.png` (+ `.meta`) | Xóa |
| `vfx_heat_wave.png` | Đổi tên → `vfx_heat_decoy_heat_wave.png` (kèm `.meta`); vẽ lại ô 256×192, slice lại; sửa công thức scale `R / 0.4375` → `R / 0.9375` |
| `vfx_heat_lure.png` | Đổi tên → `vfx_heat_decoy_lure.png` (kèm `.meta`) |
| `vfx_steam.png` | Đổi tên → `vfx_heat_decoy_steam.png` (kèm `.meta`); vẽ lại ô 64×64, 4 frame, slice lại |
| `_preview_tower.png` (gốc thư mục) | Chuyển vào `Preview~/`, vẽ lại theo bố cục §8 |
| `README.md` | Viết lại theo template §8; bỏ `#ff9a4a`, `#fff0c0`, `#4e4862`, "mép lá đỏ dần", đèn xanh/đỏ, "bệ bê tông tròn" ở t0 |

### Câu hỏi còn mở (chờ GDD / game-designer / technical-artist)

- Bán kính, thời gian hoạt động và nguội mỗi cấp (đề xuất ở trên).
- Sinh `vfx_heat_decoy_heat_wave` theo timer data 1.25 s hay theo Animation Event "Beat" (mỗi 2
  nhịp = 1.333 s) để sóng khớp nhịp tim — art-director nghiêng về theo nhịp.
- Mồi nhiệt có chịu hệ quá nhiệt chung không. Nếu có: tint + haze dùng chung `_Shared/` đè lên mọi
  trạng thái, và phải kiểm tra không lẫn với `cooldown`.
- technical-artist: heat_wave scale 2.8× có nhòe nét chấp nhận được không; nếu không, thay bằng
  vòng vẽ procedural (shader/line) — vẫn nét liền, không méo hình.
- Hex phái sinh và màu hơi nước ở đầu file cần đưa vào art bible §4.
