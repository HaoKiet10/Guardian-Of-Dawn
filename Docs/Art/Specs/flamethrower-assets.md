# Asset Specs — Entity: flamethrower (Súng phun lửa)

> **Source**: `Assets/Art/Towers/Flamethrower/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (art-director)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md` (BASE / NEG prompt dùng chung), `design/assets/specs/machine-gun-assets.md`
> **Status**: 25 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

| | t0 · Ụ phun lửa chắp vá | t1 · Trạm bơm bọc thép | t2 · Trạm nén trên giàn |
|---|---|---|---|
| Ngang / cao trên mặt đất | ~70 px (55%) / ≤ 40 px | ~90 px (70%) / ≤ 56 px | ~109 px (85%) / ≤ 72 px |
| Base | Tường bao cát hình móng ngựa thấp mở về trước, tấm pallet phía sau chở 2 thùng phuy nằm ngang buộc dây, vòng xoay là mâm sắt vụn | Tấm bê tông **vuông** vát góc 45° nhỏ, sọc vàng-đen ở mép trước; phía sau là bệ yên thép tán đinh nâng **1 bình áp suất to** nằm ngang (kiểu xe bồn); mâm xoay thép | 3 tầng: tấm móng bê tông + lưới thoát; **giàn thép trên 4 chân dầm I** (hở bên dưới, thấy ống dẫn luồn qua); giá thép **3 bình nằm ngang xếp 2+1** phía sau là khối cao nhất; máy nén lộ piston + bánh đà + đồng hồ áp suất bên phải |
| Head | Hộp tôn hàn tay sơn cam, vòi ống nước ngắn loe miệng, đèn mồi kiểu đèn khò | Khối nêm bọc thép tán đinh rộng, thấp; 2 tấm chắn nhiệt chéo 45° là thân khối; vòi **mỏ vịt dẹt** miệng rộng | Đầu phóng bọc thép rộng trên vòng xoay có động cơ; vòi có vòng kẹp, bình tích áp lộ trên lưng, tay thủy lực nâng vòi |
| Vật liệu | Bao cát `#eabb5c`, pallet gỗ, thùng phuy, dây, tôn vụn | Bê tông, thép tán đinh, sọc cảnh báo | Thép cắt máy, dầm I, thủy lực, ống dẫn, máy nén |
| Silhouette | Gò thấp rộng + 2 trụ ngang phía sau | Hộp vuông thấp + 1 trụ ngang to phía sau + nêm rộng | Bàn trên chân (khe hở dưới) + chồng 3 trụ ngang cao phía sau + nêm rộng |

**Sợi chỉ họ phun lửa (§3):**
1. Head luôn **thấp và rộng** (rộng ≥ 1.5× cao), vòi ngắn loe ở trước; không bao giờ là nòng dài (súng
   máy) hay ống chĩa trời (cối). Head không phải phần cao nhất của tháp ở t1–t2.
2. Cam lửa `#ef5b31` trên thân Head ở mọi cấp; đèn mồi hổ phách `#ff9f1c` ở đầu vòi.
3. Bình nhiên liệu **nằm ngang, luôn ở phía sau** (nửa trên sprite), sơn đỏ thẫm có vạch vàng
   `#f0b429`, nối ống đồng `#cc823f` vào vòng xoay. Số bình: 2 phuy → 1 bình to → giá 3 bình (đổi
   khối, không phải thêm phụ kiện: mỗi cấp là một kết cấu chứa khác hẳn).

**Khác họ cối / súng máy:** hai họ kia dùng vòng bao cát tròn (t0), bệ bát giác (t1), sàn bậc thang
3 tầng có trống xoay (t2). Phun lửa dùng móng ngựa + phuy (t0), tấm **vuông** + bồn (t1), **giàn chân
cao có khe hở** (t2). Khối nặng của phun lửa luôn ở phía sau (bình), của cối ở trước-trái, của súng
máy ở giữa.

