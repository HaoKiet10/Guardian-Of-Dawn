# Mồi nhiệt (HeatDecoy)

Mở khóa: Nghiên cứu R23 (tầng 3), cần R21 + M3

Bản mẫu xem trực tiếp: https://claude.ai/artifact/BzXgmhcQQtxsy3Je7Bkous

## Vai trò
- Tỏa hơi ấm giả như sự sống. Dị Thể Sáp trong bán kính rời đường đi, kéo về phía mồi và đứng vây quanh nó, ngay trong vùng hỏa lực của tháp khác
- Không gây sát thương, không bị tấn công. Sau vài giây hoạt động phải nguội lại, Dị Thể Sáp quay về đúng điểm đã rời đường rồi đi tiếp
- Khắc chế bậc 2 Sáp hổ (kéo lệch đường lao) và bậc 5 tối thượng (giữ xa tường)

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: lá tản nhiệt hồng san hô `#f2766b`, kim loại tối `#4e4862`, lõi nóng cam `#ff9a4a` sáng tới `#fff0c0`, lõi tắt đỏ rượu `#6e3442`.
Hình dáng: bệ bê tông tròn, vương miện 8 lá tản nhiệt quanh cột, trên cùng là quả cầu lõi có hình trái tim (gợi "sự sống giả").

## Lớp sprite
- `Base`: một lớp duy nhất, tháp không xoay nên không có `Head` và không có 8 hướng. Mọi animation nằm trên lớp này

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_heat_decoy_base_idle.png` | Base | sẵn sàng: lõi tắt lờ mờ, đèn xanh nháy | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_heat_decoy_base_active.png` | Base | hoạt động: lõi đập như tim, mép lá đỏ dần từ trong ra, đèn cam | 1 hàng × 4 frame | 6, lặp | 512×128 |
| `tower_heat_decoy_base_cooldown.png` | Base | nguội: lõi mờ dần, hơi nước, đèn đỏ. Chạy 1 lần rồi giữ frame 3 | 1 hàng × 4 frame | 4 | 512×128 |
| `tower_heat_decoy_base_build.png` | Base | build, frame 4 thả lõi xuống bằng dây | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_heat_decoy_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_heat_decoy_base_upgrade1.png` | Base | phụ kiện bậc 1: 8 lá tản nhiệt phụ, ống khói | 1 ô | không | 128×128 |
| `tower_heat_decoy_base_upgrade2.png` | Base | phụ kiện bậc 2: vòng phát nhiệt đồng, đèn hổ phách | 1 ô | không | 128×128 |
| `vfx_heat_wave.png` | VFX | vòng sóng nhiệt lan trên mặt đất, dẹt 0.72 | 1 hàng × 4 frame | 4 | 512×96 (ô 128×96) |
| `vfx_heat_lure.png` | VFX | tim nhỏ và sóng nhiệt trên đầu kẻ địch bị hút | 1 hàng × 2 frame | 4, lặp | 64×32 (ô 32×32) |
| `vfx_steam.png` | VFX | cụm hơi nước to dần rồi tan | 1 hàng × 3 frame | ~3 | 144×48 (ô 48×48) |
| `_preview_tower.png` | không | chỉ để xem: idle, active, cooldown, bậc 1, bậc 2 | 1 hàng × 5 | không | 640×128 |

- Build và destroy vẽ trên cùng lớp Base. Frame cuối của build giống hệt `base_idle` frame 0.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base. Bậc 2 gắn chồng lên bậc 1.
- `_preview_tower.png` không cần import vào game.

## Nhịp hoạt động
Sẵn sàng (`idle`, ít nhất 1 s) → tự bật khi có Dị Thể Sáp vào bán kính → `active` lặp 5 s → `cooldown` 4 s (chạy 1 lần ở 4 fps rồi giữ frame 3) → sẵn sàng.
- Trong lúc hoạt động: một `vfx_heat_wave` mỗi 1.25 s, `vfx_heat_lure` trên đầu mỗi con đang bị hút.
- Trong lúc nguội: sinh vài cụm `vfx_steam` trên lõi (thêm trên ống khói từ bậc 1), mỗi cụm bay lên khoảng 20 px.
- Con bị hút chọn một chỗ trên vòng đứng vây (khoảng 0.6 ô quanh tâm) gần hướng nó tới, không chồng lên con khác, đứng lắc lư và không đánh mồi.
- 5 s, 4 s, 1.25 s và bán kính là giá trị gợi ý, đặt trong data.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất. Không có lớp Head, không có localPosition con
- Bán kính thu hút: gợi ý 1.75 ô, elip x = R, y = R × 0.72
- `vfx_heat_wave`: pivot Center, đặt ở pivot Base, `localScale = R / 0.4375` (vòng lớn nhất trong ô rộng 56 px = 0.4375 unit), sort dưới tháp như vết trên mặt đất
- `vfx_heat_lure`: pivot Center, con của kẻ địch, đặt ngay trên đầu (khoảng 0.36 unit với Dị Thể Sáp thường)
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (heat_wave 128×96, heat_lure 32×32, steam 48×48), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: sóng nhiệt, dấu hiệu bị hút, hơi nước
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
