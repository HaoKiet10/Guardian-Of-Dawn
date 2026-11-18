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

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_flamethrower_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_flamethrower_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_flamethrower_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_flamethrower_t0_head_fire_end.png` | 0 | Head | fire_end | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_flamethrower_t0_head_fire_loop.png` | 0 | Head | fire_loop | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_flamethrower_t0_head_fire_start.png` | 0 | Head | fire_start | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_flamethrower_t0_head_idle.png` | 0 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_flamethrower_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_flamethrower_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_flamethrower_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_flamethrower_t1_head_fire_end.png` | 1 | Head | fire_end | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_flamethrower_t1_head_fire_loop.png` | 1 | Head | fire_loop | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_flamethrower_t1_head_fire_start.png` | 1 | Head | fire_start | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_flamethrower_t1_head_idle.png` | 1 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_flamethrower_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_flamethrower_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_flamethrower_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_flamethrower_t2_head_fire_end.png` | 2 | Head | fire_end | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_flamethrower_t2_head_fire_loop.png` | 2 | Head | fire_loop | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_flamethrower_t2_head_fire_start.png` | 2 | Head | fire_start | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_flamethrower_t2_head_idle.png` | 2 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: bình nhiên liệu vỡ thành cầu lửa, đống đổ nát còn cháy. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/flamethrower.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 flamethrower`.

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