**Head / Base:** Head = khối đầu, vòi, đèn mồi (t2 thêm bình tích áp và tay thủy lực). Base = mọi
thứ còn lại, kể cả bình nhiên liệu và ống đồng tới vòng xoay. Không vẽ người vận hành.

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 nón lửa rộng hơn (góc ×1.25); t2 áp suất cao: nón dài
hơn (tầm ×1.3) và thời gian cháy trên Dị Thể dài hơn. Không thêm cơ chế VFX mới.

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** cam lửa sáng `#f5794a` / giữa `#ef5b31`
/ tối `#b23d1f`; đỏ bình nhiên liệu sáng `#d4513f` / giữa `#b8352b` / tối `#7a2420`; vạch bình
`#f0b429` (thay `#ffcc33` của README); ống đồng `#cc823f` (thay `#e3954f`). Thép, bê tông, đồng
sáng/tối: theo `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- t0 theo art bible §3 (bao cát, phuy, tôn vụn), **không** theo README cũ (bệ tròn vành sọc vàng-đen
  — từ vựng t1). Lý do: sọc cảnh báo ở t0 làm mờ khác biệt t0/t1.
- t1 Base vuông, không bát giác. Lý do: §3 cho phép cả hai; bát giác đã thuộc cối và súng máy, vuông
  tách họ phun lửa khi tô kín.
- t2 là giàn chân cao có khe hở, không phải sàn bậc thang. Lý do: sàn bậc thang đã dùng ở hai họ kia;
  khe hở dưới giàn là đặc điểm silhouette sống qua blur 2 px (khe ≥ 6 px cao, ≥ 10 px rộng).
- Bình nhiên liệu dùng đỏ thẫm `#b8352b`, không dùng `#e2412f`. Lý do: §4 dành `#e2412f` cho
  "nguy hiểm + tam giác"; mảng bình lớn sẽ làm loãng nghĩa đó.
- Vạch bình `#f0b429`, ống `#cc823f`. Lý do: gộp về màu đã có trong bible / spec cối, bớt hex.
- Mọi cấp tách `fire_start` / `fire_loop` / `fire_end` trên Head (ngoại lệ §8): 12 + 3·1 + 2·3 = **21
  sheet tháp**. Nhịp giữ như README ở mọi cấp: start 3f 10 fps (0.3 s), loop 4f 12 fps, end 3f
  10 fps (0.3 s). Lý do: nhịp gameplay không đổi theo cấp; cấp đọc bằng khối.
- VFX dùng lại mọi cấp, chỉ đổi scale; không có `_t<N>`. Lý do: không cấp nào thêm cơ chế mới; đổi màu
  lửa theo cấp sẽ vi phạm "cấp không báo bằng màu".
- Đổi tên VFX theo §8: `vfx_flame_cone` → `vfx_flamethrower_flame_cone`, `vfx_burning` →
  `vfx_flamethrower_burning`. Lý do: mẫu `vfx_<owner>_<effect>`, như tiền lệ `vfx_machine_gun_muzzle_flash`.
- Nón lửa ở sorting layer "Projectile" (như đạn cối), không làm con của tháp. Lý do: lửa phải phủ lên
  Dị Thể ở mọi phía; nếu nằm trong Sorting Group tháp, Dị Thể phía nam sẽ vẽ đè lên lửa.
- Head localPosition t0 = (0, 0.125) = 16 px (README ghi 0.128 ≈ 16.4 px, lệch lưới). Lý do: số
  nguyên pixel để khớp ghép upgrade từng pixel.
- Nhấp nháy miệng vòi trong `fire_loop` chỉ ở vùng ≤ 8×8 px, không đổi độ sáng toàn tháp. Lý do: §7
  nhấp nháy diện rộng < 3 Hz; vòi nhỏ ở 12 fps an toàn.
- Hơi nóng méo hình quanh nón không vẽ vào sheet; để polish. Lý do: §4 dùng heat-haze cho Quá nhiệt —
  thêm vào lửa thường sẽ làm hai nghĩa lẫn nhau.

## Prompt nền

