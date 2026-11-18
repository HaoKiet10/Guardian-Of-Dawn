# Asset Specs — Entity: sniper-nest (Tháp bắn tỉa)

> **Source**: `Assets/Art/Towers/SniperNest/README.md` (placeholder); **chưa có trong GDD** — tháp thứ 12 đề xuất, cần thêm vào `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (art-director)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md` (bố cục Head 5 hàng)
> **Status**: 18 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

Vai trò (theo README, đề xuất): tầm xa nhất, ~1 phát / 2 s, 1 mục tiêu, sát thương cao; ưu
tiên Dị Thể đặc biệt (Sáp hồi phục, Sáp kích động, Bậc 4 thấu kính), không có thì bắn con
đi xa nhất; nạp đạn sau mỗi 5 phát.

| | t0 · Tổ bắn tỉa dã chiến | t1 · Chòi thép trên bệ bê tông | t2 · Tháp quan sát công nghiệp |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Sàn xạ thủ (mặt sàn trên mặt đất) | 16 px | 32 px | 48 px |
| Khối nền | Gò tròn méo thấp: 2 thùng phuy + pallet chồng đỡ sàn ván | Bệ bê tông vuông vát cạnh; 4 chân thép tán đinh vuốt vào trong, giằng chữ X; sàn vuông thép chống trượt | 3 tầng: móng thép cắt máy bậc thang + 4 chân chống thủy lực; trụ thép dày có thang nâng đạn xích lộ ra; mâm xoay có động cơ, vành răng lộ ra |
| Vật liệu | Bao cát `#eabb5c` (nửa vòng phía sau sàn), ván, thùng phuy gỉ, rebar, dây | Bê tông, thép tán đinh, sọc vàng-đen `#f0b429` | Thép cắt máy, xy-lanh thủy lực, ống dẫn, xích, hộp động cơ |
| Giá súng (vũ khí theo §3) | Tì tay lên bao cát, lộ thiên | Vòng tì súng thép cố định quanh mép sàn (giá cố định 360°) | Mâm xoay có động cơ + thang nâng đạn tự động (cơ chế lộ ra) |
| Motif kính đo xa (sau-phải sàn) | Ống nhòm treo trên cọc rebar | Kính đo xa trên giá thép bắt bu-lông | Thanh đo xa lập thể có động cơ trên tay đòn |
| Silhouette | Gò tròn thấp + chấm người + gạch súng | Hình thang rỗng (giàn chân) + nắp phẳng | Bậc thang rộng + trụ + mâm xòe (chữ T trên bậc) |

**Sợi chỉ họ bắn tỉa (§3):**
1. Dạng nguyên thủy: **sàn ngắm nâng cao, mặt sàn rộng hơn phần đỡ bên dưới, trên đó một
   người quỳ cầm súng dài mảnh có ống ngắm to**. Sàn cao dần 16 / 32 / 48 px; dáng này khác
   pháo xuyên giáp (nòng dài gắn máy, không người) và cột thu sáng (kim mảnh, không mâm).
2. Màu họ: olive `#7d8f3a` trên báng súng và lớp bọc ống ngắm (nằm trên vũ khí, thuộc lớp
   Gunner nên giống hệt ở mọi cấp).
3. Motif: kính đo xa ở **sau-phải** sàn, có chấm lóe hổ phách `#ff9f1c`; đổi vật liệu theo
   cấp, không đổi vị trí.

