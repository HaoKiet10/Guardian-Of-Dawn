# Cầu cảng (Harbor)

Chương 2 trong GDD v2 (mục 5.3) · 10 ngày · Đất xây: Vừa

> “Nơi ánh sáng không chạm tới.”

Bến cảng, cần cẩu, container.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-2` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 41, 31, 34
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ. Bậc mới: Bậc 2 – Sáp hổ, biến thể: Sáp vỏ cua
- Trùm ngày cuối: Hổ Sáp Đầu Đàn. Bão mặt trời: 10% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới
- Nền móng dựng sẵn: 11 nền (`towerPlots`), mỗi nền 1 ô xây sát đường. Chỉ xây tháp trên nền móng (đề xuất, khác đặt tự do ở GDD 4.5). `order` là độ ưu tiên: bản mẫu đặt 3/5/7/9 tháp lên các nền đầu tiên theo cấp tường

Ý đồ bố cục:
- Hai hướng, ba nhánh. Lối bắc từ phố đi xuống, gấp khúc chữ U qua bãi container rồi đổ dốc ra dải bờ kè trước cổng tây. Lối biển đổ bộ trên cầu phao, nhảy qua các bệ neo bê tông. Tới bệ ngã ba thì tách đôi: nhánh trong leo lên bờ kè nhập với lối bắc, nhánh ngoài vòng qua bệ neo thứ hai vào cổng nam.
- Không có đoạn thẳng nào dài quá 10 ô, nên sáp hổ không có đường băng để lao. Nền móng nằm bên trong các khúc cua chữ U và chữ V, để tháp bắn vào hông và lưng sáp vỏ cua.
- Dải bờ kè trước cổng tây là vùng tiêu diệt chính: nhánh bắc và nhánh biển trong đi chung 8 ô cuối, ba nền móng ở đó bắn được cả hai hướng. Mất tháp ở đây vì bão là mất cả hai phía, nên cần tháp dự phòng ở phía bắc và trên các bệ neo.
- 11 nền móng dựng sẵn (đề xuất, thay cho đặt tự do ở GDD 4.5). Nền đầu tiên nên xây là nền nằm trong khúc chữ U phía bắc, phủ khoảng 19 ô đường.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_harbor_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_harbor_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_harbor_plots.png` | Nền móng dựng sẵn (tấm bê tông trên hố đào), 11 nền | 2560×1536, nền trong suốt |
| `map_harbor_layout.json` | Lưới ô, đường đi, nền móng, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp `plots` nằm trên ảnh nền và dưới tháp. Hố đào quanh nền đã có sẵn trong ảnh nền. Đặt tháp tại `towerPlots[i].towerPivot` (pivot Base của tháp)
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 23 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 4 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 12 chỗ đậu (`ambient.crowPerches`)
- Tàu đắm (đạo cụ `landmark`, góc đông bắc): lửa cháy âm ỉ ở chỗ gãy giữa hai nửa tàu, cột khói đen bốc lên và trôi về tây, khói mỏng từ ống khói, tàn lửa bay lên, cứ khoảng 3 giây tóe một chùm tia lửa
- Quanh tàu: sóng đập tung bọt ở mũi và đuôi, thùng phuy và tấm ván dập dềnh, vệt sáng lấp lánh trôi trên vệt dầu. Ban đêm ánh lửa hắt cam lên thân tàu (có sẵn trong `lights`)
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Đạo cụ
Hiện tên khi rê chuột. `blocksBuilding` = ô đó không xây được.

| Đạo cụ | Ghi chú |
|---|---|
| Tàu hàng đắm | Cảnh nền ở cửa cảng, chỉ để trang trí, không ảnh hưởng lối chơi. |
| Giàn cẩu container sập | Giàn cẩu bờ gãy chân, cần cẩu gãy đôi gục xuống boong tàu đắm. Cảnh nền, không ảnh hưởng lối chơi. |
| Cần cẩu đổ | Cần cẩu bến đổ nhào xuống nước, đè bẹp một container (GDD 6.2). |
