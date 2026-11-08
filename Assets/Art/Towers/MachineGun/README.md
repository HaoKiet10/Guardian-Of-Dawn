# Súng máy (MachineGun)

Mở khóa: Có sẵn từ đầu

Bản mẫu xem trực tiếp: https://claude.ai/artifact/XfPccdVVkeionEGqhPpNrE

## Góc nhìn và style
- Góc 3/4 từ trên cao: thấy mặt trên và mặt trước, chiều sâu mặt đất co còn khoảng 72%
- Màu sáng, viền ngoài tím than (`#2c2240`) dày khoảng 2 px, mỗi màu 3 tông: mặt trên sáng ngả ấm, mặt trước màu gốc, mặt bên tối ngả tím
- Ánh sáng chiếu từ trên bên trái

## Lớp sprite
- `Base`: chân đế, không đổi theo hướng, pivot ở tâm ô xây trên mặt đất
- `Head`: đầu súng, vẽ sẵn 8 hướng (5 hướng vẽ + 3 hướng lật ngang), pivot ở tâm mặt trên vòng xoay

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_machine_gun_base_idle.png` | Base | idle, đèn nháy | 1 hàng × 2 frame | 4 | 256×128 |
| `tower_machine_gun_base_build.png` | Base | build, chạy 1 lần | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_machine_gun_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_machine_gun_head_idle.png` | Head | idle, kính ngắm lóe | 5 hàng × 2 frame | 3 | 256×640 |
| `tower_machine_gun_head_fire.png` | Head | fire, bắn 1 viên ở frame 1 | 5 hàng × 4 frame | 24 | 512×640 |
| `tower_machine_gun_base_upgrade1.png` | Base | phụ kiện bậc 1: bao cát | 1 ô | không | 128×128 |
| `tower_machine_gun_head_upgrade1.png` | Head | phụ kiện bậc 1: tấm chắn | 5 hàng × 1 | không | 128×640 |
| `tower_machine_gun_base_upgrade2.png` | Base | phụ kiện bậc 2: ăng-ten, vạch cấp bậc | 1 ô | không | 128×128 |
| `tower_machine_gun_head_upgrade2.png` | Head | phụ kiện bậc 2: hộp đạn tròn, vạch đỏ | 5 hàng × 1 | không | 128×640 |
| `vfx_muzzle_flash.png` | VFX | chớp đầu nòng | 1 hàng × 3 frame | ~40 | 96×32 (ô 32×32) |

**Thứ tự hàng trong sheet Head:** Nam (S), Đông Nam (SE), Đông (E), Đông Bắc (NE), Bắc (N).
Tây Nam, Tây, Tây Bắc dùng hàng SE, E, NE lật ngang (flipX).

- Build và destroy đã vẽ sẵn đầu súng hướng Đông Nam. Code ẩn Head khi bắt đầu phá hủy, và bật Head thật sau frame cuối của build.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base hoặc Head. Bậc 2 gắn chồng lên bậc 1.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128 (1 ô xây = 1 unit)
- Base: pivot Custom (0.5, 0.375)
- Head: pivot Center (0.5, 0.5), `localPosition = (0, 0.171)` so với Base (22 px)
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, 0 = Đông, 2 = Nam (về phía camera). k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (VFX 32×32), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: chớp đầu nòng, vệt đạn, vỏ đạn
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