**Gunner / Base:** Gunner = người xạ thủ + súng + túi đạn trên ngực (vai trò lớp Head, §8:
5 hàng + flipX). Base = mọi thứ còn lại, gồm motif kính đo xa. Xạ thủ mặc **đồ thợ máy trung
tính xám xanh, không sọc cam** (§5), cùng một người, cùng tỉ lệ ở mọi cấp, chỉ ngồi cao hơn.
Cấp đọc **chỉ** qua khối Base và chevron.

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 giá tì cố định → tầm +15%, sát thương +25%;
t2 thang nâng đạn → băng 7 phát và nạp nhanh hơn (~0.6 s), kính đo xa có động cơ phát hiện
Dị Thể đặc biệt ở tầm xa hơn. Mọi cấp: đánh dấu mục tiêu ưu tiên bằng khung ngắm (ASSET-280).

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** olive sáng `#9aab4f` / gốc
`#7d8f3a` / tối `#5a682a`; đồ thợ máy `#8d9aa8` / `#6f7d8c` / `#4f5966`. Thép súng `#323845`,
bê tông, thép, vàng cảnh báo dùng bộ phái sinh của `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Dùng chung sheet Gunner cho cả 3 cấp** (4 file, không có token `t<N>`): §5 nói xạ thủ
  không bao giờ báo cấp, nên vẽ 3 bộ giống nhau là lãng phí; chỉ `localPosition` đổi theo cấp.
- **Số file tháp = 13** (9 Base + 1 Gunner idle + 3 Gunner hành động), thay vì 12 + 3A = 21
  theo công thức §8 — ngoại lệ công thức, cần ghi vào art bible.
- **Tên file Gunner giữ nguyên tên cũ** `tower_sniper_nest_gunner_<anim>.png` (không token
  cấp = dùng mọi cấp): giữ GUID `.meta`, không phải đổi tên; ngoại lệ mẫu đặt tên §8.
- **Hộp bao Gunner: ≤ 24 px trên mặt sàn ở mọi hàng, mọi frame** (kể cả hàng N/NE khi nòng
  chĩa lên màn hình): lý do — chiều cao không có ngoại lệ (§3), nên sàn = trần cấp − 24
  (16 / 32 / 48 px). Súng dài 22 px (6 px sau vai + 16 px trước vai), người quỳ ~17 px.
- **Tư thế quỳ, không nằm:** đọc được là người ở ô 128 và reload rõ; nằm sấp quá thấp,
  khó đọc thành "người".
- **15% silhouette đo ở t0** (trường hợp xấu nhất vì Gunner cùng cỡ mọi cấp), tính cả súng:
  ước ~13%. Ở t1/t2 tỉ lệ tự giảm.
- **Vùng cấm trước xạ thủ:** Gunner luôn vẽ đè Base, nên Base không có gì cao quá 4 px trên
  mặt sàn ở nửa trước sàn, và điểm quỳ cách mép trước sàn ≥ 6 px (tránh sai chiều sâu).
  Bao cát t0 và tấm chắn t2 chỉ ở nửa sau sàn.
- **Thang cấp nằm ở Base, không ở súng:** súng giống nhau mọi cấp (sợi chỉ #1, #2); "vũ khí
  theo cấp" của §3 thể hiện qua giá súng (tì tay → vòng tì cố định → mâm xoay có động cơ).
- **Tia ngắm không dùng đỏ:** đỏ `#e2412f` dành cho "nguy hiểm + tam giác" (§4). Tia ngắm
  (LineRenderer, code) = hổ phách `#ff9f1c`, nét liền 1 px, alpha 50%, chỉ trong lúc `aim`.
- **Chớp đầu nòng không vẽ vào sheet Gunner** (chỉ VFX riêng): giữ hộp bao 24 px sạch.
- **Đống đổ nát không có người:** khói che xạ thủ ở F2 của destroy; giữ tông "u ám nhưng hy
  vọng" và khớp README "xạ thủ biến mất cùng tháp".
- **Đổi tên VFX** `vfx_sniper_*` → `vfx_sniper_nest_*` cho khớp `<owner>` = tên snake thư mục (§8).
- **Vỏ đạn không dùng đồng thau `#d9a441`** (màu họ súng máy); vỏ đạn thép xám, vẽ trong
  sheet `fire`, không thành VFX riêng (1 vỏ mỗi 2 s, không đáng một sheet).
- Anim `fire`: ngoại lệ "frame 0 = tư thế nghỉ" (§8), như cối — F0 là giật và lúc bắn.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**NEG-G** (mọi prompt có xạ thủ — build, destroy, upgrade, sheet Gunner): NEG bỏ `soldiers, characters`, thêm `, orange stripes, white hazmat suit, visible face, squad insignia, more than one person, branded real-world rifle, red laser`.

**T0:** `low round irregular improvised sniper perch, two rusty oil drums and stacked wooden pallets under a plank deck 16px above ground, ragged half-ring of sandbags #eabb5c on the back half of the deck open at the front, short rebar ladder on the left, rope lashings, scrap plate, binoculars hanging on a rebar stake at back-right with amber lens glint, about 70px wide, nothing above 40px`

