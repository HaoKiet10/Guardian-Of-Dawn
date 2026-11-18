# Asset Specs — Entity: chain-tesla (Tháp điện chuỗi)

> **Source**: `Assets/Art/Towers/ChainTesla/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director; technical-artist chưa duyệt)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md`, `design/assets/specs/machine-gun-assets.md`
> **Status**: 19 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

**Sợi chỉ họ điện chuỗi (giữ cả 3 cấp, §3):**
1. **Dạng nguyên thủy:** một cột cuộn dây **mập, đứng thẳng ở chính giữa**, đội một **cực phóng
   tròn** (quả cầu móp → quả cầu thép bóng → vành xuyến dẹt). Không bao giờ có mũi nhọn, kim
   hay tinh thể trên đỉnh (đó là Cột thu sáng). Tia luôn phóng từ tâm cực phóng.
2. **Màu riêng trên vũ khí:** dây quấn đồng đỏ `#e08a4e` trên cột + đĩa sứ cách điện `#f6f3ee`
   xếp chồng ngay dưới cực phóng; năng lượng tím điện `#9a6ad8` / `#c58cff` / `#dcb8ff` chỉ
   hiện khi nạp/phóng và ở tia nhỏ idle. Không dùng cyan (thuộc Làm lạnh / Pháo xuyên giáp).
3. **Motif:** **khối nguồn ở trước-phải** (bình ắc-quy → tủ tụ điện → giàn tụ thủy tinh), luôn
   có một cầu dao tay đòn và đèn hổ phách `#ff9f1c`. Khác họ cối (thùng đạn trước-trái) và súng
   máy (hộp đạn bên trái).

**Phân biệt với Cột thu sáng (Sun Rod, §3 "mảnh, đứng, vật cao nhất trên sân"):** Tesla là
khối **lùn và rộng**: tỉ lệ ngang/cao ≥ 1.6 ở mọi cấp, cột cuộn dây rộng ≥ 14 / 20 / 30 px
(t0/t1/t2), đỉnh t2 ≤ 66 px (dưới trần 72 px, để Cột thu sáng luôn cao hơn).

| | t0 · Cuộn dây chắp vá | t1 · Trạm biến áp cuộn dây | t2 · Lò phóng điện công nghiệp |
|---|---|---|---|
| Chiếm ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px (đỉnh ~38) | ~90 px (70%) / ≤ 56 px (đỉnh ~54) | ~109 px (85%) / ≤ 72 px (đỉnh ≤ 66) |
| Khối nền | Lõi cuộn cáp gỗ nằm ngang (tròn, méo) kẹp giữa vài bao cát | Bệ bê tông **vuông** vát góc 45°, một bậc nâng, sọc vàng-đen | 3 tầng: sàn thép rộng bậc thang · giàn khung thép hở + thùng dầu biến áp · đài cuộn dây |
| Vật liệu | Gỗ cuộn cáp, bao cát `#eabb5c`, ống nước, dây đồng quấn tay, ắc-quy ô tô, kẹp cá sấu | Bê tông, tủ thép tán đinh, thanh cái đồng, sứ cách điện | Thép cắt máy, bu-lông, ống dầu, động cơ khe phóng quay, khung giàn |
| Vũ khí (cột + cực phóng) | Ống thép quấn dây đồng lổn nhổn, 1 đĩa sứ mẻ, phao thép móp làm cực phóng | Cột cuộn dây quấn đều trên lõi cách điện, 3 đĩa sứ, quả cầu thép bóng | Cuộn thứ cấp to (thấy rõ từng vòng), 4 đĩa sứ, vành xuyến dẹt lớn; 2 trụ sứ phụ hai bên nối bằng thanh cái |
| Khối nguồn trước-phải | 2 bình ắc-quy chồng, cầu dao gỗ, đèn treo | Tủ tụ điện thép, cầu dao tay đòn, đèn lồng | Giàn 3 bình tụ thủy tinh trong khung, cầu dao có motor, đèn |
| Cơ chế lộ ra | Dây cáp vắt ngoài | Thanh cái đồng nối tủ → cột | Khe phóng quay (đĩa có điện cực, motor) trước-trái, ống dầu, cuộn sơ cấp dẹt quanh chân cuộn thứ cấp |
| Silhouette | Gò tròn thấp + cọc mập ngắn đội quả cầu | Khối vuông có bậc + cột mập + cầu tròn, vai phải là tủ | Bậc thang rộng + trụ to đội vành xuyến dẹt + 2 vai trụ sứ (dáng chữ "M" lùn) |

