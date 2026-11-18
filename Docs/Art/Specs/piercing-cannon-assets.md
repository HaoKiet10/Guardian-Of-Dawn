# Asset Specs — Entity: piercing-cannon (Pháo xuyên giáp)

> **Source**: `Assets/Art/Towers/PiercingCannon/README.md` (placeholder dựng bằng code), `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md` (bố cục Head, dữ liệu điểm sinh đạn)
> **Status**: 22 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

| | t0 · Pháo cuộn chắp vá | t1 · Ụ pháo xuyên giáp | t2 · Pháo gia tốc công nghiệp |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Base | Gò bao cát tròn méo, tấm sắt vụn làm sàn, trục bánh xe tải làm mâm xoay; thùng gỗ chứa ắc-quy xe + hũ tụ điện, nối dây kẹp, ở sau-trái | Bệ bê tông vuông vát góc 45°, một bậc nâng, sọc vàng-đen; tường chắn thấp vát 45° ở mặt trước; lồng thép tán đinh chứa 2 trụ tụ điện ở sau-trái | 2 tầng có chân chống: sàn thép cắt máy rộng đứng trên 4 chân chống thủy lực xòe ra 4 góc (đế tì xuống đất), cột xoay ngắn mập có vòng răng lộ ra; dàn tụ điện cao ở sau-trái với thanh dẫn đồng lộ, ống luồn cáp bọc giáp chạy lên cột xoay, cửa tản nhiệt |
| Head | Ống giáo thép dài làm nòng, quấn 3 cuộn dây đồng bằng băng dính; khóa nòng = mâm cặp máy tiện + ê-tô, đối trọng là khối bê tông buộc dây ở đuôi; vài tấm sắt vụn sơn xanh thép | Hộp khóa nòng bọc giáp xanh thép hình nêm (các mặt vát 45°), 2 má giá kẹp trục nòng, nòng dài với 3 vòng cuộn nạp tiện máy, đầu hãm vuông | Hộp khóa nòng lớn có nêm khóa trượt lộ ra, 2 xy-lanh giật thủy lực ngắn dưới khóa nòng (≤ 1/3 chiều dài nòng), nòng dài với 3 vỏ cuộn nạp to cắt hở thấy dây quấn đồng bên trong, đối trọng khối thép có khớp nối cáp |
| Vật liệu | Bao cát `#eabb5c`, gỗ, sắt vụn, dây, băng dính | Bê tông, thép tán đinh, sọc cảnh báo | Thép cắt máy, thủy lực, ống dẫn, thanh dẫn đồng |
| Silhouette | Gò tròn thấp + 1 vạch dài mảnh có cục nặng ở đuôi | Khối vuông có bậc + nêm + vạch dài | Sàn rộng trên 4 chân xòe + cột + vạch dài có khối đuôi lớn |

**Sợi chỉ họ pháo xuyên giáp (§3):**
1. **Một** nòng dài mảnh duy nhất ở mọi cấp (không bao giờ nhân nòng), khóa nòng nặng hình khối
   ở đuôi chiếm ≥ 1/3 chiều dài Head. Khác Súng máy (nòng ngắn hơn so với thân, t1/t2 nhiều nòng,
   hộp đạn + băng đồng thau bên trái) và Tháp bắn tỉa (súng do người cầm, chòi gỗ chân cao, khóa
   nòng mảnh). Nòng dài nhất roster ở hàng E.
2. Giáp xanh thép `#6f93bf` trên khóa nòng / vỏ nòng (t0: tấm sắt vụn sơn xanh), năng lượng cyan
   `#63f3ff` chỉ ở 3 vòng cuộn nạp, đèn tụ điện và viên đạn.
3. Motif cố định: 3 vòng cuộn nạp trên nòng (trên Head, xoay theo nòng) + khối tụ điện có đèn cyan
   luôn ở **sau-trái** của Base.