**T1:** `engineered steel sniper watchtower, square chamfered concrete footing with yellow-black hazard stripes #f0b429, four riveted steel legs tapering upward with X cross-bracing, square checker-plate steel deck 32px above ground about 48px wide, low fixed steel rifle-rest ring along the deck edge, caged steel ladder on the left, fixed rangefinder on a bolted bracket at back-right with amber lens glint, small amber work lamp, no sandbags, about 90px wide, nothing above 56px`

**T2:** `three-level industrial sniper tower, level 1 wide stepped machined steel foundation with four hydraulic stabiliser outriggers, level 2 thick steel shaft with exposed chain-driven ammo elevator and pipes on the front-left, level 3 wide motorized turntable deck 48px above ground with exposed gear ring and motor housing, deck wider than the shaft, low blast shield plate on the back half of the deck, motorized stereo rangefinder bar on an arm at back-right with amber lens glint, about 109px wide, nothing above 72px, Stålenhag-style industrial materials`

**GUNNER:** `one small kneeling sniper operator in neutral grey-blue mechanic coveralls #6f7d8c, steel helmet with yellow goggles #ffc94a, face hidden, no orange stripes, chest ammo pouch, long thin gunmetal #323845 generic sniper rifle with large scope, olive #7d8f3a wrapped stock and scope cover, figure about 17px tall, figure and rifle entirely within 24px above the deck line`

**BASE-ONLY (thêm cuối prompt Base idle):** `base only, empty deck, no person`.
**GUNNER-ONLY (thêm cuối prompt sheet Gunner):** `operator and rifle only, no tower, no ground, knee contact at 48px from bottom of cell, facing <direction>`.

Gunner sheet: 5 hàng S, SE, E, NE, N (flipX cho SW, W, NW). Hàng S thấy mặt trước ống ngắm,
nòng rút ngắn; hàng E nòng dài nhất; hàng N thấy lưng, súng lệch sang vai phải để nòng vẫn
thấy cạnh đầu (§5: tư thế không che vũ khí). Mọi hàng giữ trong hộp 24 px trên sàn.

Chung mọi sheet: theo `mortar-assets.md` (1 hàng mỗi anim, không padding, ≥ 2 px lề trong
suốt, trần thực tế 78 px trên mặt đất; RGBA32 sRGB alpha thẳng, Bilinear, tắt mipmap, tắt
Read/Write, Mesh Tight, BC7 HQ qua Atlas V2 Standalone override).

---

## ASSET-265 — tower_sniper_nest_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Gò thấp tròn méo: 2 thùng phuy gỉ nằm nghiêng và pallet chồng đỡ
sàn ván cao 16 px; nửa vòng bao cát ở nửa sau sàn, mặt trước trống; thang rebar ngắn bên
trái; dây buộc, tấm sắt vụn vá mép. Ống nhòm treo trên cọc rebar ở sau-phải. Sàn trống (xạ
thủ là lớp riêng). F0 ống nhòm lóe hổ phách, F1 tắt.

**Art Bible Anchors:**
- §3: hàng cấp 0 (~55%, ≤ 40 px, bao cát chỉ ở cấp này, chắp vá tại chỗ)
- §4: 3 tông, viền `#2c2240`

**Generation Prompt:** BASE + T0 + BASE-ONLY + `idle`. NEG.

**Engine:** mặt sàn y = 64 px tính từ đáy ô (48 + 16).

**Status:** Needed

## ASSET-266 — tower_sniper_nest_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t0_base_build.png` (đổi tên từ `tower_sniper_nest_base_build.png`) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu. F1 lăn 2 thùng phuy vào. F2 chồng pallet,
lát sàn ván. F3 xếp nửa vòng bao cát, cắm thang rebar và cọc ống nhòm. F4 xạ thủ (Gunner SE
vẽ sẵn) leo thang, nửa người trên sàn. F5 = ghép base idle F0 + Gunner idle F0 hàng SE tại
sàn 16 px, trùng từng pixel.