**Lối chơi theo cấp (đề xuất, chờ GDD):** số mục tiêu 3 / 4 / 5 (theo README); hệ số giảm
sát thương mỗi lần nảy 0.75 mọi cấp; t2 bán kính nảy ×1.2 (108 px). Không cấp nào thêm cơ chế
mới → VFX dùng lại, chỉ đổi scale (§8). Sáp gương không phản điện ở mọi cấp: không cần VFX riêng.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** đồng đỏ cuộn dây `#f0a874` /
`#e08a4e` / `#a85a2a`; tím điện `#c58cff` / `#9a6ad8` / `#6a44a0`; sứ `#f6f3ee` / `#d9d4ca` /
`#a9a296`; năng lượng sáng nhất `#dcb8ff`. Thép, bê tông, vàng cảnh báo theo `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Tesla không còn là "tháp cao nhất"** (README cũ) — art bible §3 dành vị trí đó cho Cột thu
  sáng; Tesla đỉnh t2 ≤ 66 px, tỉ lệ ngang/cao ≥ 1.6. Lý do: giữ từ vựng roster, tránh lẫn hai
  tháp cùng màu đồng đỏ + sứ trắng.
- **Cực phóng đổi dạng theo cấp (cầu móp → cầu bóng → vành xuyến), luôn tròn, luôn ở tâm trên.**
  Lý do: đổi khối mà vẫn giữ sợi chỉ "cực phóng tròn".
- **Bệ t1 vuông vát góc** thay vì bát giác. Lý do: cối và súng máy đã dùng bát giác; vuông giúp
  phân biệt họ tháp ở cùng cấp mà vẫn trong §3 ("bát giác hoặc vuông").
- **t0 theo art bible §3** (lõi cuộn cáp gỗ, bao cát, ắc-quy), **không** theo README cũ (bệ bê
  tông hình thoi, ba chân trụ, sàn bát giác — vật liệu cấp 1–2).
- **Thời lượng `charge` = 0.667 s ở mọi cấp** (t0/t1 4 frame 6 fps; t2 6 frame 9 fps cho đĩa
  khe phóng quay). `discharge` 3 frame 10 fps mọi cấp. Lý do: nhịp phóng nằm trong data, art
  không làm lệch nhịp khi lên cấp.
- **Tia phóng ở `discharge` F0** — ngoại lệ "frame 0 = tư thế nghỉ" (§8), như `fire` của cối.
- **Ô `vfx_chain_tesla_hit` đổi 48 → 64 px.** Lý do: §8 yêu cầu VFX bội số 32.
- **VFX đổi tên** `vfx_tesla_*` → `vfx_chain_tesla_*` theo mẫu `vfx_<owner>_<effect>` (§8).
- **Tia có viền ngoài tối `#2c2240` alpha 60%, 1 px.** Lý do: lõi `#dcb8ff` gần trắng mất hẳn
  trên Đồng bằng trắng ban ngày (§4 vùng rủi ro đọc nhất); viền giữ tia đọc được mà không đổi màu họ.
- **Không VFX `_t2`**: t2 chỉ tăng số mục tiêu/bán kính, không là cơ chế mới (§8).
- **Tia nhỏ idle / tia giữa 2 trụ sứ t2 vẽ trong sprite**, trong lề 2 px; tia giữa các mục tiêu
  luôn là VFX riêng.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**TESLA (thêm sau BASE):** `tesla coil tower, red-copper coil windings #e08a4e, white porcelain insulator discs #f6f3ee, electric purple #9a6ad8 accents, squat and wide, coil column centered and vertical, round discharge terminal on top center, power source block front-right with knife switch and amber lamp`

