# Asset Specs — Entity: net-launcher (Tháp phóng lưới)

> **Source**: `Assets/Art/Towers/NetLauncher/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director; chờ technical-artist)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md` (cấu trúc Head / Base, dữ liệu điểm sinh đạn)
> **Status**: 24 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

| | t0 · Hộp phóng chắp vá | t1 · Giàn phóng đôi trên chạc | t2 · Giàn cẩu phóng lưới |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Base | Vòng bao cát thấp méo, ván pallet, trụ xoay bằng ống nước + rebar, cuộn dây thừng quấn tay đặt dưới đất sau-trái | Bệ bê tông **vuông** vát góc 45°, một bậc nâng (sọc vàng-đen chỉ ở mép bậc), trụ thép chạc chữ U, tang cuốn dây gắn giá sau-trái, thùng lưới dự phòng sau-phải | 2 tầng: sàn thép cắt máy rộng; trên đó **khung thép chữ nhật hở** (4 cột chữ I, giằng chéo 45°, có khoảng trống nhìn xuyên) đội sàn đỉnh có vòng xoay. Tang quấn lưới có động cơ sau-trái, xích nâng gói lưới chạy dọc trong khung, ống khí nén + 2 bình đứng bên phải |
| Head | Thùng gỗ tận dụng sơn xanh chanh bằng chổi, **1 miệng ô vuông**, bình khí buộc dây bên phải, bao tải lưới buộc trên nắp | Hộp thép tán đinh sơn xanh chanh, **2 miệng ô vuông cạnh nhau**, bình khí nằm ngang treo dưới hộp có đồng hồ áp, phễu thép + tay nạp đòn bẩy trên đỉnh | Hộp phóng nặng **1 miệng vuông lớn**, 2 giảm chấn thủy lực hai bên, **giá băng hở chứa 3 gói lưới xếp chồng** trên đỉnh hộp, ram thủy lực đẩy gói xuống |
| Vật liệu | Bao cát `#eabb5c`, gỗ, rebar, dây, ống nước | Bê tông, thép tán đinh, sọc cảnh báo | Thép cắt máy, thủy lực, ống dẫn, xích |
| Silhouette | Gò tròn thấp + hộp vuông nhỏ ngóc lên | Bậc vuông phẳng + chạc chữ U + hộp ngang 2 ô | Khung chữ nhật đứng rỗng ruột + hộp to có giá gói trên đỉnh |

**Sợi chỉ họ phóng lưới (§3):**
1. Dạng nguyên thủy: **hộp phóng thành vuông, miệng ô vuông**, ngóc lên ~15° theo hướng bắn (khác cối: ống tròn chĩa trời 55°; khác súng máy: nòng tròn dài nằm ngang). Không có nòng tròn ở bất kỳ cấp nào.
2. Màu riêng trên vũ khí: xanh chanh `#b9de3a` phủ thân hộp phóng (chỉ ở Head); gói lưới nâu dây thừng `#c08a4a` thấy rõ trong miệng ô = **sẵn sàng bắn**, miệng trống = đang nạp (tín hiệu từ README, giữ mọi cấp, gói ≥ 6 px để sống qua LOD §5).
3. Motif cùng vị trí: **cuộn dây thừng luôn ở sau-trái trên Base**, lớn dần theo cấp (cuộn quấn tay → tang cuốn trên giá → tang quấn có động cơ nối vào cơ chế).

**Head / Base:** Head = hộp phóng, miệng ô, gói lưới, bình khí, cơ cấu nạp (bao tải / phễu + tay nạp / giá băng + ram). Base = mọi thứ còn lại, kể cả cuộn dây. Không vẽ người vận hành (tháp tự động, §5).

**Khác họ Súng máy ở đâu:** MG đi theo "gò → bát giác có khiên → kim tự tháp bậc thang + trống xoay"; phóng lưới đi theo "gò → bệ vuông có chạc → khung giàn hở". Không dùng khiên (thuộc MG t1), không dùng trống xoay bậc thang (MG/cối t2). Khối t2 là hình chữ nhật đứng có khoảng trống âm, đọc khác hẳn khối đặc bậc thang khi tô kín + blur (test §3).