**Head / Base:** Head = khóa nòng, đối trọng, nòng, cuộn nạp (t2 thêm xy-lanh giật). Base = mọi thứ
còn lại, kể cả khối tụ điện. Không vẽ xạ thủ (tháp tự động).

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 nạp nhanh hơn và sát thương xuyên cao hơn; t2 "đạn
quá tải": đạn to hơn (bề ngang vùng trúng ×1.5), không giảm sát thương theo số Dị Thể đã xuyên. Cả
hai không thêm cơ chế hình ảnh mới → VFX chỉ đổi scale.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** xanh thép sáng `#9bb8dc` / gốc
`#6f93bf` / tối `#4a6a94`; cyan năng lượng lõi `#d8fdff` / gốc `#63f3ff` / tối `#25a9c4`. Bê tông,
thép, vàng cảnh báo dùng hex phái sinh của `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Một nòng ở mọi cấp**, cấp lên bằng đổi khối (bao cát → bệ bê tông → sàn chân chống), không
  nhân nòng — để không lẫn Súng máy (t1 2 nòng, t2 6 nòng).
- **Cyan `#63f3ff` giữ** (liên tục với README), nhưng chỉ ở dạng vòng/dải chữ nhật và vệt đạn thẳng,
  không bao giờ dạng tinh thể có cạnh — vì "Lạnh" (`#7fd6ff`) được nhận qua hình tinh thể (§4).
- **t2 dùng chân chống xòe 4 góc**, không dùng "trống xoay 3 tầng" như cối/súng máy t2 — giữ ngữ pháp
  công nghiệp nhưng silhouette t2 riêng của họ (pháo giật mạnh cần neo đất).
- **t0 theo art bible §3** (bao cát, sắt vụn, thùng ắc-quy), **không** theo README cũ (bệ bê tông
  vuông + 2 trụ tụ điện — chuyển thành t1).
- **Trần chiều cao áp dụng cả hàng N/NE:** nòng hàng N rút ngắn phối cảnh để Head nhô ≤ trần − m;
  hàng E mang chiều dài đầy đủ — vì §3 "chiều cao không có ngoại lệ".
- **Nòng dài tối đa (tâm xoay → miệng nòng, hàng E):** 45 / 55 / 62 px — t0/t1 theo ngoại lệ ≤ 10 px
  của §3; t2 bị chặn ở 62 px bởi lề ≥ 2 px mép ô (thấp hơn 64.5 px mà % cho phép).
- **Base không có anim `charge`:** tín hiệu nạp nằm trên Head (xoay theo nòng, thấy ở mọi hướng) — giữ
  công thức 12 + 3A = 18 sheet tháp (A = head charge + head fire).
- **t2 fire 6 frame 18 fps (0.33 s)** để thấy xy-lanh giật nén và hồi; t0/t1 giữ 4 frame 12 fps theo
  README — cùng thời lượng, nhịp bắn trong data không đổi.
- **Không VFX theo cấp:** đạn scale 1.0 / 1.2 / 1.5, chớp đầu nòng 1.0 / 1.25 / 1.5 — §8, vì đề xuất
  t1/t2 không thêm cơ chế hình ảnh mới.
- **Ô VFX chớp đầu nòng 48 → 64 px** — §8 yêu cầu bội số 32.
- **Anim `fire`: frame 0 = chớp và sinh đạn** (ngoại lệ "frame 0 = tư thế nghỉ" như cối) — README đã
  bắn ở frame 0.
- **Không thêm VFX trúng/xuyên** (thêm asset là thêm scope) — ghi vào câu hỏi mở.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**NEG+ (thêm sau NEG cho mọi sheet tháp này):** `multiple barrels, twin barrels, rotary gatling, ammo belt, brass cartridges, sniper rifle, human gunner, wooden watchtower, stilts, ice crystals, snowflakes, sagging curves`

**T0:** `low round irregular improvised coil cannon nest, ragged ring of sandbags #eabb5c, scrap metal plate floor, truck axle swivel, one long thin steel scaffold-pipe barrel wrapped with three taped copper wire coils glowing cyan #63f3ff, heavy blocky breech made from a lathe chuck and vise, concrete block counterweight tied at the rear, a few scrap plates painted blue steel #6f93bf, wooden crate of car batteries and jar capacitors with jumper cables at rear-left with cyan indicator lamp, about 70px wide 40px tall`

**T1:** `square concrete plinth with 45° chamfered corners and one raised step, yellow-black hazard stripes #f0b429, low sloped 45° concrete blast wall at the front, wedge-shaped armoured breech housing in blue steel #6f93bf with angled faces, two cheek plates holding the trunnion, one long thin barrel with three machined coil rings glowing cyan #63f3ff, square muzzle brake, riveted steel cage with two capacitor cylinders at rear-left with cyan indicator lamp, no sandbags, about 90px wide 56px tall`

