# Tháp bắn tỉa (SniperNest)

> **Đề xuất, chưa có trong GDD.** Tháp thứ 12. Cần thêm vào GDD mục 4.6 (công trình, bảng khắc chế) và mạng nghiên cứu trước khi chốt.

Mở khóa (đề xuất): nút R25 "Xạ thủ", nhánh Sinh tồn tầng 2, cần R03 + M2

Bản mẫu xem trực tiếp: https://claude.ai/artifact/Mt3iJ1wchdhxH4w36ixM2a

## Vai trò
- Tầm xa nhất, bắn rất chậm (khoảng 1 phát mỗi 2 giây), 1 mục tiêu, sát thương cao
- Tự ưu tiên Dị Thể Sáp đặc biệt: Sáp hồi phục, Sáp kích động, Bậc 4 thấu kính. Không có thì bắn con đi xa nhất
- Yếu trước Sáp vụn, bầy đông, Sáp gương (phản đạn đơn mục tiêu)
- Nạp đạn sau mỗi 5 phát

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Xạ thủ mặc đồ bảo hộ trắng `#eef2f5`, sọc cam `#ff8a3d`, kính mũ vàng `#ffc94a`, không lộ mặt (người chỉ ra nắng được nhờ nghiên cứu R03).
Súng vẽ kiểu súng bắn tỉa chung, không sao chép mẫu súng thật có thương hiệu.

## Lớp sprite
- `Base`: chòi canh 4 chân gỗ, thang, sàn ván, bao cát chữ U (mặt trước để trống nên không che xạ thủ). Không đổi theo hướng
- `Gunner`: người xạ thủ cùng khẩu súng, vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang). Thay cho lớp `Head` của các tháp máy, luôn vẽ đè lên `Base`

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_sniper_nest_base_idle.png` | Base | idle, đèn nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_sniper_nest_base_build.png` | Base | build, frame 4 xạ thủ leo thang | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_sniper_nest_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_sniper_nest_gunner_idle.png` | Gunner | súng hạ, thở, kính mũ lóe | 5 hàng × 2 frame | 2 | 256×640 |
| `tower_sniper_nest_gunner_aim.png` | Gunner | nâng súng lên vai, giữ frame cuối khi ngắm | 5 hàng × 3 frame | 8 | 384×640 |
| `tower_sniper_nest_gunner_fire.png` | Gunner | giật, hồi, kéo khóa nòng, đẩy về | 5 hàng × 4 frame | 10 | 512×640 |
| `tower_sniper_nest_gunner_reload.png` | Gunner | hạ nòng, tháo hộp đạn, lấy hộp mới, lắp | 5 hàng × 4 frame | 5 | 512×640 |
| `tower_sniper_nest_base_upgrade1.png` | Base | bậc 1: tấm tôn trước chân chòi, thêm bao cát | 1 ô | không | 128×128 |
| `tower_sniper_nest_gunner_upgrade1.png` | Gunner | bậc 1: ăng-ten radio trên bình khí | 5 hàng × 1 | không | 128×640 |
| `tower_sniper_nest_base_upgrade2.png` | Base | bậc 2: lưới ngụy trang, đèn pha | 1 ô | không | 128×128 |
| `tower_sniper_nest_gunner_upgrade2.png` | Gunner | bậc 2: giáp vai, đèn mũ | 5 hàng × 1 | không | 128×640 |
| `vfx_sniper_flash.png` | VFX | chớp đầu nòng hẹp dài kèm khói | 1 hàng × 3 frame | ~12 | 96×32 (ô 32×32) |
| `vfx_sniper_hit.png` | VFX | tia lửa và giọt sáp khi trúng | 1 hàng × 3 frame | ~12 | 96×32 (ô 32×32) |

**Thứ tự hàng trong sheet Gunner:** Nam (S), Đông Nam (SE), Đông (E), Đông Bắc (NE), Bắc (N).
Tây Nam, Tây, Tây Bắc dùng hàng SE, E, NE lật ngang (flipX).

- Build và destroy đã vẽ sẵn xạ thủ hướng Đông Nam. Code ẩn Gunner khi bắt đầu phá hủy, bật Gunner thật sau frame cuối của build.
- Phụ kiện của xạ thủ chỉ gắn lên phần ít cử động (bình khí, vai, mũ), không gắn lên súng.
- Xạ thủ là một phần của công trình, không phải đội lính: bão phá tháp thì xạ thủ biến mất cùng tháp, xây lại thì quay lại.
- Laser ngắm đỏ và vệt đạn là LineRenderer trong code, không có sprite.

## Nhịp bắn
Tìm hướng (0.12 s mỗi nấc) → `aim` 0.375 s rồi giữ frame cuối tới 0.975 s → `fire` 0.4 s → giữ tư thế 1.0 s (frame cuối của `fire`).
Mục tiêu kế tiếp cùng hướng thì bỏ qua bước nâng súng. Sau mỗi 5 phát chạy `reload` 0.8 s.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Gunner: pivot Center (0.5, 0.5), `localPosition = (0, 0.244)` so với Base (31 px), sorting order cao hơn Base
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (VFX 32×32), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: chớp đầu nòng, tia lửa khi trúng
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