**Lối chơi theo cấp (đề xuất, chờ GDD):** t0 bắn 1 lưới, trói 1 Dị Thể. t1 loạt 2 lưới vào 2 mục tiêu khác nhau (lệch 0.25 s), nạp cả hai một lần. t2 lưới nặng bung rộng giữa không, trói tới 3 Dị Thể trong bán kính ~40 px quanh điểm rơi. Mọi cấp: mục tiêu lớn (bậc 5, trùm) chỉ bị làm chậm, không gây sát thương.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §3/§4):** xanh chanh sáng `#d9f07e` / gốc `#b9de3a` / tối `#7f9e1e`; dây thừng `#e2b676` / `#c08a4a` / `#8a5a2b`. Thép, bê tông, vàng cảnh báo dùng bộ hex phái sinh trong `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- Vũ khí đổi từ "ống phóng ngắn miệng loe" (README cũ) sang **hộp phóng miệng vuông** — từ vựng roster §3 "phóng lưới = giá hình hộp", và tách khỏi ống tròn của cối.
- t1 dùng bệ **vuông** (không bát giác), t2 dùng **khung giàn hở** (không bậc thang + trống) — §3 cho phép vuông; tránh trùng silhouette cấp với Súng máy và Cối.
- Màu họ xanh chanh `#b9de3a` chỉ nằm trên Head; sọc vàng `#f0b429` chỉ ở mép bậc Base t1, không bao giờ trên Head — lime và vàng cảnh báo gần nhau với người deutan nên tách bằng vị trí.
- Bỏ thép `#9fadb5` của README; dùng bộ thép chung `#6a7284` / `#4a505e` / `#323845` — giữ thống nhất vật liệu giữa các họ tháp.
- Mắt lưới trên Dị Thể vẽ bằng nâu dây thừng 3 tông + viền `#2c2240` 1 px ở dây chính + 4 quả tạ xanh chanh ở góc, không dùng `#e2b676` làm màu chính — `#e2b676` quá gần ngà sáp `#e9dfc4`, lưới sẽ chìm vào thân Dị Thể.
- Anim `fire`: F0 = tư thế nghỉ (có gói), sinh lưới ở F1, frame cuối = miệng trống; `fire` luôn nối thẳng sang `reload`, frame cuối `reload` = idle F0 — tuân §8, không cần ngoại lệ như cối.
- VFX đổi tên `vfx_net_*` → `vfx_net_launcher_*` — mẫu tên §8 `vfx_<owner>_<effect>` với owner = tên thư mục dạng snake.
- `vfx_net_launcher_shot` đổi ô 48×48 → 64×64 — §8 yêu cầu VFX bội số 32.
- t2 có cơ chế mới (lưới diện rộng) nên thêm đúng 1 VFX `vfx_net_launcher_shot_t2`; lưới trói trên từng Dị Thể vẫn dùng lại `vfx_net_launcher_trap` — tối thiểu file theo §8.
- Bộ file tháp = 12 + 3 × 2 (head fire, head reload) = **18 sheet**, không ngoại lệ công thức. t2 base idle 4 frame (tang quấn và xích chạy) chỉ đổi số frame, không thêm file.
- Head localPosition đề xuất m ≈ 20 / 30 / 46 px; đo lại từ art.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

(BASE và NEG nguyên văn từ `mortar-assets.md`.) Thêm vào NEG cho mọi sheet tháp phóng lưới: `round barrel, cylindrical tube launcher, gun shield, stepped pyramid base`.

**T0:** `low round irregular improvised net launcher nest, ragged ring of sandbags #eabb5c, wooden pallet planks, rebar and water-pipe swivel post, repurposed wooden crate launcher box brush-painted lime green #b9de3a with one square launch port holding a round rope-brown #c08a4a net bundle, tilted up about 15 degrees, small gas bottle strapped to its right side with rope, burlap sack of nets tied on the lid, hand-wound rope coil on the ground rear-left, small amber work lamp, about 70px wide 40px tall`

**T1:** `square concrete plinth with 45-degree chamfered corners and one raised step, yellow-black hazard stripes #f0b429 only on the step edge, steel U-fork yoke pedestal, riveted steel box launcher painted lime green #b9de3a with two square launch ports side by side each holding a round rope-brown #c08a4a net bundle, tilted up about 15 degrees, horizontal compressed air tank slung under the box with pressure gauge, steel hopper and lever loading arm on top, rope reel on a steel bracket rear-left, spare net crate rear-right, no sandbags, no shield, about 90px wide 56px tall`

**T2:** `two-level industrial net launcher gantry, wide machined steel deck, open rectangular steel I-beam frame with 45-degree cross bracing and see-through gaps, motorized rope winding drum rear-left, chain hoist carrying net bundles up inside the frame, compressed air manifold pipes and two upright air tanks on the right, turret ring on the top platform carrying a heavy riveted lime green #b9de3a box launcher with one large square port, open steel cassette rack of three stacked rope-brown #c08a4a net bundles on top of the box, two hydraulic recoil dampers on the box sides, amber lamp, about 109px wide 72px tall, Stålenhag-style industrial materials`