**BASE / NEG:** dùng nguyên văn từ `mortar-assets.md`.

**FLAME (thêm sau BASE):** `flame orange #ef5b31 head, dark crimson #b8352b horizontal fuel tanks with yellow #f0b429 band at the rear, copper #cc823f hose to the turret ring, amber #ff9f1c pilot light at nozzle tip`

**T0:** `low wide improvised flamethrower nest, horseshoe-shaped low sandbag wall #eabb5c open to the front, wooden pallet at the rear carrying two oil drums lying horizontally tied with rope, scrap-metal turntable plate, hand-welded orange sheet-metal sprayer box with short flared pipe nozzle and blowtorch pilot light, about 70px wide 40px tall`

**T1:** `square chamfered concrete pad with yellow-black hazard stripes #f0b429 on the front edge, riveted steel saddle cradle at the rear holding one large horizontal pressure tank like a fuel bowser, steel turntable, low wide riveted armored wedge flamethrower head with two 45° heat-shield side plates and a flat wide duck-bill nozzle, no sandbags, about 90px wide 56px tall`

**T2:** `industrial flamethrower compressor station, concrete foundation slab with drain grate, steel gantry deck raised on four I-beam legs with open space underneath and pipes running through, steel rack of three horizontal pressure tanks stacked two plus one at the rear as the tallest mass, exposed compressor with piston, flywheel and pressure gauge on the right, motorized turret ring, low wide armored flame projector head with clamped nozzle, pressure accumulator cylinder on its back and hydraulic nozzle arm, about 109px wide 72px tall, Stålenhag-style industrial materials`

**HEAD (thêm cuối prompt Head):** `flamethrower head only, no emplacement, no tanks, no ground, centered, facing <direction>`.
**BASE-ONLY (thêm cuối prompt Base):** `base only, empty turret ring, fuel tanks at the rear`.

Head sheet: 5 hàng S, SE, E, NE, N (flipX cho SW, W, NW). Hàng S thấy miệng vòi và đèn mồi chính
diện; hàng E vòi dài nhất; hàng N thấy lưng đầu và chỗ nối ống. Không vẽ lửa phun vào Head (nón lửa
là VFX); Head chỉ có ánh nóng ở miệng vòi.

Chung mọi sheet: theo `mortar-assets.md` (RGBA32 sRGB alpha thẳng, ≥ 2 px lề trong suốt, trần 78 px
gồm cả Head trên Base, Bilinear, tắt mipmap, tắt Read/Write, Mesh Tight, BC7 HQ qua Atlas V2
Standalone override; None nếu vỡ khối viền). Lửa destroy không chạm mép ô.

---

## ASSET-040 — tower_flamethrower_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tường bao cát móng ngựa thấp mở về trước, pallet sau chở 2 thùng phuy đỏ thẫm
nằm ngang buộc dây, vạch vàng; ống đồng vắt từ phuy tới mâm sắt vụn (Head gắn riêng). F0 đèn trạng
thái cam trên phuy sáng, F1 tắt.

**Art Bible Anchors:** §3 t0 (~55%, ≤ 40 px, bao cát chỉ ở t0); §4 viền, 3 tông.

**Generation Prompt:** BASE + FLAME + T0 + BASE-ONLY + `idle`. NEG.

**Status:** Needed

## ASSET-041 — tower_flamethrower_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây. F1 pallet đặt xuống, nửa sau tường cát. F2 lăn 2 phuy lên
pallet. F3 xong móng ngựa, buộc dây, nối ống. F4 đặt hộp phun (Head SE vẽ sẵn). F5 = base idle F0
+ Head SE.

**Art Bible Anchors:** §8 chỉ t0 có build; Head SE vẽ sẵn.

**Generation Prompt:** BASE + FLAME + T0 + `under construction, stage N of 6, stakes and string, head facing southeast`. NEG.

**Status:** Needed

