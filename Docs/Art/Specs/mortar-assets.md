# Asset Specs — Entity: mortar (Súng cối)

> **Source**: `Assets/Art/Towers/Mortar/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: full — art-director + technical-artist)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Status**: 19 assets specced / 19 approved / 0 in production / 0 done

## Thiết kế theo cấp

Sợi chỉ họ cối (giữ cả 3 cấp, §3): ống đồng `#cc823f` to, ngắn, nghiêng lên phải
~55°; thùng đạn luôn ở trước-trái có đèn hổ phách `#ff9f1c`; không có Head (nòng
luôn chĩa trời). Cấp đọc bằng khối và chevron, không bằng màu (§4).

| | t0 · Cối dã chiến | t1 · Ụ cối đôi | t2 · Cối công nghiệp |
|---|---|---|---|
| Chiếm ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Khối nền | Ụ tròn, méo, thấp | Bệ bát giác bê tông vát cạnh, một bậc nâng | 3 tầng: sàn thép rộng, vòng xoay hình trống, giá nòng |
| Vật liệu | Bao cát `#eabb5c`, ván pallet, rebar, dây, tấm sắt vụn | Bê tông, thép tán đinh, sọc vàng-đen | Thép cắt máy, xy-lanh thủy lực, ống dẫn, hộp động cơ |
| Vũ khí | 1 ống đồng ngắn mập trên chân chống rebar | 2 ống đồng song song trên giá thép | 1 ống đồng rất to (~1.6× t0) + 2 xy-lanh thủy lực dọc ống |
| Thùng đạn | Thùng gỗ hở, đèn gắn tạm | Tủ đạn thép tán đinh | Giá nạp đạn tự động |
| Silhouette | Gò tròn + 1 gạch chéo | Hình thang bát giác + 2 gạch chéo song song | Tháp bậc thang cao + 1 khối chéo dày |

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 bắn loạt 2 quả lệch 0.25 s; t2 đạn
nặng, bán kính nổ ×1.5 (78 px), để lại vùng cháy, bắn chậm hơn.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** đồng sáng `#e0a060` /
tối `#8f5a28`; thép `#6a7284` / `#4a505e` / `#323845`; bê tông `#b3b0a6` /
`#8d8a82` / `#666359`; vàng cảnh báo `#f0b429`.

## Quyết định đã chốt (2026-11-18)

- **Đổi style theo ảnh tham khảo của người dùng (thay bảng "Thiết kế theo cấp" ở trên):** cối nòng
  mập chĩa thẳng lên trời, kẹp giữa 2 bản má hình bánh răng có trục bu-lông. Cùng một thân ở mọi cấp
  (quy tắc §3 sửa đổi): t0 gang đen + đai đồng thau · t1 gang sẫm đính núm đồng, miệng nòng nóng đỏ
  phát sáng, bản má bọc giáp có núm · t2 thân bọc đồng thau + ô sơn đỏ chống gỉ, gai, xích quấn
  trước, miệng nòng nóng rực. Sợi chỉ mới: nòng mập chĩa trời + bản má bánh răng + thùng đạn
  trước-trái có đèn hổ phách. Mockup: `prototypes/tower-mockups/towers/mortar.js` (v4).

- t1 fire: 8 frame 12 fps, ống A bắn frame 0, ống B frame 3 (0.25 s).
- t2 vụ nổ: sheet riêng `vfx_mortar_blast_t2.png` (ô 128×128, scale 1.3), không phóng sheet cũ.
- Vùng cháy: ô 160×128, vẽ đúng bán kính 78 px, không scale.
- t0: hạ nòng để miệng nòng ≤ 40 px trên mặt đất; đo lại điểm sinh đạn từ art mới.
- t0 theo art bible §3 (gò bao cát, ván, rebar), **không** theo README cũ (bệ bê
  tông có sọc cảnh báo — thuộc t1).
- Anim `fire`: ngoại lệ của quy tắc "frame 0 = tư thế nghỉ" (§8) — frame 0 là
  chớp lửa và lúc sinh đạn.