**NEG-TESLA (thêm sau NEG):** `thin needle, lightning rod spike, pointed crystal tip, tall slender pole, cyan, blue lightning, curved sagging shapes`

**T0:** `low round irregular improvised tesla coil, wooden cable reel lying on its side as base wedged by a few sandbags #eabb5c, scrap steel pipe hand-wound with lumpy copper wire, one chipped porcelain disc, dented steel float ball as terminal, two stacked car batteries with crocodile-clip cables and wooden knife switch front-right with hanging amber lamp, about 70px wide 38px tall`

**T1:** `square concrete plinth with 45 degree chamfered corners and one raised step, yellow-black hazard stripes #f0b429, riveted steel transformer cabinet, thick evenly wound red-copper coil column on insulating core, three porcelain discs, polished steel sphere terminal, copper bus bars from cabinet to coil, riveted steel capacitor cabinet with lever knife switch and amber cage lamp front-right, no sandbags, about 90px wide 54px tall`

**T2:** `three-level stepped industrial tesla discharge station, wide machined steel deck, open steel gantry frame with oil-cooled transformer tank and pipes, large exposed secondary coil with visible individual windings and flat primary spiral around its foot, four porcelain discs, large flat toroid ring terminal, two short porcelain bushing posts left and right linked by copper bus bars, exposed motorized rotary spark gap disc front-left, rack of three glass capacitor jars with motorized breaker and amber lamp front-right, about 109px wide 66px tall, Stålenhag-style industrial materials`

Prompt mẫu: BASE + TESLA + T<N> + `<dòng anim>`. NEG + NEG-TESLA.

Chung mọi sheet: theo `mortar-assets.md` (1 hàng, frame trái → phải, không padding, ≥ 2 px
trong suốt sát mép; PNG RGBA32 sRGB alpha thẳng; Sprite Mode Multiple; Bilinear; tắt mipmap;
tắt Read/Write; Mesh Tight; BC7 HQ qua Atlas V2 Standalone override, ngoại lệ None nếu vỡ khối
viền). Tia và chớp trong sprite không chạm mép ô; trần thực tế 78 px trên mặt đất.

---

## ASSET-115 — tower_chain_tesla_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128 (ô 128), 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Lõi cuộn cáp gỗ nằm ngang làm nền, 3–4 bao cát chèn hai bên. Từ tâm
cuộn cáp dựng ống thép quấn dây đồng đỏ lổn nhổn (rộng ~14 px), một đĩa sứ mẻ, phao thép móp
trên đỉnh (~38 px). Trước-phải: 2 bình ắc-quy chồng, kẹp cá sấu, cầu dao gỗ, đèn hổ phách treo
trên que. F0 một tia tím nhỏ (≤ 6 px) bò trên phao, đèn sáng; F1 tia ở vị trí khác, đèn tắt.

**Art Bible Anchors:**
- §3: hàng cấp 0 (~55%, ≤ 40 px, chắp vá, bao cát chỉ ở cấp này)
- §4: 3 tông, viền `#2c2240`; tím chỉ ở năng lượng

**Generation Prompt:** BASE + TESLA + T0 + `idle, tiny purple spark on terminal`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-116 — tower_chain_tesla_t0_base_charge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 6 fps, 1 lần (0.667 s) |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t0_base_charge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0, cầu dao gạt xuống. F1 dây quấn dưới sáng tím, ắc-quy rung
1 px. F2 sáng lên nửa trên cột và đĩa sứ. F3 phao sáng tím `#c58cff`, 2–3 tia nhỏ bám quanh
phao (trong lề).

**Art Bible Anchors:**
- §3: cơ chế lộ ra dần theo cấp; ở t0 chỉ dây và cầu dao
- §7: nhấp nháy < 3 Hz không áp dụng (sáng dần, không chớp)

**Generation Prompt:** BASE + TESLA + T0 + `charging, coil windings glowing purple from bottom up, stage N of 4`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-117 — tower_chain_tesla_t0_base_discharge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×128, 3 frame, 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t0_base_discharge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 phao chớp trắng (cục bộ, bán kính ≤ 10 px), tia chuỗi sinh ra. F1 phao
tím nhạt, khói mỏng từ dây quấn. F2 tắt, về gần idle F0 (dây còn hơi ấm 1 tông).

