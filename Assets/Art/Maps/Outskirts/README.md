# Ngoại ô (Outskirts)

Chương 1 trong GDD v2 (mục 5.3) · 8 ngày · Đất xây: Rộng

> “Còn ai trong đó?”

Rìa Dawnhold, khu dân cư bỏ hoang.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-1` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 1 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 95
- Bậc quái: 1 – Sáp tiêu chuẩn. Bậc mới: Bậc 1 – Sáp tiêu chuẩn, biến thể: Sáp vụn
- Trùm ngày cuối: Sáp Nguyên Thủy. Bão mặt trời: 1 cơn hướng dẫn (ngày 6)
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi
- Nền móng dựng sẵn: 13 nền (`towerPlots`), mỗi nền 1 ô xây sát đường. Chỉ xây tháp trên nền móng (đề xuất, khác đặt tự do ở GDD 4.5). `order` là độ ưu tiên: bản mẫu đặt 3/5/7/9 tháp lên các nền đầu tiên theo cấp tường

Ý đồ bố cục:
- Một lối vào duy nhất từ phía bắc, uốn qua cả khu dân cư rồi tới tiền đồn nhỏ ở góc đông nam. Chỉ một con đường, không rẽ nhánh: vòng qua phía bắc, trải xuống tận mép nam rồi chạy dọc đáy bản đồ. Đường dài cho người mới thời gian quan sát tháp bắn.
- 13 nền móng dựng sẵn sát đường (đề xuất, thay cho đặt tự do ở GDD 4.5). Nền đặt giữa hai vòng đường bắn được quái ở cả hai lượt đi qua.
- Bối cảnh theo GDD 6.2: nhà dân bỏ hoang, hàng rào, đường nhựa nứt, ổ gà, bó vỉa gãy, tông nâu xám.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_outskirts_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_outskirts_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_outskirts_plots.png` | Nền móng dựng sẵn (tấm bê tông trên hố đào), 13 nền | 2560×1536, nền trong suốt |
| `map_outskirts_layout.json` | Lưới ô, đường đi, nền móng, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp `plots` nằm trên ảnh nền và dưới tháp. Hố đào quanh nền đã có sẵn trong ảnh nền. Đặt tháp tại `towerPlots[i].towerPivot` (pivot Base của tháp)
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 15 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 12 cửa sổ (`ambient.windows`)
- Khói mỏng bốc từ mái nhà sập: 2 chỗ (`ambient.smokeHoles`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 38 chỗ đậu (`ambient.crowPerches`)
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)