## ASSET-042 — tower_flamethrower_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 chớp trắng (Head SE vẽ sẵn). F1 nứt, phuy phồng. F2 phuy bùng lửa phía
sau (giữ motif README), hộp phun bật văng. F3–4 khói đen. F5 đống đổ nát: cát rải, phuy móp nằm lăn,
hộp phun cháy xém; 2 tông, không viền. Lửa không chạm mép.

**Art Bible Anchors:** §7 đống đổ nát; §8 destroy mỗi cấp.

**Generation Prompt:** F0–4 BASE + FLAME + T0 + `explosion, fuel drums bursting into flame at the rear, debris`; F5 BASE + `rubble of improvised sandbag flamethrower nest, dented oil drums rolled over, scorched sprayer box, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-043 — tower_flamethrower_t0_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Hộp tôn hàn tay sơn cam, mối hàn và đinh vít lộ, vòi ống nước ngắn loe miệng,
đèn khò mồi ở đầu vòi. F0 đèn mồi hổ phách sáng, F1 mờ.

**Art Bible Anchors:** §3 sợi chỉ (đầu thấp rộng); §8 Head 5 hàng.

**Generation Prompt:** BASE + FLAME + T0 + HEAD + `idle, pilot light on`. NEG.

**Engine:** Head nhô ≤ 24 px trên tâm xoay (40 − 16).

**Status:** Needed

## ASSET-044 — tower_flamethrower_t0_head_fire_start

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_head_fire_start.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0. F1 đèn mồi bùng, miệng vòi sáng cam (VFX nón bắt đầu ở đây).
F2 đầu vòi đỏ sẫm, hộp giật lùi 1 px. F2 nối liền sang `fire_loop` F0.

**Art Bible Anchors:** §8 ngoại lệ tách anim; §4 hổ phách = lửa người tạo.

**Generation Prompt:** BASE + FLAME + T0 + HEAD + `igniting, nozzle mouth glowing, no flame stream`. NEG.

**Status:** Needed

## ASSET-045 — tower_flamethrower_t0_head_fire_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 12 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_head_fire_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Đầu vòi nóng đỏ, miệng vòi nháy (vùng ≤ 8×8 px), hộp rung 1 px F1/F3. 4 frame
lặp liền mạch.

**Art Bible Anchors:** §7 nhấp nháy diện nhỏ; §4 cặp "quá nhiệt / lửa" phân biệt bằng hình.

**Generation Prompt:** BASE + FLAME + T0 + HEAD + `spraying, nozzle tip red hot, no flame stream`. NEG.

**Engine:** sát thương theo tick trong data, không theo frame.

**Status:** Needed

## ASSET-046 — tower_flamethrower_t0_head_fire_end

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t0_head_fire_end.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 nón ngắn lại (VFX), đầu vòi đỏ. F1 khói nhỏ bốc khỏi miệng vòi, đầu vòi
nguội dần. F2 = idle F0 (khói tan, không chạm mép).

**Art Bible Anchors:** §8 frame cuối = tư thế nghỉ.

**Generation Prompt:** BASE + FLAME + T0 + HEAD + `flame shutting off, wisp of smoke from nozzle, cooling`. NEG.

**Status:** Needed

## ASSET-047 — tower_flamethrower_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t0 (base idle F0 + head idle F0 SE) phủ giàn giáo. F1–2 bụi, dỡ
tường cát, lăn phuy đi. F3 tấm bê tông vuông và bệ yên thép trồi lên. F4 bình áp suất to hạ vào yên,
Head nêm SE vẽ sẵn. F5 trùng từng pixel với ghép t1.

**Art Bible Anchors:** §1 nguyên tắc 1; §8 upgrade.

**Generation Prompt:** BASE + FLAME + `construction transition, scaffolding and dust, sandbag nest and oil drums replaced by square concrete pad with one large horizontal pressure tank on a steel saddle, wedge flamethrower head facing southeast`. NEG.

**Status:** Needed

## ASSET-048 — tower_flamethrower_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tấm bê tông vuông vát góc, sọc vàng-đen mép trước, mâm xoay thép trống. Phía
sau: bình áp suất to nằm ngang trên yên thép tán đinh, vạch vàng, van tay quay; ống đồng nối mâm.
Đèn trạng thái trên van nháy F0/F1. Không bao cát.

**Art Bible Anchors:** §3 t1 (~70%, ≤ 56 px, vuông có bệ); §9 Stålenhag.

**Generation Prompt:** BASE + FLAME + T1 + BASE-ONLY + `idle`. NEG.

**Status:** Needed

## ASSET-049 — tower_flamethrower_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp (Head SE vẽ sẵn), nứt bê tông, F2 bình áp suất xé dọc bùng lửa phía sau,
đầu nêm văng. F3–4 khói. F5: tấm vuông vỡ góc, mảnh sọc vàng, bình rách nằm lệch khỏi yên; 2 tông,
không viền.

**Art Bible Anchors:** §7; §3 ≤ 56 px.

**Generation Prompt:** F5 BASE + `shattered square concrete pad, hazard stripe fragments, ruptured horizontal tank slipped off its saddle, armored wedge head fallen, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-050 — tower_flamethrower_t1_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Khối nêm bọc thép tán đinh cam, rộng và thấp; 2 tấm chắn nhiệt chéo 45° là
hai má của khối; vòi mỏ vịt dẹt miệng rộng, đèn mồi trên mép vòi. F0 đèn sáng, F1 mờ.