## Prompt nền

**BASE:** `stylized hand-painted cartoon 2D tower defense sprite, industrial mechanical theme, exaggerated chunky proportions, warm lit tops and cool purple shadows, material-specific highlights (metal streaks, painted steel with scratches and chipped paint, glass glints), thick dark indigo #2c2240 silhouette outline with thinner inner lines, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, grounded on a small dirt patch with contact shadow, rich palette: copper #cc823f, painted teal #3f7f7a, red-oxide primer #a9503a, blued steel #5d6a80, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, generic 3D render, plastic look, flat vector, large flat grey surfaces, random clutter, text, watermark, soldiers, characters`

**T0:** `low round irregular improvised mortar nest, ragged ring of sandbags #eabb5c, wooden pallet planks, rebar bipod, short fat copper mortar tube tilted up-right, open wooden ammo crate front-left with amber lamp, rope and scrap plate, about 70px wide 40px tall`

**T1:** `octagonal chamfered concrete plinth with yellow-black hazard stripes #f0b429, riveted steel cradle holding two parallel short fat copper mortar tubes tilted up-right, riveted steel ammo locker front-left with amber lamp, no sandbags, about 90px wide 56px tall`

**T2:** `three-level stepped industrial mortar emplacement, wide machined steel deck, round motorized turntable drum with motor housing, pipes, two hydraulic recoil cylinders alongside one very large short fat copper mortar tube tilted up-right, shell autoloader rack front-left with amber lamp, about 109px wide 72px tall, Stålenhag-style industrial materials`

Chung mọi sheet (§8): 1 hàng, frame trái → phải, không padding, ≥ 2 px trong suốt
sát mép ô (trần thực tế 78 px trên mặt đất); lửa, khói, mảnh destroy không chạm mép.
PNG RGBA32 sRGB alpha thẳng; Sprite Mode Multiple; Bilinear; tắt mipmap; Mesh
Tight; nén BC7 HQ đặt trong override Standalone của Sprite Atlas V2 (ngoại lệ None
nếu vỡ khối viền).

---

## ASSET-001 — tower_mortar_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128 (ô 128), 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Ụ bao cát tròn thấp, ống đồng ngắn chĩa lên phải trên chân
chống rebar, thùng gỗ trước-trái. Frame 0 đèn thùng đạn sáng, frame 1 tắt; mọi thứ
khác giữ nguyên.

**Art Bible Anchors:**
- §3: hàng cấp 0 (≤ 40 px, bao cát chỉ ở cấp này)
- §4: 3 tông, viền `#2c2240`

**Generation Prompt:** BASE + T0 + `idle pose`. NEG.

**Status:** Needed

## ASSET-002 — tower_mortar_t0_base_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 12 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t0_base_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp lửa trên miệng nòng, nòng tụt 4 px, sinh đạn. F1–3
nòng tụt 6/4/2 px, khói phụt rồi tan. F4–5 bụi khỏi chân bao cát, nòng về 0 (F5 =
idle F0).

**Art Bible Anchors:**
- §8: lửa không chạm mép; ngoại lệ frame 0 cho anim fire
- §3: ≤ 40 px

**Generation Prompt:** BASE + T0 + `firing frame, muzzle flash in amber, smoke puff` (đổi dòng cuối theo frame). NEG.

**Status:** Needed

## ASSET-003 — tower_mortar_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu. F1 nền đất, nửa sau bao cát. F2
xong lớp 1 và thùng đạn. F3 xong lớp 2 và đế cối. F4 thả nòng xuống. F5 = idle F0.

