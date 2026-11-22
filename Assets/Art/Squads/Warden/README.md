# Lính trấn thủ (Warden)

Xuất hiện: Mở khóa cùng R03 · đứng cố định trên tường thành

## Hình dáng
- Đồ bảo hộ trắng, dải cam ngang ngực, kính mũ vàng, sọc cam trên đỉnh mũ; khiên chống bạo động (tay trái) và súng trường (tay phải).
- Góc 3/4 từ trên cao, ánh sáng từ trên bên trái, viền tím than `#2c2240`, mỗi màu 3 tông (cùng quy ước với sprite tháp và bản đồ)

## File (placeholder dựng bằng code)

| File | Bố cục | fps | Lặp | Ghi chú |
|---|---|---|---|---|
| `squad_warden_idle.png` | 3 hàng (S, E, N) × 4 frame | 4 | có | thở |
| `squad_warden_walk.png` | 3 hàng (S, E, N) × 6 frame | 10 | có | đi |
| `squad_warden_fire.png` | 3 hàng (S, E, N) × 4 frame | 12 | có | bắn; chớp đầu nòng vẽ sẵn ở frame 1-2 |
| `squad_warden_skill_hold.png` | 3 hàng (S, E, N) × 6 frame | 10 | không | Giữ vững: cắm khiên xuống, khiên phát sáng (giữ frame 3-4 khi kỹ năng còn hiệu lực) |
| `squad_warden_die.png` | 3 hàng (S, E, N) × 6 frame | 10 | không | ngã xuống |

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128 (1 ô xây = 1 unit)
- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô 16 px
- Hàng 0 = S (về phía camera), hàng 1 = E (quay phải), hàng 2 = N (quay đi). Hướng W dùng hàng E + flipX
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 90°)` (trục y của Unity hướng lên): 0 = E, 1 = N, -1 = S, ±2 = W
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. Muốn áp lại: Tools > Units > Reapply Sprite Import Settings
- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite

## Thay bằng bản vẽ thật
Giữ nguyên kích thước ô, vị trí chân (pivot), số hàng và số frame để thay thẳng vào. Muốn đổi số frame thì sửa luôn bảng này và báo người code.
Dựng lại placeholder: `python3 Tools/ArtGen/gen_units.py --only Warden`

## Sprite phụ

| File | Bố cục | fps | Ô | Ghi chú |
|---|---|---|---|---|
| `squad_warden_tar_trap.png` | 1 hàng × 4 frame | 6 | 128×128 | Bẫy hắc ín (nhánh đặt bẫy, R06): vũng hắc ín sủi bọt, lặp; pivot Center |
