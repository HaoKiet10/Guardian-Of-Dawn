# Trùm 5 – Khối Sáp Vạn Người (Myriad)

Xuất hiện: Bản đồ 5, ngày 15

## Hình
- Bảng tư thế gốc: `Tools/ArtGen/source/wax_poses/myriad.png` – vẽ bằng AI (ChatGPT) theo hình đã chốt `Assets/Art/_ArtDirection/options/gothic_v5/ingame_sprites/src_myriad.png`, nền xanh lá
- Mọi frame là hình vẽ thật: `Tools/ArtGen/build_wax_from_poses.py` chỉ tách nền, căn chân, giữ frame, và dịch/co nhẹ cả hình (nhún, lao tới, nảy lùi, nháy trắng, mờ dần) – không bẻ cong hình
- Hàng S = hình vẽ (quay xuống trái), hàng E = lật ngang (quay phải), hàng N = giống S (chưa có hình nhìn sau)

## File

| File | Bố cục | fps | Lặp | Frame trúng | Ghi chú |
|---|---|---|---|---|---|
| `wax_myriad_walk.png` | 3 hàng (S, E, N) × 8 frame | 10 | có | – | đi: 4 tư thế vẽ tay, mỗi tư thế giữ 2 frame với nhịp nhún |
| `wax_myriad_attack.png` | 3 hàng (S, E, N) × 7 frame | 12 | không | 3 | lấy đà → giơ cao (giữ) → đánh; frame 3 = lúc trúng |
| `wax_myriad_hit.png` | 3 hàng (S, E, N) × 4 frame | 14 | không | 0 | tư thế trúng đòn (vẽ tay), nháy trắng, nảy lùi |
| `wax_myriad_die.png` | 3 hàng (S, E, N) × 7 frame | 16 | không | – | 3 giai đoạn tan chảy (vẽ tay) rồi lún và mờ dần; 0,44 giây |
| `wax_myriad_absorb.png` | 3 hàng (S, E, N) × 6 frame | 8 | có | – | Hấp thụ: kéo xác về phía mình, lặp |
| `wax_myriad_scream.png` | 3 hàng (S, E, N) × 6 frame | 10 | có | – | Vạn người (66% và 33% máu): các khuôn mặt gào, rung; code sinh bầy |
| `wax_myriad_last_heart.png` | 3 hàng (S, E, N) × 6 frame | 8 | có | – | Trái tim cuối cùng (10% máu): vỏ nứt hóa cứng, tim nhật thực rực sáng, lặp |
| `wax_myriad_charge.png` | 3 hàng (S, E, N) × 4 frame | 10 | có | – | Lao về phía tường sau Trái tim cuối cùng, lặp |

## Thông số Unity
- Ô sprite 256×256, Pixels Per Unit = 128 (1 ô xây = 1 unit); con vật cao khoảng 213 px
- Pivot Custom (0.5, 0.125): chân nằm cách mép dưới ô 32 px
- Hàng 0 = S, hàng 1 = E, hàng 2 = N; hướng W dùng hàng E + flipX
- `Assets/Editor/UnitSpriteImporter.cs` tự cắt ô và đặt pivot khi import lần đầu. Đổi kích thước ô thì chạy Tools > Units > Reapply Sprite Import Settings
- Bóng đổ mềm dưới chân đã vẽ sẵn trong sprite
- Số frame, fps, frame trúng của mọi con: `Assets/Art/Wax/anim_manifest.json`

Dựng lại: `python3 Tools/ArtGen/build_wax_from_poses.py --only Myriad`
