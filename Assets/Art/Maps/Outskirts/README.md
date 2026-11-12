# Ngoại ô (Outskirts)

Chương 1 trong GDD v2 (mục 5.3) · 8 ngày · Đất xây: Rộng

> “Còn ai trong đó?”

Rìa Dawnhold, khu dân cư bỏ hoang.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-1

## Bố cục
- 1 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn. Bậc mới: Bậc 1 – Sáp tiêu chuẩn, biến thể: Sáp vụn
- Trùm ngày cuối: Sáp Nguyên Thủy. Bão mặt trời: 1 cơn hướng dẫn (ngày 6)
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 107 / 159 / 217 / 264 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Một lối vào duy nhất từ phía bắc, uốn hình chữ S qua khu dân cư. Đường dài cho người mới thời gian quan sát tháp bắn.
- Đất rộng: tường cấp 0 đã đủ chỗ cho 4 công trình cơ bản. Mỗi cấp tường mở tới thêm một khúc cua của đường.
- Cảnh vật kể lại buổi sáng thảm họa: xe dừng giữa đường, quần áo còn phơi. Đó là cuộc sống mà người chơi đang cố đưa về.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_outskirts_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_outskirts_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_outskirts_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_outskirts_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 48 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 17 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 10 cửa sổ (`ambient.windows`)
- Khói mỏng bốc từ mái nhà sập: 2 chỗ (`ambient.smokeHoles`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 26 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ xuống từ cây sáp và bóng sáp: 1 chỗ (`ambient.waxDrips`)
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Hai bóng sáp bên vệ đường | Hai bóng sáp nắm tay nhau. Người nhỏ hơn vẫn đeo chiếc cặp sách. |
| Chiếc xe dừng giữa đường | Cửa xe còn mở, chìa khóa vẫn cắm trong ổ. Có người đã cố chạy ra ngoài. |
| Xe nôi | Một chiếc xe nôi lật nghiêng. Bên trong chỉ còn tấm chăn nhỏ. |
| Chữ SOS trên mái nhà | Ai đó đã sơn chữ SOS lên mái. Không ai đến kịp. |
| Biển chỉ đường | Biển chỉ về Dawnhold, cong vênh vì nhiệt. |
| Dây phơi | Quần áo vẫn phơi trên dây, đã bạc trắng vì nắng. |
| Hình vẽ phấn | Hình vẽ phấn của một đứa trẻ: mặt trời có khuôn mặt cười. |
| Gấu bông | Một con gấu bông nằm úp mặt trong cỏ khô. |
| Đống lửa trại (hy vọng) | Đống lửa của đoàn viễn chinh. Đêm nào cũng có người thức canh. |
| Dây đèn (hy vọng) | Dây đèn mang theo từ Dawnhold, thắp lên mỗi tối như ở nhà. |
| Chậu mầm cây (hy vọng) | Mấy chậu mầm cây mang theo từ Dawnhold, được tưới mỗi đêm. |
