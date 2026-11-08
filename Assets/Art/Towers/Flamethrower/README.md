# Súng phun lửa (Flamethrower)

Mở khóa: Có sẵn từ đầu

Bản mẫu xem trực tiếp: https://claude.ai/artifact/CftDcDQittkCbjJ2yt25FG

## Vai trò
Phun lửa hình nón tầm ngắn, đốt cùng lúc mọi Dị Thể Sáp trong nón. Con nào dính lửa sẽ cháy thêm vài giây (`vfx_burning`) và trong lúc cháy không thể hồi máu hay tự hồi phục. Sáp bào tử chết khi đang cháy thì không vỡ thành Sáp vụn.
Khắc chế: bậc 1, bậc 3, bậc 5, Sáp vụn, Sáp bào tử. Yếu: bậc 2 Dị Thể Sáp hổ (lao qua quá nhanh).

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: đỏ cam lửa `#ef5b31` ở khối đầu, bình nhiên liệu đỏ `#e2412f` vạch vàng `#ffcc33`, thép tối `#4a505e` ở sàn và vòi phun, ống đồng `#e3954f`.

## Lớp sprite
- `Base`: bệ tròn thấp có vành sọc vàng đen, sàn thép tối, hai bình nhiên liệu đỏ nằm ngang phía sau nối ống đồng vào vòng xoay. Không đổi theo hướng
- `Head`: khối đầu đỏ cam thấp và rộng, vòi phun ngắn loe miệng, đèn mồi lửa ở đầu vòi. Vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang)

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_flamethrower_base_idle.png` | Base | idle, đèn trạng thái cam nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_flamethrower_base_build.png` | Base | build, chạy 1 lần | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_flamethrower_base_destroy.png` | Base | destroy, frame 2 bình bùng lửa, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_flamethrower_head_idle.png` | Head | idle, đèn mồi lửa nháy | 5 hàng × 2 frame | 2 | 256×640 |
| `tower_flamethrower_head_fire_start.png` | Head | mồi lửa: miệng vòi sáng dần, đầu vòi đỏ sẫm | 5 hàng × 3 frame | 10 | 384×640 |
| `tower_flamethrower_head_fire_loop.png` | Head | phun: đầu vòi nóng đỏ, miệng vòi nháy, rung 1 px | 5 hàng × 4 frame | 12 | 512×640 |
| `tower_flamethrower_head_fire_end.png` | Head | tắt lửa: khói bốc lên, đầu vòi nguội dần | 5 hàng × 3 frame | 10 | 384×640 |
| `tower_flamethrower_base_upgrade1.png` | Base | phụ kiện bậc 1: bình thứ ba phía sau, can xăng góc phải | 1 ô | không | 128×128 |
| `tower_flamethrower_head_upgrade1.png` | Head | phụ kiện bậc 1: tấm chắn nhiệt hai bên vòi, tấm che trước | 5 hàng × 1 | không | 128×640 |
| `tower_flamethrower_base_upgrade2.png` | Base | phụ kiện bậc 2: bình áp suất lớn vạch đỏ, ống dẫn đôi | 1 ô | không | 128×128 |
| `tower_flamethrower_head_upgrade2.png` | Head | phụ kiện bậc 2: hai ống áp lực vạch đỏ, bình nén nhỏ | 5 hàng × 1 | không | 128×640 |
| `vfx_flame_cone.png` | VFX | luồng lửa hình nón, gốc ở giữa mép trái, hướng sang phải | 1 hàng × 4 frame | 12 | 512×64 (ô 128×64) |
| `vfx_burning.png` | VFX | lửa nhỏ bám trên Dị Thể Sáp đang cháy, đáy lửa ở dòng 28 | 1 hàng × 4 frame | 10 | 128×32 (ô 32×32) |

**Thứ tự hàng trong sheet Head:** Nam (S), Đông Nam (SE), Đông (E), Đông Bắc (NE), Bắc (N).
Tây Nam, Tây, Tây Bắc dùng hàng SE, E, NE lật ngang (flipX).

- Build và destroy đã vẽ sẵn đầu súng hướng Đông Nam. Code ẩn Head khi bắt đầu phá hủy, bật Head thật sau frame cuối của build.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base hoặc Head. Bậc 2 gắn chồng lên bậc 1.

## Nhịp phun
Tìm hướng (`idle`) → `fire_start` 0.3 s → `fire_loop` lặp chừng nào còn mục tiêu trong tầm → `fire_end` 0.3 s → `idle`.
Đầu súng quay về hướng có nhiều Dị Thể Sáp nhất trong tầm, vẫn được đổi hướng từng nấc trong lúc `fire_loop`.
`vfx_flame_cone` hiện từ frame 1 của `fire_start` (khoảng 20%, 45% chiều dài), đủ dài trong `fire_loop`, ngắn lại ở frame 0 của `fire_end`. Đặt gốc VFX vào miệng vòi (cách tâm vòng xoay 27 đơn vị theo hướng đầu súng, cao 9 đơn vị), xoay theo góc màn hình của hướng `atan2(sin·0.72, cos)`, scale chiều dài theo tầm, chiều ngang khoảng 1.45.
`vfx_burning` gắn lên kẻ địch đang cháy, scale theo cỡ kẻ địch (Sáp vụn khoảng 0.6, Sáp bào tử khoảng 1.2), giữ suốt thời gian cháy.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Head: pivot Center (0.5, 0.5), `localPosition = (0, 0.128)` so với Base (16 px)
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (flame cone 128×64, burning 32×32), Filter Bilinear, Compression None
- `vfx_flame_cone`: pivot Custom (0, 0.5) để gốc lửa nằm ở miệng vòi

## Không vẽ vào sprite tháp
- VFX riêng: luồng lửa hình nón, lửa bám trên kẻ địch
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