**HEAD (thêm cuối prompt Head):** `launcher only, no emplacement, no ground, centered, facing <direction>`.
**BASE-ONLY (thêm cuối prompt Base idle):** `base only, empty mount`.

Head sheet: 5 hàng S, SE, E, NE, N (flipX cho SW, W, NW). Hàng S thấy mặt miệng ô và gói lưới; hàng E thấy cạnh dài của hộp và bình khí; hàng N thấy lưng hộp, cơ cấu nạp, miệng ô bị che. Bình khí t0 bên phải bị lật khi flipX — chấp nhận (như hộp đạn MG).

Chung mọi sheet (§8, như `mortar-assets.md`): 1 hàng mỗi anim (Head 5 hàng), frame trái → phải, không padding, ≥ 2 px trong suốt sát mép ô (trần thực tế 78 px trên mặt đất); khí phụt, mảnh destroy không chạm mép. PNG RGBA32 sRGB alpha thẳng; Sprite Mode Multiple; Bilinear; tắt mipmap; tắt Read/Write; Mesh Tight; nén BC7 HQ qua override Standalone của Sprite Atlas V2 (ngoại lệ None nếu vỡ khối viền).

---

## ASSET-165 — tower_net_launcher_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Vòng bao cát tròn thấp méo, ván pallet lót giữa, trụ xoay ghép từ ống nước và rebar buộc dây (Head gắn riêng). Cuộn dây thừng quấn tay nằm dưới đất sau-trái. Đèn làm việc hổ phách nhỏ buộc vào trụ: F0 sáng, F1 tắt.

**Art Bible Anchors:**
- §3: hàng cấp 0 (~55%, ≤ 40 px, bao cát chỉ ở cấp này); motif cuộn dây sau-trái
- §4: 3 tông, viền `#2c2240`

**Generation Prompt:** BASE + T0 + BASE-ONLY + `idle`. NEG.

**Status:** Needed

## ASSET-166 — tower_net_launcher_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu. F1 nền đất, nửa sau vòng bao cát. F2 xong vòng cát, lót ván. F3 dựng trụ ống nước, đặt cuộn dây sau-trái. F4 nhấc thùng phóng lên trụ (Head SE vẽ sẵn, miệng trống). F5 = base idle F0 + head idle F0 SE (gói lưới đã vào miệng).

**Art Bible Anchors:**
- §8: chỉ t0 có build; Head SE vẽ sẵn; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string, launcher facing southeast`. NEG.

**Engine:** code ẩn Head thật suốt build, bật sau F5.

**Status:** Needed

## ASSET-167 — tower_net_launcher_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (Head SE vẽ sẵn). F1 nứt, thùng gỗ bung ván. F2 thùng văng, bình khí lăn, bao cát tung. F3–4 khói. F5 đống đổ nát: bao cát rải, ván thùng xanh chanh gãy, lưới rối vắt qua trụ đổ; 2 tông, không viền. Chevron mờ và dấu góc ô do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + T0 + `explosion, debris flying, launcher facing southeast`; F5 BASE + `rubble of improvised sandbag nest, broken lime green crate planks, tangled rope net, fallen pipe post, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-168 — tower_net_launcher_t0_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t0_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Thùng gỗ sơn xanh chanh bằng chổi (vệt sơn thấy rõ, mép gỗ lộ), 1 miệng ô vuông có gói lưới tròn nâu, ngóc lên ~15°. Bình khí nhỏ buộc dây bên phải, bao tải lưới buộc trên nắp. F0 van bình khí có chấm hổ phách sáng, F1 tắt.

**Art Bible Anchors:**
- §8: Head 5 hàng + flipX
- §3: sợi chỉ hộp miệng vuông + màu xanh chanh; vũ khí cấp 0 "gắn tay, lộ thiên"

**Generation Prompt:** BASE + T0 + HEAD + `idle, net bundle loaded in port`. NEG.

**Engine:** Head nhô ≤ 20 px trên tâm xoay (40 − 20).

**Status:** Needed

## ASSET-169 — tower_net_launcher_t0_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 12 fps, 1 lần (0.333 s) |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t0_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ, có gói. F1 khí nén phụt trắng-xám từ khe thùng, gói rời miệng (sinh lưới), thùng giật lùi 4 px. F2 giật 2 px, khí tan, ván rung 1 px. F3 về 0, **miệng trống**. Khí phụt không chạm mép ô.

**Art Bible Anchors:**
- §8: frame 0 = tư thế nghỉ; phụt khí không chạm mép
- §3: ≤ 40 px

