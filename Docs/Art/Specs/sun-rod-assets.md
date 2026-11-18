# Asset Specs — Entity: sun-rod (Cột thu sáng)

> **Source**: `Assets/Art/Towers/SunRod/README.md`, `design/gdd/guardian-of-dawn-gdd-v2.md` §4.6
> **Art Bible**: design/art/art-bible.md
> **Generated**: 2026-11-18 (review: art-director; chờ technical-artist)
> **Engine**: chưa cấu hình; giả định Unity URP 2D theo art bible §8
> **Sibling spec**: `design/assets/specs/mortar-assets.md`, `design/assets/specs/machine-gun-assets.md`
> **Status**: 16 assets specced / 0 approved / 0 in production / 0 done

## Thiết kế theo cấp

Vai trò: hỗ trợ, không gây sát thương. Khi tia bão mặt trời hoặc tia hội tụ của Dị Thể
thấu kính nhắm vào một công trình trong bán kính, tia bị bẻ hướng vào `StrikePoint` của
cột; cột bị phá thay công trình kia. **Phá hủy là kết cục bình thường**, nên `absorb` +
`destroy` là cặp anim chính, vẽ kỹ như anim bắn của tháp gây sát thương.

| | t0 · Cột néo dã chiến | t1 · Cột giàn thép | t2 · Tháp thu sáng công nghiệp |
|---|---|---|---|
| Chiếm ngang (thân + nền) / cao trên mặt đất | ~40 px (31%) / ≤ 56 px | ~52 px (41%) / ≤ 66 px | ~66 px (52%) / ≤ 76 px |
| Khối nền | Thùng phuy đổ sỏi, quây vài bao cát, 3 dây néo xòe ra cọc | Móng bê tông vuông có sọc vàng-đen, chân giàn bắt bu-lông | 2 tầng: sàn thép cắt máy + 2 khối tụ điện hình hộp hai bên, thanh cái đồng |
| Thân | 1 ống thép nhặt lại, dựng thẳng, buộc dây | Giàn thép tán đinh thon dần lên đỉnh (kiểu cột phát sóng) | Cột thép tiện dày, 2 cụm sứ cách điện bát giác ở khớp chân và khớp đỉnh |
| Chóp (vũ khí) | 3 chấu rebar uốn tay giữ tinh thể ~8×10 px | Vương miện thép gia công 3 chấu bắt bu-lông, tinh thể ~10×12 px | 3 cánh tay kẹp thủy lực, tinh thể ~12×14 px; cánh tay mở ra khi hút tia |
| Cuộn đồng | 1 cuộn dây quấn tay ngay dưới chóp | 2 vòng cuộn trên giàn, sứ trắng ngăn giữa | 1 vòng cuộn quanh giữa cột, nối thanh cái xuống tụ |
| Dây nối đất (motif) | Dây đồng trần xuống cọc rebar trước-phải | Cáp trong ống thép xuống tấm tiếp đất đúc trước-phải | Cáp bọc giáp to xuống khối cọc tiếp đất có đồng hồ trước-phải |
| Vật liệu | Bao cát `#eabb5c`, phuy, ống thép, dây thừng, rebar | Bê tông, thép tán đinh, sọc cảnh báo | Thép cắt máy, tụ điện, thủy lực, cáp bọc giáp |
| Silhouette | Vạch đứng mảnh + "lều" dây néo + cục thấp ở chân | Tam giác nhọn thon cao (tháp giàn) | Bệ bậc rộng + cột dày + vương miện càng kẹp |

**Sợi chỉ họ cột thu sáng (giữ cả 3 cấp, §3):**
1. Dạng nguyên thủy: một trục **đứng thẳng, mảnh**, chóp là **tinh thể dài nhiều mặt cạnh
   thẳng kẹp trong 3 chấu**, luôn ở đỉnh, đúng trục giữa ô. Không bao giờ có cuộn dây to
   hay vòng xuyến ở đỉnh (tránh lẫn với tháp điện chuỗi "cuộn dây/chóp đứng", §3).
2. Màu họ: đồng đỏ `#e97d4e` chỉ trên cuộn dây và dây nối đất; vàng nắng `#ffcf3a` chỉ
   trên tinh thể. Giữ nguyên ở mọi cấp; cấp không bao giờ báo bằng màu (§4).
3. Motif: dây nối đất đi từ chân trục ra **trước-phải** xuống cọc tiếp đất ở góc
   trước-phải ô (cối: thùng đạn trước-trái; súng máy: hộp đạn bên trái). Khi hút tia,
   năng lượng chạy dọc dây này xuống cọc ở mọi cấp: người chơi thấy tia "đi đâu".