**Art Bible Anchors:**
- §8: chỉ t0 có build; Head (Gunner) SE vẽ sẵn; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + GUNNER + `under construction, stage N of 6, stakes and string, operator facing southeast` (F0–3 bỏ GUNNER). NEG-G.

**Status:** Needed

## ASSET-267 — tower_sniper_nest_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t0_base_destroy.png` (đổi tên từ `tower_sniper_nest_base_destroy.png`) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (Gunner SE vẽ sẵn). F1 sàn ván nứt. F2 khói dày che
kín xạ thủ, thùng phuy lăn, bao cát tung. F3–4 khói tan. F5 đống đổ nát: ván gãy, 1 thùng
phuy đổ, bao cát rải, súng nằm chéo; không có người; 2 tông, không viền. Chevron mờ và 4 dấu
góc ô do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §8: destroy mỗi cấp một file

**Generation Prompt:** F0–4 BASE + T0 + GUNNER + `explosion, debris flying, smoke covering the operator`; F5 BASE + `rubble of improvised plank sniper perch, broken pallets, toppled oil drum, scattered sandbags, rifle lying diagonally, no person, two-tone, no outline`. NEG-G.

**Status:** Needed

## ASSET-268 — tower_sniper_nest_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t0 (base idle F0 + Gunner SE tại 16 px) phủ giàn giáo
thép. F1–2 bụi che; tháo thùng phuy, pallet, bao cát. F3 bệ bê tông vuông và 4 chân thép
giằng X dựng lên. F4 sàn thép và vòng tì súng đặt lên; xạ thủ (Gunner SE vẽ sẵn) leo thang
lồng lên sàn mới. F5 trùng từng pixel với ghép t1 (base idle F0 + Gunner SE tại 32 px). Đổi
cả khối, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §5: cùng một người, chỉ đứng cao hơn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, improvised plank perch replaced by riveted steel lattice watchtower on concrete footing` + GUNNER + `operator facing southeast`. NEG-G.

**Status:** Needed

## ASSET-269 — tower_sniper_nest_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Bệ bê tông vuông vát cạnh rộng ~90 px, sọc vàng-đen ở 2 mặt trước.
4 chân thép tán đinh vuốt vào trong, giằng chữ X (khoảng rỗng giữa giàn thấy rõ — silhouette
hình thang rỗng). Sàn vuông thép chống trượt ~48 px ở độ cao 32 px; vòng tì súng thép thấp
(≤ 4 px) dọc mép sàn. Thang lồng bên trái. Kính đo xa trên giá bắt bu-lông ở sau-phải; đèn
làm việc nhỏ. F0 đèn và kính lóe, F1 tắt. Không bao cát.

**Art Bible Anchors:**
- §3: hàng cấp 1 (~70%, ≤ 56 px, bệ, thép tán đinh, sọc cảnh báo, giá cố định)
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + BASE-ONLY + `idle`. NEG.

**Engine:** mặt sàn y = 80 px từ đáy ô.

**Status:** Needed

## ASSET-270 — tower_sniper_nest_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp (Gunner SE vẽ sẵn tại 32 px). F1 một chân thép oằn. F2 khói
che xạ thủ, sàn nghiêng, thanh giằng bung. F3–4 giàn đổ sang phải, bụi. F5: bệ bê tông nứt
còn mảnh sọc vàng, 2 chân cong gãy, sàn thép nằm nghiêng trên đất, súng rơi cạnh; không có
người; 2 tông, không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 56 px

**Generation Prompt:** F5 BASE + `collapsed steel lattice watchtower, cracked concrete footing with hazard stripe fragments, bent legs, fallen checker-plate deck, rifle on the ground, no person, two-tone, no outline`. NEG-G.

**Status:** Needed

## ASSET-271 — tower_sniper_nest_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t1 phủ giàn giáo. F1–2 bụi, tháo giàn chân thép. F3 móng
bậc thang và chân chống thủy lực trồi lên, trụ thép dựng. F4 mâm xoay, thang nâng đạn và
thanh đo xa lắp vào; xạ thủ (Gunner SE vẽ sẵn) bước ra từ cửa trụ lên mâm. F5 trùng từng
pixel với ghép t2 (base idle F0 + Gunner SE tại 48 px).

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; §3 ≤ 72 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, steel lattice watchtower replaced by stepped industrial tower with hydraulic outriggers and motorized turntable deck` + GUNNER + `operator facing southeast`. NEG-G.