**Generation Prompt:** BASE + T0 + HEAD + `firing frame, compressed air puff from crate seams, recoil, net bundle leaving port` (F3 đổi `empty port`). NEG.

**Engine:** Animation Event sinh lưới ở F1. Luồng khí vẽ thẳng vào sheet (không phải VFX riêng, theo README).

**Status:** Needed

## ASSET-170 — tower_net_launcher_t0_head_reload

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 8 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t0_head_reload.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 miệng trống (= fire F3). F1 nắp gỗ có bản lề bật lên, bao tải nghiêng. F2 gói lưới rơi từ bao tải vào lòng thùng. F3 nắp đập xuống, gói nằm trong miệng = idle F0.

**Art Bible Anchors:**
- §3: cơ chế cấp 0 thô, lộ thiên
- §8: frame cuối khớp idle F0

**Generation Prompt:** BASE + T0 + HEAD + `reloading, hinged crate lid open, net bundle dropping from burlap sack into the port`. NEG.

**Engine:** Animation Event "Loaded" ở F3 → bật cờ sẵn sàng.

**Status:** Needed

## ASSET-171 — tower_net_launcher_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t0 (base idle F0 + head idle F0 SE) phủ giàn giáo thép. F1–2 bụi che, tháo bao cát và thùng gỗ. F3 bệ bê tông vuông có bậc nhô lên, trụ chạc chữ U dựng. F4 hộp phóng thép 2 ô lắp vào chạc (Head SE vẽ sẵn), tang dây lên giá sau-trái. F5 trùng từng pixel với ghép t1 (base idle F0 + head idle F0 SE tại Head localPosition t1). Đổi khối nền, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới; Head SE vẽ sẵn

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, sandbag nest replaced by square concrete plinth with steel U-fork yoke, lime green twin-port box launcher facing southeast`. NEG.

**Status:** Needed

## ASSET-172 — tower_net_launcher_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bê tông vuông vát góc 45°, một bậc nâng, sọc vàng-đen chỉ chạy dọc mép bậc trước. Trụ thép chạc chữ U trống ở giữa. Tang cuốn dây thừng trên giá thép sau-trái, thùng lưới dự phòng nắp hé sau-phải. Đèn hổ phách trên giá tang nháy F0/F1. Không bao cát.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px, vuông có bệ); motif cuộn dây sau-trái
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + BASE-ONLY + `idle, empty fork yoke`. NEG.

**Status:** Needed

## ASSET-173 — tower_net_launcher_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp (Head SE vẽ sẵn). F1 nứt bê tông, bình khí xì. F2 hộp phóng bật khỏi chạc, tang dây lăn. F3–4 bụi khói. F5: bệ vuông vỡ một góc, mảnh sọc vàng còn thấy, chạc chữ U gãy, hộp xanh chanh móp nằm nghiêng, dây thừng bung; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 56 px

**Generation Prompt:** F5 BASE + `shattered square concrete plinth, hazard stripe fragments, broken steel fork, dented lime green box launcher on its side, unspooled rope, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-174 — tower_net_launcher_t1_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t1_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hộp thép tán đinh sơn xanh chanh, viền khung thép tối, 2 miệng ô vuông cạnh nhau, mỗi ô một gói lưới; ngóc ~15°. Bình khí nằm ngang treo dưới hộp, đồng hồ áp mặt tròn nhỏ. Phễu thép và tay nạp đòn bẩy gập trên đỉnh. F0 đèn đồng hồ áp hổ phách sáng, F1 tắt.

**Art Bible Anchors:**
- §3: cấp 1 "giá cố định, thêm nòng" (thêm ô); sợi chỉ hộp miệng vuông
- §4: xanh chanh chỉ trên Head

**Generation Prompt:** BASE + T1 + HEAD + `idle, both ports loaded`. NEG.

**Engine:** Head nhô ≤ 26 px trên tâm xoay (56 − 30).

**Status:** Needed

## ASSET-175 — tower_net_launcher_t1_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 1024×640 (5 hàng × 8 frame), 16 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t1_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ, 2 ô có gói. F1 ô A phụt khí, gói A rời (sinh lưới A), hộp giật 3 px. F2–4 giật về, khí tan, kim đồng hồ áp tụt. F5 ô B phụt khí, gói B rời (sinh lưới B), giật 3 px. F6–7 về 0, **cả hai ô trống**. Đề xuất (loạt 2 lưới, 2 mục tiêu), chờ GDD.

**Art Bible Anchors:**
- §3: thêm nòng (ô); §8 phụt khí không chạm mép

**Generation Prompt:** BASE + T1 + HEAD + `firing, left port air blast and recoil` (F5 đổi `right port`, F7 `both ports empty`). NEG.

