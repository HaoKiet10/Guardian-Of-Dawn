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

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_chain_tesla_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_chain_tesla_t0_base_charge.png` | 0 | Base | charge | 1 hàng × 4 frame | 512×128 |
| `tower_chain_tesla_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_chain_tesla_t0_base_discharge.png` | 0 | Base | discharge | 1 hàng × 3 frame | 384×128 |
| `tower_chain_tesla_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_chain_tesla_t1_base_charge.png` | 1 | Base | charge | 1 hàng × 4 frame | 512×128 |
| `tower_chain_tesla_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_chain_tesla_t1_base_discharge.png` | 1 | Base | discharge | 1 hàng × 3 frame | 384×128 |
| `tower_chain_tesla_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_chain_tesla_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_chain_tesla_t2_base_charge.png` | 2 | Base | charge | 1 hàng × 6 frame | 768×128 |
| `tower_chain_tesla_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_chain_tesla_t2_base_discharge.png` | 2 | Base | discharge | 1 hàng × 3 frame | 384×128 |
| `tower_chain_tesla_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_chain_tesla_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: quá tải điện, tia tím chằng chịt, vòng xung tím. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/chain_tesla.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 chain_tesla`.

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