**Art Bible Anchors:**
- §8: chớp không chạm mép; ngoại lệ frame 0 cho anim hành động
- §7: chớp chỉ cục bộ, không phải chớp toàn màn hình

**Generation Prompt:** BASE + TESLA + T0 + `discharge frame, terminal white flash` (F1 `purple afterglow`, F2 `fading`). NEG + NEG-TESLA.

**Engine:** Animation Event phóng tia ở F0 tại `ArcOrigin`, không dùng timer.

**Status:** Needed

## ASSET-118 — tower_chain_tesla_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu. F1 lăn cuộn cáp gỗ vào, đặt nằm. F2 chèn bao cát,
đặt ắc-quy. F3 dựng ống thép. F4 quấn dây đồng, đặt đĩa sứ và phao. F5 = idle F0.

**Art Bible Anchors:**
- §8: chỉ t0 có build; frame cuối = idle F0

**Generation Prompt:** BASE + TESLA + T0 + `under construction, stage N of 6, stakes and string`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-119 — tower_chain_tesla_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng, F1 tia tím chập loạn quanh cột, F2 phao bật văng, cuộn cáp
nứt đôi, F3–4 khói và dây đồng bung. F5 đống đổ nát: cuộn cáp vỡ đôi, dây đồng rối, phao móp
lăn sang trái, ắc-quy đổ; 2 tông, không viền, không phát sáng. Chevron mờ và dấu góc ô do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + TESLA + T0 + `short circuit explosion, purple sparks, debris flying`; F5 BASE + `rubble of improvised tesla coil, split wooden cable reel, tangled copper wire, dented float ball, toppled car batteries, two-tone, no outline`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-120 — tower_chain_tesla_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t0 idle F0 bị giàn giáo thép bao quanh. F1–2 bụi che, tháo cuộn cáp
và bao cát. F3 bệ bê tông vuông và tủ biến áp trồi lên. F4 cột cuộn dây và quả cầu được hạ xuống,
tủ tụ trước-phải. F5 = t1 idle F0. Đổi khối nền, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + TESLA + `construction transition, scaffolding and dust cloud, improvised cable-reel coil replaced by square concrete plinth with transformer cabinet and copper coil column`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-121 — tower_chain_tesla_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ vuông vát góc có bậc, sọc vàng-đen ở bậc. Giữa bệ: tủ biến áp thép
tán đinh thấp; trên tủ là cột cuộn dây quấn đều (rộng ~20 px), 3 đĩa sứ, quả cầu thép bóng
(đỉnh ~54 px). Thanh cái đồng đi từ tủ lên chân cột. Trước-phải: tủ tụ thép, cầu dao tay đòn,
đèn lồng hổ phách. F0 tia nhỏ trên cầu + đèn sáng; F1 đổi vị trí tia, đèn tắt. Không bao cát.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px, gia công)
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + TESLA + T1 + `idle, tiny purple spark on sphere`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-122 — tower_chain_tesla_t1_base_charge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 6 fps, 1 lần (0.667 s) |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t1_base_charge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0, tay đòn cầu dao gạt xuống. F1 thanh cái đồng sáng tím. F2
đĩa sứ sáng lần lượt từ dưới lên, cuộn dây ánh tím. F3 quả cầu sáng `#c58cff`, 3–4 tia nhỏ bám
quanh cầu.

**Art Bible Anchors:**
- §3: giá cố định, cỡ to hơn
- §8: tia trong sprite không chạm mép

**Generation Prompt:** BASE + TESLA + T1 + `charging, bus bars and porcelain discs glowing purple from bottom up, stage N of 4`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-123 — tower_chain_tesla_t1_base_discharge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×128, 3 frame, 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t1_base_discharge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 quả cầu chớp trắng (bán kính ≤ 12 px), tia sinh ra; tủ rung 1 px. F1
tím nhạt, hơi nóng mảnh trên cuộn dây. F2 tắt, về gần idle F0.

