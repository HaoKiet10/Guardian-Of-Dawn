# Khu ngập lụt (FloodedQuarter)

Bản đồ phụ, **đề xuất, chưa có trong GDD** · 10 ngày · Đất xây: Vừa

> “Mưa là thứ duy nhất che được mặt trời.”

Khu phố bị nước nhấn chìm dưới cơn mưa không dứt. Mây dày tới mức ánh nắng không chạm được mặt đất.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-6

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục
- Trùm ngày cuối: Khối Sáp Trôi (đề xuất). Bão mặt trời: Không có (mây che kín nắng)
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 58 / 113 / 150 / 164 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Phần lớn bản đồ là nước. Hai lối đi trên cầu tạm nối các mô đất: lối bắc đổ vào mặt trên của tường, lối đông chạy dọc bờ kè vào mặt bên.
- Tiền đồn dựng trên gò cao nhất ở góc tây nam, tường hình chữ L. Các mái nhà ngập nửa chừng chặn tầm nhìn nhưng không chặn đường.
- Mưa che kín mặt trời nên ở đây không có bão, và Gương hội tụ không dùng được. Đây là nơi duy nhất người ta dám đứng ngoài trời ban ngày.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_flooded_quarter_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_flooded_quarter_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_flooded_quarter_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_flooded_quarter_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_flooded_quarter_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_flooded_quarter_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 37 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 20 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 4 cửa sổ (`ambient.windows`)
- Khói mỏng bốc từ mái nhà sập: 1 chỗ (`ambient.smokeHoles`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 16 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ xuống từ cây sáp và bóng sáp: 1 chỗ (`ambient.waxDrips`)
- Thời tiết mưa: mưa xiên phủ màn hình, gợn nước, chớp xa. Mây che nắng nên **không có bão mặt trời** và không dùng được Gương hội tụ
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Chiếc ô bên vũng sáp | Một chiếc ô mở sẵn nằm cạnh vũng sáp. Cơn mưa đến muộn một ngày. |
| Bóng sáp trên bậc thềm | Một bóng sáp ngồi trên bậc thềm, nước đã ngập tới chân. Họ ngồi đó như đang chờ mưa tạnh. |
| Xuồng cứu hộ | Xuồng cứu hộ úp ngược giữa dòng nước. Áo phao vẫn buộc vào mạn xuồng. |
| Gấu bông trôi | Một con gấu bông trôi lững lờ, mắc vào song cửa sổ của ngôi nhà ngập. |
| Biển khu sơ tán | Biển chỉ lên đồi: “Khu sơ tán”. Nước đã ngập tới chữ cuối cùng. |
| Phao cứu sinh | Phao cứu sinh xoay chậm trên mặt nước, không ai kịp ném. |
| Đống lửa dưới bạt (hy vọng) | Đống lửa dưới tấm bạt căng. Ở đây người ta ngủ ngon, vì mây còn dày. |
| Dây đèn dưới mái bạt (hy vọng) | Đèn treo dưới mái bạt, tiếng mưa gõ đều suốt đêm. |
| Chậu mầm cây (hy vọng) | Mầm cây uống nước mưa, lớn nhanh hơn ở bất cứ đâu. |
