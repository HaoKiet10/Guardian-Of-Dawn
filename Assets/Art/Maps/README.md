# Bản đồ (Maps)

Mỗi folder là một bản đồ, gồm ảnh nền, 4 lớp tường theo cấp, file layout JSON và `README.md` ghi bố cục, thông số Unity và các hiệu ứng động cần code.

Bản mẫu chạy được (quái, tháp tự bắn, ngày/đêm): `Docs/Final Project/Guardian of Dawn - Map Prototype.html`, mở bằng trình duyệt.

## Quy cách chung
- Góc 3/4 từ trên cao, phong cách hoạt hình vẽ tay: viền tím than đậm, tô bóng mềm, ánh sáng từ trên bên trái
- Cùng tỉ lệ với sprite tháp: Pixels Per Unit = 128, **1 ô xây = 1 unit = 128 px**
- Bản đồ là lưới 40×24 ô nhỏ. 2×2 ô nhỏ = 1 ô xây, nên mỗi bản đồ rộng **20×12 unit**, ảnh **2560×1536 px**
- Đường đi rộng 2 ô nhỏ (1 unit). Tháp chiếm 1 ô xây
- `Assets/Editor/MapSpriteImporter.cs` tự đặt thông số import khi PNG được import lần đầu: Sprite Single, PPU 128, pivot Bottom Left, Bilinear, Compression None, không mipmap, Max Size 4096. Muốn áp lại: Tools > Maps > Reapply Sprite Import Settings
- Hình hiện tại dựng bằng code từ bản mẫu. Người vẽ bản thật giữ nguyên kích thước ảnh và vị trí đường đi, tường để thay thẳng vào

## Các lớp trong một bản đồ

| File | Nội dung | Đặt trong scene |
|---|---|---|
| `map_<tên>_background.png` | Mặt đất, đường, nước, nhà, cây, đạo cụ, tiền đồn. Không có tường | Sprite Renderer ở (0, 0), sorting thấp nhất |
| `map_<tên>_wall_lv0..3.png` | Tường thành theo cấp 0 → 3, nền trong suốt, cùng khung với ảnh nền | Cùng vị trí (0, 0). Chỉ bật lớp đúng cấp tường hiện tại |
| `map_<tên>_layout.json` | Lưới ô, đường đi, vùng xây theo cấp tường, đạo cụ kể chuyện, vị trí đèn và hiệu ứng | Đọc bằng code khi dựng màn |

Thứ tự vẽ: ảnh nền → lớp tường → tháp, quái, hiệu ứng (sort theo trục Y như tháp).

## layout.json
- Toạ độ tính bằng unit, gốc ở góc dưới trái, trục y hướng lên: khớp với ảnh nền đặt ở (0, 0)
- `grid`: 24 dòng × 40 ký tự, dòng đầu là hàng trên cùng. Nghĩa từng ký tự nằm trong `gridLegend`
- `routes`: điểm giữa đường đi theo thứ tự quái đi, từ điểm xuất hiện tới tường
- `buildZone.masksByWallLevel[cấp]`: 24 dòng chuỗi `0/1`, `1` là ô nhỏ xây được. Một ô xây (1 unit) hợp lệ khi đủ 2×2 ô nhỏ đều là `1`
- `props`: đạo cụ kể chuyện (tên, đoạn chữ hiện khi rê chuột, `hope` = chi tiết hy vọng trong tiền đồn, `blocksBuilding`)
- `lights`, `fires`, `lanterns`, `beacons`: dùng cho Light 2D ban đêm (màu `r,g,b`, bán kính tính bằng unit)
- `ambient`: điểm cho hoạt ảnh nền: cửa sổ có người ngó ra, khói từ mái sập, chỗ quạ đậu, giọt sáp, nắp cống bốc hơi, biển neon, hologram

Hiện chưa có folder bản đồ nào. Các bản đồ kiểu cũ đã bỏ; ảnh của 5 bản đồ mới (Ngoại ô, Cầu cảng, Phố cổ đổ nát, Đồng bằng trắng, Đài thiên văn) sẽ được xuất lại từ bản mẫu theo quy cách trên.