**Lối chơi theo cấp (đề xuất, chờ GDD):** t1 bán kính bảo vệ ×1.25 (r 1.875 unit); t2 bán
kính ×1.5 (r 2.25 unit). Phương án "t2 chịu được 1 tia rồi mới vỡ" chưa được vẽ trong
spec này (xem Quyết định và Câu hỏi còn mở).

**Hex phái sinh (đề xuất, cần bổ sung vào art bible §4):** đồng đỏ `#f4a479` / `#e97d4e`
/ `#a9502c`; tinh thể `#fff1a8` / `#ffcf3a` / `#d99a1a`; sứ cách điện `#eeede8` / `#c9c6bc`
/ `#9a978e`. Thép, bê tông, vàng cảnh báo dùng hex phái sinh của `mortar-assets.md`.

## Quyết định đã chốt (2026-11-18)

- **Chiều cao vượt bảng §3 (ngoại lệ art bible):** 56 / 66 / 76 px thay vì 40 / 56 / 72,
  vẫn ≤ trần thực tế 78 px. Lý do: từ vựng roster §3 bắt cột là "vật cao nhất trên sân";
  cột luôn cao hơn mọi tháp cùng cấp và cao nhất tuyệt đối ở t2, mà thân mảnh nên che ô
  phía sau rất ít.
- **Độ chiếm ô dưới bảng §3 (ngoại lệ art bible):** ~31 / 41 / 52% thay vì 55 / 70 / 85%,
  nhưng vẫn tăng qua từng cấp cùng với khối nền và chiều cao. Lý do: tháp chiếm ô nhỏ
  nhất roster; vai trò "rẻ, phụ" đọc qua độ mảnh.
- **Dây néo t0** được xòe ra ngoài % chiếm ô (như ngoại lệ nòng ngang §3), tổng ≤ 64 px,
  cách mép ô ≥ 2 px. Lý do: dây néo là thứ làm t0 khác hẳn tháp giàn t1 khi blur.
- **Thân cột không trắng:** thân là thép 3 tông; trắng `#eeede8` chỉ ở sứ cách điện, diện
  tích nhỏ, có viền. Lý do: README cũ dùng thân trắng, sát ngà sáp `#e9dfc4` và biến mất
  trên Đồng bằng trắng ban ngày (§4, §5).
- **t0 theo §3 (phuy, bao cát, dây néo)**, không theo README cũ (bệ bê tông sọc cảnh báo
  thuộc t1). Lý do: bao cát chỉ ở t0, bê tông từ t1.
- **Đỉnh luôn là tinh thể trong 3 chấu**, không cuộn/vòng xuyến ở đỉnh. Lý do: tách khỏi
  silhouette tháp điện chuỗi.
- **Phá hủy = cong gập và gãy theo đường thẳng, không chảy võng.** Vũng đồng vẽ thành mảng
  bắn tóe cạnh gãy, phẳng. Lý do: §3, đường võng/nhỏ giọt là ngôn ngữ của sáp; cột chảy võng
  sẽ đọc như "bị hóa sáp".
- **Absorb luôn nối destroy ở mọi cấp; không vẽ trạng thái "sống sót".** File set đúng §8:
  9 + 3A, A = 1 → 12 sheet tháp. Lý do: cơ chế chịu 1 tia chưa có trong GDD; nếu được chốt
  sẽ cần thêm sheet (ghi ở Câu hỏi còn mở), không ước lượng trước.
- **Anim `absorb` F0 = lúc tia chạm** (ngoại lệ "frame 0 = tư thế nghỉ", như `fire` của
  cối). **`destroy` F0 nối tiếp `absorb` F5** (tinh thể nứt, thân đỏ nóng), không phải tư
  thế nghỉ. Lý do: destroy là kết cục bình thường, luôn chạy ngay sau absorb.
- **Không có VFX theo cấp:** `vfx_storm_bolt` và tia lửa hút dùng lại, chỉ đổi scale. Lý do:
  §8; không cấp nào thêm cơ chế hình ảnh mới (bán kính lớn hơn là vòng code vẽ).
- **Năng lượng chạy dọc dây nối đất vẽ trong sprite tháp**, không làm VFX. Lý do: nằm gọn
  trong ô, khớp frame chính xác, rẻ.
- **`vfx_storm_bolt` giữ tên, chuyển sang `_Shared/`**; tia lửa đổi tên thành
  `vfx_sun_rod_absorb_spark`. Lý do: tia bão chạy cả khi không có cột (chủ = hệ bão, tên đã
  đúng mẫu `vfx_<owner>_<effect>`); tia lửa thuộc riêng cột.