**Art Bible Anchors:** §3 t1 (giá cố định, cỡ to hơn); sợi chỉ đầu thấp rộng.

**Generation Prompt:** BASE + FLAME + T1 + HEAD + `idle, pilot light on`. NEG.

**Status:** Needed

## ASSET-051 — tower_flamethrower_t1_head_fire_start

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_head_fire_start.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0. F1 đèn mồi bùng, khe mỏ vịt sáng cam suốt bề ngang. F2 miệng
vòi đỏ sẫm, tấm chắn nhiệt rung 1 px. Nối sang `fire_loop` F0.

**Art Bible Anchors:** §8 ngoại lệ tách anim.

**Generation Prompt:** BASE + FLAME + T1 + HEAD + `igniting, wide flat nozzle slot glowing, no flame stream`. NEG.

**Status:** Needed

## ASSET-052 — tower_flamethrower_t1_head_fire_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 12 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_head_fire_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Miệng mỏ vịt nóng đỏ, khe sáng nháy (≤ 8 px cao), khối rung 1 px F1/F3, tấm
chắn nhiệt ửng cam ở mép trước. Đề xuất (nón rộng hơn), chờ GDD.

**Art Bible Anchors:** §7; §4.

**Generation Prompt:** BASE + FLAME + T1 + HEAD + `spraying, nozzle red hot, heat shields glowing at front edge, no flame stream`. NEG.

**Status:** Needed

## ASSET-053 — tower_flamethrower_t1_head_fire_end

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t1_head_fire_end.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 miệng vòi đỏ, F1 khói dẹt thoát khỏi khe mỏ vịt, F2 = idle F0.

**Art Bible Anchors:** §8.

**Generation Prompt:** BASE + FLAME + T1 + HEAD + `flame shutting off, flat smoke wisp from duck-bill nozzle`. NEG.

**Status:** Needed

## ASSET-054 — tower_flamethrower_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = ghép t1 phủ giàn giáo. F1–2 bụi, cẩu bình to đi, đập tấm vuông. F3 móng
bê tông và 4 chân dầm I dựng lên, sàn giàn đặt lên chân. F4 giá 3 bình và máy nén lắp phía sau/phải,
Head SE vẽ sẵn. F5 trùng từng pixel với ghép t2.

**Art Bible Anchors:** §1 nguyên tắc 1; §8; §3 ≤ 72 px.

**Generation Prompt:** BASE + FLAME + `construction transition, scaffolding, dust cloud, square concrete pad replaced by steel gantry on four I-beam legs with a rack of three horizontal tanks and compressor, flame projector head facing southeast`. NEG.

**Status:** Needed

