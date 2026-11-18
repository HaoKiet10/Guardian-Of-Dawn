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

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_heat_decoy_t0_base_active.png` | 0 | Base | active | 1 hàng × 4 frame | 512×128 |
| `tower_heat_decoy_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t0_base_cooldown.png` | 0 | Base | cooldown | 1 hàng × 4 frame | 512×128 |
| `tower_heat_decoy_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_heat_decoy_t1_base_active.png` | 1 | Base | active | 1 hàng × 4 frame | 512×128 |
| `tower_heat_decoy_t1_base_cooldown.png` | 1 | Base | cooldown | 1 hàng × 4 frame | 512×128 |
| `tower_heat_decoy_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_heat_decoy_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t2_base_active.png` | 2 | Base | active | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t2_base_cooldown.png` | 2 | Base | cooldown | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_heat_decoy_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_heat_decoy_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: lõi quá nhiệt nổ, cánh san hô văng, tàn lửa hổ phách. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/heat_decoy.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 heat_decoy`.

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