**Status:** Needed

## ASSET-272 — tower_sniper_nest_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1: móng thép cắt máy bậc thang rộng ~109 px, 4 chân chống thủy
lực chéo ra góc. Tầng 2: trụ thép dày ~30 px, thang nâng đạn chạy bằng xích lộ ra ở trước-
trái, ống dẫn. Tầng 3: mâm xoay rộng ~56 px ở 48 px (rộng hơn trụ → đỉnh chữ T), vành răng
và hộp động cơ lộ dưới mép mâm, tấm chắn thấp ở nửa sau mâm. Thanh đo xa lập thể trên tay đòn
ở sau-phải. F0/F1: vành răng lệch 1 răng, hộp đạn trên thang nâng nhích 2 px, kính lóe F0.

**Art Bible Anchors:**
- §3: hàng cấp 2 (~85%, ≤ 72 px, nhiều tầng, cơ chế lộ ra); test silhouette
- §9: Stålenhag

**Generation Prompt:** BASE + T2 + BASE-ONLY + `idle`. NEG.

**Engine:** mặt sàn y = 96 px từ đáy ô. Thanh đo xa và tấm chắn ≤ 72 px trên mặt đất.

**Status:** Needed

## ASSET-273 — tower_sniper_nest_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp (Gunner SE tại 48 px). F1 chân chống thủy lực gãy, hơi xả.
F2 khói che xạ thủ, mâm nghiêng, xích thang nâng đứt. F3–4 trụ gục, bụi. F5: móng bậc thang
còn, trụ gãy đôi nằm ngang, mâm xoay vỡ dựng nghiêng, thanh đo xa rơi; không có người; 2
tông, không viền. Mảnh và khói không chạm mép ô.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 ≤ 72 px; §8 lề ô

**Generation Prompt:** F5 BASE + `wrecked industrial sniper tower, stepped foundation intact, snapped steel shaft lying sideways, broken turntable deck, torn elevator chain, fallen rangefinder, no person, two-tone, no outline`. NEG-G.

**Status:** Needed

## ASSET-274 — tower_sniper_nest_gunner_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_gunner_idle.png` (giữ tên, dùng chung t0/t1/t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Xạ thủ quỳ một gối, đồ thợ máy xám xanh, mũ thép, kính vàng, không
thấy mặt, không sọc cam. Súng dựng đứng, báng chạm sàn, nòng tì vai (≤ 22 px). F0 thở ra,
kính mũ lóe; F1 vai nâng 1 px, kính tắt. Olive trên báng và bọc ống ngắm luôn thấy.

**Art Bible Anchors:**
- §5: lính gắn trên tháp — đồ trung tính, ≤ 15% silhouette, cùng tỉ lệ mọi cấp, không che vũ khí
- §8: Head 5 hàng + flipX

**Generation Prompt:** BASE + GUNNER + GUNNER-ONLY + `idle, rifle held upright, goggles glint`. NEG-G.

**Engine:** pivot (0.5, 0.375) — điểm quỳ ở y = 48 px trong ô, giống Base; hộp bao y 48–72.

**Status:** Needed

## ASSET-275 — tower_sniper_nest_gunner_aim

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 8 fps, 1 lần (0.375 s), giữ F2 |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_gunner_aim.png` (giữ tên, dùng chung) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 hạ súng từ thế dựng. F1 súng ngang, báng vào vai. F2 áp mắt vào
ống ngắm, thân hơi đổ về trước — giữ frame này tới 0.975 s. Hàng N: súng lệch vai phải, nòng
thấy cạnh mũ; hàng N/NE nòng ngắn lại theo phối cảnh để vẫn ≤ 24 px trên sàn.

**Art Bible Anchors:**
- §5: không che vũ khí; §3: chiều cao không ngoại lệ

**Generation Prompt:** BASE + GUNNER + GUNNER-ONLY + `raising rifle to shoulder, aiming through scope`. NEG-G.

**Engine:** tia ngắm hổ phách (code) bật từ F2 tại điểm đầu nòng của hàng.

**Status:** Needed

## ASSET-276 — tower_sniper_nest_gunner_fire

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 10 fps, 1 lần (0.4 s), giữ F3 |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_gunner_fire.png` (giữ tên, dùng chung) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 bắn: vai bị đẩy lùi 2 px, nòng hất lên 1 px (không vẽ chớp, chớp
là VFX). F1 hồi về. F2 kéo khóa nòng, 1 vỏ đạn thép xám bật ra. F3 đẩy khóa, về thế ngắm
(= aim F2) — giữ 1.0 s. Đề xuất, chờ GDD.