**Engine:** sự kiện F1 → MuzzleA, F5 → MuzzleB. Với flipX, A/B đổi bên màn hình: luân phiên theo chỉ số ô, không theo trái/phải (như MG t1).

**Status:** Needed

## ASSET-176 — tower_net_launcher_t1_head_reload

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 10 fps, 1 lần (0.6 s) |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t1_head_reload.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 hai ô trống (= fire F7). F1 tay nạp đòn bẩy mở ra, cửa phễu hé. F2 gói thứ nhất trượt xuống ô A. F3 tay nạp đẩy, ô A đầy. F4 gói thứ hai vào ô B. F5 tay nạp gập về, cả hai ô đầy = idle F0.

**Art Bible Anchors:**
- §3: cơ chế gia công, giá cố định
- §8: frame cuối khớp idle F0

**Generation Prompt:** BASE + T1 + HEAD + `reloading, lever loading arm pushing net bundles from steel hopper into ports`. NEG.

**Engine:** Animation Event "Loaded" ở F5.

**Status:** Needed

## ASSET-177 — tower_net_launcher_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t1 phủ giàn giáo. F1–2 bụi, đập bệ bê tông. F3 sàn thép rộng trồi lên, 4 cột chữ I dựng thành khung chữ nhật. F4 lắp giằng chéo, tang quấn có động cơ, xích nâng, ống khí; hộp phóng nặng lên vòng xoay đỉnh (Head SE vẽ sẵn). F5 trùng từng pixel với ghép t2.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by open steel I-beam gantry frame on machined deck, heavy lime green box launcher facing southeast on top`. NEG.

**Status:** Needed

## ASSET-178 — tower_net_launcher_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×128, 4 frame, 6 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1: sàn thép cắt máy rộng, mép vát 45°. Tầng 2: khung chữ nhật 4 cột chữ I, giằng chéo, khoảng trống nhìn xuyên giữa các cột; sàn đỉnh với vòng xoay trống (Head gắn riêng). Sau-trái: tang quấn dây có hộp động cơ (motif cuộn dây, cấp cao nhất). Trong khung: xích nâng mang 2 gói lưới đi lên. Phải: ống khí nén chạy dọc cột tới 2 bình đứng. Mỗi frame tang quay 1/4 vòng, xích dịch 3 px; đèn hổ phách trên đỉnh khung sáng F0–1, tắt F2–3 (1.5 Hz, < 3 Hz).

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, ≤ 72 px, nhiều tầng, bệ nâng, cơ chế lộ ra); test silhouette
- §9: Stålenhag — máy công nghiệp cũ

**Generation Prompt:** BASE + T2 + BASE-ONLY + `idle, empty turret ring, chain hoist mid-cycle`. NEG.

**Engine:** khoảng trống trong khung giúp Dị Thể ở hàng ô phía sau vẫn lộ một phần (giảm vấn đề che khuất §8).

**Status:** Needed

## ASSET-179 — tower_net_launcher_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp (Head SE vẽ sẵn). F1 bình khí nổ, ống dẫn bung. F2 khung oằn, hộp phóng rơi khỏi đỉnh. F3–4 khói, xích tuột. F5: khung đổ nghiêng còn 2 cột, sàn thép lệch, tang dây lăn ra, hộp phóng xanh chanh nằm nghiêng, lưới rối; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px