**T2:** `two-level industrial rail accelerator cannon emplacement, wide machined steel deck standing on four splayed hydraulic outrigger jacks with ground pads at the corners, short thick turret column with exposed gear ring, large blue steel #6f93bf breech with exposed sliding breech block, two short hydraulic recoil cylinders under the breech, one long thin barrel with three large cut-away coil housings showing copper windings glowing cyan #63f3ff, steel counterweight block with cable coupling, tall capacitor bank with exposed copper busbars at rear-left, armoured cable conduit to the turret, cooling vents, about 109px wide 72px tall, Stålenhag-style industrial materials`

**HEAD (thêm cuối prompt Head):** `weapon only, no emplacement, no ground, centered, facing <direction>`.
**BASE-ONLY (thêm cuối prompt Base idle):** `base only, empty mount`.

Head sheet: 5 hàng S, SE, E, NE, N (flipX cho SW, W, NW). Hàng E nòng dài nhất (45 / 55 / 62 px từ
tâm xoay); hàng S thấy mặt đầu hãm và vòng cuộn nạp đồng tâm; hàng N thấy lưng khóa nòng + đối trọng
che gốc nòng, nòng rút ngắn phối cảnh để Head nhô ≤ trần − m. Khối tụ điện nằm trên Base nên luôn ở
sau-trái màn hình, không xoay.

Chung mọi sheet: theo `mortar-assets.md` (RGBA32, ≥ 2 px lề trong suốt, lửa / chớp / mảnh destroy
không chạm mép, Bilinear, tắt mipmap, tắt Read/Write, Mesh Tight, BC7 HQ qua Atlas V2 Standalone
override; None nếu vỡ khối viền). Không nhấp nháy toàn màn hình; ánh cyan nạp là sáng dần, không chớp.

---

## ASSET-240 — tower_piercing_cannon_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t0_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Gò bao cát tròn méo thấp (~14 px), sàn tấm sắt vụn, trục bánh xe tải dựng
giữa làm mâm xoay trống (Head gắn riêng). Sau-trái: thùng gỗ hở chứa 2 ắc-quy xe và 3 hũ tụ điện,
dây kẹp đỏ-đen vắt sang trục. F0 đèn cyan trên thùng sáng, F1 tắt.

**Art Bible Anchors:** §3 t0 (≤ 40 px, bao cát chỉ ở t0, chắp vá tại chỗ); §4 viền, 3 tông; motif
tụ điện sau-trái.

**Generation Prompt:** BASE + T0 + BASE-ONLY + `idle, indicator lamp on`. NEG + NEG+.

**Status:** Needed

## ASSET-241 — tower_piercing_cannon_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây. F1 nền đất, nửa sau vòng bao cát. F2 xong vòng cát, đặt sàn
sắt vụn. F3 dựng trục xoay, khiêng thùng ắc-quy vào sau-trái. F4 đặt ống nòng quấn dây lên trục (Head
SE vẽ sẵn), đèn cyan bật lần đầu. F5 trùng từng pixel với ghép t0 (base idle F0 + head idle F0 SE tại
Head localPosition t0).

