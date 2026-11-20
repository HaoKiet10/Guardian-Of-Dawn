# Đài thiên văn (Observatory)

Chương 5 trong GDD v2 (mục 5.3) · 15 ngày · Đất xây: Hẹp

> “Vạn người.”

Đài thiên văn cuối cùng của thế giới, nơi Dị Thể Mặt Trời lần đầu được ghi nhận. Giờ đây nó là tiền đồn cuối cùng của loài người.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-5` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 3 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 25, 13, 24, 33, 28, 19
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục, 4 – Sáp thấu kính, 5 – Sáp tối thượng. Bậc mới: Bậc 5 – Sáp tối thượng, biến thể: Sáp kích động
- Trùm ngày cuối: Khối Sáp Vạn Người. Bão mặt trời: 20% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt, Pháo xuyên giáp
- Nền móng dựng sẵn: 12 nền (`towerPlots`), mỗi nền 1 ô xây sát đường. Chỉ xây tháp trên nền móng (đề xuất, khác đặt tự do ở GDD 4.5). `order` là độ ưu tiên: bản mẫu đặt 3/5/7/9 tháp lên các nền đầu tiên theo cấp tường

Ý đồ bố cục:
- Đài thiên văn cuối cùng của thế giới đứng giữa đỉnh núi, giờ là tiền đồn cuối cùng của loài người. Tường thép bao quanh, kính viễn vọng lớn vẫn hướng lên Dị Thể Mặt Trời.
- Ba hướng tấn công tách thành sáu nhánh đường sỏi đá. Hướng bắc chia hai nhánh vào mặt bắc. Hướng tây một nhánh vào cổng tây, một nhánh vượt cầu treo xuống đảo tây rồi vòng vào mặt nam. Hướng đông một nhánh vượt cầu vào cổng đông, một nhánh vòng xuống mặt nam.
- Chỉ xây trên 12 nền móng dựng sẵn sát đường (đề xuất, thay cho đặt tự do ở GDD 4.5). Mỗi nền là một hố đất vừa đào, cây và đá quanh đó bị chặt, bị đập để đổ móng. Xây tháp lên thì mặt móng nứt và vỡ mép.
- Sáp tràn vào từ các cửa lối đi và đổ qua vách xuống vực. Hố bão cháy đen rải khắp đỉnh núi, cầu treo cũ đã đứt.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_observatory_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_observatory_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_observatory_plots.png` | Nền móng dựng sẵn (tấm bê tông trên hố đào), 12 nền | 2560×1536, nền trong suốt |
| `map_observatory_layout.json` | Lưới ô, đường đi, nền móng, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp `plots` nằm trên ảnh nền và dưới tháp. Hố đào quanh nền đã có sẵn trong ảnh nền. Đặt tháp tại `towerPlots[i].towerPivot` (pivot Base của tháp)
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 26 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 2 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 15 chỗ đậu (`ambient.crowPerches`)
- Biển mây trôi chậm quanh các đảo đá (vùng ký tự `v` trong `grid`)
- Sáp chảy từ mép các đảo xuống biển mây. Khói bốc từ các hố bom, vết nứt quanh hố âm ỉ đỏ
- Tia bão mặt trời vẫn giáng xuống phía xa của đỉnh núi
- Ban ngày mặt trời đột biến chói ở góc màn hình. Mép màn hình tối lại và khép vào theo nhịp tim của sáp
- Đài thiên văn cuối cùng: đèn pha quét quanh tiền đồn và ánh lóe trên ống kính thiên văn
- Tro lẫn tuyết rơi phủ toàn màn hình, rơi chéo nhẹ theo gió, cả ngày lẫn đêm
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Đạo cụ
Hiện tên khi rê chuột. `blocksBuilding` = ô đó không xây được.

| Đạo cụ | Ghi chú |
|---|---|
| Hố bão mặt trời | Tia bão đánh xuống nung chảy đá thành thủy tinh đen, tuyết quanh hố tan thành bùn tro. |
| Hố bão mặt trời | Hố bão còn bốc khói. |
| Hố bão mặt trời | Hố bão trên đảo đông, đá nứt toác quanh miệng hố. |
| Hố bão mặt trời | Mép hố còn âm ỉ nóng. |
| Cầu treo đứt | Cầu treo cũ nối hai đỉnh đã đứt, nửa cầu rủ xuống biển mây. |
| Cầu treo đứt | Nửa còn lại của một cây cầu treo, ván rơi dần xuống vực. |
