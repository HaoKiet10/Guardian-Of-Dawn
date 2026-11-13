# Phố cổ đổ nát (OldTown)

Chương 3 trong GDD v2 (mục 5.3) · 12 ngày · Đất xây: Hẹp

> “Hạt giống.”

Phố hẹp, nhà sụp, cây sáp mọc xuyên đường.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-3` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 81, 81
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục. Bậc mới: Bậc 3 – Sáp hồi phục, biến thể: Sáp bào tử
- Trùm ngày cuối: Cây Sáp Mẹ. Bão mặt trời: 12% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt
- Ô nhỏ xây được: 247 (4 ô nhỏ = 1 ô xây). Đặt tự do ở mọi cấp tường (GDD 4.5)

Ý đồ bố cục:
- Hai con hẻm hẹp đổ vào từ hai mép tây và đông, men lên phía bắc rồi ôm lấy quảng trường. Cả hai gặp nhau ở mép nam quảng trường, qua cầu đá vượt kênh, rẽ tây theo bờ kênh rồi vòng ngược về đông tới tiền đồn nhỏ ở góc đông nam.
- Đất xây hẹp: quảng trường xen đống đổ nát và cây sáp, hai sân sau và dải đất kẹp giữa hai lượt đường ở bờ nam kênh: tháp đặt ở đó bắn được cả hai lượt. Chỗ hai lối gặp nhau và đầu cầu hợp nhất với sát thương lan (súng cối, dung môi).
- Bối cảnh theo GDD 6.2: nhà sụp, cây sáp mọc xuyên đường, tông vàng sáp. Ô xây xen giữa đống đổ nát.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_old_town_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_old_town_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_old_town_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 15 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 93 cửa sổ (`ambient.windows`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 58 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ từ tán các cây sáp mọc xuyên mái nhà (`ambient.waxDrips`)
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)