## ASSET-055 — tower_flamethrower_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Tầng 1 móng bê tông có lưới thoát. Tầng 2 sàn giàn thép trên 4 chân dầm I, khe
hở rõ bên dưới (ống dẫn đồng luồn qua). Tầng 3 vòng xoay có động cơ (Head trống). Phía sau, giá thép
3 bình nằm ngang xếp 2+1, cao nhất tháp (~68 px). Bên phải máy nén: piston, bánh đà, đồng hồ áp suất.
F0/F1 piston dịch 1 px, kim đồng hồ rung, đèn nháy.

**Art Bible Anchors:** §3 t2 (~85%, ≤ 72 px, nhiều tầng, bệ nâng, cơ chế lộ ra); test silhouette (khe
≥ 6 px cao, ≥ 10 px rộng).

**Generation Prompt:** BASE + FLAME + T2 + BASE-ONLY + `idle, empty turret ring`. NEG.

**Status:** Needed

## ASSET-056 — tower_flamethrower_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần, giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Chớp (Head SE vẽ sẵn). F1 chân giàn oằn. F2 giá bình bùng lửa phía sau (lửa
trong ô, cách mép ≥ 2 px), đầu phóng văng. F3–4 khói dày. F5: giàn sụp nghiêng về một bên, 2 chân gãy,
bình lăn khỏi giá, bánh đà rời; 2 tông, không viền.

**Art Bible Anchors:** §7; §3 ≤ 72 px; §8 lửa không chạm mép.

**Generation Prompt:** F5 BASE + `collapsed steel gantry on broken I-beam legs, tank rack toppled with ruptured horizontal tanks, loose flywheel, two-tone, no outline`. NEG.

**Status:** Needed

## ASSET-057 — tower_flamethrower_t2_head_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×640 (5 hàng × 2 frame), 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_head_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Đầu phóng bọc thép cam rộng, thấp; vòi có 2 vòng kẹp; bình tích áp hình trụ
nằm trên lưng đầu; tay thủy lực dưới vòi. F0 đèn mồi sáng, F1 mờ, piston tay thủy lực dịch 1 px.

**Art Bible Anchors:** §3 t2 (tháp pháo có động cơ, cơ chế lộ ra); sợi chỉ đầu thấp rộng (không cao
hơn giá bình).

**Generation Prompt:** BASE + FLAME + T2 + HEAD + `idle, pilot light on`. NEG.

**Status:** Needed

## ASSET-058 — tower_flamethrower_t2_head_fire_start

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_head_fire_start.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = idle F0. F1 bình tích áp nén (vạch kim lên), tay thủy lực đẩy vòi 2 px,
đèn mồi bùng. F2 miệng vòi sáng cam, vòng kẹp đỏ sẫm. Nối sang `fire_loop` F0.

**Art Bible Anchors:** §3 cơ chế lộ ra; §8 ngoại lệ tách anim.

**Generation Prompt:** BASE + FLAME + T2 + HEAD + `pressurizing and igniting, accumulator compressed, nozzle glowing, no flame stream`. NEG.

**Status:** Needed

## ASSET-059 — tower_flamethrower_t2_head_fire_loop

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 512×640 (5 hàng × 4 frame), 12 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_head_fire_loop.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Vòi nóng đỏ, miệng nháy (≤ 8×8 px), tay thủy lực rung 1 px, bình tích áp nhịp
nén/nhả F0–1/F2–3. Đề xuất (áp suất cao, nón dài hơn), chờ GDD.

**Art Bible Anchors:** §3; §7.

**Generation Prompt:** BASE + FLAME + T2 + HEAD + `spraying at high pressure, nozzle red hot, accumulator pulsing, no flame stream`. NEG.

**Status:** Needed

