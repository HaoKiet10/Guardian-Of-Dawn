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

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_fortifier_base_idle.png` | Base | idle, đèn xanh nháy chậm | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_fortifier_base_repair_loop.png` | Base | đang sửa: tay gõ mỏ hàn xuống bàn gá (đầu mỏ hàn hạ khoảng 10 px), tia lửa ở frame 1 và 2 | 1 hàng × 4 frame | 8 | 512×128 |
| `tower_fortifier_base_repair_pulse.png` | Base | đợt gia cố: đèn bùng trắng xanh, vòng sáng lan 20 lên 38 px | 1 hàng × 4 frame | 10 | 512×128 |
| `tower_fortifier_base_build.png` | Base | build, chạy 1 lần, frame 5 = idle | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_fortifier_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_fortifier_base_upgrade1.png` | Base | phụ kiện bậc 1: thùng đồ nghề, thêm 2 tấm thép, 2 cọc chắn | 1 ô | không | 128×128 |
| `tower_fortifier_base_upgrade2.png` | Base | phụ kiện bậc 2: ăng-ten điều phối có đèn, chảo thu, đèn vàng | 1 ô | không | 128×128 |
| `vfx_repair_beam.png` | VFX | đoạn tia sửa, lát ngang được (sóng chu kỳ 32 px) | 1 hàng × 3 frame | 12 | 192×16 (ô 64×16) |
| `vfx_repair_spark.png` | VFX | chớp xanh rồi cờ lê bật lên ở điểm tia chạm tường | 1 hàng × 4 frame | 12 | 128×32 (ô 32×32) |
| `vfx_wall_shield.png` | VFX | khiên mờ lưới lục giác, lát ngang theo đoạn tường | 1 hàng × 3 frame | 6 | 192×48 (ô 64×48) |

`_preview_tower.png` chỉ để xem nhanh (idle, repair, pulse, bậc 1, bậc 2), không import.

- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base. Bậc 2 gắn chồng lên bậc 1. Phụ kiện không che cánh tay nên `repair_loop` vẫn chạy bên dưới.
- Code tắt phụ kiện khi bắt đầu phá hủy, bật lại sau frame cuối của build.

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