**Generation Prompt:** F5 BASE + `collapsed steel gantry frame, two leaning I-beams, broken air tanks, rolled winding drum, lime green box launcher fallen, tangled nets, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-180 — tower_net_launcher_t2_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t2_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hộp phóng nặng tán đinh sơn xanh chanh, 1 miệng vuông lớn có gói lưới to (có tạ góc xanh chanh), ngóc ~15°. 2 giảm chấn thủy lực hai bên hộp. Trên đỉnh: giá băng thép hở chứa 3 gói lưới xếp chồng, ram thủy lực phía sau giá. F0 đèn hổ phách trên giá sáng, F1 tắt.

**Art Bible Anchors:**
- §3: cấp 2 "tháp pháo có động cơ, cơ chế lộ ra"; sợi chỉ hộp miệng vuông, gói lưới = sẵn sàng

**Generation Prompt:** BASE + T2 + HEAD + `idle, large net bundle loaded, three spare bundles in cassette rack`. NEG.

**Engine:** Head nhô ≤ 26 px trên tâm xoay (72 − 46).

**Status:** Needed

## ASSET-181 — tower_net_launcher_t2_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 12 fps, 1 lần (0.5 s) |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t2_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nghỉ. F1 luồng khí lớn, gói nặng rời miệng (sinh lưới), hộp giật 5 px, giảm chấn nén. F2–3 giảm chấn đẩy hộp về, khí tan. F4 van xả bên hông phụt hơi sang ngang (không lên trên). F5 về 0, **miệng trống**, giá băng vẫn còn 3 gói. Đề xuất (lưới diện rộng), chờ GDD.

**Art Bible Anchors:**
- §3: cơ chế lộ ra; §8 ≤ 16 frame/hàng, thân ≤ 72 px, chỉ còn 6 px tới 78 px

**Generation Prompt:** BASE + T2 + HEAD + `firing, large compressed air blast, hydraulic dampers compressed, heavy net bundle leaving port` (F5 `empty port`). NEG.

**Engine:** sự kiện F1 → 1 điểm sinh lưới (tâm miệng). Hơi vượt 6 px còn lại phải làm VFX riêng, không vẽ vào sheet.

**Status:** Needed

## ASSET-182 — tower_net_launcher_t2_head_reload

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 10 fps, 1 lần (0.6 s) |
| Format | PNG RGBA32 |
| Naming | `tower_net_launcher_t2_head_reload.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 miệng trống (= fire F5). F1 ram thủy lực rút, gói dưới cùng của giá băng tụt xuống. F2–3 ram đẩy gói vào miệng. F4 giá băng hạ một nấc, gói mới từ vòng xoay (đi lên qua xích của Base, che khuất) lấp chỗ trên cùng. F5 ram về, 3 gói trong giá + 1 trong miệng = idle F0.

**Art Bible Anchors:**
- §3: cơ chế lộ ra (người chơi thấy lưới được nạp tự động)
- §8: frame cuối khớp idle F0

**Generation Prompt:** BASE + T2 + HEAD + `reloading, hydraulic ram pushing net bundle from open cassette rack into port`. NEG.

**Engine:** Animation Event "Loaded" ở F5.

**Status:** Needed

## ASSET-183 — vfx_net_launcher_shot

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×64 (ô 64×64), 3 frame, đổi theo quãng bay |
| Format | PNG RGBA32 |
| Naming | `vfx_net_launcher_shot.png` (đổi tên từ `vfx_net_shot.png`, ô 48 → 64) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Gói lưới bay hướng sang phải: F0 gói tròn bó dây, F1 nửa bung, F2 bung hết (4 tạ góc xanh chanh dẫn đầu). Dây nâu 3 tông, viền `#2c2240`. Vẽ trong vùng ~44×44, chừa lề. Dùng cho t0 và t1, scale 1.0.

**Art Bible Anchors:**
- §8: VFX dùng lại mọi cấp, chỉ đổi scale; bội số 32
- §4: viền tím than cho vật do người làm

**Generation Prompt:** `flying net bundle sprite sheet, 3 frames: tight round rope bundle, half open, fully open with four lime green #b9de3a corner weights, rope brown #c08a4a 3 tones, indigo outline #2c2240, heading right, 64x64 cells, transparent background`.

**Engine:** pivot Center; xoay theo tiếp tuyến đường bay; đổi frame ở 35% / 70% quãng bay (README). Sorting layer "Projectile" như đạn cối, không làm con của tháp.

**Status:** Needed

