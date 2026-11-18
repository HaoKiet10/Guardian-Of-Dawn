# Cột thu sáng (SunRod)

Mở khóa: Nghiên cứu R07 (nhánh Sinh tồn, tầng 2), cần R05 + M2

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7LeYNgvzrvb3eaDUDQskQA

## Vai trò
Hỗ trợ, không gây sát thương. Khi tia bão mặt trời (hoặc tia hội tụ của Dị Thể Sáp thấu kính) nhắm vào một công trình trong bán kính của cột, tia bị bẻ hướng và hút vào đỉnh cột: chỉ cột bị phá hủy, công trình kia an toàn. Rẻ, nhỏ, nhưng chiếm một ô xây.
Vì vậy `base_destroy` là kết cục bình thường của cột, không phải tai nạn, và được vẽ kỹ như animation chính.

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: đồng đỏ `#e97d4e` ở hộp chân và cuộn dây, tinh thể vàng nắng `#ffcf3a`, thân cột trắng `#eeede8`.
Silhouette: cây kim mảnh và cao. Footprint nhỏ nhất trong các tháp (khoảng ±26 px), đỉnh tinh thể cách mép trên ô khoảng 6 px.

## Lớp sprite
- `Base`: một lớp duy nhất, không xoay, không có 8 hướng. Bệ bê tông nhỏ có sọc cảnh báo, hộp đồng bát giác, thân cột trắng với hai cuộn dây đồng, hai sứ cách điện, chóp ba chấu giữ tinh thể, một dây nối đất xuống cọc ở góc bệ

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_sun_rod_t0_base_absorb.png` | 0 | Base | absorb | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_sun_rod_t1_base_absorb.png` | 1 | Base | absorb | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_sun_rod_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t2_base_absorb.png` | 2 | Base | absorb | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_sun_rod_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_sun_rod_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: tinh thể vỡ lóe vàng, đồng nóng chảy bắn ra. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/sun_rod.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 sun_rod`.

## Nhịp hoạt động
Bão chọn mục tiêu → vòng cảnh báo dùng chung 10 giây trên công trình bị nhắm (0.7 giây cuối hiện `vfx_storm_bolt` frame 0 chớp tắt phía trên mục tiêu) → tia rơi thẳng xuống 0.14 s tới điểm bẻ góc, cao khoảng 1.2 unit trên mục tiêu → đoạn thứ hai lao vào điểm nhận tia của cột trong 0.08 s → `base_absorb` 0.5 s cùng `vfx_absorb_spark` ~0.2 s → `base_destroy` 0.6 s → giữ frame cuối tới khi xây lại.
Tia chính chạy frame 1, 2, 3 trong khoảng 0.36 s sau khi chạm. Không có cột: tia rơi thẳng vào công trình, công trình bị phá như bình thường.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Điểm nhận tia: Transform con `StrikePoint` tại `localPosition = (0, 0.524)` (67 px trên pivot, giữa tinh thể)
- Bán kính bảo vệ (đề xuất): r = 1.5 unit. Công trình được bảo vệ khi tâm ô xây thỏa `(dx / r)² + (dy / (r · 0.72))² ≤ 1`. Nhiều cột cùng phủ thì cột gần nhất hút tia (đề xuất, GDD chưa quy định)
- `vfx_storm_bolt`: pivot Bottom (0.5, 0). Đặt pivot ở điểm chạm, scale Y = độ dài / 2 unit để kéo tới mép trên màn hình. Khi bẻ góc dùng hai bản: một bản thẳng đứng từ trời tới điểm bẻ góc, một bản xoay hướng từ điểm bẻ góc vào `StrikePoint`
- `vfx_absorb_spark`: pivot Center, đặt tại `StrikePoint`, không xoay
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (storm bolt 64×256, spark 64×64), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: tia bão, tia lửa điện khi hút
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm (nằm trên công trình bị nhắm, không phải trên cột), bóng đổ, bụi xây
- Vòng bán kính bảo vệ: vẽ bằng code (ellipse nét đứt) khi đặt hoặc chọn cột, không phải sprite
