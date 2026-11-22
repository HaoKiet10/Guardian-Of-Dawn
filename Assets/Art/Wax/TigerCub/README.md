# Hổ con (TigerCub)

Xuất hiện: Bản đồ 2 – trùm Hổ Sáp Đầu Đàn gọi ra

## Hình
- Bảng tư thế gốc: `Tools/ArtGen/source/wax_poses/tiger_cub.png` – vẽ bằng AI (ChatGPT) theo hình đã chốt `Assets/Art/_ArtDirection/options/gothic_v5/ingame_sprites/src_tiger_cub.png`, nền xanh lá
- Mọi frame là hình vẽ thật: `Tools/ArtGen/build_wax_from_poses.py` chỉ tách nền, căn chân, giữ frame, và dịch/co nhẹ cả hình (nhún, lao tới, nảy lùi, nháy trắng, mờ dần) – không bẻ cong hình
- Hàng S = hình vẽ (quay xuống trái), hàng E = lật ngang (quay phải), hàng N = giống S (chưa có hình nhìn sau)

## File

| File | Bố cục | fps | Lặp | Frame trúng | Ghi chú |
|---|---|---|---|---|---|
| `wax_tiger_cub_walk.png` | 3 hàng (S, E, N) × 8 frame | 10 | có | – | đi: 4 tư thế vẽ tay, mỗi tư thế giữ 2 frame với nhịp nhún |
| `wax_tiger_cub_attack.png` | 3 hàng (S, E, N) × 7 frame | 12 | không | 3 | lấy đà → giơ cao (giữ) → đánh; frame 3 = lúc trúng |
| `wax_tiger_cub_hit.png` | 3 hàng (S, E, N) × 4 frame | 14 | không | 0 | tư thế trúng đòn (vẽ tay), nháy trắng, nảy lùi |
| `wax_tiger_cub_die.png` | 3 hàng (S, E, N) × 7 frame | 16 | không | – | 3 giai đoạn tan chảy (vẽ tay) rồi lún và mờ dần; 0,44 giây |

## Thông số Unity
- Ô sprite 64×64, Pixels Per Unit = 128 (1 ô xây = 1 unit); con vật cao khoảng 46 px
- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô 8 px
- Hàng 0 = S, hàng 1 = E, hàng 2 = N; hướng W dùng hàng E + flipX
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. Đổi kích thước ô thì chạy Tools > Units > Reapply Sprite Import Settings
- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite
- Số frame, fps, frame trúng của mọi con: `Assets/Art/Wax/anim_manifest.json`

Dựng lại: `python3 Tools/ArtGen/build_wax_from_poses.py --only TigerCub`