**Art Bible Anchors:**
- §8: ngoại lệ frame 0 cho fire; §4: không dùng đồng thau `#d9a441` (họ súng máy)

**Generation Prompt:** BASE + GUNNER + GUNNER-ONLY + `firing recoil, shoulder pushed back` (F2 đổi `working the bolt, casing ejecting`). NEG-G.

**Engine:** Animation Event bắn ở F0 → sinh VFX chớp + vệt đạn tại điểm đầu nòng của hàng.

**Status:** Needed

## ASSET-277 — tower_sniper_nest_gunner_reload

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 5 fps, 1 lần (0.8 s) |
| Format | PNG RGBA32 |
| Naming | `tower_sniper_nest_gunner_reload.png` (giữ tên, dùng chung) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 hạ nòng chéo xuống. F1 tháo hộp đạn. F2 lấy hộp mới từ túi đạn
trên ngực. F3 lắp hộp, vỗ tay lên — sau đó vào `aim`. Hộp đạn thép, không đồng thau. Cả 4
frame vẫn thấy súng (không ôm súng sau lưng).

**Art Bible Anchors:**
- §5: không che vũ khí; §8: Head 5 hàng

**Generation Prompt:** BASE + GUNNER + GUNNER-ONLY + `reloading, swapping box magazine from chest pouch`. NEG-G.

**Engine:** thời lượng nạp lấy từ data; nếu t2 nạp nhanh hơn (đề xuất ~0.6 s) thì tăng
Animator speed, không vẽ sheet riêng.

**Status:** Needed

## ASSET-278 — vfx_sniper_nest_muzzle_flash

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 96×32 (ô 32×32, vẽ trong 28×28), 3 frame, ~12 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_sniper_nest_muzzle_flash.png` (đổi tên từ `vfx_sniper_flash.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Chớp hẹp dài hướng phải, lõi trắng, rìa hổ phách `#ff9f1c`, kèm
một vệt khói xám nhỏ ở F2. Hẹp và dài hơn chớp súng máy (khác hình hoa sao). Dùng mọi cấp,
scale 1.0 (Gunner giống nhau).

**Art Bible Anchors:**
- §8: VFX dùng lại mọi cấp; §4: hổ phách = ánh sáng người tạo

**Generation Prompt:** `narrow long muzzle flash sprite sheet, 3 frames, pointing right, white core amber #ff9f1c edge, small grey smoke wisp, 32x32 cells, transparent background`.

**Engine:** xoay theo góc hàng; sorting trên Gunner trong Sorting Group của tháp.

**Status:** Needed

## ASSET-279 — vfx_sniper_nest_hit

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 96×32 (ô 32×32), 3 frame, ~12 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_sniper_nest_hit.png` (đổi tên từ `vfx_sniper_hit.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Tia lửa hổ phách ngắn tỏa hình nón + 2–3 giọt sáp ngà `#e9dfc4`
văng (giọt có cạnh mềm nhưng không phát sáng). Không dùng đỏ.

**Art Bible Anchors:**
- §4: ngà sáp chỉ cho Dị Thể (ở đây là sáp của Dị Thể bị trúng)

**Generation Prompt:** `bullet impact sprite sheet, 3 frames, short amber #ff9f1c spark cone and two ivory wax #e9dfc4 droplets splashing, 32x32 cells, transparent background`.

**Engine:** chung lớp Y-sort với Dị Thể; pool.

**Status:** Needed