**Art Bible Anchors:**
- §8: chỉ t0 có build; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string`. NEG.

**Status:** Needed

## ASSET-004 — tower_mortar_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng, F1 nứt, F2 nòng bật ngửa và bao cát văng,
F3–4 khói. F5 đống đổ nát: bao cát rải, nòng đồng nằm nghiêng, thùng gãy; 2 tông,
không viền tím. Chevron mờ và 4 dấu góc ô do UI vẽ, không gộp vào sprite.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + T0 + `explosion, debris flying`; F5 BASE + `rubble of improvised sandbag mortar nest, copper tube lying on its side, broken crate, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-005 — tower_mortar_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t0 idle F0 bị giàn giáo thép bao quanh. F1–2 bụi che,
tháo bao cát. F3 bệ bê tông bát giác nhô lên. F4 hai ống đồng lắp vào giá. F5 = t1
idle F0. Đổi khối nền, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, old sandbag nest replaced by octagonal concrete plinth`. NEG.

**Status:** Needed

## ASSET-006 — tower_mortar_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bát giác bê tông có sọc vàng-đen, giá thép tán đinh giữ
2 ống đồng song song chĩa lên phải, tủ đạn thép trước-trái. Đèn nháy F0/F1. Không
có bao cát.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px)
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + `idle`. NEG.

**Status:** Needed

## ASSET-007 — tower_mortar_t1_base_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 1024×128, 8 frame, 12 fps, 1 lần (0.667 s) |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t1_base_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Ống A (trái) bắn ở F0: chớp, tụt 4 px. Ống B (phải) bắn ở
F3 cùng chuỗi chớp/tụt. Giá thép rung 1 px. Khói hai điểm tan ở F6–7; F7 = idle F0.
Đề xuất (loạt 2 quả), chờ GDD.

**Art Bible Anchors:**
- §3: giá cố định, thêm nòng
- §8: lửa không chạm mép

**Generation Prompt:** BASE + T1 + `firing, left tube flash and recoil` (F3 đổi `right tube`). NEG.

**Engine:** Animation Event sinh đạn ở F0 (MuzzleA) và F3 (MuzzleB), không dùng timer.

**Status:** Needed

## ASSET-008 — tower_mortar_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, nứt bê tông, 2 ống văng, bụi. F5: bệ bát giác vỡ
nửa, mảnh sọc vàng còn thấy, 2 ống nằm nghiêng; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát
- §3: ≤ 56 px

**Generation Prompt:** F5 BASE + `shattered octagonal concrete plinth, hazard stripe fragments, two copper tubes fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-009 — tower_mortar_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t1 idle F0 bị giàn giáo che. F1–2 bụi, bệ bê tông bị
phá. F3 sàn thép 3 tầng và vòng xoay trồi lên. F4 xy-lanh và ống đồng lớn lắp vào.
F5 = t2 idle F0.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by stepped machined steel deck with turntable`. NEG.

**Status:** Needed

## ASSET-010 — tower_mortar_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Sàn thép tầng 1, vòng xoay trống tầng 2, giá nòng tầng 3.
Một ống đồng to chéo lên phải kẹp giữa 2 xy-lanh thủy lực, ống dẫn từ khối động cơ
sau-trái. Giá nạp đạn trước-trái, đèn nháy F0/F1.

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, ≤ 72 px, cơ chế lộ ra); test silhouette

**Generation Prompt:** BASE + T2 + `idle`. NEG.

**Status:** Needed

## ASSET-011 — tower_mortar_t2_base_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 1024×128, 8 frame, fps chờ chốt (12 = 0.667 s / 8 = 1.0 s), 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t2_base_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp lớn, ống tụt 7 px, xy-lanh nén, sinh đạn. F1–4
xy-lanh đẩy ống về, khói dày, vòng xoay giật 1 px. F5–7 hơi xả từ ống dẫn rồi tan;
F7 = idle F0. Đề xuất (đạn nặng), chờ GDD.

**Art Bible Anchors:**
- §3: cơ chế lộ ra
- §8: ≤ 16 frame/hàng; thân ≤ 72 px, chỉ còn 6 px tới giới hạn 78 px

**Generation Prompt:** BASE + T2 + `firing, large muzzle flash, hydraulic cylinders compressed, heavy smoke`. NEG.

**Engine:** hơi nước và khói vượt 6 px còn lại phải làm VFX riêng, không vẽ vào sheet.

**Status:** Needed

## ASSET-012 — tower_mortar_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_mortar_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp, nổ khung thép, ống đồng bật văng, xy-lanh gãy. F5:
sàn thép nghiêng, vòng xoay vỡ, ống nằm nghiêng; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px

**Generation Prompt:** F5 BASE + `wrecked stepped steel emplacement, broken hydraulic cylinders, copper tube fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-013 — vfx_mortar_shell

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 128×32 (ô 32×32), 4 frame, 16 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_mortar_shell.png` (dùng lại, giữ tên) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Quả đạn nhỏ, đầu đạn bên phải, xoay quanh trục; thân đồng,
đầu thép `#4a505e`. Scale: t0 1.0, t1 1.0 (2 quả), t2 1.5 (đề xuất).

