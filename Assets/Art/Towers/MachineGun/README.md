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

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_machine_gun_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_machine_gun_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_machine_gun_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_machine_gun_t0_head_fire.png` | 0 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_machine_gun_t0_head_idle.png` | 0 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_machine_gun_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_machine_gun_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_machine_gun_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_machine_gun_t1_head_fire.png` | 1 | Head | fire | 5 hàng (S, SE, E, NE, N) × 8 frame | 1024×640 |
| `tower_machine_gun_t1_head_idle.png` | 1 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_machine_gun_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_machine_gun_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_machine_gun_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_machine_gun_t2_head_fire_loop.png` | 2 | Head | fire_loop | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_machine_gun_t2_head_fire_start.png` | 2 | Head | fire_start | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |
| `tower_machine_gun_t2_head_idle.png` | 2 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: băng đạn nổ lách tách, vỏ đạn đồng văng, tia đạn lạc. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/machine_gun.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 machine_gun`.

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
