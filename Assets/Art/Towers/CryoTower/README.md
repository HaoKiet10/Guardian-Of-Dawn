# Tháp làm lạnh (CryoTower)

Mở khóa: Nghiên cứu R10 (tầng 3), cần R02, M2 + M3

Bản mẫu xem trực tiếp: https://claude.ai/artifact/EZu4eG5fdhr632vy5pBaW9

## Vai trò
Làm chậm mọi Dị Thể Sáp trong vùng tròn quanh tháp. Đóng băng hoàn toàn Dị Thể Sáp thấu kính (bậc 4) và ngắt quá trình hội tụ của nó. Không gây sát thương, cần tháp khác đứng gần để ra đòn. Khắc chế bậc 2 (Sáp hổ) và bậc 4 (Sáp thấu kính).

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: bồn trắng băng `#f3f8fb`, ống xoắn cyan nhạt `#93cdd9` (sáng `#9ff6ff`), đèn băng `#8ff1ff`, thép xám xanh `#93a8b8`. Không dùng xanh lam đậm để khỏi lẫn với Pháo xuyên giáp.

## Lớp sprite
- `Base`: lớp duy nhất. Bệ bê tông tròn có sọc cảnh báo, sàn thép, bồn khí lạnh đứng có ống xoắn quanh thân, đầu quạt và hai ống xả trên đỉnh, đá bám ở chân, đèn băng. Tháp không xoay nên không có lớp Head, không lật.

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_cryo_tower_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_cryo_tower_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_cryo_tower_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_cryo_tower_t0_head_fire.png` | 0 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_cryo_tower_t0_head_idle.png` | 0 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_cryo_tower_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_cryo_tower_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_cryo_tower_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_cryo_tower_t1_head_fire.png` | 1 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_cryo_tower_t1_head_idle.png` | 1 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_cryo_tower_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_cryo_tower_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_cryo_tower_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_cryo_tower_t2_head_fire.png` | 2 | Head | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_cryo_tower_t2_head_idle.png` | 2 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: băng vỡ thành tinh thể, mây sương lạnh, cục băng còn lại. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/cryo_tower.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 cryo_tower`.

## Nhịp hoạt động
- Vùng làm chậm luôn bật: kẻ địch trong vùng đi còn 45% tốc độ và mang `vfx_slow`, ra khỏi vùng là hết.
- Chỉ khi có kẻ địch trong vùng: nghỉ 2.2 s (`idle`) → tích 0.25 s (`pulse` frame 0 đến 1) → xả 0.5 s (`pulse` frame 2 đến 5, bật `vfx_frost_ring` ở frame 2). Khoảng 1 lần mỗi 3 giây.
- Vòng băng lan từ tâm ra mép vùng trong 0.5 s. Sáp thấu kính bị vòng chạm vào thì đóng băng 1.5 s: `vfx_frozen` frame 0 trong 0.15 s, giữ frame 1, frame 2 khi tan (0.2 s). Thời gian hội tụ về 0, nên nó không bao giờ hội tụ đủ 5 s khi đứng trong vùng.
- Các số trên là của bản mẫu, đặt trong config (tuning knob), không vẽ vào sprite.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất. Không có Head, không cần localPosition
- Vùng: hình tròn bán kính R trong thế giới, trên màn hình là ellipse rx = R, ry = 0.72 R. Trong vùng khi `(dx / R)² + (dy / 0.72R)² ≤ 1`. Bản mẫu dùng R = 186 px (khoảng 1.45 ô)
- `vfx_frost_ring`: pivot Center, đặt ở pivot Base, sort dưới tháp và kẻ địch, `localScale = R / 120` (vòng ngoài frame 4 có bán kính 120 px theo x)
- `vfx_slow`: pivot Center, đặt trên vai kẻ địch, khoảng (6, 30) px phía trên chân theo cỡ kẻ địch
- `vfx_frozen`: pivot Custom (0.5, 0.0625), đặt ở chân kẻ địch, scale theo cỡ kẻ địch. Code dừng animation và tint xanh nhạt kẻ địch bị đóng băng
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (frost_ring 256×192, slow 32×32, frozen 48×48), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: vòng băng, bông tuyết làm chậm, khối băng
- Vùng làm chậm mờ trên mặt đất (nếu có) do code vẽ theo R
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
