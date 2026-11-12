# Cầu cảng (Harbor)

Chương 2 trong GDD v2 (mục 5.3) · 10 ngày · Đất xây: Vừa

> “Nơi ánh sáng không chạm tới.”

Bến cảng, cần cẩu, container.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-2

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ. Bậc mới: Bậc 2 – Sáp hổ, biến thể: Sáp vỏ cua
- Trùm ngày cuối: Hổ Sáp Đầu Đàn. Bão mặt trời: 10% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 62 / 94 / 134 / 176 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Hai hướng: lối bắc xuyên bãi container, lối tây đi trên cầu gỗ mục qua mặt nước. Tiền đồn nằm góc đông nam nên tường hình chữ L, hai mặt tường phải chia hỏa lực.
- Lối tây có đoạn cầu thẳng dài: hổ sáp lao rất nhanh ở đây, nên đặt súng máy hoặc tháp lưới ở đầu cầu.
- Cầu tàu giữa cảng chỉ nằm trong vùng xây khi tường lên cấp 3. Đó là vị trí đặt cược: tầm đẹp cho súng cối nhưng xa tường.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_harbor_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_harbor_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_harbor_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 40 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 22 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 3 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 13 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ xuống từ cây sáp và bóng sáp: 1 chỗ (`ambient.waxDrips`)
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Thuyền đánh cá úp ngược | Thuyền úp ngược sát cầu tàu. Lưới vẫn còn mắc cá khô. |
| Bóng sáp ở mép cầu tàu | Một bóng sáp ngồi ở mép cầu tàu, chân thõng xuống nước. Có lẽ họ đang câu cá. |
| Phao cứu sinh | Phao cứu sinh trôi giữa cảng, tên con tàu đã bong tróc. |
| Hàng cứu trợ | Thùng hàng cứu trợ đổ ra từ container, chưa kịp phát cho ai. |
| Cần cẩu | Cabin treo lơ lửng. Đèn báo vẫn nhấp nháy bằng pin dự phòng. |
| Bức tường người mất tích (hy vọng) | Ảnh những người mất tích. Ai đó đã viết bên dưới: “Chúng tôi sẽ đưa các bạn về.” |
| Đống lửa trại (hy vọng) | Đống lửa nhỏ, cháy bằng gỗ vụn từ cầu tàu. |
| Dây đèn (hy vọng) | Dây đèn căng dọc tường, để người gác không phải đứng trong bóng tối. |