**Art Bible Anchors:** §8 chỉ t0 có build; Head SE vẽ sẵn; frame cuối = idle F0.

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string, cannon facing southeast`. NEG + NEG+.

**Status:** Needed

## ASSET-242 — tower_piercing_cannon_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (Head SE vẽ sẵn). F1 nứt, tia lửa ở thùng ắc-quy. F2 ống nòng
bật văng, bao cát tung, cuộn dây bung. F3–4 khói. F5 đống đổ nát: bao cát rải, ống nòng dài nằm chéo
qua đống, khối bê tông đối trọng lăn ra, thùng ắc-quy vỡ; 2 tông, không viền, không cyan. Chevron mờ
và 4 dấu góc ô do UI vẽ.

**Art Bible Anchors:** §7 đống đổ nát 2 tông, mất viền; §8 destroy mỗi cấp.

**Generation Prompt:** F0–4 BASE + T0 + `explosion, debris flying, sparks`; F5 BASE + `rubble of improvised sandbag cannon nest, long pipe barrel lying diagonally, concrete counterweight block, broken battery crate, two-tone, no outline`. NEG + NEG+.

**Status:** Needed

## ASSET-243 — tower_piercing_cannon_t0_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t0_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Ống giáo thép dài mảnh, 3 cuộn dây đồng quấn băng dính (cyan tối, chưa nạp);
khóa nòng = mâm cặp máy tiện kẹp trong ê-tô; khối bê tông buộc dây làm đối trọng ở đuôi; 2–3 tấm sắt
vụn sơn xanh thép ốp khóa nòng. F0 đèn cảm biến nhỏ trên khóa nòng sáng, F1 tắt. Hàng E: nòng 45 px
từ tâm xoay, đuôi ≤ 30 px.

**Art Bible Anchors:** §3 t0 (gắn tay, lộ thiên), từ vựng "nòng dài mảnh"; §8 Head 5 hàng.

**Generation Prompt:** BASE + T0 + HEAD + `idle, coils unlit`. NEG + NEG+.

**Engine:** Head nhô ≤ 24 px trên tâm xoay (40 − 16).

**Status:** Needed

## ASSET-244 — tower_piercing_cannon_t0_head_charge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 6 fps, 1 lần (0.67 s) |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t0_head_charge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0. F1 cuộn sau (gần khóa nòng) sáng cyan. F2 thêm cuộn giữa, dây
quấn rung 1 px. F3 cả 3 cuộn sáng, đầu nòng có quầng cyan nhỏ (trong ô, không chạm mép). Sáng dần
từ sau ra trước, không nhấp nháy.

**Art Bible Anchors:** §4 cyan chỉ ở vòng cuộn; §7 không chớp; motif 3 cuộn.

**Generation Prompt:** BASE + T0 + HEAD + `charging, N of 3 wire coils glowing cyan from the breech forward`. NEG + NEG+.

**Engine:** giữ F3 nếu nạp xong mà chưa bắn; mất mục tiêu → về idle (chưa có anim xả, xem câu hỏi mở).

**Status:** Needed

## ASSET-245 — tower_piercing_cannon_t0_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 12 fps, 1 lần (0.33 s) |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t0_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 sinh đạn, cuộn tắt phụt, nòng giật lùi 6 px, khối đối trọng nảy 1 px, dây
buộc lắc. F1–2 nòng về 4 / 2 px, khói mỏng từ cuộn dây. F3 về 0 (= idle F0). Chớp đầu nòng là VFX
riêng (ASSET-259), không vẽ vào sheet.

**Art Bible Anchors:** §8 ngoại lệ frame 0 cho fire; chớp không vẽ vào sprite tháp.

**Generation Prompt:** BASE + T0 + HEAD + `firing, barrel recoiled backward, coils just discharged, thin smoke`. NEG + NEG+.

**Engine:** sự kiện sinh đạn ở F0; 1 điểm sinh đạn mỗi hàng.

**Status:** Needed

## ASSET-246 — tower_piercing_cannon_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t0 phủ giàn giáo thép. F1–2 bụi, tháo bao cát và thùng ắc-quy. F3
bệ bê tông vuông vát góc nhô lên, tường chắn vát trước đổ xong. F4 lồng 2 trụ tụ điện đặt vào
sau-trái, Head t1 (hộp nêm xanh thép) hạ xuống cột, hướng SE vẽ sẵn. F5 trùng từng pixel với ghép t1.
Đổi khối nền, không chồng phụ kiện.

**Art Bible Anchors:** §1 nguyên tắc 1; §8 upgrade (giàn giáo → bụi → công trình mới).

**Generation Prompt:** BASE + `construction transition, scaffolding and dust, sandbag nest replaced by square chamfered concrete plinth with sloped blast wall, armoured wedge breech cannon facing southeast`. NEG + NEG+.

**Status:** Needed

## ASSET-247 — tower_piercing_cannon_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bê tông vuông vát góc 45°, một bậc nâng, sọc vàng-đen ở mép bậc; tường
chắn thấp vát 45° ở mặt trước (không che chỗ Head); cột thép ngắn đội mâm xoay trống. Sau-trái: lồng
thép tán đinh chứa 2 trụ tụ điện, đèn cyan F0 sáng / F1 tắt. Không bao cát.

**Art Bible Anchors:** §3 t1 (~70%, ≤ 56 px, bát giác/vuông có bệ); §9 Stålenhag.

**Generation Prompt:** BASE + T1 + BASE-ONLY + `idle`. NEG + NEG+.

**Status:** Needed

## ASSET-248 — tower_piercing_cannon_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp (Head SE vẽ sẵn). F1 nứt bê tông, trụ tụ điện phóng tia lửa. F2 hộp
nêm bật khỏi giá, nòng gãy đôi. F3–4 khói, bụi. F5: bệ vỡ một góc, tường chắn đổ, mảnh sọc vàng còn
thấy, nòng gãy nằm chéo, trụ tụ điện lăn; 2 tông, không viền, không cyan.

**Art Bible Anchors:** §7; §3 ≤ 56 px.

**Generation Prompt:** F5 BASE + `shattered square concrete plinth, toppled sloped blast wall, hazard stripe fragments, broken long barrel lying diagonally, fallen capacitor cylinders, two-tone, no outline`. NEG + NEG+.

**Status:** Needed

## ASSET-249 — tower_piercing_cannon_t1_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t1_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hộp khóa nòng hình nêm bọc giáp xanh thép `#6f93bf`, các mặt vát 45°, đinh
tán ở mép; 2 má giá kẹp trục nòng; một nòng dài mảnh với 3 vòng cuộn nạp tiện máy (cyan tối); đầu hãm
vuông. Hàng E: nòng 55 px từ tâm xoay. Hàng N: thấy lưng nêm che gốc nòng. F0 đèn cảm biến sáng, F1
tắt.

