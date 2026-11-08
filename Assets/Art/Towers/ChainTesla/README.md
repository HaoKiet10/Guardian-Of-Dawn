# Tháp điện chuỗi (ChainTesla)

Mở khóa: Nghiên cứu R20 (tầng 1), cần R02 + M1

Bản mẫu xem trực tiếp: https://claude.ai/artifact/W3mUinUprfuwwPZggaY8eo

## Vai trò
Tia điện phóng từ quả cầu đỉnh vào Dị Thể Sáp đi đầu trong tầm, rồi nảy sang con gần nhất chưa trúng, qua 3 đến 5 con. Sát thương giảm sau mỗi lần nảy. Da tinh thể muối của Sáp gương không phản được điện.
Khắc chế: bậc 1, Sáp vụn, Sáp gương. Yếu: bậc 5, mục tiêu đi lẻ (chỉ nhận 1 tia, không nảy).

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: tím điện `#9a6ad8`, đồng đỏ cuộn dây `#e08a4e`, sứ trắng cách điện `#f6f3ee`, năng lượng tím nhạt `#c58cff` / `#dcb8ff` (khác cyan của Pháo xuyên giáp).
Hình dáng: bệ bê tông hình thoi có sọc cảnh báo, ba chân trụ, sàn bát giác, cuộn đồng, bốn đĩa sứ xếp chồng, quả cầu kim loại trên đỉnh. Tháp cao nhất trong các tháp.

## Lớp sprite
- `Base`: lớp duy nhất, không xoay. Mọi animation nằm trên lớp này, mỗi file một hàng
- Điểm phóng tia: Transform con ở tâm quả cầu, không phải sprite

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_chain_tesla_base_idle.png` | Base | idle, tia điện nhỏ trên quả cầu, đèn trạng thái nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_chain_tesla_base_charge.png` | Base | nạp: đĩa sứ sáng dần từ dưới lên, frame 3 quả cầu sáng tím | 1 hàng × 4 frame | 6 | 512×128 |
| `tower_chain_tesla_base_discharge.png` | Base | phóng ở frame 0: quả cầu chớp trắng, frame 1 tím nhạt, frame 2 tắt | 1 hàng × 3 frame | 10 | 384×128 |
| `tower_chain_tesla_base_build.png` | Base | build, chạy 1 lần, frame 5 giống idle | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_chain_tesla_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_chain_tesla_base_upgrade1.png` | Base | phụ kiện bậc 1: vòng đồng dưới quả cầu, hai trụ sứ nhỏ ở góc bệ | 1 ô | - | 128×128 |
| `tower_chain_tesla_base_upgrade2.png` | Base | phụ kiện bậc 2: vòng hào quang quanh quả cầu, cột phụ nhỏ, dải sáng trên sàn | 1 ô | - | 128×128 |
| `vfx_tesla_arc.png` | VFX | đoạn tia sét ngang kéo giãn được, hai đầu ở giữa mép trái và phải | 1 hàng × 3 frame | 20 | 384×32 (ô 128×32) |
| `vfx_tesla_hit.png` | VFX | chớp điện trên thân mục tiêu | 1 hàng × 3 frame | ~14 | 144×48 (ô 48×48) |
| `_preview_tower.png` | - | chỉ để xem: cấp 0, bậc 1, bậc 2 ở 2x, không import | 3 ô 256×256 | - | 768×256 |

- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base. Bậc 2 gắn chồng lên bậc 1.
- Build và destroy đã có đủ tháp cấp 0, không cần lớp nào khác.

## Nhịp hoạt động
Có Dị Thể Sáp trong tầm → `charge` 0.67 s → `discharge` 0.3 s → nghỉ 0.8 s (dùng `idle`), khoảng 1 lần phóng mỗi 1.8 giây.
Tia chuỗi bắn ra ở frame 0 của `discharge`, sáng khoảng 0.25 s, đổi hình zigzag mỗi 0.05 s.

Chuỗi nảy (con số mẫu trong bản xem trước, chỉnh trong config):
- Số mục tiêu: 3 (cấp 0), 4 (bậc 1), 5 (bậc 2). Đề xuất, GDD chỉ ghi 3 đến 5
- Sát thương nhân 0.75 sau mỗi lần nảy: 12 → 9 → 6.8 → 5.1 → 3.8
- Bán kính nảy 90 px ≈ 0.7 unit, tính từ mục tiêu vừa trúng tới con gần nhất chưa trúng
- Độ dày nhánh 1, 0.78, 0.6, 0.46, 0.36; độ trong nhánh 1, 0.82, 0.66, 0.52, 0.4

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Điểm phóng tia: Transform con `localPosition = (0, 0.463)` (tâm quả cầu, 59 px trên pivot)
- Không xoay: tia đi theo đường thẳng thật tới mục tiêu
- `vfx_tesla_arc`: pivot (0, 0.5), đặt ở điểm đầu, xoay về điểm cuối, `localScale.x` = khoảng cách (unit) vì ô dài đúng 1 unit; `localScale.y` = độ dày nhánh. Hoặc dùng LineRenderer zigzag 3 lớp như bản mẫu
- `vfx_tesla_hit`: pivot Center, đặt ở thân mục tiêu (khoảng 13 px trên chân), nhánh sau scale 0.7 đến 1.2 và alpha theo độ trong nhánh
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (arc 128×32, hit 48×48), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: tia sét nối giữa các mục tiêu (LineRenderer hoặc `vfx_tesla_arc`), chớp điện trên mục tiêu
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
