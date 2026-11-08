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

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_sun_rod_base_idle.png` | Base | idle, frame 1 tinh thể lóe sáng | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_sun_rod_base_build.png` | Base | build, chạy 1 lần, frame 4 lắp tinh thể | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_sun_rod_base_absorb.png` | Base | hút tia: tia chạm đỉnh, cột trắng rực, cuộn dây cam rồi đỏ, frame 5 tinh thể nứt | 1 hàng × 6 frame | 12 | 768×128 |
| `tower_sun_rod_base_destroy.png` | Base | nóng chảy, gập, gãy đổ; frame 5 = chân bệ cháy đen, gốc cột cụt, vũng đồng, mảnh tinh thể | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_sun_rod_base_upgrade1.png` | Base | phụ kiện bậc 1: vòng sáu cánh gương và vành vàng quanh chân tinh thể | 1 ô | không | 128×128 |
| `tower_sun_rod_base_upgrade2.png` | Base | phụ kiện bậc 2: dây nối đất thứ hai bên trái, đèn báo đỏ | 1 ô | không | 128×128 |
| `vfx_storm_bolt.png` | VFX | tia bão: frame 0 tia dẫn mờ, frame 1 đến 3 tia chính rồi tắt dần, đốm chạm ở đáy | 1 hàng × 4 frame | 12 | 256×256 (ô 64×256) |
| `vfx_absorb_spark.png` | VFX | tia lửa điện tỏa ra khi cột hút tia | 1 hàng × 3 frame | ~14 | 192×64 (ô 64×64) |
| `_preview_tower.png` | không | chỉ để xem: cấp 0, bậc 1, bậc 2 ghép | không | không | 512×128 |

- Build kết thúc bằng frame giống idle. Destroy luôn chạy ngay sau absorb, không cần chuyển cảnh.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base. Bậc 2 gắn chồng lên bậc 1.
- Khi chạy absorb, phụ kiện vẫn hiện và được tint trắng cùng nhịp (frame 0 đến 5: 30%, 85%, 60%, 25%, 0, 0). Ẩn phụ kiện khi bắt đầu destroy. Cột xây lại mất cấp nâng cấp như mọi công trình.

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