**Art Bible Anchors:**
- §8: ngoại lệ frame 0; chớp không chạm mép

**Generation Prompt:** BASE + TESLA + T1 + `discharge frame, sphere white flash` (F1 `purple afterglow`, F2 `fading`). NEG + NEG-TESLA.

**Engine:** Animation Event phóng tia ở F0 tại `ArcOrigin` t1.

**Status:** Needed

## ASSET-124 — tower_chain_tesla_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp, F1 tia chập loạn, F2 cửa tủ bật tung, cột cuộn dây gãy ngang, F3–4
khói. F5: bệ vuông nứt một góc, mảnh sọc vàng còn thấy, cột cuộn dây đổ nghiêng, quả cầu nứt
nằm dưới chân; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 56 px

**Generation Prompt:** F5 BASE + `cracked square concrete plinth, hazard stripe fragments, burst steel cabinet, toppled copper coil column, cracked steel sphere, two-tone, no outline`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-125 — tower_chain_tesla_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t1 idle F0 bị giàn giáo che. F1–2 bụi, đập bệ bê tông. F3 sàn thép
bậc thang và giàn khung hở trồi lên, thùng dầu vào chỗ. F4 cuộn thứ cấp lớn và vành xuyến hạ
xuống, lắp 2 trụ sứ phụ, khe phóng quay và giàn tụ. F5 = t2 idle F0.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + TESLA + `construction transition, scaffolding, dust cloud, concrete plinth replaced by stepped machined steel deck with open gantry and large coil with toroid`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-126 — tower_chain_tesla_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1: sàn thép rộng bậc thang, bu-lông góc. Tầng 2: giàn khung thép
hở, thấy thùng dầu biến áp và ống dầu; trước-trái là đĩa khe phóng quay có điện cực và motor.
Tầng 3: cuộn sơ cấp dẹt hình xoắn ốc quanh chân, cuộn thứ cấp to (rộng ~30 px, thấy từng vòng
dây), 4 đĩa sứ, vành xuyến dẹt rộng ~40 px (đỉnh ≤ 66 px). Hai trụ sứ phụ ngắn ở hai vai, nối
thanh cái về cuộn. Trước-phải: giàn 3 bình tụ thủy tinh trong khung thép, cầu dao có motor, đèn
hổ phách. F0/F1: đĩa khe phóng xoay 1/8 vòng, tia nhỏ trên vành xuyến đổi chỗ, đèn nháy.

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, nhiều tầng, cơ chế lộ ra); test silhouette, không lẫn Cột thu sáng
- §9: Stålenhag

**Generation Prompt:** BASE + TESLA + T2 + `idle, tiny purple spark on toroid`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-127 — tower_chain_tesla_t2_base_charge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 9 fps, 1 lần (0.667 s) |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t2_base_charge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0, cầu dao đóng. F1–2 đĩa khe phóng quay nhanh dần (vệt chuyển
động), bình tụ sáng tím từng bình. F3 thanh cái và 2 trụ sứ phụ sáng, tia ngắn nhảy giữa hai
trụ phụ và cuộn. F4 cuộn thứ cấp sáng tím từ dưới lên. F5 vành xuyến sáng `#c58cff`, vòng tia nhỏ
chạy quanh vành (trong lề, đỉnh tia ≤ 74 px).

**Art Bible Anchors:**
- §3: cơ chế lộ ra (khe phóng, tụ, thanh cái)
- §8: ≤ 16 frame/hàng; tia không chạm mép

**Generation Prompt:** BASE + TESLA + T2 + `charging, rotary spark gap spinning, capacitor jars and coil glowing purple, small arcs between bushing posts, stage N of 6`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-128 — tower_chain_tesla_t2_base_discharge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×128, 3 frame, 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t2_base_discharge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 vành xuyến chớp trắng (bán kính ≤ 14 px, không quá y = 76 px), tia sinh
ra; giàn khung giật 1 px. F1 tím nhạt, hơi nóng trên cuộn, đĩa khe phóng chậm lại. F2 tắt, về
gần idle F0.

**Art Bible Anchors:**
- §8: ngoại lệ frame 0; trần 78 px, chớp không chạm mép