- **Đèn idle hổ phách `#ff9f1c`, không đèn đỏ báo không lưu.** Lý do: đỏ `#e2412f` là màu
  nguy hiểm (§4); hổ phách = ánh sáng con người.

## Prompt nền

**BASE:** `hand-painted 2D tower defense sprite, flat cel-shaded, exactly 3 tones per colour, clean 2px dark indigo outline #2c2240, 3/4 top-down orthographic view (~45° elevation, no perspective), light from top-left, single object centered on transparent background, 128x128 cell, ground contact line 48px from bottom, no ground shadow, saturated warm palette: copper #cc823f, steel #4a505e, amber lamp #ff9f1c`

**NEG:** `medieval, fantasy, stone castle, banners, tiled roof, photorealistic, painterly realism, perspective camera, fisheye, thick black outline, gradients, noise texture, text, watermark, grass, soldiers, characters`

**NEG-ROD (thêm sau NEG ở mọi sheet tháp):** `tesla coil, toroid ring on top, glowing orb, wax, dripping, sagging curves, white painted mast, red and white aviation stripes`

**T0:** `tall thin improvised lightning-rod mast, one salvaged steel pipe #4a505e standing perfectly upright, lashed into a gravel-filled oil drum ringed by a few sandbags #eabb5c, three thin guy wires spreading to rebar stakes, hand-wound red-copper #e97d4e wire coil just below the top, three bent rebar prongs holding an elongated faceted sun-yellow crystal #ffcf3a at the very top, small amber lantern hanging mid-mast, bare red-copper ground wire running to a stake at front-right, about 40px wide base, 56px tall`

**T1:** `tall slender tapering riveted steel lattice mast like a radio tower, square concrete footing with yellow-black hazard stripes #f0b429, two red-copper #e97d4e coil collars separated by small white ceramic insulators #eeede8, machined bolted three-prong steel crown holding an elongated faceted sun-yellow crystal #ffcf3a at the top, amber lamp on the lattice, red-copper ground cable in steel conduit to a cast ground plate at front-right, no sandbags, about 52px wide base, 66px tall`

**T2:** `tall industrial light-collector spire, two-level machined steel deck with two boxy capacitor banks and copper busbars on either side, thick machined steel column with stacks of small octagonal white ceramic insulator plates #eeede8 at its foot and top joints, one red-copper #e97d4e coil band around the column middle, three hydraulic claw arms holding a large elongated faceted sun-yellow crystal #ffcf3a at the top, armored red-copper ground cable to a ground spike block with gauge at front-right, amber indicator lamp on capacitor bank, about 66px wide base, 76px tall, Stålenhag-style industrial materials`

Chung mọi sheet (§8): 1 hàng, frame trái → phải, không padding, ≥ 2 px trong suốt sát
mép ô (trần thực tế 78 px trên mặt đất; t2 chỉ còn 2 px trên đỉnh tinh thể, nên mảnh vỡ
destroy t2 văng ngang/xuống, không văng lên). PNG RGBA32 sRGB alpha thẳng; Sprite Mode
Multiple; Bilinear; tắt mipmap; tắt Read/Write; Mesh Tight; nén BC7 HQ qua override
Standalone của Sprite Atlas V2 (ngoại lệ None nếu vỡ khối viền). Một lớp `Base`, không
Head, không hướng.

---

## ASSET-140 — tower_sun_rod_t0_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128 (ô 128), 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t0_base_idle.png` |
| Texture Res | Ô tháp 128×128 — §8 |

**Visual Description:** Ống thép nhặt lại dựng thẳng trong thùng phuy đổ sỏi, vài bao
cát quây chân phuy, 3 dây néo căng xuống cọc rebar. Cuộn dây đồng đỏ quấn tay ngay dưới 3
chấu rebar giữ tinh thể vàng nắng ở đỉnh; đèn bão hổ phách treo giữa cột; dây đồng trần
xuống cọc trước-phải. F0 tinh thể tĩnh, đèn sáng; F1 tinh thể lóe 1 điểm sáng, đèn mờ.

**Art Bible Anchors:**
- §3: vật liệu cấp 0 (chắp vá, bao cát chỉ ở cấp này); ngoại lệ chiều cao 56 px (Quyết định)
- §3 từ vựng roster: mảnh, đứng, vật cao nhất
- §4: 3 tông, viền `#2c2240`, cấp không báo bằng màu

