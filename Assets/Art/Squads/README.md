# Sprite binh lính (Squads)

Mỗi folder là một loại lính, gồm sprite sheet PNG và `README.md` ghi số frame, fps, pivot và ghi chú từng animation.

- Góc nhìn 3/4 từ trên cao, ánh sáng từ trên bên trái, viền tím than `#2c2240`, mỗi màu 3 tông: cùng quy ước với sprite tháp và bản đồ
- Màu phe ta (GDD 8.1): đồ bảo hộ trắng `#eef2f5`, sọc cam `#ff8a3d`, kính mũ vàng `#ffc94a`, không lộ mặt
- Mỗi loại phân biệt được qua hình bóng, không chỉ qua màu: Lính trấn thủ có khiên lớn, Thợ săn có bình dung môi trên lưng và súng có lưỡi lê
- Ô 128×128, Pixels Per Unit = 128. Mỗi sprite là **một người lính**; code đặt 2–3 sprite gần nhau để thành một đội
- Mỗi sheet có 3 hàng theo hướng: S (về phía camera), E (quay phải), N (quay đi). W = hàng E lật ngang (flipX)
- Animation theo GDD 7.8: `idle`, `walk`, `fire`, kỹ năng chủ động, `die`
- Pivot ở chân: (0.5, 0.125). `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. Muốn áp lại: Tools > Units > Reapply Sprite Import Settings
- Hình hiện tại là placeholder dựng bằng `Tools/ArtGen/gen_units.py`. Người vẽ bản thật giữ nguyên kích thước ô, pivot, số hàng và số frame để thay thẳng vào

| Folder | Lính | Kỹ năng | Mốc |
|---|---|---|---|
| `Warden` | Lính trấn thủ | Giữ vững (`skill_hold`) + Bẫy hắc ín | 50% |
| `Hunter` | Thợ săn | Hạ sát (`skill_execute`) | 50% |
| `_Shared` | Dùng chung: vạch cấp bậc (`squad_rank.png`, 3 ô 32×32 = cấp 1, 2, 3) | – | 50% |

Chưa làm (mốc 70%): Công binh (kỹ năng Dựng khẩn cấp, sửa tường, xây lại).

## Không vẽ vào sprite lính
- Thanh máu và icon kỹ năng hồi chiêu: thuộc thẻ đội lính trên HUD
- Vạch cấp bậc: dùng `_Shared/squad_rank.png`, code đặt trên đầu đội
