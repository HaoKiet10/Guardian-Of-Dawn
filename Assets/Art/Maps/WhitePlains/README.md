# Đồng bằng trắng (WhitePlains)

Chương 4 trong GDD v2 (mục 5.3) · 12 ngày · Đất xây: Vừa

> “Bẻ cong ánh sáng.”

Cánh đồng muối trắng, không chỗ che.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-4

## Bố cục
- 3 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục, 4 – Sáp thấu kính. Bậc mới: Bậc 4 – Sáp thấu kính, biến thể: Sáp gương
- Trùm ngày cuối: Lăng Kính Sống. Bão mặt trời: 15% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt, Pháo xuyên giáp
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 66 / 119 / 174 / 241 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Ba hướng: bắc, tây, đông. Tường hình chữ U phải phủ cả ba mặt, nên công trình bị chia mỏng.
- Đồng muối trống trải. Tinh thể muối và hồ nước muối là chướng ngại duy nhất. Sự trống rỗng là cảm xúc chính của bản đồ.
- Lối đông và tây chạy sát hai cạnh tường, ngay trong vùng xây. Sáp thấu kính dễ đứng cạnh công trình để hội tụ, nên cần Tháp làm lạnh và Cột thu sáng ở đây.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_white_plains_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_white_plains_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_white_plains_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_white_plains_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_white_plains_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_white_plains_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 48 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 28 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 1 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 15 chỗ đậu (`ambient.crowPerches`)
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Dấu chân trên muối | Dấu chân kéo dài trên muối rồi dừng lại ở một vũng sáp. Bên cạnh là một chiếc giày. |
| Xe phủ muối | Chiếc xe bị muối phủ kín, chỉ còn lộ cây ăng-ten. |
| Vòng tinh thể | Tinh thể muối mọc thành vòng quanh một điểm cháy sém, như thể ánh sáng từng hội tụ ở đây. |
| Bộ xương bò | Bộ xương bò bạc trắng. Con vật không kịp hóa sáp, nó chết khát trước đó. |
| Lá cờ khảo sát | Lá cờ của một đoàn khảo sát cũ, rách tả tơi trong gió. |
| Đống lửa trại (hy vọng) | Ngọn lửa duy nhất giữa đồng muối, nhìn thấy được từ rất xa. |
| Dây đèn (hy vọng) | Dây đèn căng giữa hai lều, sáng hơn cả ánh trăng trên muối. |
| Chậu mầm cây (hy vọng) | Mầm cây đã cao hơn một gang tay. Không ai quên tưới. |
