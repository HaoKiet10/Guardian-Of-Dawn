# Cầu cảng (Harbor)

Chương 2 trong GDD v2 (mục 5.3) · 10 ngày · Đất xây: Vừa

> “Nơi ánh sáng không chạm tới.”

Bến cảng, cần cẩu, container.

Bản mẫu chạy được: `Docs/Final Project/Guardian of Dawn - Map Prototype.html` (mở bằng trình duyệt, thêm `#map-2` vào cuối đường dẫn để vào thẳng bản đồ này).

## Bố cục
- 2 hướng tấn công. Quái xuất hiện ở mép bản đồ, đi theo `routes` trong layout.json tới tường. Độ dài từng lối (ô lưới): 57, 39
- Bậc quái: 1 – Sáp tiêu chuẩn, 2 – Sáp hổ. Bậc mới: Bậc 2 – Sáp hổ, biến thể: Sáp vỏ cua
- Trùm ngày cuối: Hổ Sáp Đầu Đàn. Bão mặt trời: 10% mỗi ngày
- Tháp dùng được: Súng máy, Súng phun lửa, Súng cối, Tháp gia cố, Tháp điện chuỗi, Tháp phóng lưới
- Ô nhỏ xây được: 329 (4 ô nhỏ = 1 ô xây). Đặt tự do ở mọi cấp tường (GDD 4.5)

Ý đồ bố cục:
- Hai lối: lối bắc len qua bãi container, gấp khúc ba lần rồi đâm vào mặt bắc tiền đồn. Lối tây đi trên cầu gỗ nổi, lượn chữ U giữa mặt nước rồi đâm vào mặt tây.
- Tiền đồn nhỏ nằm trên bến phía đông, hai mặt tường chịu hai lối. Cầu tàu giữa vòng chữ U xây được: đứng đó bắn được cả ba đoạn cầu.
- Lối tây gần như chỉ có cầu gỗ: hổ sáp lao rất nhanh trên đoạn thẳng, nên đặt súng máy hoặc tháp lưới ở hai đầu chữ U.

## File

| File | Nội dung | Kích thước |
|---|---|---|
| `map_harbor_background.png` | Ảnh nền, không có tường | 2560×1536 |
| `map_harbor_wall_lv0.png` | Tường cấp 0: Rào phế liệu | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv1.png` | Tường cấp 1: Tường bê tông | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv2.png` | Tường cấp 2: Thép gia cố | 2560×1536, nền trong suốt |
| `map_harbor_wall_lv3.png` | Tường cấp 3: Tường điện | 2560×1536, nền trong suốt |
| `map_harbor_layout.json` | Lưới ô, đường đi, vùng xây, đạo cụ, đèn, điểm hoạt ảnh nền | |

## Thông số Unity
- Sprite Single, Pixels Per Unit = 128, pivot Bottom Left, đặt mọi lớp ở (0, 0). Bản đồ rộng 20×12 unit
- Chỉ bật một lớp tường, đúng cấp tường hiện tại
- Lớp tường cấp 3 có đèn trên trụ: thêm Light 2D theo `lights` khi bật lớp đó

## Hiệu ứng động (code làm, không có trong PNG)
- Đèn ban đêm: 22 nguồn sáng (`lights`), có đèn nháy (`blinkMs`)
- Đèn hiệu nhấp nháy đỏ: 3 (`beacons`)
- Quạ đậu, nhảy, bay đi khi quái tới gần: 28 chỗ đậu (`ambient.crowPerches`)
- Tàu đắm (đạo cụ `landmark`, góc đông bắc): lửa cháy âm ỉ ở chỗ gãy giữa hai nửa tàu, cột khói đen bốc lên và trôi về tây, khói mỏng từ ống khói, tàn lửa bay lên, cứ khoảng 3 giây tóe một chùm tia lửa
- Quanh tàu: sóng đập tung bọt ở mũi và đuôi, thùng phuy và tấm ván dập dềnh, vệt sáng lấp lánh trôi trên vệt dầu. Ban đêm ánh lửa hắt cam lên thân tàu (có sẵn trong `lights`)
- Tia nắng xiên chậm trôi qua bản đồ vào ban ngày
- Trong tiền đồn: người đi lại giữa các lều, một lính gác đi tuần trên tường (ban đêm cầm đèn)

## Đạo cụ
Hiện tên khi rê chuột. `blocksBuilding` = ô đó không xây được.

| Đạo cụ | Ghi chú |
|---|---|
| Tàu hàng đắm | Cảnh nền ở cửa cảng, chỉ để trang trí, không ảnh hưởng lối chơi. |
| Cần cẩu | Cần cẩu bến cảng (GDD 6.2). |