## ASSET-280 — vfx_sniper_nest_mark

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 128×64 (ô 64×64), 2 frame, 1 lần rồi giữ F1 |
| Format | PNG RGBA32 |
| Naming | `vfx_sniper_nest_mark.png` (mới, đề xuất) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** 4 góc khung ngắm cắt 45° (cùng ngôn ngữ stencil UI §3), hổ phách
phẳng viền `#2c2240`, bao quanh Dị Thể đặc biệt đang bị ngắm. F0 khung rộng, F1 khép vào.
Báo "tháp bắn tỉa đang ưu tiên con này" bằng hình, không bằng màu. Đề xuất, chờ GDD.

**Art Bible Anchors:**
- §3/§7: góc cắt 45°; §4: không dùng đỏ (nguy hiểm), không nét đứt (bão)

**Generation Prompt:** `four corner targeting brackets with 45 degree cut corners, flat amber #ff9f1c with indigo outline #2c2240, 2 frames closing in, 64x64 cells, transparent background`.

**Engine:** unlit, bám theo Dị Thể, sorting trên Dị Thể; chỉ hiện khi mục tiêu thuộc danh
sách ưu tiên; scale theo cỡ Dị Thể (Bậc 4 thấu kính 64×64 → 1.0).

**Status:** Needed

## ASSET-281 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/SniperNest/Preview~/_preview_tower.png` (tạo mới) |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle (Gunner SE) và t2 đang ngắm/bắn hướng E.
Hàng 2: cùng 4 ô tô kín `#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng.
Ghi kèm phép đo: diện tích Gunner / silhouette t0 ≤ 15%.

**Art Bible Anchors:**
- §3: test silhouette (che Gunner đi, các cấp vẫn phải phân biệt được); §5: 15%; §8 Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-282 — ui_icon_tower_sniper_nest_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_sniper_nest_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Súng dài nằm ngang với ống ngắm chữ nhật to trên lưng và chân chống
chữ V dưới nòng, đặt trên vạch sàn ngắn nâng cao (gợi sàn chữ T). Nét 2 px, một màu hổ phách
trên `#1a1528`, chỉ góc 90°/45°. Khác icon súng máy (hộp thân súng + đế) nhờ ống ngắm và chân V.

**Art Bible Anchors:**
- §7: icon = dạng vũ khí gốc, lưới 32 px, một icon mọi cấp

