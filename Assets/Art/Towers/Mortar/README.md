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

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_mortar_base_idle.png` | Base | idle, đèn hổ phách trên thùng đạn nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_mortar_base_fire.png` | Base | bắn ở frame 0: chớp lửa, nòng tụt 4/6/4/2/1/0 px, khói phụt rồi tan, bụi chân bao cát | 1 hàng × 6 frame | 12 | 768×128 |
| `tower_mortar_base_build.png` | Base | build, chạy 1 lần | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_mortar_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_mortar_base_upgrade1.png` | Base | phụ kiện bậc 1: lớp bao cát thứ ba nửa sau, hai tấm thép sọc vàng phía trước | 1 ô | - | 128×128 |
| `tower_mortar_base_upgrade2.png` | Base | phụ kiện bậc 2: ống ngắm quang học, cột ăng ten đèn đỏ | 1 ô | - | 128×128 |
| `vfx_mortar_shell.png` | VFX | quả đạn cối, đầu đạn bên phải, xoay quanh trục | 1 hàng × 4 frame | 16 | 128×32 (ô 32×32) |
| `vfx_mortar_blast.png` | VFX | nổ trên đất: chớp, cầu lửa, vòng xung kích dẹt 0.72, khói, vết cháy | 1 hàng × 6 frame | 14 | 576×96 (ô 96×96) |
| `vfx_mortar_target.png` | VFX | vòng đánh dấu điểm rơi, đỏ / vàng | 1 hàng × 2 frame | 6 | 192×64 (ô 96×64) |

`_preview_tower.png` chỉ để xem nhanh (cấp 0, bậc 1, bậc 2, bậc 2 đang bắn), không import.

- Build: cọc và dây đánh dấu, đổ bệ và xếp nửa sau lớp bao cát đầu, xong lớp một và thùng đạn, xong lớp hai và đế cối, frame 4 thả nòng xuống, frame 5 giống idle.
- Destroy: chớp trắng, nứt, nòng bật ngửa và bao cát văng, khói, rồi đống đổ nát (bao cát rải rác, nòng đồng nằm nghiêng, thùng đạn gãy).
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base cùng pivot. Bậc 2 gắn chồng lên bậc 1. Phụ kiện không gắn lên nòng nên không lệch khi nòng giật.

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
