# Phố cổ đổ nát (OldTown)

Chương 3 trong GDD v2 (mục 5.3) · 12 ngày · Đất xây: Hẹp

> “Hạt giống.”

Phố hẹp, nhà sụp, cây sáp mọc xuyên đường.

Bản mẫu xem trực tiếp: https://claude.ai/artifact/7QeXzB3ZA9yPA9KdfVewdN#map-3

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ, 3 – Sáp hồi phục. Bậc mới: Bậc 3 – Sáp hồi phục, biến thể: Sáp bào tử
- Trùm ngày cuối: Cây Sáp Mẹ. Bão mặt trời: 12% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới, Tháp làm lạnh, Tháp phun dung môi, Mồi nhiệt
- Ô nhỏ xây được theo cấp tường 0/1/2/3: 80 / 108 / 113 / 116 (4 ô nhỏ = 1 ô xây)

Ý đồ bố cục:
- Hai con phố hẹp đổ xuống từ hai góc bắc. Nhà cửa chặn gần hết đất: chỉ có dải phố dọc tường và ba khoảng sân là xây được.
- Hai lối dồn về sát nhau trước tường, nên vùng giữa hai lối hợp với sát thương lan (súng cối, dung môi).
- Cây sáp mọc xuyên mái nhà và quảng trường. Đây là nơi sự sống bị biến dạng rõ nhất, cũng là nơi giữ hạt giống sạch.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_old_town_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_old_town_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_old_town_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_old_town_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 2 và 3 có đèn trên trụ (cứ 4 ô nhỏ một trụ, ở các cột x chia hết cho 4 trong `grid`). Đèn này không có trong `lights`: code thêm Light 2D khi bật lớp tường cấp 2 hoặc 3

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 45 nguồn sáng (`lights`), gồm lửa trại chập chờn (`flicker`) và đèn nháy (`blinkMs`)
- Dây đèn trong tiền đồn: 15 bóng (`lanterns`)
- Lửa trại: 1 đống (`fires`), cần sprite lửa và khói bốc lên
- Đèn hiệu nhấp nháy đỏ (cần cẩu, ăng-ten, nóc nhà): 1 (`beacons`)
- Cửa sổ có người ngó ra rồi thụt vào, ban đêm chỉ còn hai đốm mắt: 112 cửa sổ (`ambient.windows`)
- Khói mỏng bốc từ mái nhà sập: 22 chỗ (`ambient.smokeHoles`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 32 chỗ đậu (`ambient.crowPerches`)
- Giọt sáp nhỏ xuống từ cây sáp và bóng sáp: 7 chỗ (`ambient.waxDrips`)
- Trong tiền đồn: dân làng đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Dấu vết kể chuyện
Hiện khi rê chuột lên đạo cụ. Ô có đạo cụ chặn không cho xây (`blocksBuilding`).

| Đạo cụ | Đoạn chữ |
|---|---|
| Quán cà phê ngoài trời | Bàn ghế vẫn xếp như chờ khách. Cây sáp đã mọc xuyên qua mái hiên. |
| Chuông nhà thờ | Quả chuông rơi xuống quảng trường, nứt làm đôi. |
| Bóng sáp sát tường nhà | Một bóng sáp ngồi co ro sát tường, nơi bóng râm đã không đủ che. |
| Biển kho hạt giống | Biển chỉ đường tới kho lưu trữ hạt giống. Thứ đoàn viễn chinh cần nằm ở đó. |
| Xe đạp giao bánh | Chiếc xe đạp giao hàng, giỏ vẫn đầy bánh mì khô cứng. |
| Đống lửa trại (hy vọng) | Đống lửa giữa sân tiền đồn. Có người hát khe khẽ cho đỡ sợ. |
| Dây đèn (hy vọng) | Dây đèn treo giữa hai lều, sáng suốt đêm. |
| Chậu mầm cây (hy vọng) | Mầm cây gieo từ hạt giống tìm được. Lần đầu tiên chúng mọc lên sạch. |
