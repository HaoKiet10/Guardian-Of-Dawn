# Tháp phóng lưới (NetLauncher)

Mở khóa: Nghiên cứu R21 (tầng 2), cần R02 + M2

Bản mẫu xem trực tiếp: https://claude.ai/artifact/EQ9YZ5BCRGHXiPw8rUwC9q

## Vai trò
Bắn gói lưới trói chặt một Dị Thể Sáp trong vài giây, không gây sát thương. Mục tiêu lớn (bậc 5 tối thượng, trùm) không bị trói mà chỉ bị làm chậm.
Khắc chế bậc 2 (Sáp hổ) và Sáp kích động (gào tăng tốc cho bầy, luôn đi giữa bầy).

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: xanh chanh `#b9de3a` (màu nhận diện), nâu dây thừng `#c08a4a` cho gói lưới, cuộn dây và mắt lưới `#e2b676`, thép `#9fadb5`.

## Lớp sprite
- `Base`: khung thép sơn xanh chanh, sàn ván gỗ, trụ xoay có đèn sẵn sàng, cuộn dây thừng phía sau bên trái, thùng lưới dự phòng phía sau bên phải. Không đổi theo hướng
- `Head`: ống phóng ngắn miệng loe có gói lưới tròn ở miệng, bình khí nén bên phải, phễu và tay nạp phía trên. Vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang)

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_net_launcher_base_idle.png` | Base | idle, đèn trụ xoay nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_net_launcher_base_build.png` | Base | build, chạy 1 lần | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_net_launcher_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_net_launcher_head_idle.png` | Head | idle, gói lưới trong miệng, đèn bình khí nháy | 5 hàng × 2 frame | 2 | 256×640 |
| `tower_net_launcher_head_fire.png` | Head | bắn: frame 0 và 1 khí nén phụt, ống giật 6/4/2/0 px, miệng trống | 5 hàng × 4 frame | 12 | 512×640 |
| `tower_net_launcher_head_reload.png` | Head | nạp: tay nạp gắp gói từ phễu, đưa qua đầu ống, nhét vào miệng | 5 hàng × 4 frame | 8 | 512×640 |
| `tower_net_launcher_base_upgrade1.png` | Base | phụ kiện bậc 1: thêm thùng lưới phía trước bên trái | 1 ô | không | 128×128 |
| `tower_net_launcher_head_upgrade1.png` | Head | phụ kiện bậc 1: tấm chắn thép viền vàng bên trái ống | 5 hàng × 1 | không | 128×640 |
| `tower_net_launcher_base_upgrade2.png` | Base | phụ kiện bậc 2: cuộn dây lớn trên giá thép phía trước bên phải | 1 ô | không | 128×128 |
| `tower_net_launcher_head_upgrade2.png` | Head | phụ kiện bậc 2: kính ngắm thấu kính xanh trên tấm chắn | 5 hàng × 1 | không | 128×640 |
| `vfx_net_shot.png` | VFX | gói lưới bay, bung dần (gói tròn, nửa mở, mở hết), hướng sang phải | 1 hàng × 3 frame | theo quãng bay | 144×48 (ô 48×48) |
| `vfx_net_trap.png` | VFX | lưới chụp lên kẻ địch: chụp, đáp và siết, giữ (2, 3 lặp) | 1 hàng × 4 frame | 0, 1 một lần · 2, 3 lặp 4 fps | 256×64 (ô 64×64) |
| `vfx_net_burst.png` | VFX | lưới đứt khi hết giờ trói, mảnh dây bật ra rồi rơi | 1 hàng × 3 frame | 10 | 192×64 (ô 64×64) |

**Thứ tự hàng trong sheet Head:** Nam (S), Đông Nam (SE), Đông (E), Đông Bắc (NE), Bắc (N).
Tây Nam, Tây, Tây Bắc dùng hàng SE, E, NE lật ngang (flipX).

- Build và destroy đã vẽ sẵn ống phóng hướng Đông Nam. Code ẩn Head khi bắt đầu phá hủy, bật Head thật sau frame cuối của build.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base hoặc Head. Bậc 2 gắn chồng lên bậc 1.
- Gói lưới ở miệng ống là tín hiệu sẵn sàng: có gói là sẵn sàng bắn, miệng trống là đang nạp.

## Nhịp bắn
Tìm hướng → `fire` 0.33 s (gói lưới rời ống ở frame 0) → `reload` 0.5 s → nghỉ 1.1 s (dùng `idle`), khoảng 1 phát mỗi 1.9 giây.
Gói lưới bay vòng cung tới mục tiêu (thời gian bay khoảng 0.3 s + quãng đường / 650 px/s, đỉnh vòng cung khoảng 16 px + 14% quãng đường), sprite xoay theo tiếp tuyến đường bay, đổi frame ở 35% và 70% quãng bay.
Khi chạm: `vfx_net_trap` frame 0 (0.08 s), frame 1 (tới 0.2 s), rồi frame 2, 3 lặp 4 fps tới hết giờ trói (bản mẫu 3 giây), cuối cùng `vfx_net_burst` chạy 1 lần (~0.3 s).
Bậc 5 và trùm: bỏ frame 1, chỉ dùng frame 2, 3, kéo rộng 12% theo trục x, tốc độ còn 35% thay vì đứng yên.
Ưu tiên mục tiêu trong bản mẫu: Sáp kích động, Sáp hổ, con đi xa nhất chưa bị trói, con to xếp cuối. Thời gian trói, tỉ lệ làm chậm và thứ tự ưu tiên là giá trị bản mẫu (GDD chỉ ghi "vài giây"), cần game designer chốt.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Head: pivot Center (0.5, 0.5), `localPosition = (0, 0.146)` so với Base (18.7 px)
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Miệng ống (điểm phóng lưới): cách tâm Head 27 px theo hướng đang quay, cao 13 × 0.78 px
- `vfx_net_shot`: pivot Center. `vfx_net_trap` và `vfx_net_burst`: pivot Custom (0.5, 0.1875) = điểm (32, 52) là chân kẻ địch, scale theo kích thước kẻ địch, vẽ trên kẻ địch
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (net_shot 48×48, net_trap và net_burst 64×64), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: gói lưới bay, lưới chụp, lưới đứt
- Luồng khí nén khi bắn đã vẽ thẳng vào `head_fire` (không phải VFX riêng)
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