**Generation Prompt:** BASE + T0 + `idle pose`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-141 — tower_sun_rod_t0_base_absorb

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 12 fps, 1 lần (0.5 s), nối thẳng destroy |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t0_base_absorb.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 tia chạm: tinh thể trắng rực, 3 chấu rebar sáng viền. F1 ống
thép trắng nóng từ đỉnh xuống nửa thân. F2 cuộn đồng cam, một vệt sáng chạy dọc dây đồng
trần xuống cọc trước-phải, cọc tóe tia nhỏ. F3 cuộn đồng đỏ, dây néo rung 1 px, khói mảnh
từ cuộn dây. F4 tinh thể nứt một đường chéo thẳng, đèn bão tắt. F5 tinh thể nứt hẳn, ống đỏ
nóng, giữ để destroy F0 nối tiếp. Toàn bộ ≤ 56 px trên mặt đất; tia sáng ngoài sprite do
VFX vẽ.

**Art Bible Anchors:**
- §4: hổ phách/vàng = ánh sáng con người thuần hóa; trắng nóng chỉ trong thân cột
- §7: chớp cục bộ trong sprite, không phải chớp toàn màn hình
- Quyết định: F0 = lúc chạm (ngoại lệ frame 0)

**Generation Prompt:** BASE + T0 + `absorbing a light beam at the crystal, crystal white-hot, energy running down the ground wire, coil glowing orange then red` (đổi dòng cuối theo frame; F4–5 `crystal cracked`). NEG + NEG-ROD.

**Engine:** Animation Event F0 khớp lúc đoạn tia thứ hai chạm `StrikePoint`; sinh
`vfx_sun_rod_absorb_spark` ở F0.

**Status:** Needed

## ASSET-142 — tower_sun_rod_t0_base_build

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t0_base_build.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 cọc và dây đánh dấu, 3 cọc rebar néo. F1 thùng phuy đặt xuống,
bao cát quây nửa sau. F2 ống thép dựng nghiêng ~30°, dây néo chùng. F3 ống thẳng đứng, dây
néo căng, dây đồng nối đất xuống cọc trước-phải. F4 lắp tinh thể vào 3 chấu (lóe nhẹ). F5 =
idle F0.

**Art Bible Anchors:**
- §8: chỉ t0 có build; frame cuối = idle F0

**Generation Prompt:** BASE + T0 + `under construction, stage N of 6, stakes and string`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-143 — tower_sun_rod_t0_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần (0.6 s), giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t0_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = tiếp absorb F5 (tinh thể nứt, ống đỏ nóng), tinh thể vỡ tung
thành 4–5 mảnh cạnh thẳng. F1 ống gập một góc cứng ở chỗ buộc dây, dây néo đứt bật. F2 nửa
trên ống đổ nghiêng sang phải. F3 phuy lật nghiêng, khói. F4 khói tan. F5 đống đổ nát: phuy
nằm nghiêng, ống thép gập đôi, bao cát xém, mảnh tinh thể vàng tắt màu, mảng đồng bắn tóe
cạnh gãy ở chân; 2 tông, không viền tím. Chevron mờ và dấu góc ô do UI vẽ.

**Art Bible Anchors:**
- §7: đống đổ nát 2 tông, mất viền
- §3: gãy theo đường thẳng, không chảy võng (Quyết định)
- §8: destroy mỗi cấp một file; mảnh không chạm mép