## ASSET-184 — vfx_net_launcher_trap

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 256×64 (ô 64×64), 4 frame; F0–1 một lần, F2–3 lặp 4 fps |
| Format | PNG RGBA32 |
| Naming | `vfx_net_launcher_trap.png` (đổi tên từ `vfx_net_trap.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** F0 lưới chụp xuống, F1 đáp và siết, F2–3 giữ (dây căng/chùng 1 px). Mắt lưới vuông xoay 45° (không võng — §3), dây chính viền `#2c2240` 1 px, 4 tạ xanh chanh ở góc chạm đất. Không dùng `#e2b676` làm màu chính (chìm vào ngà sáp). Scale: t0 1.0, t1 1.0, t2 1.15 trên từng Dị Thể bị trói.

**Art Bible Anchors:**
- §4: tương phản người/sáp; §5 Dị Thể không viền, lưới có viền → tách lớp
- §3: con người = đường thẳng, 45°

**Generation Prompt:** `rope net trapping a creature, 4 frames: dropping, landing and tightening, holding loop A, holding loop B, square mesh rotated 45 degrees, straight taut cords, rope brown #c08a4a 3 tones, indigo outline #2c2240 on main cords, four lime green #b9de3a corner weights, empty center (creature drawn separately), 64x64 cells, transparent background`.

**Engine:** pivot Custom (0.5, 0.1875) = chân Dị Thể; vẽ trên Dị Thể (con của Dị Thể, order +1 trong Sorting Group của nó). Mục tiêu lớn (bậc 5, trùm): bỏ F1, chỉ F2–3, kéo x 1.12, scale theo cỡ địch, tốc độ còn 35% (giá trị bản mẫu README). Cần chụp test trên Dị Thể ngà ở Đồng bằng trắng.

**Status:** Needed

## ASSET-185 — vfx_net_launcher_burst

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×64 (ô 64×64), 3 frame, 10 fps, 1 lần (~0.3 s) |
| Format | PNG RGBA32 |
| Naming | `vfx_net_launcher_burst.png` (đổi tên từ `vfx_net_burst.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Lưới đứt khi hết giờ trói: F0 dây bật đứt ở 4 điểm, F1 mảnh dây và tạ văng ra, F2 mảnh rơi và mờ. Cùng bảng màu ASSET-184. Dùng mọi cấp, scale như trap.

**Art Bible Anchors:**
- §8: VFX dùng lại, đổi scale

**Generation Prompt:** `rope net snapping apart, 3 frames, cord fragments and lime green #b9de3a weights flying outward then falling, rope brown #c08a4a, indigo outline #2c2240, 64x64 cells, transparent background`.

**Engine:** pivot như ASSET-184.

**Status:** Needed

## ASSET-186 — vfx_net_launcher_shot_t2

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 512×96 (ô 128×96), 4 frame, đổi theo quãng bay + 1 frame đáp |
| Format | PNG RGBA32 |
| Naming | `vfx_net_launcher_shot_t2.png` (mới) |
| Texture Res | Bội số 32 — §8; vẽ đúng bán kính đề xuất 40 px, không scale |

**Visual Description:** F0 gói nặng bó dây có 6 tạ (0–60% quãng bay). F1 bung giữa không (60–85%). F2 lưới rộng phẳng căng 6 tạ (85–100%). F3 lưới đáp đất: elip dẹt 0.72 (80×58 px) phủ vùng trói, giữ 0.1 s rồi code chuyển sang ASSET-184 trên từng Dị Thể. Đề xuất (t2 lưới diện rộng), chờ GDD.

**Art Bible Anchors:**
- §8: VFX mới chỉ khi cấp có cơ chế mới
- §7: elip nén 0.72 như vòng tầm bắn

**Generation Prompt:** `heavy area net sprite sheet, 4 frames: weighted rope bundle in flight, bursting open mid-air, wide taut net with six lime green #b9de3a weights, net landed as flat ellipse squashed to 0.72, rope brown #c08a4a 3 tones, indigo outline #2c2240, top-down 3/4, 128x96 cells, transparent background`.

**Engine:** F0–2 pivot Center, layer "Projectile"; F3 pivot Center, lớp decal dưới Y-sort. Bán kính và số mục tiêu lấy từ data, không đo từ sprite.

**Status:** Needed

## ASSET-187 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/NetLauncher/Preview~/_preview_tower.png` (tạo mới) |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle (Head SE) và t2 đang bắn (fire F1). Hàng 2: cùng ô tô kín `#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng ban ngày. Kèm một bản so cạnh preview Súng máy để xác nhận 2 họ không trùng silhouette cấp.

**Art Bible Anchors:**
- §3: test silhouette; §8: Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-188 — ui_icon_tower_net_launcher_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, vẽ 64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_net_launcher_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Hộp vuông có một miệng ô vuông, phía trước miệng là mảng lưới mắt chéo 45° bung ra (3×3 mắt), đế chữ nhật nhỏ. Nét 2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°. Một icon cho mọi cấp; khác icon cối (ống nghiêng 45°) và súng máy (nòng ngang dài), nhận ra ở 32 px.

**Art Bible Anchors:**
- §7: icon = dạng vũ khí gốc, lưới 32 px

**Generation Prompt:** `flat monochrome UI icon, square box launcher with one square port and a small diagonal 45-degree net mesh bursting out, on a small rectangular base, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ | giữ |
| Pivot Head | Center (0.5, 0.5) | giữ | giữ |
| Head localPosition | (0, 0.156) = 20 px (README cũ 0.146, đo lại) | (0, 0.234) ≈ 30 px, đo từ art | (0, 0.359) ≈ 46 px, đo từ art |
| Trần cả tháp | ≤ 40 px | ≤ 56 px | ≤ 72 px |
| Head nhô trên tâm xoay | ≤ 20 px | ≤ 26 px | ≤ 26 px |
| Điểm sinh lưới | 1 | 2 (MuzzleA, MuzzleB) | 1 (tâm miệng lớn) |
| Frame sinh lưới | fire f1 | fire f1 → A, f5 → B | fire f1 |
| fire / reload | 4f 12 fps / 4f 8 fps | 8f 16 fps / 6f 10 fps | 6f 12 fps / 6f 10 fps |
| Scale shot / trap / burst | 1.0 / 1.0 / 1.0 | 1.0 / 1.0 / 1.0 | shot_t2 1.0 / 1.15 / 1.15 |

- Chọn hướng: `k = round(atan2(dy/0.72, dx)/45°)`; hàng S, SE, E, NE, N = k 2, 1, 0, 7, 6; k 3, 4, 5 dùng hàng của 1, 0, 7 với flipX.
- Điểm sinh lưới: dùng chung cấu trúc `TierMuzzleData` và quy trình marker 1 px trong `machine-gun-assets.md` (nòng → ô: t0 = 1, t1 = 2, t2 = 1). Bỏ công thức cố định "27 px, cao 13 × 0.78" của README (thuộc ống phóng cũ).
- Nhịp: `fire` → `reload` → `idle`; code không bắn khi chưa nhận event "Loaded". Thời gian nghỉ lấy từ data.
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể.

### Khớp frame khi nâng cấp / phá hủy

Như `machine-gun-assets.md`: frame cuối `t1/t2_base_upgrade` trùng từng pixel với ghép (base idle F0 cấp đích + head idle F0 hàng SE tại Head localPosition cấp đó); frame đầu trùng ghép cấp trước. Destroy vẽ sẵn Head SE (có gói) của đúng cấp. Code ẩn Head thật suốt build, upgrade, destroy.

### Atlas

| Atlas | Nội dung | Ô 128 | Dự kiến |
|---|---|---|---|
| `NetLauncher_t0` | 165–170 | 64 | 2048² (1024² không đủ khi có padding 4) |
| `NetLauncher_t1` | 171–176 | 94 | 2048² |
| `NetLauncher_t2` | 177–182 | 86 | 2048² |
| `NetLauncher_VFX` | 183–186 | 10 ô 64² + 4 ô 128×96 | 512² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tối đa ≈ 12 MB BC7 cho 3 atlas tháp (ước tính; Tight có thể đưa t0 về 1024² sau khi đo). `NetLauncher_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

Thư mục hiện chưa có `.meta` (Unity chưa import); nếu đã có khi làm, đổi tên kèm `.meta` để giữ GUID.

| File cũ | Xử lý |
|---|---|
| `tower_net_launcher_base_{idle,build,destroy}.png` | Đổi tên → `..._t0_base_*`; **vẽ lại** (bản cũ là khung thép sàn ván, không khớp t0 bao cát) |
| `tower_net_launcher_head_{idle,fire,reload}.png` | Đổi tên → `..._t0_head_*`; **vẽ lại** (ống loe → thùng gỗ miệng vuông) |
| `tower_net_launcher_base_upgrade1/2.png`, `head_upgrade1/2.png` | Xóa (§8 bỏ phụ kiện đè) |
| `vfx_net_shot.png` | Đổi tên → `vfx_net_launcher_shot.png`, xuất lại ô 64×64 |
| `vfx_net_trap.png`, `vfx_net_burst.png` | Đổi tên → `vfx_net_launcher_trap/burst.png`; đổi màu lưới theo ASSET-184 |
| `Preview~/_preview_tower.png` | Tạo mới (hiện chưa có); link artifact trong README chỉ còn là tham khảo cũ |
| `README.md` | Viết lại theo template §8: sửa "Compression None" → BC7 qua atlas, "Head 0.146" → bảng theo cấp, bỏ thép `#9fadb5`, bỏ mục phụ kiện bậc 1/2 |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Thời gian trói, tỉ lệ làm chậm mục tiêu lớn, thứ tự ưu tiên mục tiêu (hiện là giá trị bản mẫu README).
- t1: khi chỉ có 1 mục tiêu trong tầm, lưới B bắn cùng mục tiêu, giữ lại, hay bỏ?
- t2: bán kính lưới rộng (đề xuất 40 px), số mục tiêu tối đa (đề xuất 3), trói có cộng dồn / làm mới khi trúng lại không.
- Nhịp bắn và thời gian nghỉ mỗi cấp.
- Màu họ xanh chanh `#b9de3a` + hex phái sinh xanh chanh / dây thừng cần đưa vào art bible §3 (sợi chỉ họ) và §4 (màu họ tháp phụ).
- Chụp test lưới (ASSET-184) trên Dị Thể ngà ở Đồng bằng trắng trước khi chốt màu.
