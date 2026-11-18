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

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_net_launcher_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_net_launcher_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_net_launcher_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_net_launcher_t0_head_fire.png` | 0 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_net_launcher_t0_head_idle.png` | 0 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_net_launcher_t0_head_reload.png` | 0 | Head | reload | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_net_launcher_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_net_launcher_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_net_launcher_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_net_launcher_t1_head_fire.png` | 1 | Head | fire | 5 hàng (S, SE, E, NE, N) × 8 frame | 1024×640 |
| `tower_net_launcher_t1_head_idle.png` | 1 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_net_launcher_t1_head_reload.png` | 1 | Head | reload | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |
| `tower_net_launcher_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_net_launcher_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 4 frame | 512×128 |
| `tower_net_launcher_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_net_launcher_t2_head_fire.png` | 2 | Head | fire | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |
| `tower_net_launcher_t2_head_idle.png` | 2 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_net_launcher_t2_head_reload.png` | 2 | Head | reload | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: mảnh lưới tung bay, dây thừng rơi. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/net_launcher.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 net_launcher`.

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
