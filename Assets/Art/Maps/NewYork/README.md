# New York (NewYork)

Bản đồ phụ, **đề xuất, chưa có trong GDD** · 12 ngày · Đất xây: Hẹp

> “Thành phố vẫn sáng đèn, nhưng không còn ai ở đó.”

Trung tâm một siêu đô thị công nghệ. Lưới điện dự phòng vẫn nuôi đèn neon, hologram và drone, dù cả thành phố đã hóa sáp.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-7

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục, 4 – Sáp thấu kính
- Trùm ngày cuối: Lõi Sáp Thành Phố (đề xuất). Bão mặt trời: 15% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt, Pháo xuyên giáp
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 99 / 137 / 149 / 163 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Hai hướng: lối bắc đi xuống một đại lộ rồi rẽ đông, lối đông chạy dọc phố ngang rồi cắm thẳng xuống tường. Hai lối cắt nhau giữa bản đồ, hợp với tháp sát thương lan đặt ở giao lộ.
- Các tòa tháp chiếm gần hết đất: chỉ có dải vỉa hè trước tường, quảng trường hologram và vài khe phố hẹp là xây được.
- Neon và hologram vẫn chạy cho một thành phố không còn ai. Ban đêm là lúc bản đồ đẹp nhất, và cũng buồn nhất.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_new_york_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_new_york_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_new_york_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_new_york_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_new_york_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_new_york_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 135 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 22 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 20 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 41 chỗ đậu (`ambient.crowPerches`)
- Hơi nước bốc từ nắp cống: 7 chỗ (`ambient.steamVents`)
- Biển neon chập chờn, thỉnh thoảng tắt hẳn: 27 biển (`ambient.neonSigns`)
- Hologram quảng cáo nhiễu sọc: 2 bảng (`ambient.holograms`)
- Ban ngày phủ khói bụi tím; ban đêm cửa sổ và neon tự phát sáng. Drone bay tuần tra
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Bảng hologram | Hologram quảng cáo vẫn lặp lại cho con phố vắng: “Ra ngoài đi, hôm nay trời nắng đẹp!” |
| Hologram thời tiết | Bản tin thời tiết tự động vẫn chạy: “Nắng đẹp. Chỉ số tia cực tím: ngoài thang đo.” |
| Xe taxi bỏ lại | Cửa xe còn mở, đồng hồ tính cước vẫn nhảy số cho một chuyến đi không bao giờ kết thúc. |
| Robot giao hàng | Robot giao hàng vẫn đứng chờ trước cửa, màn hình nháy: “Người nhận chưa xác nhận.” |
| Lối xuống tàu điện ngầm (hy vọng) | Lối xuống ga tàu điện ngầm tối om, bị chặn bằng ván từ bên trong. Có lẽ dưới đó vẫn còn người. |
| Bóng sáp trên ghế | Một bóng sáp ngồi trên ghế đá, tay giơ điện thoại lên trời như đang chụp mặt trời. |
| Màn hình khẩn cấp | Màn hình khẩn cấp lặp lại một dòng chữ đỏ: “Ở trong nhà. Đừng nhìn lên trời.” |
| Đống lửa giữa phố (hy vọng) | Đống lửa thật đầu tiên ở thành phố này sau nhiều năm chỉ có ánh đèn điện. |
| Dây đèn (hy vọng) | Đoàn viễn chinh kéo điện từ một trạm sạc bỏ hoang để thắp đèn. |
| Chậu mầm cây (hy vọng) | Mầm cây đặt dưới đèn neon, mọc nghiêng về phía ánh hồng. |