**Generation Prompt:** F0–4 BASE + T0 + `overloaded, crystal shattering, mast buckling at a sharp angle, guy wires snapping`; F5 BASE + `rubble of improvised lightning rod, oil drum on its side, steel pipe bent double, scorched sandbags, dull crystal shards, flat angular copper splash, two-tone, no outline`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-144 — tower_sun_rod_t1_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t1_base_upgrade.png` (t0 → t1) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t0 idle F0 bị giàn giáo thép bao quanh (giàn giáo cao tới
~60 px). F1–2 bụi che, hạ ống thép và phuy, tháo dây néo. F3 móng bê tông vuông và nửa
dưới giàn thép trồi lên. F4 giàn hoàn thiện, vương miện 3 chấu và tinh thể được cẩu vào
đỉnh. F5 = t1 idle F0. Đổi khối, không chồng phụ kiện.

**Art Bible Anchors:**
- §1 nguyên tắc 1: cấp là công trình khác hẳn
- §8: upgrade = giàn giáo → bụi → lộ công trình mới

**Generation Prompt:** BASE + `construction transition, scaffolding and dust cloud, guyed pipe mast replaced by tapering steel lattice mast on square concrete footing`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-145 — tower_sun_rod_t1_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t1_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Móng bê tông vuông sọc vàng-đen; giàn thép tán đinh thon dần,
thanh chéo tạo các tam giác rõ; 2 vòng cuộn đồng đỏ trên giàn, sứ trắng nhỏ ngăn giữa;
vương miện thép 3 chấu giữ tinh thể ở đỉnh; cáp nối đất trong ống thép xuống tấm tiếp
đất trước-phải. F0 đèn hổ phách trên giàn sáng; F1 tinh thể lóe, đèn mờ. Không bao cát,
không dây néo.

**Art Bible Anchors:**
- §3: vật liệu cấp 1 (bê tông, thép tán đinh, sọc cảnh báo); ngoại lệ 66 px
- §9: Stålenhag — vật liệu t1–t2

**Generation Prompt:** BASE + T1 + `idle`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-146 — tower_sun_rod_t1_base_absorb

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 12 fps, 1 lần (0.5 s), nối thẳng destroy |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t1_base_absorb.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 tia chạm, tinh thể và vương miện trắng rực. F1 các đoạn giàn
sáng trắng lần lượt từ đỉnh xuống (từng tam giác một). F2 2 vòng cuộn cam, vệt sáng chạy
dọc ống thép xuống tấm tiếp đất, tấm tóe tia. F3 cuộn đỏ, sứ trắng nứt vạch, khói từ giữa
giàn. F4 tinh thể nứt, đèn tắt. F5 tinh thể nứt hẳn, nửa trên giàn đỏ nóng, giữ để destroy
nối tiếp.

**Art Bible Anchors:**
- §3: cơ chế đọc qua kết cấu giàn; §7 chớp cục bộ
- Quyết định: F0 = lúc chạm

**Generation Prompt:** BASE + T1 + `absorbing a light beam at the crystal, lattice segments glowing white-hot from top down, energy running down the ground conduit, coils orange then red` (F4–5 `crystal cracked`). NEG + NEG-ROD.

**Engine:** như ASSET-141; spark scale 1.2.

**Status:** Needed

## ASSET-147 — tower_sun_rod_t1_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần (0.6 s), giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t1_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 tiếp absorb F5, tinh thể vỡ, vương miện bật. F1 giàn oằn một
khúc gãy góc cứng ở giữa. F2 nửa trên giàn gập đổ sang phải, thanh chéo bung. F3 móng bê
tông nứt một góc, khói. F4 khói tan. F5: móng bê tông nứt, mảnh sọc vàng còn thấy, gốc
giàn cụt, nửa giàn gập nằm ngang, mảnh tinh thể tắt màu, mảng đồng bắn tóe cạnh gãy; 2 tông,
không viền.

**Art Bible Anchors:**
- §7: đống đổ nát; §3 gãy thẳng, không võng

**Generation Prompt:** F5 BASE + `wreck of steel lattice mast folded over, cracked square concrete footing with hazard stripe fragments, stump of lattice, dull crystal shards, flat angular copper splash, two-tone, no outline`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-148 — tower_sun_rod_t2_base_upgrade

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t2_base_upgrade.png` (t1 → t2) |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 = t1 idle F0 bị giàn giáo che. F1–2 bụi, hạ giàn thép, đập móng.
F3 sàn thép 2 tầng và 2 khối tụ điện trồi lên. F4 cột thép dày dựng lên, cụm sứ và cánh tay
kẹp thủy lực lắp vào, tinh thể lớn hạ xuống đỉnh. F5 = t2 idle F0. Giàn giáo ≤ 76 px.

**Art Bible Anchors:**
- §1 nguyên tắc 1; §8 upgrade; ngoại lệ 76 px ≤ trần 78 px

**Generation Prompt:** BASE + `construction transition, scaffolding, dust cloud, lattice mast replaced by thick machined steel spire on stepped deck with capacitor banks`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-149 — tower_sun_rod_t2_base_idle

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 256×128, 2 frame, 2 fps, loop |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t2_base_idle.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** Sàn thép cắt máy 2 tầng, 2 khối tụ điện hình hộp hai bên nối thanh
cái đồng vào chân cột. Cột thép tiện dày, cụm sứ bát giác nhỏ ở khớp chân và khớp đỉnh,
vòng cuộn đồng đỏ giữa cột. 3 cánh tay kẹp thủy lực khép quanh tinh thể lớn. Cáp bọc giáp
xuống khối cọc tiếp đất có đồng hồ ở trước-phải. F0 đèn hổ phách trên tụ sáng, kim đồng
hồ trái; F1 tinh thể lóe, kim lệch 1 px.

