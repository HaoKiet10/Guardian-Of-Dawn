# Dùng chung cho mọi tháp (_Shared)

Những thứ này đặt đè lên tháp hoặc dưới tháp, không vẽ lại cho từng tháp.

| File | Dùng khi | Ghi chú |
|---|---|---|
| `tower_shared_storm_target.png` | Bão nhắm tháp, 10 giây trước khi đánh | vòng nhấp nháy trên mặt đất, phải nổi bật cả khi không nhìn màu |
| `tower_shared_overheat_smoke.png` | Quá nhiệt (Giáp phản quang R14) | đi kèm shader tint đỏ cam trên sprite tháp |
| `tower_shared_shadow_1x1.png` | Luôn hiển thị dưới Base | bóng đổ tách riêng khỏi sprite tháp |
| `tower_shared_build_dust.png` | Khi xây hoặc xây lại | bụi bay lên |

## Quy cách (giống mọi tháp)
- Góc 3/4 từ trên cao: chiều sâu mặt đất co còn 72%, nên mọi vòng tròn trên đất là ellipse cao bằng 0.72 lần rộng
- Ô 128×128, Pixels Per Unit = 128 (1 ô xây = 1 unit)
- Pivot Custom (0.5, 0.375), trùng pivot Base của tháp, để đặt cùng vị trí với tháp
- Màu sáng, viền tím than `#2c2240`, ánh sáng từ trên bên trái
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128, Filter Bilinear, Compression None
- Sorting: bóng đổ và vòng bão nhắm nằm dưới Base, khói quá nhiệt và bụi xây nằm trên Base