## ASSET-060 — tower_flamethrower_t2_head_fire_end

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 384×640 (5 hàng × 3 frame), 10 fps, 1 lần (0.3 s) |
| Format | PNG RGBA32 |
| Naming | `tower_flamethrower_t2_head_fire_end.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 vòi đỏ, tay thủy lực rút về. F1 xả hơi trắng-xám nhỏ khỏi van bình tích áp
+ khói miệng vòi (trong ô). F2 = idle F0.

**Art Bible Anchors:** §8; §3 cơ chế lộ ra.

**Generation Prompt:** BASE + FLAME + T2 + HEAD + `flame shutting off, pressure vent puff, smoke from nozzle`. NEG.

**Status:** Needed

## ASSET-061 — vfx_flamethrower_flame_cone

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 512×64 (ô 128×64), 4 frame, 12 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_flamethrower_flame_cone.png` (đổi tên từ `vfx_flame_cone.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Luồng lửa hình nón, gốc giữa mép trái, loe sang phải; lõi hổ phách-trắng, thân
cam `#ef5b31`, đuôi khói. Không méo hình nhiệt (dành cho Quá nhiệt). Lửa cách mép ô ≥ 2 px. Dùng lại
mọi cấp; scale ngang đề xuất 1.45 / 1.8 / 1.8, dài theo tầm (t2 ×1.3, chờ GDD).

**Art Bible Anchors:** §8 VFX dùng lại, đổi scale; §4 cặp quá nhiệt / lửa.

**Generation Prompt:** `flamethrower flame cone sprite sheet, 4 frames, origin at left middle widening to the right, amber-white core, orange #ef5b31 body, dark smoke tail, cel-shaded flat tones, 128x64 cells, transparent background`.

**Engine:** pivot Custom (0, 0.5); sorting layer "Projectile"; xoay theo `atan2(sin·0.72, cos)`; frame
start/end do code scale (README).

**Status:** Needed

## ASSET-062 — vfx_flamethrower_burning

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 128×32 (ô 32×32), 4 frame, 10 fps, loop |
| Format | PNG RGBA32 |
| Naming | `vfx_flamethrower_burning.png` (đổi tên từ `vfx_burning.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Lửa nhỏ bám trên Dị Thể đang cháy, đáy lửa ở dòng 28; cam `#ef5b31` lõi hổ
phách, có viền `#2c2240` mảnh (để nổi trên ngà sáp). Scale theo cỡ kẻ địch (Sáp vụn 0.6, Bào tử 1.2),
không theo cấp tháp.

**Art Bible Anchors:** §2 nguyên tắc sáng cho con người; §8.

**Generation Prompt:** `small flame clinging to a target, 4 frames loop, base of flame on row 28, orange #ef5b31 with amber core, thin indigo outline #2c2240, 32x32 cells, transparent background`.

**Engine:** con của kẻ địch, sort theo kẻ địch; pool.

**Status:** Needed

## ASSET-063 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/Flamethrower/Preview~/_preview_tower.png` (tạo mới) |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle (Head SE) và t2 `fire_loop` F1 + nón lửa (cắt trong ô).
Hàng 2: cùng ô tô kín `#2c2240`, blur 2 px; khe hở giàn t2 phải còn thấy. Nền nửa đêm `#1e2a4a`, nửa
Đồng bằng trắng. Nên đặt thêm t2 cối và t2 súng máy cạnh bên khi review để so họ tháp.

**Art Bible Anchors:** §3 test silhouette; §8 Preview~.

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-064 — ui_icon_tower_flamethrower_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_flamethrower_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Khối nêm thấp rộng với vòi ngắn loe sang phải, bình nằm ngang (chữ nhật vát
45° hai đầu) phía sau-trên, 3 vạch lửa ngắn trước vòi. Nét 2 px, hổ phách trên `#1a1528`, chỉ góc
90°/45°. Khác icon súng máy (nòng dài mảnh) và cối (ống nghiêng 45°); nhận ra ở 32 px.

**Art Bible Anchors:** §7 icon = dạng vũ khí gốc.

**Generation Prompt:** `flat monochrome UI icon, low wide wedge flamethrower head with short flared nozzle pointing right, horizontal tank behind it, three short flame strokes, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot Base | (0.5, 0.375) | giữ | giữ |
| Pivot Head | Center (0.5, 0.5) | giữ | giữ |
| Head localPosition | (0, 0.125) = 16 px | (0, (m1 − 48)/128), đo từ art | (0, (m2 − 48)/128), đo từ art |
| Trần cả tháp | ≤ 40 px | ≤ 56 px | ≤ 72 px (giá bình ~68) |
| Head nhô trên tâm xoay | ≤ 24 px | ≤ 56 − m1 | ≤ 72 − m2 |
| Gốc nón lửa (theo hướng / cao) | ~24 / ~9 px, đo từ art | ~30 / đo | ~34 / đo |
| Scale nón (ngang) | 1.45 | 1.8 (đề xuất) | 1.8 (đề xuất), dài ×1.3 |

- m = độ cao tâm xoay Head so với mặt đất. Đề xuất: m ≈ 16 / 26 / 38 px (t2 = mặt sàn giàn + vòng xoay).
- Chọn hướng: `k = round(atan2(dy/0.72, dx)/45°)`; hàng S, SE, E, NE, N = k 2, 1, 0, 7, 6; k 3, 4, 5
  dùng hàng của 1, 0, 7 với flipX.
- Gốc nón và độ cao lưu theo dữ liệu mỗi cấp (marker 1 px, xuất JSON như `machine-gun-assets.md`):
  `TierNozzleData { headLocalPos; nozzle[5 hàng] }`, flipX đảo dấu x.
- Khớp frame upgrade/destroy: như `machine-gun-assets.md` (F5 upgrade trùng từng pixel với ghép cấp
  đích; destroy vẽ sẵn Head SE; code ẩn Head thật).
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể; nón lửa ở "Projectile".

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `Flamethrower_t0` | 040–046 | 74 | 2048² |
| `Flamethrower_t1` | 047–053 | 74 | 2048² |
| `Flamethrower_t2` | 054–060 | 74 | 2048² |
| `Flamethrower_VFX` | 061, 062 | 4 ô 128×64 + 4 ô 32² | 256²–512² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tối đa ≈ 12 MB BC7 cho 3 atlas tháp
(ước tính; nặng hơn hai họ kia do 3 file fire mỗi cấp). Sheet nguồn lớn nhất 768×640, dưới giới hạn
2048. `Flamethrower_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_flamethrower_base_{idle,build,destroy}.png` | Đổi tên → `..._t0_base_*` (kèm `.meta` nếu có, giữ GUID); vẽ lại theo t0 mới |
| `tower_flamethrower_head_{idle,fire_start,fire_loop,fire_end}.png` | Đổi tên → `..._t0_head_*` (kèm `.meta`); vẽ lại theo t0 mới |
| `base_upgrade1/2.png`, `head_upgrade1/2.png` (+ `.meta`) | Xóa |
| `vfx_flame_cone.png`, `vfx_burning.png` | Đổi tên → `vfx_flamethrower_flame_cone.png`, `vfx_flamethrower_burning.png` (kèm `.meta`) |
| `Preview~/_preview_tower.png` | Tạo mới (hiện chưa có) |
| `README.md` | Viết lại theo template §8; sửa màu (`#e2412f` → `#b8352b`, `#ffcc33` → `#f0b429`, `#e3954f` → `#cc823f`), "Compression None" → BC7 qua atlas, Head 0.128 → bảng theo cấp |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Góc nón và tầm mỗi cấp (đề xuất t1 góc ×1.25, t2 tầm ×1.3); thời gian cháy trên Dị Thể theo cấp.
- Nón lửa có cần frame start/end riêng hay giữ scale bằng code như README.
- Hơi nóng quanh nón ở giai đoạn polish: có cho phép không (rủi ro lẫn với Quá nhiệt §4).
- Hex phái sinh (cam lửa, đỏ bình) ở đầu file cần đưa vào art bible §4.
- Head hướng N ở t2 vẽ đè lên giá bình phía sau: chấp nhận được hay cần hạ giá bình — kiểm ở preview.
