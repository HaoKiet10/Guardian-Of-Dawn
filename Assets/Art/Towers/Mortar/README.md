# Súng cối (Mortar)

Mở khóa: Có sẵn từ đầu

Bản mẫu xem trực tiếp: https://claude.ai/artifact/VjAVXxjQ1ysvcwEhuphJGX

## Vai trò
Bắn tầm xa, đạn bay vòng cầu, sát thương lan trên mặt đất.
Khắc chế: bậc 1, bậc 3 hồi phục (đứng yên khi hồi máu), Sáp vụn, Sáp vỏ cua (đạn rơi từ trên xuống), Sáp gương (sát thương lan không bị phản).
Yếu: bậc 2 hổ, vì đạn bay 1.1 giây nên con hổ đã chạy ra khỏi vùng nổ.

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: bao cát vàng đất `#eabb5c`, nòng đồng `#cc823f`. Silhouette là ụ bao cát tròn thấp với nòng cối to, ngắn, nghiêng lên phía trên bên phải.

## Lớp sprite
- `Base`: lớp duy nhất. Bệ bê tông tròn có sọc cảnh báo, hai lớp bao cát, đế cối, chân chống đôi, nòng cối đồng, thùng đạn mở nắp
- Không có `Head`: nòng luôn chĩa lên trời, đạn đi vòng cầu nên tháp không xoay theo hướng

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_mortar_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_mortar_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_mortar_t0_base_fire.png` | 0 | Base | fire | 1 hàng × 6 frame | 768×128 |
| `tower_mortar_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_mortar_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_mortar_t1_base_fire.png` | 1 | Base | fire | 1 hàng × 8 frame | 1024×128 |
| `tower_mortar_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_mortar_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_mortar_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_mortar_t2_base_fire.png` | 2 | Base | fire | 1 hàng × 8 frame | 1024×128 |
| `tower_mortar_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_mortar_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: đạn trong nòng nổ ngược, cầu lửa bốc lên từ miệng nòng. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/mortar.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 mortar`.

## Nhịp hoạt động
Chọn điểm rơi → `fire` 0.5 s (quả đạn sinh ở frame 0) → nạp 1.6 s (dùng `idle`), khoảng 1 phát mỗi 2.1 giây.
- Chọn điểm: ưu tiên Sáp hồi phục đang đứng hồi máu, nếu không thì chỗ có nhiều Dị Thể Sáp nhất trong bán kính nổ. Ngắm vào chỗ mục tiêu đang đứng, không đoán trước.
- Đường bay do code tính, thời gian bay T = 1.1 s:
  - vị trí trên đất `g(t) = lerp(muzzle, target, t)`
  - độ cao `h(t) = h0 * (1 - t) + 4 * H * t * (1 - t)`, H = 160 px, h0 = độ cao miệng nòng
  - vẽ ở `y = g.y + h * 0.78` (trục y Unity hướng lên), sprite đạn xoay theo hướng vận tốc trên màn hình
- Bóng đạn trên đất: ellipse dẹt 0.72, rộng 4 → 11 px, độ mờ 0.15 → 0.4 theo `1 - h / 200`.
- Vòng đánh dấu nhấp nháy ở điểm rơi từ lúc bắn tới lúc nổ.
- Bán kính nổ 52 px (0.41 unit), ellipse dẹt 0.72. Blast và target vẽ nhỏ hơn rồi scale 1.3 lần để khớp bán kính này.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Điểm sinh đạn (miệng nòng lúc nghỉ): `localPosition = (0.073, 0.362)` so với Base
- `vfx_mortar_shell`: pivot Center, scale 1
- `vfx_mortar_blast`: pivot Custom (0.5, 0.333) = tâm mặt đất (48, 64) của ô, scale 1.3
- `vfx_mortar_target`: pivot Center, scale 1.3, sorting dưới Dị Thể Sáp
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (shell 32×32, blast 96×96, target 96×64), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: quả đạn, vụ nổ, vòng đánh dấu điểm rơi, bóng đạn (code vẽ ellipse)
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
