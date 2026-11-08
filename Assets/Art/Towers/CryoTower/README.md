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

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_cryo_tower_base_idle.png` | Base | idle, quạt quay, đèn nháy dịu, ống xả bốc chút hơi | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_cryo_tower_base_pulse.png` | Base | xả lạnh: frame 0 và 1 tích (ống xoắn sáng từ dưới lên), frame 2 xả, frame 3 đến 5 hơi trắng bốc lên rồi tan | 1 hàng × 6 frame | 8 | 768×128 |
| `tower_cryo_tower_base_build.png` | Base | build, chạy 1 lần, frame 4 đầu quạt thả xuống | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_cryo_tower_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát (bồn nằm ngang, ống xoắn gãy) | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_cryo_tower_base_upgrade1.png` | Base | phụ kiện bậc 1: bình phụ phía sau bên phải, áo cách nhiệt bọc chân bồn | 1 ô | không | 128×128 |
| `tower_cryo_tower_base_upgrade2.png` | Base | phụ kiện bậc 2: 8 cánh tản lạnh, vòng đèn dày và sáng hơn, đèn hiệu trên trục quạt | 1 ô | không | 128×128 |
| `vfx_frost_ring.png` | VFX | vòng băng lan ra trên mặt đất, ép dẹt 0.72 | 1 hàng × 5 frame | 10 | 1280×192 (ô 256×192) |
| `vfx_slow.png` | VFX | bông tuyết bám kẻ địch bị chậm, lặp | 1 hàng × 3 frame | 6 | 96×32 (ô 32×32) |
| `vfx_frozen.png` | VFX | khối băng bọc kẻ địch: đóng băng, giữ, vỡ | 1 hàng × 3 frame | không | 144×48 (ô 48×48) |
| `_preview_tower.png` | không | ảnh tự kiểm tra (cấp 0, bậc 1, bậc 2, pulse; hàng dưới phóng 2×), không import | không | không | 512×384 |

- Build vẽ sẵn cả đầu quạt. Destroy bắt đầu bằng chớp sáng, sau đó bồn nứt xì hơi lạnh.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base. Bậc 2 gắn chồng lên bậc 1.
- Hơi trắng ở đỉnh và sương ở chân nằm sẵn trong `base_pulse`, không phải VFX riêng.
- `vfx_frost_ring` làm ô 256×192 thay vì 128×96 để khi scale lên bằng bán kính vùng (khoảng 1.5×) không bị nhòe.

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