**Generation Prompt:** `flat monochrome UI icon, long sniper rifle with large rectangular scope on top and V-shaped bipod, resting on a short raised platform line, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ | giữ |
| Pivot Gunner | (0.5, 0.375) — điểm quỳ y = 48 trong ô | giữ (cùng sheet) | giữ |
| Mặt sàn trên mặt đất | 16 px | 32 px | 48 px |
| Gunner localPosition | (0, 0.125) | (0, 0.25) | (0, 0.375) |
| Trần cả tháp (Base + Gunner) | ≤ 40 px (sàn 16 + hộp 24) | ≤ 56 px (32 + 24) | ≤ 72 px (48 + 24) |
| Ngang thân + nền | ~70 px | ~90 px | ~109 px |
| Điểm đầu nòng | `muzzle[hàng]` + localPosition t0 | + localPosition t1 | + localPosition t2 |

- Một bộ điểm đầu nòng duy nhất (đo từ sheet Gunner chung, ở `aim` F2 / `fire` F0):
  `muzzle[S,SE,E,NE,N]`, hệ tâm pivot Gunner `local = ((x_px − 64)/128, (y_từ_đáy_ô − 48)/128)`;
  flipX đảo dấu x. Lưu trong data như `TierMuzzleData` của súng máy, nhưng `headLocalPos`
  theo cấp, `muzzles` dùng chung.
- Chọn hướng như súng máy: `k = round(atan2(dy/0.72, dx)/45°)`; hàng S, SE, E, NE, N = k 2,
  1, 0, 7, 6; k 3, 4, 5 dùng hàng của 1, 0, 7 với flipX.
- Nòng ngang hàng E được thò ≤ 10 px ngoài độ chiếm ô (§3), vẫn cách mép ô ≥ 2 px.
- Sorting Group ở gốc tháp; Gunner order > Base; unlit, cùng sorting layer với Dị Thể.
- Vùng cấm: Base ≤ 4 px trên mặt sàn ở nửa trước sàn; điểm quỳ cách mép trước sàn ≥ 6 px.
- Trần thực tế 78 px còn 6 px trên t2: chớp đầu nòng (VFX riêng) được dùng phần này, không
  phần nào của Base/Gunner được dùng.

### Khớp frame khi xây / nâng cấp / phá hủy

Frame cuối của `t0_base_build`, `t1/t2_base_upgrade` trùng từng pixel với ghép (base idle F0
cấp đích + gunner idle F0 hàng SE tại localPosition cấp đó). Frame đầu của upgrade trùng ghép
cấp trước. Destroy vẽ sẵn Gunner SE ở đúng độ cao sàn của cấp. Code ẩn Gunner thật suốt
build, upgrade và destroy.

### Số file

| Nhóm | File |
|---|---|
| Base | 1 build + 3 destroy + 2 upgrade + 3 idle = 9 |
| Gunner (dùng chung 3 cấp) | 1 idle + 3 hành động (aim, fire, reload) = 4 |
| **Tổng sheet tháp** | **13** (công thức §8 có Head: 12 + 3A = 21; tiết kiệm 8 file) |
| VFX / Preview / Icon | 3 + 1 + 1 |

Công thức đề xuất cho art bible §8: tháp có Head **dùng chung mọi cấp** = **9 + 1 + A**.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `SniperNest_t0` | 265–267 | 14 | 1024² |
| `SniperNest_t1` | 268–270 | 14 | 1024² |
| `SniperNest_t2` | 271–273 | 14 | 1024² |
| `SniperNest_Gunner` | 274–277 | 65 (sprite thật ~30×30 px, Tight) | 1024², dự phòng 2048×1024 |
| `SniperNest_VFX` | 278–280 | 6 ô 32² + 2 ô 64² | 256² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 4–6 MB BC7 (ước tính).
`SniperNest_Gunner` và `SniperNest_VFX` là atlas thêm ngoài quy tắc "mỗi tháp mỗi cấp một
atlas" (§8), vì dùng chung mọi cấp. Gunner luôn được nạp cùng atlas cấp hiện hành.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_sniper_nest_base_{idle,build,destroy}.png` | Đổi tên → `..._t0_base_*` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_sniper_nest_gunner_{idle,aim,fire,reload}.png` | **Giữ tên** (dùng chung); vẽ lại: đồ thợ máy xám xanh, bỏ đồ trắng và sọc cam, hộp bao ≤ 24 px; pivot Center → (0.5, 0.375) |
| `tower_sniper_nest_base_upgrade1/2.png`, `tower_sniper_nest_gunner_upgrade1/2.png` (+ `.meta`) | Xóa |
| `vfx_sniper_flash.png`, `vfx_sniper_hit.png` | Đổi tên → `vfx_sniper_nest_muzzle_flash.png`, `vfx_sniper_nest_hit.png` (kèm `.meta`) |
| `Preview~/_preview_tower.png` | Tạo mới (hiện chưa có) |
| `README.md` | Viết lại theo template §8; sửa: xạ thủ trung tính không sọc cam, `localPosition` 0.244 → bảng theo cấp, pivot Gunner, laser đỏ → tia ngắm hổ phách, "Compression None" → BC7 qua atlas, bảng file theo cấp |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Tháp chưa có trong GDD: chỉ số từng cấp (tầm, sát thương, băng đạn, thời gian nạp), mở khóa
  R25, bảng khắc chế §4.6.
- Lối chơi theo cấp đề xuất ở trên (t1 tầm/sát thương, t2 băng 7 + nạp nhanh) cần xác nhận.
- Khung đánh dấu ASSET-280: có giữ không, và có gắn hiệu ứng lối chơi (vd. tháp khác gây
  thêm sát thương lên con bị đánh dấu) hay chỉ để đọc.
- Cột thu sáng phải là "vật cao nhất trên sân" (§3) nhưng t2 bắn tỉa chạm 72 px: cần chốt
  khi spec cột thu sáng (cột cao hơn mọi t2, hay chỉ khác nhờ dáng kim mảnh vs mâm chữ T).
- Olive `#7d8f3a` cần chụp test cạnh nền Ngoại ô (xám xanh lá) ban ngày.
- Bổ sung vào art bible: màu họ olive (§4), từ vựng silhouette bắn tỉa (§3), ngoại lệ công
  thức và tên file Gunner dùng chung (§8).
