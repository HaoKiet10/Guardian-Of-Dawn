# Đài thiên văn (Observatory)

Chương 5 trong GDD v2 (mục 5.3) · 15 ngày · Đất xây: Hẹp

> “Vạn người.”

Đài thiên văn nơi Dị Thể Mặt Trời lần đầu được ghi nhận.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-5` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 3 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 39, 32, 27
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục, 4 – Sáp thấu kính, 5 – Sáp tối thượng. Bậc mới: Bậc 5 – Sáp tối thượng, biến thể: Sáp kích động
- Trùm ngày cuối: Khối Sáp Vạn Người. Bão mặt trời: 20% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt, Pháo xuyên giáp
- Ô nhỏ xây được: 338 (4 ô nhỏ = 1 ô xây). Đặt tự do ở mọi cấp tường (GDD 4.5)

Ý đồ bố cục:
- Đỉnh núi phủ tuyết nhô lên giữa biển mây. Các khối đá rộng nối nhau bằng cầu treo, ngoài mép đá chỉ còn vực sâu.
- Ba hướng: lối bắc tuôn từ cửa đài thiên văn, vượt cầu treo xuống cao nguyên giữa rồi gấp khúc tới mặt bắc tiền đồn. Lối tây và đông vượt cầu treo dài xuống hai đảo phía nam rồi vòng ngược vào hai cạnh tiền đồn.
- Đài thiên văn bị sáp trùm kín: sáp tràn khỏi mái vòm, rễ sáp bò khắp mỏm đá, trong sáp có bóng tay người và khuôn mặt.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_observatory_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_observatory_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_observatory_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 25 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 2 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 11 chỗ đậu (`ambient.crowPerches`)
- Biển mây trôi chậm quanh các đảo đá (vùng ký tự `v` trong `grid`)
- Tuyết rơi phủ toàn màn hình: 3 lớp bông tuyết to nhỏ, rơi chéo nhẹ theo gió, cả ngày lẫn đêm
- Đài thiên văn: khối sáp trùm mái vòm phát sáng đỏ cam theo nhịp tim (hai nhịp rồi nghỉ), mắt các khuôn mặt trong sáp lóe đỏ cùng nhịp, giọt sáp nhỏ xuống từ chân vòm
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Đạo cụ
Hiện tên khi rê chuột. `blocksBuilding` = ô đó không xây được.

| Đạo cụ | Ghi chú |
|---|---|
| Kính viễn vọng | Kính viễn vọng của đài thiên văn, sáp phủ khắp nơi (GDD 6.2). |
