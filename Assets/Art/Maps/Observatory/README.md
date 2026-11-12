# Đài thiên văn (Observatory)

Chương 5 trong GDD v2 (mục 5.3) · 15 ngày · Đất xây: Hẹp

> “Vạn người.”

Đài thiên văn nơi Dị Thể Mặt Trời lần đầu được ghi nhận.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-5

## Bố cục
- 3 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục, 4 – Sáp thấu kính, 5 – Sáp tối thượng. Bậc mới: Bậc 5 – Sáp tối thượng, biến thể: Sáp kích động
- Trùm ngày cuối: Khối Sáp Vạn Người. Bão mặt trời: 20% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt, Pháo xuyên giáp
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 84 / 114 / 114 / 116 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Đỉnh núi: vách đá bao quanh, chỉ có gờ đá trước tường và hai gờ nhỏ hai bên là xây được.
- Ba hướng đổ về: lối bắc đi bậc đá zíc zắc rồi cắm thẳng vào vùng xây, lối tây và đông vòng xuống ôm hai cạnh tường.
- Mái vòm đài thiên văn nằm trong tường, đã thủng một mảng. Tiền đồn cuối được dựng ngay nơi mọi chuyện bắt đầu.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_observatory_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_observatory_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_observatory_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_observatory_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 38 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 24 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 1 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 4 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ xuống từ cây sáp và bóng sáp: 2 chỗ (`ambient.waxDrips`)
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Kính thiên văn gãy | Kính thiên văn gãy làm đôi, nửa còn lại vẫn hướng về phía mặt trời. |
| Ghi chép rơi vãi | Những trang ghi chép bay khắp gờ đá. Dòng cuối viết vội: “Nó đang nhìn lại chúng ta.” |
| Bóng sáp trước bàn điều khiển | Một bóng sáp vẫn ngồi trước bàn điều khiển, tay đặt trên bàn phím. Màn hình còn sáng. |
| Ăng-ten vô tuyến | Ăng-ten vẫn phát một tín hiệu lặp lại. Chưa ai trả lời. |
| Hai bóng sáp trên gờ đá | Hai người ngồi cạnh nhau nhìn về phía đông, chờ bình minh lần cuối. |
| Đống lửa trại (hy vọng) | Đống lửa dưới mái vòm thủng. Lần đầu tiên sau nhiều năm có người ngủ yên ở đây. |
| Đèn lồng giấy (hy vọng) | Mỗi chiếc đèn lồng mang tên một người đang chờ được cứu. |
| Chậu mầm cây (hy vọng) | Mầm cây đã ra lá thật. Ai đó đặt chúng hướng về phía đông. |
