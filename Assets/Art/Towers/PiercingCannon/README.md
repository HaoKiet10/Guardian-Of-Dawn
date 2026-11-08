# Pháo xuyên giáp (PiercingCannon)

Mở khóa: Nghiên cứu R24 (tầng 4), cần M3 + M4

Bản mẫu xem trực tiếp: https://claude.ai/artifact/9ywmBdHKtofyvxtw2isKV8

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: giáp thép xanh lam `#6f93bf`, năng lượng xanh `#63f3ff` ở cuộn nạp và tụ điện.

## Lớp sprite
- `Base`: bệ bê tông vuông, sàn thép, hai trụ tụ điện phía sau. Không đổi theo hướng
- `Head`: khối khóa nòng, đối trọng, nòng dài với 3 cuộn nạp. Vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang)

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_piercing_cannon_base_idle.png` | Base | idle, tụ điện nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_piercing_cannon_base_build.png` | Base | build, chạy 1 lần | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_piercing_cannon_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_piercing_cannon_head_idle.png` | Head | idle, đèn cảm biến nháy | 5 hàng × 2 frame | 2 | 256×640 |
| `tower_piercing_cannon_head_charge.png` | Head | nạp: 3 cuộn sáng dần, frame 3 sáng đầu nòng | 5 hàng × 4 frame | 6 | 512×640 |
| `tower_piercing_cannon_head_fire.png` | Head | bắn ở frame 0, nòng giật 8/5/2/0 px | 5 hàng × 4 frame | 12 | 512×640 |
| `tower_piercing_cannon_base_upgrade1.png` | Base | phụ kiện bậc 1: giáp bao ba mặt | 1 ô | không | 128×128 |
| `tower_piercing_cannon_head_upgrade1.png` | Head | phụ kiện bậc 1: tấm chắn hai bên | 5 hàng × 1 | không | 128×640 |
| `tower_piercing_cannon_base_upgrade2.png` | Base | phụ kiện bậc 2: chân chống, dải năng lượng | 1 ô | không | 128×128 |
| `tower_piercing_cannon_head_upgrade2.png` | Head | phụ kiện bậc 2: module ngắm đèn đỏ | 5 hàng × 1 | không | 128×640 |
| `vfx_piercing_bolt.png` | VFX | viên đạn năng lượng, đầu đạn bên phải | 1 hàng × 2 frame | 20 | 128×32 (ô 64×32) |
| `vfx_cannon_blast.png` | VFX | nổ đầu nòng | 1 hàng × 3 frame | ~14 | 144×48 (ô 48×48) |

**Thứ tự hàng trong sheet Head:** Nam (S), Đông Nam (SE), Đông (E), Đông Bắc (NE), Bắc (N).
Tây Nam, Tây, Tây Bắc dùng hàng SE, E, NE lật ngang (flipX).

- Build và destroy đã vẽ sẵn đầu pháo hướng Đông Nam. Code ẩn Head khi bắt đầu phá hủy, bật Head thật sau frame cuối của build.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base hoặc Head. Bậc 2 gắn chồng lên bậc 1.

## Nhịp bắn
Tìm hướng → `charge` 0.67 s → `fire` 0.33 s → nguội 0.9 s (dùng `idle`), khoảng 1 phát mỗi 1.9 giây.
Viên đạn bay theo góc thật tới mục tiêu (không theo 8 hướng của đầu pháo), khoảng 1300 px/giây, xuyên qua mọi Dị Thể Sáp trên đường.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Head: pivot Center (0.5, 0.5), `localPosition = (0, 0.152)` so với Base (20 px)
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (bolt 64×32, blast 48×48), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: viên đạn, nổ đầu nòng
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
