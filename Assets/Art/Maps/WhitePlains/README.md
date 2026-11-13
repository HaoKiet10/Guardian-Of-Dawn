# Đồng bằng trắng (WhitePlains)

Chương 4 trong GDD v2 (mục 5.3) · 12 ngày · Đất xây: Vừa

> “Bẻ cong ánh sáng.”

Cánh đồng muối trắng ven biển: ruộng muối phẳng như gương, không chỗ che.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-4` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 3 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 35, 35, 34
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục, 4 – Sáp thấu kính. Bậc mới: Bậc 4 – Sáp thấu kính, biến thể: Sáp gương
- Trùm ngày cuối: Lăng Kính Sống. Bão mặt trời: 15% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt, Pháo xuyên giáp
- Ô nhỏ xây được: 337 (4 ô nhỏ = 1 ô xây). Đặt tự do ở mọi cấp tường (GDD 4.5)

Ý đồ bố cục:
- Ba hướng: bắc, tây, đông. Cả ba lối là bờ đất len giữa các ô ruộng muối rồi đâm vào ba mặt của tiền đồn nhỏ dựng sát bãi biển, nên công trình bị chia mỏng.
- Ruộng muối chia ô bằng bờ đất, mỗi ô một độ kết tinh: nước biển trong, nước muối hồng, muối trắng đã kết. Không xây trên ruộng; đất xây là dải muối khô dọc lối đi. Phía nam là biển, một con kênh dẫn nước cắt ngang lối đông.
- Sáp thấu kính dễ đứng cạnh công trình để hội tụ, nên cần Tháp làm lạnh và Cột thu sáng.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_white_plains_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_white_plains_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_white_plains_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_white_plains_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_white_plains_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_white_plains_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 22 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 1 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 8 chỗ đậu (`ambient.crowPerches`)
- Bờ biển: một đường bọt sóng uốn lượn xô lên rồi rút xuống dọc bãi cát, các lớp sóng lừng chạy từ ngoài khơi vào, bọt chạy dọc hai bờ kênh dẫn nước
- Mặt biển lấp lánh, có một vệt sáng dưới mặt trời (ban đêm là ánh trăng)
- Ruộng muối: mây trắng trôi chậm phản chiếu trên các ô còn nước, một vệt nắng quét ngang mặt ruộng mỗi ~11 giây, các ô ruộng thỉnh thoảng lóe sáng
- 3 cối xay gió bơm nước quay cánh, có gợn nước dưới chân, đặt tại (12.75, 11.09), (1.25, 6.59), (18.25, 6.59) (unit). Cối xay chỉ vẽ trong code, không có trong ảnh nền
- Bụi muối trắng bay theo gió khắp bản đồ
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)