**Generation Prompt:** BASE + TESLA + T2 + `discharge frame, toroid white flash` (F1 `purple afterglow`, F2 `fading`). NEG + NEG-TESLA.

**Engine:** Animation Event phóng tia ở F0 tại `ArcOrigin` t2.

**Status:** Needed

## ASSET-129 — tower_chain_tesla_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_chain_tesla_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp, F1 tia chập toàn khung, F2 thùng dầu bục, vành xuyến bật văng,
bình tụ vỡ, F3–4 khói đen. F5: sàn thép nghiêng, giàn khung cong, cuộn thứ cấp gãy cụt, vành
xuyến nằm lệch như cái vòng rơi, mảnh thủy tinh; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px

**Generation Prompt:** F5 BASE + `wrecked stepped steel tesla station, bent gantry, sheared coil stump, fallen toroid ring, shattered glass jars, two-tone, no outline`. NEG + NEG-TESLA.

**Status:** Needed

## ASSET-130 — vfx_chain_tesla_arc

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 384×32 (ô 128×32), 3 frame, 20 fps, loop khi tia sống |
| Format | PNG RGBA32 |
| Naming | `vfx_chain_tesla_arc.png` (đổi tên từ `vfx_tesla_arc.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Đoạn tia zigzag ngang, hai đầu ở giữa mép trái và phải ô. 3 lớp: lõi
`#dcb8ff`, giữa `#c58cff`, ngoài `#9a6ad8` + viền `#2c2240` alpha 60% 1 px. 3 frame là 3 hình
zigzag khác nhau. Dùng lại mọi cấp; độ dày theo cấp ở bảng engine.

**Art Bible Anchors:**
- §8: VFX dùng lại, chỉ đổi scale
- §4: không cyan; đọc được trên Đồng bằng trắng

**Generation Prompt:** `electric arc segment sprite sheet, 3 frames, horizontal jagged lightning bolt from left edge center to right edge center, white-lavender core #dcb8ff, purple #c58cff and #9a6ad8 glow, thin dark indigo #2c2240 outer edge, 128x32 cells, transparent background`.

**Engine:** pivot (0, 0.5) ở điểm đầu, xoay về điểm cuối, `localScale.x` = khoảng cách (unit),
`localScale.y` = độ dày nhánh × hệ số cấp. Hoặc LineRenderer 3 lớp (technical-artist chọn).
Sorting layer "Projectile" trên lớp Y-sort, không làm con của tháp.

**Status:** Needed

## ASSET-131 — vfx_chain_tesla_hit

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×64 (ô 64×64, vẽ trong 56×56), 3 frame, 14 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_chain_tesla_hit.png` (đổi tên từ `vfx_tesla_hit.png`, ô 48 → 64) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Chớp điện bám thân mục tiêu: F0 sao tia tím lõi trắng, F1 3–4 nhánh
ngắn tỏa ra, F2 tàn tím nhạt. Cùng một VFX cho Sáp gương (không phản, không có lóe trắng muối).

**Art Bible Anchors:**
- §8: VFX tách khỏi sprite; §4 màu họ giữ nguyên mọi cấp

**Generation Prompt:** `electric hit spark sprite sheet, 3 frames, purple #9a6ad8 star burst with lavender #dcb8ff core, short forked branches, 64x64 cells, transparent background`.

**Engine:** pivot Center, đặt ~13 px trên chân mục tiêu; nhánh sau scale 0.7–1.2 và alpha theo
độ trong nhánh (data).

**Status:** Needed

## ASSET-132 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/ChainTesla/Preview~/_preview_tower.png` |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle và t2 discharge F0. Hàng 2: cùng ô tô kín
`#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng. Kiểm thêm: đặt cạnh silhouette
Cột thu sáng — hai tháp phải phân biệt trong < 1 s.

**Art Bible Anchors:**
- §3: test silhouette và từ vựng roster; §8 Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-133 — ui_icon_tower_chain_tesla_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_chain_tesla_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Cột cuộn dây mập (3 vạch ngang) đội hình tròn, một tia gãy 45° từ hình
tròn sang phải, trên đế chữ nhật. Nét 2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°
(trừ hình tròn cực phóng). Khác icon Cột thu sáng (kim mảnh, đầu nhọn).

**Art Bible Anchors:**
- §7: icon = dạng vũ khí gốc, một icon mọi cấp

**Generation Prompt:** `flat monochrome UI icon, squat coil column with three horizontal bands topped by a circle, one zigzag bolt at 45 degrees to the right, small rectangular base, 2px stroke, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot | (0.5, 0.375) | giữ nguyên | giữ nguyên |
| Trần thân | ≤ 40 px (y ≤ 0.3125) | ≤ 56 px (y ≤ 0.4375) | ≤ 66 px art (trần §3 72 px, y ≤ 0.5625) |
| `ArcOrigin` (tâm cực phóng) | ~34 px → (0, 0.266), đo từ art | ~48 px → (0, 0.375), đo từ art | ~60 px → (0, 0.469), đo từ art |
| Frame phóng tia | discharge F0 | discharge F0 | discharge F0 |
| charge / discharge | 4f 6 fps / 3f 10 fps | 4f 6 fps / 3f 10 fps | 6f 9 fps / 3f 10 fps |
| Scale arc (y) / hit | 1.0 / 1.0 | 1.15 / 1.1 | 1.3 / 1.25 |
| Số mục tiêu / bán kính nảy (đề xuất) | 3 / 90 px | 4 / 90 px | 5 / 108 px |

- `ArcOrigin` cũ `(0, 0.463)` (59 px) không còn đúng ở cấp nào: t0 chỉ cao 40 px.
- Công thức: `local = ((x_px − 64) / 128, (y_px_từ_đáy_ô − 48) / 128)`; đặt marker 1 px ở layer
  riêng trong file nguồn, đo ở discharge F0.
- Base-only, không xoay, không hướng. Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể.
- Tổng sheet tháp = 9 + 3 × 2 = **15** (Base-only, A = charge + discharge), §8.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `ChainTesla_t0` | 115–119 | 21 | 1024² |
| `ChainTesla_t1` | 120–124 | 21 | 1024² |
| `ChainTesla_t2` | 125–129 | 23 | 1024² |
| `ChainTesla_VFX` | 130, 131 | 3 ô 128×32 + 3 ô 64² | 256² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 3 MB BC7 (ước tính).
`ChainTesla_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_chain_tesla_base_{idle,charge,discharge,build,destroy}.png` | Đổi tên → `tower_chain_tesla_t0_base_*` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_chain_tesla_base_upgrade1.png`, `_upgrade2.png` (+ `.meta`) | Xóa |
| `vfx_tesla_arc.png` | Đổi tên → `vfx_chain_tesla_arc.png` (kèm `.meta`) |
| `vfx_tesla_hit.png` | Đổi tên → `vfx_chain_tesla_hit.png`; vẽ lại ô 64×64, sửa slice |
| `_preview_tower.png` (gốc thư mục) | Chuyển vào `Preview~/`, làm lại theo §8 |
| `README.md` | Viết lại theo template §8; bỏ "tháp cao nhất", "Compression None" → BC7 qua atlas, `ArcOrigin` → bảng theo cấp, hình dáng → bảng cấp ở trên |

### Câu hỏi còn mở (chờ GDD / game-designer / technical-artist)

- Số mục tiêu 3/4/5, hệ số 0.75, bán kính nảy t2 ×1.2: chờ GDD.
- Có cần phản hồi riêng cho "Sáp gương không phản điện" (UX/codex) hay chỉ cần không có VFX phản.
- Arc: sprite kéo giãn hay LineRenderer 3 lớp (technical-artist); viền tối 60% có cần chụp test ban ngày.
- Đồng đỏ `#e08a4e` + sứ `#f6f3ee` gần bộ màu Cột thu sáng (`#e97d4e`, `#eeede8`): hiện phân
  biệt bằng hình + tím; nếu test roster còn lẫn, cần chỉnh một trong hai bảng màu.
- Hex phái sinh ở đầu file cần đưa vào art bible §4.
