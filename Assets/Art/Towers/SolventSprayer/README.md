# Tháp phun dung môi (SolventSprayer)

Mở khóa: Nghiên cứu R22 (tầng 3), cần R11 + M3

Bản mẫu xem trực tiếp: https://claude.ai/artifact/X81ueDkXmjZCb38eQsy519

## Vai trò
Phun một khối dung môi bay vòng cầu xuống đường, thành vũng tồn tại 5 giây. Dị Thể Sáp đi qua vũng mất máu theo thời gian, không hồi máu được và bị tan giáp.
Khắc chế: bậc 3 hồi phục, bậc 5, Sáp bào tử (chết khi dính dung môi thì không vỡ ra Sáp vụn), Sáp vỏ cua (mai tan dần). Yếu: bậc 2 hổ (đi qua quá nhanh).

## Góc nhìn và style
Giống Súng máy (MG-01): góc 3/4 từ trên cao, màu sáng, viền tím than `#2c2240`, 3 tông mỗi màu, ánh sáng từ trên bên trái.
Màu riêng: thép sơn xanh ngọc `#35c2a4`, dung môi xanh acid phát sáng `#a6ff4d`, thùng hóa chất trắng `#eef2ee` có nhãn cảnh báo vàng.

## Lớp sprite
- `Base`: bệ bê tông, sàn thép xanh ngọc, thùng phuy hóa chất cao ở góc sau bên trái, ống dẫn có van đỏ, đồng hồ áp suất. Không đổi theo hướng
- `Head`: hộp bơm có piston, bình dung môi trong suốt phía sau, vòi phun cong kiểu cổ ngỗng phía trước. Vẽ sẵn 8 hướng (5 vẽ + 3 lật ngang)

## File đã có (mockup dựng bằng code, bản 2026-11-18)

Mỗi cấp là **một thân riêng** (`t0` / `t1` / `t2`), không còn ảnh phụ kiện `upgrade1` / `upgrade2` đặt đè. Mỗi cấp to hơn khoảng 15%, lên vật liệu (đá → đai thép tán đinh → giáp) và thêm ít nhất một chi tiết đỉnh mới. `tN_base_upgrade` là hoạt cảnh nâng từ cấp N-1 lên cấp N (frame cuối = idle cấp N).

| File | Cấp | Lớp | Hoạt cảnh | Bố cục | Kích thước |
|---|---|---|---|---|---|
| `tower_solvent_sprayer_t0_base_build.png` | 0 | Base | build | 1 hàng × 6 frame | 768×128 |
| `tower_solvent_sprayer_t0_base_destroy.png` | 0 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_solvent_sprayer_t0_base_idle.png` | 0 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_solvent_sprayer_t0_head_idle.png` | 0 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_solvent_sprayer_t0_head_spray.png` | 0 | Head | spray | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |
| `tower_solvent_sprayer_t1_base_destroy.png` | 1 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_solvent_sprayer_t1_base_idle.png` | 1 | Base | idle | 1 hàng × 2 frame | 256×128 |
| `tower_solvent_sprayer_t1_base_upgrade.png` | 1 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_solvent_sprayer_t1_head_idle.png` | 1 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_solvent_sprayer_t1_head_spray.png` | 1 | Head | spray | 5 hàng (S, SE, E, NE, N) × 6 frame | 768×640 |
| `tower_solvent_sprayer_t2_base_destroy.png` | 2 | Base | destroy | 1 hàng × 6 frame | 768×128 |
| `tower_solvent_sprayer_t2_base_idle.png` | 2 | Base | idle | 1 hàng × 4 frame | 512×128 |
| `tower_solvent_sprayer_t2_base_upgrade.png` | 2 | Base | upgrade | 1 hàng × 6 frame | 768×128 |
| `tower_solvent_sprayer_t2_head_idle.png` | 2 | Head | idle | 5 hàng (S, SE, E, NE, N) × 2 frame | 256×640 |
| `tower_solvent_sprayer_t2_head_spray.png` | 2 | Head | spray | 5 hàng (S, SE, E, NE, N) × 8 frame | 1024×640 |

- Destroy (mọi cấp): sập chung (chớp, nứt, sập, đống đổ nát) cộng hiệu ứng riêng của tháp: bồn vỡ, dung môi bắn tóe, vũng axit sủi bọt. Frame cuối = đống đổ nát.
- Ô 128×128, pivot Base (0.5, 0.375); Head/Gunner pivot Center. `TowerSpriteImporter` tự cắt ô khi import.
- `Preview~/_preview_tower.png` chỉ để xem nhanh, Unity bỏ qua thư mục có dấu `~`.
- Nguồn: `Tools/TowerMockups/towers/solvent_sprayer.js`, xuất lại bằng `Tools/TowerMockups/export.ps1 solvent_sprayer`.

## Nhịp phun
Tìm hướng → `spray` frame 0 nén 0.25 s → frame 1 đến 3 phun 0.3 s (tạo glob ở frame 1) → bơm lại 1.5 s (dùng `idle`), khoảng 1 vũng mỗi 2 giây.
Tháp nhắm vào điểm trên đường phía trước mục tiêu đi xa nhất (vị trí sau khoảng 0.9 giây đi bộ). Glob bay vòng cầu 0.55 giây, đỉnh cao khoảng 70 px, code xoay sprite theo vận tốc.
Vũng tồn tại 5 giây: frame 0 đến 2 khi chạm đất, lặp 3 đến 5, mờ dần ở 0.6 giây cuối. Vùng tác dụng là ellipse khoảng 76×50 px (bán kính 38 × 25).
`vfx_melt` hiện trên Dị Thể Sáp đang trong vũng và 0.5 giây sau khi ra khỏi vũng, kéo giãn theo kích thước con đó.

## Thông số Unity
- Ô sprite 128×128, Pixels Per Unit = 128
- Base: pivot Custom (0.5, 0.375), tâm ô xây trên mặt đất
- Head: pivot Center (0.5, 0.5), `localPosition = (0, 0.146)` so với Base (19 px)
- Chọn hướng: `k = round(atan2(dy / 0.72, dx) / 45°)`, k = 3, 4, 5 dùng sprite của 1, 0, 7 với flipX
- Miệng vòi (để tạo glob): cách pivot Head 47 px theo hướng đang quay, cao thêm khoảng 19 px trên màn hình
- Vũng: pivot Center (0.5, 0.5), đặt đúng điểm rơi, sorting dưới Dị Thể Sáp
- Thứ tự vẽ: Transparency Sort Axis (0, 1, 0), Sprite Sort Point = Pivot
- Import: Sprite Mode Multiple, Slice Grid By Cell Size 128×128 (glob và melt 32×32, puddle 128×64), Filter Bilinear, Compression None

## Không vẽ vào sprite tháp
- VFX riêng: khối dung môi bay, vũng dung môi, sáp tan trên kẻ địch
- UI trận: ký hiệu cấm hồi, chữ "không vỡ", thanh máu, thanh độ dày mai của Sáp vỏ cua
- Mai Sáp vỏ cua mỏng dần và bạc màu là việc của sprite hoặc shader kẻ địch
- Dùng chung trong `../_Shared/`: vòng bị bão nhắm, tint và hơi nóng khi quá nhiệt, bóng đổ
