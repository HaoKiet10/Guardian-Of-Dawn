# Phố cổ đổ nát (OldTown)

Chương 3 trong GDD v2 (mục 5.3) · 12 ngày · Đất xây: Hẹp

> “Hạt giống.”

Phố hẹp, nhà sụp, cây sáp mọc xuyên đường.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-3` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 81, 81, 45, 45
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục. Bậc mới: Bậc 3 – Sáp hồi phục, biến thể: Sáp bào tử
- Trùm ngày cuối: Cây Sáp Mẹ. Bão mặt trời: 12% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt
- Nền móng dựng sẵn: 11 nền (`towerPlots`), mỗi nền 1 ô xây sát đường. Chỉ xây tháp trên nền móng (đề xuất, khác đặt tự do ở GDD 4.5). `order` là độ ưu tiên: bản mẫu đặt 3/5/7/9 tháp lên các nền đầu tiên theo cấp tường

Ý đồ bố cục:
- Hai con hẻm hẹp đổ vào từ hai mép tây và đông, men lên phía bắc rồi ôm lấy quảng trường. Cả hai gặp nhau ở mép nam quảng trường, qua cầu đá vượt kênh, rẽ tây theo bờ kênh rồi vòng ngược về đông tới tiền đồn nhỏ ở góc đông nam. Chân cầu rẽ đôi: rẽ trái vòng về tây rồi vào cổng dưới, rẽ phải men theo bờ kênh vào cổng trên.
- 11 nền móng dựng sẵn (đề xuất, thay cho đặt tự do ở GDD 4.5). Nền nằm ở quảng trường xen đống đổ nát và cây sáp, ở hai sân sau, và năm nền trên dải đất kẹp giữa đường men kênh và vòng bờ nam, nơi bắn được cả hai nhánh. Chỗ hai lối gặp nhau và đầu cầu hợp với sát thương lan (súng cối, dung môi).
- Bối cảnh theo GDD 6.2: nhà sụp, cây sáp mọc xuyên đường, tông vàng sáp. Nền móng xen giữa đống đổ nát.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_old_town_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_old_town_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_old_town_plots.png` | Nền móng dựng sẵn (tấm bê tông trên hố đào), 11 nền | 2560×1536, nền trong suốt |
| `map_old_town_layout.json` | Lưới ô, đường đi, nền móng, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp `plots` nằm trên ảnh nền và dưới tháp. Hố đào quanh nền đã có sẵn trong ảnh nền. Đặt tháp tại `towerPlots[i].towerPivot` (pivot Base của tháp)
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 15 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 88 cửa sổ (`ambient.windows`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 56 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ từ tán các cây sáp mọc xuyên mái nhà (`ambient.waxDrips`)
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Đạo cụ
Hiện tên khi rê chuột. `blocksBuilding` = ô đó không xây được.

| Đạo cụ | Ghi chú |
|---|---|
| Đài phun nước đổ nát | Bức tượng giữa đài phun gãy ngang, thân tượng đổ chìm xuống bể. Ống nước vỡ vẫn phun. |