**Art Bible Anchors:** §3 t1 (giá cố định, cỡ to hơn); sợi chỉ: một nòng, khóa nòng nặng.

**Generation Prompt:** BASE + T1 + HEAD + `idle, coils unlit`. NEG + NEG+.

**Engine:** Head nhô ≤ 56 − m1 (m1 đề xuất 26 → ≤ 30 px).

**Status:** Needed

## ASSET-250 — tower_piercing_cannon_t1_head_charge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 6 fps, 1 lần (0.67 s, chờ GDD) |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t1_head_charge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Như t0: F1–F3 vòng cuộn sáng lần lượt từ khóa nòng ra đầu nòng; thêm khe tản
nhiệt trên nêm hắt cyan nhẹ ở F3; quầng cyan nhỏ ở đầu hãm F3. Không nhấp nháy.

**Art Bible Anchors:** §4 cyan chỉ dạng vòng; §7.

**Generation Prompt:** BASE + T1 + HEAD + `charging, N of 3 machined coil rings glowing cyan from the breech forward`. NEG + NEG+.

**Engine:** nếu GDD rút ngắn nạp ở t1, đổi fps (giữ 4 frame), không vẽ lại.

**Status:** Needed

## ASSET-251 — tower_piercing_cannon_t1_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 12 fps, 1 lần (0.33 s) |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t1_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 sinh đạn, vòng cuộn tắt, nòng trượt lùi trong má giá 8 px. F1–2 về 5 / 2
px, hơi trắng mỏng thoát từ đầu hãm vuông sang hai bên. F3 về 0 (= idle F0).

**Art Bible Anchors:** §8 ngoại lệ frame 0; chớp là VFX riêng.

**Generation Prompt:** BASE + T1 + HEAD + `firing, barrel recoiled into cradle, vented gas at square muzzle brake`. NEG + NEG+.

**Engine:** sinh đạn F0, 1 điểm mỗi hàng.

**Status:** Needed

## ASSET-252 — tower_piercing_cannon_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t1 phủ giàn giáo. F1–2 bụi, đập bệ bê tông. F3 sàn thép hạ xuống, 4
chân chống thủy lực xòe ra cắm đế xuống đất. F4 cột xoay và dàn tụ điện dựng lên, ống cáp nối, Head t2
SE vẽ sẵn. F5 trùng từng pixel với ghép t2.

