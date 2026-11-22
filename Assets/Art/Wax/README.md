# Sprite Dị Thể Sáp (Wax)

Mỗi folder là một loại Dị Thể Sáp, gồm sprite sheet PNG và `README.md` ghi số frame, fps, pivot và ghi chú từng animation.

## Hình
- Cả 16 con có hình minh họa do AI (ChatGPT) vẽ theo style tháp và bản đồ của game: viền tím than `#2c2240`, tô bóng hoạt hình, ánh sáng từ trên bên trái, chất sáp nến trong mờ, hốc mắt có đốm lửa. Hình gốc (đã tách nền) nằm ở `Tools/ArtGen/source/wax/`
- Sprite sheet dựng từ hình đó bằng `Tools/ArtGen/gen_wax_from_art.py`: nhún khi đi, lấy đà và lao tới khi đánh, nháy trắng khi trúng đòn, tan chảy thành vũng khi chết, phát sáng hoặc rung cho kỹ năng
- **Tạm thời** mỗi con chỉ có một góc nhìn, nên 3 hàng hướng dùng chung một hình. Khi có hình nhìn ngang và nhìn sau, thêm `<tên>_e.png` / `<tên>_n.png` vào `Tools/ArtGen/source/wax/` rồi chạy lại script
- Ghi công: hình do AI tạo, cần ghi rõ trong bản nộp (GDD 13.4)

## Quy cách
- Pixels Per Unit = 128 (1 ô xây = 1 unit = 128 px). Quái nhỏ ô 64, quái thường ô 128, bậc 5 ô 192, trùm ô 256
- Mỗi sheet 3 hàng: S (về phía camera), E (quay phải), N (quay đi). W = hàng E lật ngang (flipX)
- Animation chung (GDD 7.8): `walk`, `attack`, `hit`, `die`. Một số con có thêm sheet kỹ năng (bảng dưới)
- Pivot ở chân: (0.5, 0.125). `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. Muốn áp lại: Tools > Units > Reapply Sprite Import Settings
- Bóng đổ mềm dưới chân đã có sẵn trong sprite

| Folder | Dị Thể Sáp | Bản đồ | Ô | Sheet kỹ năng |
|---|---|---|---|---|
| `Standard` | Bậc 1 – tiêu chuẩn | 1 → 5 | 128 | – |
| `Shard` | Sáp vụn (biến thể bậc 1) | 1 | 64 | – |
| `Primordial` | Trùm 1 – Sáp Nguyên Thủy | 1 (ngày 8) | 256 | `shed` (Bong tróc) |
| `Tiger` | Bậc 2 – hổ | 2 → 5 | 128 | – |
| `Crab` | Sáp vỏ cua (biến thể bậc 1) | 2 | 128 | – |
| `AlphaTiger` | Trùm 2 – Hổ Sáp Đầu Đàn | 2 (ngày 10) | 256 | `crouch`, `pounce`, `headbutt`, `roar` + `vfx_pounce_target` |
| `TigerCub` | Hổ con (trùm 2 gọi ra) | 2 | 64 | – |
| `Healer` | Bậc 3 – hồi phục | 3 → 5 | 128 | `heal` |
| `Spore` | Sáp bào tử (biến thể bậc 3) | 3 | 128 | – |
| `MotherTree` | Trùm 3 – Cây Sáp Mẹ | 3 (ngày 12) | 256 | `seed`, `heal_aura` |
| `Lens` | Bậc 4 – thấu kính | 4 → 5 | 128 | `focus` (Hội tụ) |
| `Mirror` | Sáp gương (biến thể bậc 4) | 4 | 128 | – |
| `Prism` | Trùm 4 – Lăng Kính Sống | 4 (ngày 12) | 256 | `focus` |
| `Ultimate` | Bậc 5 – tối thượng | 5 | 192 | – |
| `Frenzy` | Sáp kích động (biến thể bậc 2) | 5 | 128 | `howl` |
| `Myriad` | Trùm 5 – Khối Sáp Vạn Người | 5 (ngày 15) | 256 | `myriad`, `last_heart` |

Danh mục quái theo bản đồ (có hình và mô tả): xem bản PDF đã xuất từ GDD v2.0.

## Không vẽ vào sprite quái
- Icon trạng thái trên đầu (cháy, băng, dung môi, bị trói): dùng chung, đặt riêng
- Thanh máu quái và thanh máu trùm: thuộc UI