**Art Bible Anchors:**
- §3: vật liệu cấp 2 (công nghiệp, cơ chế lộ ra); ngoại lệ 76 px; test silhouette
- §9: Stålenhag

**Generation Prompt:** BASE + T2 + `idle, claw arms closed around crystal`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-150 — tower_sun_rod_t2_base_absorb

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 12 fps, 1 lần (0.5 s), nối thẳng destroy |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t2_base_absorb.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 tia chạm, 3 cánh tay kẹp bật mở ra ~2 px (cơ chế lộ ra, xy-lanh
duỗi), tinh thể trắng rực. F1 cụm sứ đỉnh sáng, cột trắng nóng xuống tới vòng cuộn. F2 cuộn
cam, đèn trên 2 khối tụ chạy từ dưới lên đầy, vệt sáng chạy dọc cáp giáp xuống khối cọc,
kim đồng hồ đập kịch. F3 cuộn đỏ, khói từ khe tụ điện. F4 tinh thể nứt, cánh tay kẹp khựng.
F5 tinh thể nứt hẳn, cột đỏ nóng, giữ để destroy nối tiếp. Không vượt 76 px kể cả khi tay
kẹp mở.

**Art Bible Anchors:**
- §3: cơ chế lộ ra (tay kẹp, tụ điện); §7 chớp cục bộ
- Quyết định: F0 = lúc chạm; không có anim "sống sót"

**Generation Prompt:** BASE + T2 + `absorbing a light beam, hydraulic claw arms opening, crystal white-hot, capacitor lights filling up, energy running down armored ground cable, coil orange then red` (F4–5 `crystal cracked`). NEG + NEG-ROD.

**Engine:** như ASSET-141; spark scale 1.4.

**Status:** Needed

## ASSET-151 — tower_sun_rod_t2_base_destroy

| Field | Value |
|-------|-------|
| Category | Sprite |
| Dimensions | 768×128, 6 frame, 10 fps, 1 lần (0.6 s), giữ F5 |
| Format | PNG RGBA32 |
| Naming | `tower_sun_rod_t2_base_destroy.png` |
| Texture Res | Ô 128 — §8 |

**Visual Description:** F0 tiếp absorb F5, tinh thể vỡ, cánh tay kẹp văng ngang. F1 cụm sứ
đỉnh vỡ, cột gãy ở khớp đỉnh. F2 cột tụt xuống từng đoạn cứng như ống lồng, khối tụ phải
nổ bung nắp. F3 sàn thép nghiêng 1 px, khói dày. F4 khói tan. F5: sàn thép với 2 khối tụ
cháy đen, gốc cột cụt và cụm sứ chân nứt, đoạn đỉnh cột kèm tay kẹp nằm ngang, mảnh tinh thể
tắt màu, mảng đồng bắn tóe cạnh gãy; 2 tông, không viền. Mảnh văng ngang/xuống, không lên
(chỉ còn 2 px tới trần).

**Art Bible Anchors:**
- §7: đống đổ nát; §8 không chạm mép; §3 gãy thẳng

**Generation Prompt:** F5 BASE + `wrecked industrial spire, stepped steel deck with burnt capacitor banks, broken column stump with cracked insulator plates, fallen top section with claw arms lying flat, dull crystal shards, flat angular copper splash, two-tone, no outline`. NEG + NEG-ROD.

**Status:** Needed

