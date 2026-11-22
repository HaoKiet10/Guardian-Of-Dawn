# Trùm 2 – Hổ Sáp Đầu Đàn (AlphaTiger)

Xuất hiện: Bản đồ 2, ngày 10

## Hình
- Bảng tư thế gốc: `Tools/ArtGen/source/wax_poses/alpha_tiger.png` – vẽ bằng AI (ChatGPT) theo hình đã chốt `Assets/Art/_ArtDirection/options/gothic_v5/ingame_sprites/src_alpha_tiger.png`, nền xanh lá
- Mọi frame là hình vẽ thật: `Tools/ArtGen/build_wax_from_poses.py` chỉ tách nền, căn chân, giữ frame, và dịch/co nhẹ cả hình (nhún, lao tới, nảy lùi, nháy trắng, mờ dần) – không bẻ cong hình
- Hàng S = hình vẽ (quay xuống trái), hàng E = lật ngang (quay phải), hàng N = giống S (chưa có hình nhìn sau)

## File

| File | Bố cục | fps | Lặp | Frame trúng | Ghi chú |
|---|---|---|---|---|---|
| `wax_alpha_tiger_walk.png` | 3 hàng (S, E, N) × 8 frame | 10 | có | – | đi: 4 tư thế vẽ tay, mỗi tư thế giữ 2 frame với nhịp nhún |
| `wax_alpha_tiger_attack.png` | 3 hàng (S, E, N) × 7 frame | 12 | không | 3 | lấy đà → giơ cao (giữ) → đánh; frame 3 = lúc trúng |
| `wax_alpha_tiger_hit.png` | 3 hàng (S, E, N) × 4 frame | 14 | không | 0 | tư thế trúng đòn (vẽ tay), nháy trắng, nảy lùi |
| `wax_alpha_tiger_die.png` | 3 hàng (S, E, N) × 7 frame | 16 | không | – | 3 giai đoạn tan chảy (vẽ tay) rồi lún và mờ dần; 0,44 giây |
| `wax_alpha_tiger_crouch.png` | 3 hàng (S, E, N) × 6 frame | 10 | có | – | Vồ – cảnh báo: cúi người rung, lặp trong 2 giây |
| `wax_alpha_tiger_pounce.png` | 3 hàng (S, E, N) × 6 frame | 10 | không | 5 | Vồ – bật nhảy (hình giữa không trung); code dời vị trí theo cung, frame 5 = chạm đất |
| `wax_alpha_tiger_headbutt.png` | 3 hàng (S, E, N) × 6 frame | 10 | không | 2 | Húc tường: frame 0-1 cúi đầu (giữ 1,5 giây), frame 2 = lúc trúng |
| `wax_alpha_tiger_roar.png` | 3 hàng (S, E, N) × 6 frame | 8 | không | 2 | Gọi bầy: gầm, code triệu hồi 4–6 hổ con ở frame 2 |

## Thông số Unity
- Ô sprite 256×256, Pixels Per Unit = 128 (1 ô xây = 1 unit); con vật cao khoảng 219 px
- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô 32 px
- Hàng 0 = S, hàng 1 = E, hàng 2 = N; hướng W dùng hàng E + flipX
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. Đổi kích thước ô thì chạy Tools > Units > Reapply Sprite Import Settings
- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite
- Số frame, fps, frame trúng của mọi con: `Assets/Art/Wax/anim_manifest.json`

Dựng lại: `python3 Tools/ArtGen/build_wax_from_poses.py --only AlphaTiger`
