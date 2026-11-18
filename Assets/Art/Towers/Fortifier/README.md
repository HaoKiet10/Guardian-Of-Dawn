# Tháp gia cố (Fortifier)

Mở khóa: Có sẵn từ đầu

Bản mẫu xem trực tiếp: https://claude.ai/artifact/XF8DTGtjvHDPe2fyHT9swU

## Vai trò
Sửa các đoạn tường thành gần đó trong ban ngày và giảm sát thương tường thành phải chịu; không gây sát thương. Khắc chế: Bậc 1 tiêu chuẩn, Bậc 5 tối thượng (giữ tường).
Tia sửa nối từ đèn trên mái tới đoạn tường trong vùng có phần trăm máu thấp nhất. Mọi đoạn trong vùng có khiên mờ giảm sát thương. Mỗi 4 giây tháp đẩy một đợt gia cố cộng máu cho cả vùng.

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: nhà xưởng và cánh tay xanh ngọc `#3fc79a`, thép sáng `#e4ecf0`, vàng cảnh báo `#ffcc33` ở cột tay, khớp và cuộn cáp. Xanh lục sửa chữa phát sáng `#7dffb8` chỉ dùng cho đèn, tia sửa, vòng gia cố và khiên.
Silhouette là trạm kỹ thuật, cao hơn rộng (khoảng 86 × 100 px trong ô): bệ bê tông ±36 px dày 9, nhà xưởng cao 38 đơn vị thấy rõ mặt trước (cửa cuốn, vạch vàng đen, bảng đèn, cửa sổ), đèn xanh trên mái, cột vàng bên phải mang cánh tay gập khớp to cầm mỏ hàn, tấm thép dựa vào thành nhà, cuộn cáp đứng. Không có nòng súng. Đỉnh cao nhất cách mép trên ô 8 px (idle 10 px).

## Lớp sprite
- `Base`: một lớp duy nhất, tháp không xoay. Mọi animation nằm trên lớp này, mỗi sheet 1 hàng

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_fortifier_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_fortifier_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_fortifier_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_fortifier_t0_base_repair_loop.png` | 0 | Base | repair_loop | 1 hàng × 4 frame | 512×128 |
| `tower_fortifier_t0_base_repair_pulse.png` | 0 | Base | repair_pulse | 1 hàng × 4 frame | 512×128 |
| `tower_fortifier_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_fortifier_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_fortifier_t1_base_repair_loop.png` | 1 | Base | repair_loop | 1 hàng × 4 frame | 512×128 |
| `tower_fortifier_t1_base_repair_pulse.png` | 1 | Base | repair_pulse | 1 hàng × 4 frame | 512×128 |
| `tower_fortifier_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_fortifier_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_fortifier_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_fortifier_t2_base_repair_loop.png` | 2 | Base | repair_loop | 1 hàng × 6 frame | 768×128 |
| `tower_fortifier_t2_base_repair_pulse.png` | 2 | Base | repair_pulse | 1 hàng × 4 frame | 512×128 |
| `tower_fortifier_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: mảnh khiên và cờ lê văng, tia lửa teal, vòng sóng teal. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/fortifier.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 fortifier`.

## Nhịp hoạt động
- Có đoạn tường trong vùng chưa đầy máu: `repair_loop` lặp, bật tia sửa và tia lửa trên tường.
- Không có đoạn nào hỏng: `idle`, tắt tia. Khiên vẫn bật (hiệu ứng bị động).
- Mỗi 4 giây: `repair_pulse` 0.4 s chen vào, xong quay lại loop hoặc idle. Code vẽ thêm vòng sáng lan ra hết vùng và tăng alpha khiên lên 100% trong khoảng 0.5 s.
- Bị bão phá hủy hoặc quá nhiệt: tắt tia và khiên ngay.
- Giá trị trong bản mẫu (dữ liệu tuning, không cố định trong code): hồi 5%/s qua tia, +6% mỗi đợt, khiên giảm 50% sát thương, vùng R = 290 px.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Điểm phát tia: Transform con `BeamOrigin`, `localPosition = (-0.156, 0.440)` so với Base (đèn xanh trên mái, 20 px sang trái, 56 px phía trên pivot)
- Tia sửa: SpriteRenderer Draw Mode Tiled, đặt ở `BeamOrigin`, xoay theo góc thật tới điểm trên mặt tường, chiều dài bằng khoảng cách
- Vùng sửa: elip quanh pivot, `dx² + (dy / 0.72)² ≤ R²`, R bản mẫu 2.27 unit. Đoạn tường có tâm thỏa điều kiện thì được sửa và được khiên
- Tia lửa: đặt ở điểm tia chạm tường, đáy ô chạm mép tường. Khiên: Draw Mode Tiled theo chiều dài đoạn tường, đáy ô ngang mặt trên tường
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot. Tia, tia lửa và khiên vẽ trên lớp tường
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (beam 64×16, spark 32×32, shield 64×48), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: tia sửa, tia lửa và cờ lê trên tường, khiên tường
- Vòng sáng lớn lan ra hết vùng khi đợt gia cố, thanh máu tường: vẽ bằng code/UI
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
