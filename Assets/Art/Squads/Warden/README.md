# Lính trấn thủ (Warden)

Xuất hiện: Mở khóa cùng R03 · đứng cố định trên tường thành

## Hình dáng
Thiết kế chốt: `Assets/Art/_ArtDirection/sheets/squads_concept_final.png`
- Người đàn ông lớn tuổi, da sẫm, râu ngắn bạc; dáng chắc, đứng vững
- Quân phục xanh xám, áo giáp xám thép, sọc cam trên mũ, kính vàng hổ phách lật lên (thấy rõ mặt)
- Áo choàng chống nắng trắng lạnh `#eef2f5` dài tới gối
- Khiên chữ nhật lớn viền sọc vàng đen, súng trường ngắn

## File

| File | Tư thế | Ghi chú |
|---|---|---|
| `squad_warden_idle.png` | đứng gác, khiên dựng bên cạnh | dùng cho idle, đi, chết |
| `squad_warden_fire.png` | cắm khiên, súng tì lên mép khiên | dùng cho bắn (Unity thêm giật súng + chớp đầu nòng) |
| `squad_warden_skill_hold.png` | Giữ vững: đập khiên xuống đất, khiên phát sáng vàng | giữ suốt thời gian kỹ năng |
| `squad_warden_tar_trap.png` | Bẫy hắc ín (R06) | sprite cũ, 1 hàng × 4 frame, pivot Center |

## Thông số Unity
- Mỗi file là một tư thế tĩnh: 1 cột × 3 hàng ô 128×128 (128×384), Pixels Per Unit = 128
- Hàng 0 = S (về phía camera), hàng 1 = E (quay phải), hàng 2 = N (quay đi). Hướng W dùng hàng E + flipX
- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô 16 px; bóng đổ mềm đã vẽ sẵn trong sprite
- Cùng một tỉ lệ cho mọi tư thế của một người lính (theo chiều cao tư thế idle hướng S ≈ 53 px), nên khi lao tới hay khom người thân không bị co lại
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu
- Chuyển động (thở, đi, giật súng, ngã, mờ dần) do Unity làm từ các tư thế này, không vẽ từng frame

## Làm lại
Ảnh gốc từ Google Flow nằm ở `Assets/Art/_ArtDirection/squad_raw/` (prompt: `Docs/Art/Specs/squad-sprite-prompts.md`).
Dựng lại sprite: `python Tools/ArtGen/build_squads_from_poses.py --only warden`
