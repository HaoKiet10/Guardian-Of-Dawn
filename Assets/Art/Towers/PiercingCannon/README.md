# Pháo xuyên giáp (PiercingCannon)

Mở khóa: Nghiên cứu R24 (tầng 4), cần M3 + M4

Bản mẫu xem trực tiếp: https://claude.ai/artifact/9ywmBdHKtofyvxtw2isKV8

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: giáp thép xanh lam `#6f93bf`, năng lượng xanh `#63f3ff` ở cuộn nạp và tụ điện.

## Lớp sprite
- `Base`: bệ bê tông vuông, sàn thép, hai trụ tụ điện phía sau. Không đổi theo hướng
- `Head`: khối khóa nòng, đối trọng, nòng dài với 3 cuộn nạp. Vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang)

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_piercing_cannon_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_piercing_cannon_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_piercing_cannon_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_piercing_cannon_t0_head_charge.png` | 0 | Head | charge | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_piercing_cannon_t0_head_fire.png` | 0 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_piercing_cannon_t0_head_idle.png` | 0 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_piercing_cannon_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_piercing_cannon_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_piercing_cannon_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_piercing_cannon_t1_head_charge.png` | 1 | Head | charge | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_piercing_cannon_t1_head_fire.png` | 1 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_piercing_cannon_t1_head_idle.png` | 1 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_piercing_cannon_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_piercing_cannon_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_piercing_cannon_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_piercing_cannon_t2_head_charge.png` | 2 | Head | charge | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_piercing_cannon_t2_head_fire.png` | 2 | Head | fire | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |
| `tower_piercing_cannon_t2_head_idle.png` | 2 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: tụ điện phóng tia cyan, hai vòng xung kích. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/piercing_cannon.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 piercing_cannon`.

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
