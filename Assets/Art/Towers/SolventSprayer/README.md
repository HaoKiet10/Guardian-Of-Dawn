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

## File đã có (placeholder dựng bằng code)

| File | Lớp | Nội dung | Bố cục | fps | Kích thước |
|---|---|---|---|---|---|
| `tower_solvent_sprayer_base_idle.png` | Base | idle, đèn trạng thái nháy, kim áp suất nhích | 1 hàng × 2 frame | 2 | 256×128 |
| `tower_solvent_sprayer_base_build.png` | Base | build, chạy 1 lần | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_solvent_sprayer_base_destroy.png` | Base | destroy, frame 5 = đống đổ nát có vệt dung môi tràn | 1 hàng × 6 frame | 10 | 768×128 |
| `tower_solvent_sprayer_head_idle.png` | Head | idle, chất lỏng trong bình sóng sánh, frame 1 có bọt | 5 hàng × 2 frame | 2 | 256×640 |
| `tower_solvent_sprayer_head_spray.png` | Head | nén, phun, giật, nhỏ giọt | 5 hàng × 4 frame | frame 0 giữ 0.25 s, frame 1 đến 3 ở 10 | 512×640 |
| `tower_solvent_sprayer_base_upgrade1.png` | Base | phụ kiện bậc 1: thùng phuy thứ hai, hai can dung môi | 1 ô | không | 128×128 |
| `tower_solvent_sprayer_head_upgrade1.png` | Head | phụ kiện bậc 1: tấm chắn bắn tóe hai bên hộp bơm | 5 hàng × 1 | không | 128×640 |
| `tower_solvent_sprayer_base_upgrade2.png` | Base | phụ kiện bậc 2: bơm áp lực lớn, cột đèn cảnh báo cam | 1 ô | không | 128×128 |
| `tower_solvent_sprayer_head_upgrade2.png` | Head | phụ kiện bậc 2: vòi phụ bên hông, đèn cam trên nắp bình | 5 hàng × 1 | không | 128×640 |
| `vfx_solvent_glob.png` | VFX | khối dung môi bay, hướng sang phải | 1 hàng × 3 frame | 12, lặp khi bay | 96×32 (ô 32×32) |
| `vfx_solvent_puddle.png` | VFX | vũng trên mặt đất: 0 đến 2 bắn tóe khi rơi, 3 đến 5 sủi bọt | 1 hàng × 6 frame | 10 (0 đến 2, 1 lần), 6 (3 đến 5, lặp) | 768×64 (ô 128×64) |
| `vfx_melt.png` | VFX | sáp chảy giọt, bọt xanh, khói trên kẻ địch dính dung môi | 1 hàng × 3 frame | 8, lặp | 96×32 (ô 32×32) |
| `_preview_tower.png` | không | ảnh tự kiểm tra: tháp ghép đủ lớp 5 hướng, cấp 0 và bậc 2. Không import | 2 hàng × 5 | không | 640×256 |

**Thứ tự hàng trong sheet Head:** Nam (S), Đông Nam (SE), Đông (E), Đông Bắc (NE), Bắc (N).
Tây Nam, Tây, Tây Bắc dùng hàng SE, E, NE lật ngang (flipX).

- Build và destroy đã vẽ sẵn đầu phun hướng Đông Nam. Code ẩn Head khi bắt đầu phá hủy, bật Head thật sau frame cuối của build.
- Phụ kiện chỉ chứa phần nhìn thấy được, đặt đè lên Base hoặc Head. Bậc 2 gắn chồng lên bậc 1.
- Ở frame 1 của `head_spray`, khối dung môi vừa rời miệng vòi là một phần của sprite Head. Khối bay trên không là `vfx_solvent_glob`.

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