**Art Bible Anchors:** §1 nguyên tắc 1; §8; §3 ≤ 72 px.

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, concrete plinth replaced by machined steel deck on four splayed hydraulic outrigger jacks, rail accelerator cannon facing southeast`. NEG + NEG+.

**Status:** Needed

## ASSET-253 — tower_piercing_cannon_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1: sàn thép cắt máy rộng (~109 px) trên 4 chân chống thủy lực xòe 45° ở
4 góc, đế tì xuống đất. Tầng 2: cột xoay ngắn mập, vòng răng lộ ra (Head trống). Sau-trái: dàn tụ điện
cao (≤ 56 px, thấp hơn Head) với thanh dẫn đồng lộ, ống luồn cáp bọc giáp chạy lên cột; cửa tản nhiệt
ở hông sàn. F0 đèn cyan trên dàn tụ sáng, F1 tắt.

**Art Bible Anchors:** §3 t2 (~85%, ≤ 72 px, nhiều tầng, cơ chế lộ ra); test silhouette.

**Generation Prompt:** BASE + T2 + BASE-ONLY + `idle, empty turret ring`. NEG + NEG+.

**Status:** Needed

## ASSET-254 — tower_piercing_cannon_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp (Head SE vẽ sẵn). F1 dàn tụ phóng tia lửa, cáp đứt. F2 một chân chống
gãy, sàn sụp nghiêng, Head bật khỏi cột. F3–4 khói dày. F5: sàn thép nghiêng trên 3 chân, chân gãy
nằm cạnh, dàn tụ đổ, nòng dài nằm chéo; 2 tông, không viền, không cyan.

**Art Bible Anchors:** §7; §3 ≤ 72 px; §8 mảnh không chạm mép.

**Generation Prompt:** F5 BASE + `wrecked steel gun deck tilted on broken outrigger jacks, toppled capacitor bank, long barrel fallen diagonally, two-tone, no outline`. NEG + NEG+.

**Status:** Needed

## ASSET-255 — tower_piercing_cannon_t2_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t2_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hộp khóa nòng lớn xanh thép với nêm khóa trượt lộ ra; 2 xy-lanh giật thủy lực
ngắn dưới khóa nòng (thép `#4a505e`, không cùng màu nòng, ≤ 1/3 chiều dài nòng để không đọc thành
nòng thứ hai); nòng dài với 3 vỏ cuộn nạp to cắt hở thấy dây đồng quấn bên trong; đối trọng khối thép
có khớp cáp ở đuôi. Hàng E: nòng 62 px. F0/F1 cuộn nạp thở cyan rất nhẹ (chờ), đèn cảm biến F0.

**Art Bible Anchors:** §3 t2 (tháp pháo có động cơ, cơ chế lộ ra); sợi chỉ: một nòng.

**Generation Prompt:** BASE + T2 + HEAD + `idle, coils faint glow`. NEG + NEG+.

**Engine:** Head nhô ≤ 72 − m2 (m2 đề xuất 38 → ≤ 34 px).

**Status:** Needed

## ASSET-256 — tower_piercing_cannon_t2_head_charge

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 6 fps, 1 lần (0.67 s, chờ GDD) |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t2_head_charge.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nêm khóa trượt đóng lại. F1–F3 3 vỏ cuộn sáng lần lượt, dây đồng bên trong
đổi sang cyan qua khe cắt; F3 quầng cyan dọc nòng và ở miệng nòng, khớp cáp đuôi sáng. Không nhấp
nháy.

**Art Bible Anchors:** §3 cơ chế lộ ra; §4 cyan dạng vòng; §7.

**Generation Prompt:** BASE + T2 + HEAD + `charging, sliding breech block closed, N of 3 cut-away coil housings glowing cyan`. NEG + NEG+.

**Status:** Needed

