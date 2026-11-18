# Tháp bắn tỉa (SniperNest)

> **Đề xuất, chưa có trong GDD.** Tháp thứ 12. Cần thêm vào GDD mục 4.6 (công trình, bảng khắc chế) và mạng nghiên cứu trước khi chốt.

Mở khóa (đề xuất): nút R25 "Xạ thủ", nhánh Sinh tồn tầng 2, cần R03 + M2

Bản mẫu xem trực tiếp: https://claude.ai/artifact/Mt3iJ1wchdhxH4w36ixM2a

## Vai trò
- Tầm xa nhất, bắn rất chậm (khoảng 1 phát mỗi 2 giây), 1 mục tiêu, sát thương cao
- Tự ưu tiên Dị Thể Sáp đặc biệt: Sáp hồi phục, Sáp kích động, Bậc 4 thấu kính. Không có thì bắn con đi xa nhất
- Yếu trước Sáp vụn, bầy đông, Sáp gương (phản đạn đơn mục tiêu)
- Nạp đạn sau mỗi 5 phát

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Xạ thủ mặc đồ bảo hộ trắng `#eef2f5`, sọc cam `#ff8a3d`, kính mũ vàng `#ffc94a`, không lộ mặt (người chỉ ra nắng được nhờ nghiên cứu R03).
Súng vẽ kiểu súng bắn tỉa chung, không sao chép mẫu súng thật có thương hiệu.

## Lớp sprite
- `Base`: chòi canh 4 chân gỗ, thang, sàn ván, bao cát chữ U (mặt trước để trống nên không che xạ thủ). Không đổi theo hướng
- `Gunner`: người xạ thủ cùng khẩu súng, vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang). Thay cho lớp `Head` của các tháp máy, luôn vẽ đè lên `Base`

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_sniper_nest_gunner_aim.png` | chung | Gunner | aim | 5 hàng (S, SE, E, NE, N) × 3 frame | 384×640 |
| `tower_sniper_nest_gunner_fire.png` | chung | Gunner | fire | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_sniper_nest_gunner_idle.png` | chung | Gunner | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_sniper_nest_gunner_reload.png` | chung | Gunner | reload | 5 hàng (S, SE, E, NE, N) × 4 frame | 512×640 |
| `tower_sniper_nest_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_sniper_nest_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_sniper_nest_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_sniper_nest_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_sniper_nest_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_sniper_nest_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_sniper_nest_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_sniper_nest_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_sniper_nest_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: ống ngắm lóe, ván gỗ và lưới ngụy trang rơi, bụi gỗ. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/sniper_nest.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 sniper_nest`.

## Nhịp bắn
Tìm hướng (0.12 s mỗi nấc) → `aim` 0.375 s rồi giữ frame cuối tới 0.975 s → `fire` 0.4 s → giữ tư thế 1.0 s (frame cuối của `fire`).
Mục tiêu kế tiếp cùng hướng thì bỏ qua bước nâng súng. Sau mỗi 5 phát chạy `reload` 0.8 s.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Gunner: pivot Center (0.5, 0.5), `localPosition = (0, 0.244)` so với Base (31 px), sorting order cao hơn Base
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (VFX 32×32), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: chớp đầu nòng, tia lửa khi trúng
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
