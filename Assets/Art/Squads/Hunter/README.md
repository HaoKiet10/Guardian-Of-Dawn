# Thợ săn (Hunter)

Xuất hiện: Mở khóa qua R04 · di chuyển, truy đuổi

## Hình dáng
Thiết kế chốt: `Assets/Art/_ArtDirection/sheets/squads_concept_final.png`
- Thanh niên da sáng; dáng gọn, nghiêng về trước
- Quân phục xanh xám, áo giáp xám thép, sọc cam trên mũ, kính vàng hổ phách lật lên (thấy rõ mặt)
- Áo choàng chống nắng trắng lạnh `#eef2f5` ngắn trên vai
- Súng trường dài có mũi tiêm dưới nòng; bình dung môi xanh acid `#a6ff4d` bên hông, ống dẫn vào súng

## File

| File | Tư thế | Ghi chú |
|---|---|---|
| `squad_hunter_idle.png` | cảnh giác, súng chéo trước người | dùng cho idle, đi/truy đuổi, chết |
| `squad_hunter_fire.png` | ngắm bắn | dùng cho bắn (Unity thêm giật súng + chớp đầu nòng) |
| `squad_hunter_skill_execute.png` | Hạ sát: lao tới đâm mũi tiêm, mũi tiêm phát sáng xanh | giữ trong lúc ra đòn |

## Thông số Unity
- Mỗi file là một tư thế tĩnh: 1 cột × 3 hàng ô 128×128 (128×384), Pixels Per Unit = 128
- Hàng 0 = S (về phía camera), hàng 1 = E (quay phải), hàng 2 = N (quay đi). Hướng W dùng hàng E + flipX
- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô 16 px; bóng đổ mềm đã vẽ sẵn trong sprite
- Cùng một tỉ lệ cho mọi tư thế của một người lính (theo chiều cao tư thế idle hướng S ≈ 53 px), nên khi lao tới hay khom người thân không bị co lại
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu
- Chuyển động (thở, đi, giật súng, ngã, mờ dần) do Unity làm từ các tư thế này, không vẽ từng frame

## Làm lại
Ảnh gốc từ Google Flow nằm ở `Assets/Art/_ArtDirection/squad_raw/` (prompt: `Docs/Art/Specs/squad-sprite-prompts.md`).
Dựng lại sprite: `python Tools/ArtGen/build_squads_from_poses.py --only hunter`