## ASSET-257 — tower_piercing_cannon_t2_head_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×640 (5 hàng × 6 frame), 18 fps, 1 lần (0.33 s) |
| Format | PNG RGBA32 |
| Naming | `tower_piercing_cannon_t2_head_fire.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 sinh đạn, cuộn tắt, nòng giật 10 px, 2 xy-lanh nén hết. F1–4 xy-lanh đẩy
nòng về 7 / 4 / 2 / 1 px, nêm khóa trượt mở, hơi trắng xả ở khe cuộn. F5 về 0 (= idle F0). Đề xuất
(đạn quá tải), chờ GDD.

**Art Bible Anchors:** §3 cơ chế lộ ra; §8 ngoại lệ frame 0, ≤ 16 frame/hàng.

**Generation Prompt:** BASE + T2 + HEAD + `firing, barrel fully recoiled, hydraulic cylinders compressed, steam venting from coil slits, breech block sliding open`. NEG + NEG+.

**Engine:** sinh đạn F0; hơi xả vượt ô phải làm VFX riêng, không vẽ vào sheet.

**Status:** Needed

## ASSET-258 — vfx_piercing_cannon_bolt

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 128×32 (ô 64×32), 2 frame, 20 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_piercing_cannon_bolt.png` (đổi tên từ `vfx_piercing_bolt.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Viên đạn năng lượng thẳng, dài, đầu đạn bên phải: lõi trắng `#d8fdff`, thân
cyan `#63f3ff`, đuôi vệt thuôn nhọn `#25a9c4`; viền `#2c2240` 1 px ở đầu đạn. Không có cạnh tinh thể.
F1 vệt đuôi dài hơn 4 px. Scale (bề ngang) 1.0 / 1.2 / 1.5 theo cấp.

**Art Bible Anchors:** §8 VFX dùng lại, đổi scale; §4 tránh hình tinh thể (Lạnh).

**Generation Prompt:** `straight energy bolt projectile, 2 frames, long and thin, white core #d8fdff, cyan #63f3ff body, tapering dark cyan #25a9c4 tail, nose pointing right, no crystals, no sparkles, 64x32 cells, transparent background`.

**Engine:** xoay theo góc thật tới mục tiêu (không theo 8 hướng Head), ~1300 px/s; sorting layer "Projectile" như cối; không làm con của tháp.

**Status:** Needed

## ASSET-259 — vfx_piercing_cannon_muzzle_blast

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×64 (ô 64×64, vẽ trong 60×60), 3 frame, 14 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_piercing_cannon_muzzle_blast.png` (đổi tên + vẽ lại từ `vfx_cannon_blast.png`, ô 48 → 64) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Chớp đầu nòng hướng phải: F0 vòng sáng dẹt lõi trắng rìa cyan, F1 hai luồng
hơi bắn ngang ra hai bên (hợp với đầu hãm), F2 hơi tan xám. Không dùng hổ phách/cam (tránh lẫn súng
máy, phun lửa). Scale 1.0 / 1.25 / 1.5.

**Art Bible Anchors:** §8 VFX dùng lại; §7 không phải chớp toàn màn hình.

**Generation Prompt:** `muzzle blast sprite sheet, 3 frames, flat ring burst pointing right, white core cyan #63f3ff rim, side gas jets, grey dissipating vapour, 64x64 cells, transparent background`.

**Engine:** pivot (0, 0.5) đặt tại điểm sinh đạn, xoay theo hướng Head.

**Status:** Needed

## ASSET-260 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/PiercingCannon/Preview~/_preview_tower.png` (tạo mới) |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle (Head hướng E để thấy nòng dài nhất) và t2 đang bắn
(fire F0 + chớp). Hàng 2: cùng ô tô kín `#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng
trắng. Đặt cạnh ô t1 của Súng máy và Tháp bắn tỉa để kiểm tra không lẫn họ.

**Art Bible Anchors:** §3 test silhouette (thứ tự cấp < 1 s, nhận ra họ); §8 Preview~.

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-261 — ui_icon_tower_piercing_cannon_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_piercing_cannon_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Khối khóa nòng vuông to ở trái + một nòng dài rất mảnh nằm ngang sang phải,
3 vạch ngang cắt qua nòng (cuộn nạp), nét 2 px, một màu hổ phách trên `#1a1528`, chỉ góc 90°/45°.
Nhận ra ở 32 px; khác icon súng máy (không có hộp đạn, khóa nòng to hơn, nòng dài hơn).

**Art Bible Anchors:** §7 icon = dạng vũ khí gốc, một icon mọi cấp.

**Generation Prompt:** `flat monochrome UI icon, heavy square breech block on the left with one very long thin horizontal barrel to the right crossed by three short coil ticks, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ | giữ |
| Pivot Head | Center (0.5, 0.5) | giữ | giữ |
| Head localPosition (m đề xuất) | (0, 0.125) = 16 px | (0, 0.203) = 26 px, đo lại từ art | (0, 0.297) = 38 px, đo lại từ art |
| Trần cả tháp | ≤ 40 px | ≤ 56 px | ≤ 72 px |
| Head nhô trên tâm xoay (cả hàng N) | ≤ 24 px | ≤ 30 px | ≤ 34 px |
| Nòng hàng E (tâm xoay → miệng) | ≤ 45 px | ≤ 55 px | ≤ 62 px (chặn bởi lề 2 px) |
| Đuôi khóa nòng hàng E | ≤ 30 px | ≤ 40 px | ≤ 50 px |
| Điểm sinh đạn | 1 / hàng | 1 / hàng | 1 / hàng |
| Frame sinh đạn | fire F0 | fire F0 | fire F0 |
| Scale bolt / muzzle blast | 1.0 / 1.0 | 1.2 / 1.25 | 1.5 / 1.5 |

- m = độ cao tâm xoay Head so với mặt đất (y = 48 px). README cũ ghi 20 px — thay bằng bảng này.
- Chọn hướng: `k = round(atan2(dy/0.72, dx)/45°)`; hàng S, SE, E, NE, N = k 2, 1, 0, 7, 6; k 3, 4, 5
  dùng hàng của 1, 0, 7 với flipX.
- Nhịp (README, giữ đến khi có GDD): tìm hướng → `charge` 0.67 s → `fire` 0.33 s → nguội 0.9 s (idle).
- Dữ liệu điểm sinh đạn: dùng nguyên `TierMuzzleData` của `machine-gun-assets.md` (marker 1 px, JSON,
  ScriptableObject mỗi cấp), `muzzles[5][1]`.
- Khớp frame upgrade/destroy: như `machine-gun-assets.md` (F cuối upgrade trùng từng pixel ghép cấp
  đích; code ẩn Head thật suốt upgrade và destroy).
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `PiercingCannon_t0` | 240–245 | 64 | 2048² (1024² không đủ chỗ cho padding) |
| `PiercingCannon_t1` | 246–251 | 64 | 2048² |
| `PiercingCannon_t2` | 252–257 | 74 | 2048² |
| `PiercingCannon_VFX` | 258, 259 | 2 ô 64×32 + 3 ô 64² | 256² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tối đa ≈ 12 MB BC7 cho 3 atlas tháp
(ước tính, Mesh Tight thường giảm). `PiercingCannon_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_piercing_cannon_base_{idle,build,destroy}.png` | Đổi tên → `..._t0_base_*` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới (bao cát, không bê tông) |
| `tower_piercing_cannon_head_{idle,charge,fire}.png` | Đổi tên → `..._t0_head_*` (kèm `.meta`); vẽ lại |
| `base_upgrade1/2.png`, `head_upgrade1/2.png` (+ `.meta`) | Xóa |
| `vfx_piercing_bolt.png` | Đổi tên → `vfx_piercing_cannon_bolt.png` (kèm `.meta`) |
| `vfx_cannon_blast.png` | Đổi tên → `vfx_piercing_cannon_muzzle_blast.png` (kèm `.meta`); vẽ lại ô 64, slice lại |
| `Preview~/_preview_tower.png` | Tạo mới |
| `README.md` | Viết lại theo template §8; sửa Base t0, "Head 20 px" → bảng theo cấp, "Compression None" → BC7 qua atlas, hex phái sinh |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Lối chơi t1/t2 (nạp nhanh hơn, đạn quá tải) và thời gian nạp mỗi cấp — chỉ đổi fps `charge`.
- Mất mục tiêu giữa lúc nạp: hủy tức thì về idle hay cần anim xả (`charge_cancel`, thêm 3 sheet).
- VFX trúng/xuyên mỗi Dị Thể (`vfx_piercing_cannon_pierce_hit`) để đọc được "xuyên" — cần producer
  duyệt scope; ID dự phòng ASSET-262.
- Hơi xả t2 fire: có cần VFX riêng hay để trong ô.
- Cyan `#63f3ff` cạnh "Lạnh" `#7fd6ff`: cần chụp test cạnh tháp làm lạnh và Dị Thể bị làm chậm; nếu
  lẫn, đổi năng lượng sang hổ phách-trắng (chỉ đổi palette, không vẽ lại khối).
- Hex phái sinh ở đầu file và màu họ (`#6f93bf`, `#63f3ff`) cần đưa vào art bible §4.