## ASSET-152 — vfx_storm_bolt

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 256×256 (ô 64×256), 4 frame, 12 fps, 1 lần |
| Format | PNG RGBA32 |
| Naming | `vfx_storm_bolt.png` (dùng lại, giữ tên; chuyển sang `Assets/Art/Towers/_Shared/`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** F0 tia dẫn mờ, mảnh (cảnh báo 0.7 s cuối). F1–3 tia chính trắng
nắng `#fff4d6` lõi trắng, rìa magenta nhạt `#ff3d7f`, đường gấp khúc cạnh thẳng, tắt dần;
đốm chạm ở đáy. Dùng cho mọi công trình bị bão đánh; khi bẻ góc, code dùng 2 bản (thẳng
đứng tới điểm bẻ, xoay từ điểm bẻ vào `StrikePoint`). Không đổi theo cấp cột.

**Art Bible Anchors:**
- §4: trắng nắng = ánh sáng thù địch; magenta = bão
- §7: chớp toàn màn hình (của hệ bão) ≤ 3 lần/giây, tùy chọn giảm chớp

**Generation Prompt:** `vertical solar storm lightning beam sprite sheet, 4 frames, 64x256 cells, hostile sun-white #fff4d6 with white core and faint magenta #ff3d7f rim, straight-edged jagged segments, impact spot at bottom, flat cel-shaded, transparent background`.

**Engine:** pivot Bottom (0.5, 0), scale Y = độ dài / 2 unit. Atlas dùng chung `_Shared`.
Tia hội tụ của Dị Thể thấu kính là VFX của enemy, bẻ góc theo cùng cách, không spec ở đây.

**Status:** Needed

## ASSET-153 — vfx_sun_rod_absorb_spark

| Field | Value |
|-------|-------|
| Category | VFX |
| Dimensions | 192×64 (ô 64×64), 3 frame, 14 fps, 1 lần (~0.2 s) |
| Format | PNG RGBA32 |
| Naming | `vfx_sun_rod_absorb_spark.png` (đổi tên từ `vfx_absorb_spark.png`) |
| Texture Res | Bội số 32 — §8 |

**Visual Description:** Tia lửa điện tỏa từ tâm, các tia gấp khúc cạnh thẳng, lõi trắng,
rìa vàng nắng `#ffcf3a` và hổ phách `#ff9f1c` (không magenta: tia đã bị con người thuần
hóa). Scale 1.0 / 1.2 / 1.4 cho t0 / t1 / t2.

**Art Bible Anchors:**
- §8: VFX dùng lại mọi cấp, chỉ đổi scale
- §4: hổ phách/vàng = ánh sáng con người

**Generation Prompt:** `electric spark burst sprite sheet, 3 frames, 64x64 cells, straight-edged jagged rays radiating from center, white core, sun-yellow #ffcf3a and amber #ff9f1c edges, flat cel-shaded, transparent background`.

**Engine:** pivot Center, đặt tại `StrikePoint` của cấp hiện tại, không xoay; không làm
con của tháp nếu Sorting Group nuốt thứ tự (đặt lớp VFX trên).

**Status:** Needed

## ASSET-154 — Preview~/_preview_tower.png

| Field | Value |
|-------|-------|
| Category | Sprite (chỉ review) |
| Dimensions | 512×256 (4×2 ô 128), tĩnh |
| Format | PNG |
| Naming | `Assets/Art/Towers/SunRod/Preview~/_preview_tower.png` |
| Texture Res | — (không import) |

**Visual Description:** Hàng 1: t0, t1, t2 idle và t2 absorb F2. Hàng 2: cùng 4 ô tô kín
`#2c2240`, blur 2 px. Nền nửa đêm `#1e2a4a`, nửa Đồng bằng trắng ban ngày. Thêm 1 lần test
đặt cạnh preview tháp điện chuỗi (khi có) để kiểm tra không lẫn họ.

**Art Bible Anchors:**
- §3: test silhouette; §8: Preview~

**Generation Prompt:** không cần — ghép từ sheet đã export.

**Status:** Needed

## ASSET-155 — ui_icon_tower_sun_rod_64

| Field | Value |
|-------|-------|
| Category | UI |
| Dimensions | 64×64, vẽ 64, hiển thị 32/48 |
| Format | PNG RGBA32 |
| Naming | `ui_icon_tower_sun_rod_64.png` |
| Texture Res | Icon UI — §8 |

**Visual Description:** Một kim đứng mảnh, đỉnh là hình thoi (tinh thể, góc 45°) giữa 3
chấu, một vạch chéo 45° xuống phải ở chân (dây nối đất), đế chữ nhật nhỏ. Nét 2 px, một
màu hổ phách trên `#1a1528`, chỉ góc 90°/45°. Một icon mọi cấp; nhận ra ở 32 px, khác icon
điện chuỗi (không cuộn dây).

**Art Bible Anchors:**
- §7: icon = dạng nguyên thủy của họ, lưới 32 px

**Generation Prompt:** `flat monochrome UI icon, thin vertical lightning rod with a diamond crystal held by three prongs on top, short 45 degree ground wire at the foot, small rectangular base, 2px stroke, only 90 and 45 degree angles, amber #ff9f1c on #1a1528, 32px grid, no gradients`.

**Engine:** Sprite Single, pivot Center, atlas UI.

**Status:** Needed

---

## Kỹ thuật chung

### Thông số engine theo cấp

| Mục | t0 | t1 | t2 |
|---|---|---|---|
| Pivot | (0.5, 0.375) | giữ nguyên | giữ nguyên |
| Trần thân | ≤ 56 px (y ≤ 0.4375) | ≤ 66 px (y ≤ 0.5156) | ≤ 76 px (y ≤ 0.5938) |
| `StrikePoint` (giữa tinh thể, đề xuất, đo lại từ art) | (0, 0.391) ≈ 50 px | (0, 0.461) ≈ 59 px | (0, 0.531) ≈ 68 px |
| Bán kính bảo vệ (đề xuất, chờ GDD) | 1.5 unit | 1.875 unit | 2.25 unit |
| Scale `vfx_sun_rod_absorb_spark` | 1.0 | 1.2 | 1.4 |
| `vfx_storm_bolt` | không đổi | không đổi | không đổi |
| Độ dài anim absorb / destroy | 0.5 / 0.6 s | giữ | giữ |

- Công thức: `StrikePoint.local = (0, px_trên_mặt_đất / 128)`. README cũ đặt 67 px cho
  cột duy nhất; nay mỗi cấp một giá trị, ghi trong data từng cấp, không hardcode.
- Vùng bảo vệ: `(dx / r)² + (dy / (r · 0.72))² ≤ 1` theo tâm ô xây; vòng nét đứt vẽ bằng
  code. Lưu ý: nét đứt §7 dành cho bão; vòng bảo vệ của cột liên quan bão nên giữ nét đứt
  nhưng màu hổ phách, không magenta (README đã như vậy).
- Nhịp (giữ từ README): cảnh báo 10 s → tia rơi 0.14 s tới điểm bẻ (1.2 unit trên mục
  tiêu) → đoạn 2 vào `StrikePoint` 0.08 s → `absorb` 0.5 s + spark ~0.2 s → `destroy`
  0.6 s → giữ F5 tới khi xây lại (luôn về t0).
- Sorting Group ở gốc tháp; unlit, cùng sorting layer với Dị Thể. Thân mảnh nên che ô sau
  ít, dù cao hơn tháp khác.

### Atlas

| Atlas | Nội dung | Ô | Dự kiến |
|---|---|---|---|
| `SunRod_t0` | 140–143 | 20 | 1024² |
| `SunRod_t1` | 144–147 | 20 | 1024² |
| `SunRod_t2` | 148–151 | 20 | 1024² |
| `SunRod_VFX` | 153 | 3 ô 64² | 256² |
| `_Shared` (đã có) | 152 | 4 ô 64×256 | 256²–512² |

Atlas V2: padding 4, Extrude 1, Mesh Tight, tắt Allow Rotation. Tổng ≈ 3 MB BC7 cho 3 atlas
tháp (ước tính). `SunRod_VFX` là atlas thêm ngoài quy tắc §8, như `Mortar_VFX`.

### File cũ cần xử lý

| File cũ | Xử lý |
|---|---|
| `tower_sun_rod_base_{idle,build,absorb,destroy}.png` | Đổi tên → `tower_sun_rod_t0_base_*.png` (kèm `.meta`, giữ GUID); vẽ lại theo t0 mới |
| `tower_sun_rod_base_upgrade1.png`, `_upgrade2.png` (+ `.meta`) | Xóa |
| `vfx_storm_bolt.png` | Giữ tên, chuyển sang `../_Shared/` (kèm `.meta`) |
| `vfx_absorb_spark.png` | Đổi tên → `vfx_sun_rod_absorb_spark.png` (kèm `.meta`) |
| `_preview_tower.png` | Chuyển vào `Preview~/`, ghép lại theo ASSET-154 |
| `README.md` | Viết lại theo template §8: bỏ thân trắng `#eeede8`, bỏ đoạn tint phụ kiện khi absorb, `StrikePoint` theo cấp, chiều cao 56/66/76, "Compression None" → BC7 qua atlas |

### Câu hỏi còn mở (chờ GDD / game-designer)

- Bán kính bảo vệ từng cấp; nhiều cột cùng phủ thì cột nào hút (README đề xuất cột gần nhất).
- t2 "chịu được 1 tia": nếu chốt cần thêm ít nhất `t2_base_absorb_survive` (tay kẹp xả, tinh
  thể nứt) + `t2_base_idle_damaged` (hoặc rơi về t1 qua một anim hạ cấp) — ngoại lệ công
  thức §8, chưa spec.
- Cột có thể bị phá bởi nguyên nhân khác (Dị Thể tấn công) không? Nếu có, destroy F0 (nối
  absorb) không khớp idle: cần quyết chạy `absorb` F3–5 trước hay thêm frame chuyển.
- Tia hội tụ Dị Thể thấu kính: cột hút với cùng anim absorb hay bản nhẹ hơn.
- Hex họ cột và hex phái sinh ở đầu file cần đưa vào art bible §4; ngoại lệ chiều cao /
  độ chiếm ô cần đưa vào §3 và bảng kích thước §8.