**Art Bible Anchors:**
- §8: VFX dùng lại mọi cấp, chỉ đổi scale

**Generation Prompt:** `small mortar shell sprite, 32x32, cel-shaded 3 tones, copper body steel nose, indigo outline #2c2240, nose pointing right, transparent background`.

**Engine:** sorting layer riêng "Projectile" trên lớp Y-sort; không làm con của tháp (Sorting Group sẽ nuốt).

**Status:** Needed

## ASSET-014 — vfx_mortar_blast

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 576×96 (ô 96×96), 6 frame, 14 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_mortar_blast.png` (dùng lại, giữ tên) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Chớp, cầu lửa, vòng xung kích dẹt 0.72, khói, vết cháy.
Dùng cho t0 và t1, scale 1.3 (bán kính 52 px). Không dùng `#ef5b31` (thuộc phun lửa).

**Art Bible Anchors:**
- §4: hổ phách = ánh sáng người tạo

**Generation Prompt:** `ground explosion sprite sheet, flat shockwave ring squashed to 0.72, amber #ff9f1c and white core, grey smoke, scorch mark, top-down 3/4, transparent background`.

**Engine:** pivot (0.5, 0.333), chung lớp Y-sort với Dị Thể.

**Status:** Needed

## ASSET-015 — vfx_mortar_target

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×64 (ô 96×64), 2 frame, 6 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_mortar_target.png` (dùng lại, giữ tên) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Vòng nét **liền** đánh dấu điểm rơi, đỏ `#e2412f` / hổ
phách, 3 tam giác nhỏ ở mép; frame 1 sáng hơn. Scale 1.3 (t0, t1), 1.95 (t2).

**Art Bible Anchors:**
- §4: nguy hiểm = đỏ + tam giác
- §7: nét đứt dành riêng cho bão

**Generation Prompt:** `ground target marker ring, solid line (not dashed), red #e2412f and amber, three small triangle ticks, flat squashed ellipse 0.72, transparent background`.

**Engine:** sorting dưới Dị Thể.

**Status:** Needed

## ASSET-016 — vfx_mortar_fire_patch

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 640×128 (ô 160×128), 4 frame, 8 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_mortar_fire_patch.png` |
| Texture Res | Vẽ đúng bán kính 78 px (ellipse 156×112 + lề 2 px), không scale |

**Visual Description:** Vệt cháy dẹt trên đất, mép đen xém, 3–4 ngọn lửa hổ phách
thấp nhấp nháy (< 3 Hz). Không dùng `#ef5b31`, không lẫn tint quá nhiệt hay ngà sáp.
Đề xuất (t2), bán kính và thời gian cháy chờ GDD.

**Art Bible Anchors:**
- §4: màu ngữ nghĩa kèm hình; §7: nhấp nháy < 3 Hz

**Generation Prompt:** `burning ground patch, flat squashed ellipse 0.72, charred dark edge, low amber flames #ff9f1c, loop frame, top-down 3/4, transparent background`.

**Engine:** pivot Center, lớp decal dưới mọi Y-sort; vùng sát thương lấy từ data, không từ sprite; alpha và thời gian sống do code.

**Status:** Needed

