# Ngoại ô (Outskirts)

Chương 1 trong GDD v2 (mục 5.3) · 8 ngày · Đất xây: Rộng

> “Còn ai trong đó?”

Rìa Dawnhold, khu dân cư bỏ hoang.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-1` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 1 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 94
- Bậc quái: 1 – Sáp tiêu chuẩn. Bậc mới: Bậc 1 – Sáp tiêu chuẩn, biến thể: Sáp vụn
- Trùm ngày cuối: Sáp Nguyên Thủy. Bão mặt trời: 1 cơn hướng dẫn (ngày 6)
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi
- Ô nhỏ xây được: 593 (4 ô nhỏ = 1 ô xây). Đặt tự do ở mọi cấp tường (GDD 4.5)

Ý đồ bố cục:
- Một lối vào duy nhất từ phía bắc, uốn bốn vòng qua cả khu dân cư rồi mới tới tiền đồn nhỏ ở góc đông nam. Đường dài cho người mới thời gian quan sát tháp bắn.
- Đất rộng: dải đất trống nằm giữa các vòng đường. Một tháp đặt giữa hai vòng bắn được quái ở cả hai lượt đi qua (GDD 4.5).
- Bối cảnh theo GDD 6.2: nhà dân bỏ hoang, hàng rào, đường nhựa nứt, tông nâu xám.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_outskirts_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_outskirts_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_outskirts_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 15 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 13 cửa sổ (`ambient.windows`)
- Khói mỏng bốc từ mái nhà sập: 2 chỗ (`ambient.smokeHoles`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 59 chỗ đậu (`ambient.crowPerches`)
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)