## ASSET-017 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/Mortar/Preview~/_preview_tower.png` |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle và t2 đang bắn. Hàng 2: cùng 4 ô
tô kín `#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng ban ngày.

**Art Bible Anchors:**
- §3: test silhouette; §8: Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-018 — ui_icon_tower_mortar_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, vẽ 64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_mortar_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Ống ngắn mập nghiêng 45° lên phải trên đế chữ nhật nhỏ, nét
2 px, một màu hổ phách trên panel `#1a1528`, chỉ góc 90°/45°. Một icon cho mọi cấp;
phải nhận ra ở 32 px.

**Art Bible Anchors:**
- §7: icon = dạng vũ khí gốc, lưới 32 px

**Generation Prompt:** `flat monochrome UI icon, short fat mortar tube tilted 45° up-right on a small rectangular base, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Mode Single, pivot Center, atlas UI.

**Status:** Needed

## ASSET-019 — vfx_mortar_blast_t2

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 768×128 (ô 128×128), 6 frame, 14 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_mortar_blast_t2.png` |
| Texture Res | Bội số 32 — §8; scale 1.3 → bán kính 78 px |

**Visual Description:** Như ASSET-014 nhưng nặng hơn: cầu lửa to, vòng xung kích
dày hơn, khói đậm, vết cháy rộng nối sang vùng cháy (ASSET-016). Bán kính vẽ 60 px
trong ô, vừa lề.

**Art Bible Anchors:**
- §8: VFX mới khi cấp có cơ chế mới (đạn nặng t2)

**Generation Prompt:** `heavy ground explosion sprite sheet, large fireball, thick flat shockwave ring squashed to 0.72, amber #ff9f1c and white core, dense grey smoke, wide scorch mark, top-down 3/4, transparent background`.

**Engine:** pivot như ASSET-014, scale 1.3.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot | (0.5, 0.375) | giữ nguyên | giữ nguyên |
| Trần thân | ≤ 40 px (y ≤ 0.3125) | ≤ 56 px (y ≤ 0.4375) | ≤ 72 px (y ≤ 0.5625) |
| Điểm sinh đạn | 1 điểm, đo lại từ art mới (≤ 40 px) | MuzzleA, MuzzleB | 1 điểm, đo từ art |
| Scale shell / blast / target | 1.0 / 1.3 / 1.3 | 1.0 / 1.3 / 1.3 | 1.5 / blast_t2 1.3 / 1.95 |
| Bán kính nổ | 52 px | 52 px | 78 px |

Công thức điểm sinh đạn: `local = ((x_px − 64) / 128, (y_px_từ_đáy_ô − 48) / 128)`.

### Atlas

| Atlas | Nội dung | Dự kiến |
|---|---|---|
| `Mortar_t0` | 001–004 (20 ô) | 1024² |
| `Mortar_t1` | 005–008 (22 ô) | 1024² |
| `Mortar_t2` | 009–012 (22 ô) | 1024² |
| `Mortar_VFX` | 013–016, 019 | 512²–1024² |

Atlas V2: padding 4, Extrude 1, tắt Allow Rotation. Tổng ≈ 3.5 MB BC7 (ước tính).
`Mortar_VFX` là atlas thêm ngoài quy tắc "mỗi tháp mỗi cấp một atlas" (§8), vì VFX
dùng chung mọi cấp.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_mortar_base_{idle,fire,build,destroy}.png` | Đổi tên → `tower_mortar_t0_base_*.png` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_mortar_base_upgrade1.png`, `_upgrade2.png` (+ `.meta`) | Xóa |
| `_preview_tower.png` (gốc thư mục) | Chuyển vào `Preview~/` |
| `vfx_mortar_shell/blast/target.png` | Giữ tên |
| `README.md` | Viết lại theo template §8 |

### Câu hỏi còn mở (chờ GDD / game-designer)

- t2 fire: 12 hay 8 fps; frame sinh đạn (tháp hạ thủy lực làm miệng nòng dịch).
- t1 loạt: quả thứ hai cùng điểm rơi hay điểm khác.
- t2: thời gian bay T, độ cao H, bán kính và thời gian sống của vùng cháy.
- Hex phái sinh ở đầu file cần đưa vào art bible §4.
