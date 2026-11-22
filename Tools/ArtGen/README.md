# ArtGen – dựng sprite sheet

- **Dị Thể Sáp** (`Assets/Art/Wax/`): `build_wax_from_poses.py` dựng sheet từ **bảng tư thế vẽ tay** (ChatGPT, nền xanh lá) trong `source/wax_poses/<tên>.png` – mỗi frame là một hình vẽ thật, script chỉ tách nền, căn chân, giữ frame và dịch/co nhẹ cả hình (không bẻ cong hình). Chạy `python3 Tools/ArtGen/build_wax_from_poses.py [--only Standard,Tiger] [--preview /tmp/prev]` (vài giây mỗi con); script cũng ghi `Assets/Art/Wax/anim_manifest.json` (số frame, fps, frame trúng). Bản sheet cũ (bẻ hình bằng `gen_wax_from_art.py`, không còn dùng) chỉ lưu ở máy trong `backup_old_wax/` (không đưa lên git)
- **Binh lính** (`Assets/Art/Squads/`): `gen_units.py` vẽ placeholder bằng code, cùng style tháp và bản đồ (góc 3/4, viền `#2c2240`, 3 tông màu, ánh sáng từ trên bên trái). Từ khi quái dùng hình AI, `gen_units.py` mặc định **không** đụng tới `Assets/Art/Wax/` (muốn dựng lại bản code cũ: `--legacy-wax`)
- **Hiệu ứng (VFX)** (`Assets/Art/VFX/`): `gen_vfx.py` vẽ bằng code toàn bộ hiệu ứng của Dị Thể Sáp (bước chân, trúng đòn, tan chảy, trạng thái cháy/băng/dung môi/lưới/chậm/hắc ín, biểu tượng trạng thái, kỹ năng, cảnh báo và kỹ năng trùm), viết luôn `vfx_manifest.json` và `README.md` trong folder đó. Chạy `python3 Tools/ArtGen/gen_vfx.py` (khoảng 1,5 phút)

- **Quái trong bản đồ prototype** (`Docs/Final Project/Guardian of Dawn - Map Prototype.html`): `embed_wax_in_prototype.py` nhúng 16 con (hàng S của mọi sheet, WebP) và toàn bộ VFX vào file HTML, kèm mã chạy animation, kỹ năng, trùm và bảng kiểm tra (`wax_prototype/runtime.js`, `wax_prototype/style.css`). Không sửa mã gốc của prototype: khối `WAX-PATCH` nằm cuối file và bọc các hàm toàn cục, nên kéo bản prototype mới về chỉ cần chạy lại `python3 Tools/ArtGen/embed_wax_in_prototype.py` (vài giây, chạy lại bao nhiêu lần cũng ra cùng kết quả; `--remove` để gỡ)

Cần Python 3 với `numpy`, `scipy`, `Pillow`.

```bash
python3 Tools/ArtGen/gen_units.py                       # dựng tất cả vào Assets/Art (~6 phút)
python3 Tools/ArtGen/gen_units.py --only Tiger,Warden   # chỉ dựng vài loại
python3 Tools/ArtGen/gen_units.py --preview /tmp/prev   # kèm ảnh preview phóng to trên nền ô cờ
python3 Tools/ArtGen/gen_units.py --dry --preview /tmp/prev   # chỉ xem thử, không ghi vào Assets
python3 Tools/ArtGen/gen_units.py --docs                # chỉ viết lại README trong từng folder

python3 Tools/ArtGen/gen_vfx.py                         # dựng mọi VFX + manifest + README vào Assets/Art/VFX
python3 Tools/ArtGen/gen_vfx.py --only burning,heal     # chỉ dựng hiệu ứng có tên chứa các từ này
python3 Tools/ArtGen/gen_vfx.py --board /tmp/vfx.png    # kèm bảng xem thử: từng frame trên nền tối/sáng, ghép thử lên 5 bản đồ
python3 Tools/ArtGen/gen_vfx.py --dry --board /tmp/vfx.png   # chỉ xem thử, không ghi vào Assets
```

| File | Nội dung |
|---|---|
| `artlib.py` | Công cụ vẽ: hình cơ bản, tô 3 tông, viền, glow, ghép sheet |
| `wax.py` | Hình dáng Dị Thể Sáp: dáng người (bậc 1, Sáp vỏ cua, trùm 1), Sáp vụn, họ hổ (bậc 2, hổ con, trùm 2) |
| `squads.py` | Hình dáng binh lính (Lính trấn thủ, Thợ săn), bẫy hắc ín, vạch cấp bậc |
| `gen_units.py` | Bảng animation (tư thế từng frame, fps), danh mục lính (và quái bản code cũ), xuất PNG và README |
| `gen_vfx.py` | VFX của Dị Thể Sáp vẽ bằng SDF (numpy), tự chứa, không dùng `artlib.py`. Thêm hiệu ứng: viết hàm `fx(cv, i, n, rng)` và gắn `@effect(...)` (ô, số frame, fps, pivot, lúc dùng); manifest, README và `Assets/Editor/UnitSpriteImporter.cs` tự theo |
| `wax_hq.py` | Bản thử quái vẽ code v2 (không còn dùng) |
| `build_wax_from_poses.py` | Dựng sheet quái từ bảng tư thế: bảng 4 cột, hàng 1 = đi (4 hình), hàng 2 = đánh (4), hàng 3 = trúng đòn + 3 giai đoạn tan chảy, hàng 4 (nếu có) = kỹ năng (4). Tách nền xanh, xóa đường lưới, căn chân, một tỉ lệ cho cả con (theo bảng `UNITS`), tự thu nhỏ nếu tư thế rộng nhất tràn ô. Tên file kỹ năng ở bảng `SKILL`; bảng vẽ quay phải thì khai trong `FACING` |
| `source/wax_poses/` | Bảng tư thế của 16 con (đầu vào của script trên) |
| `backup_old_wax/` | Bản sao `Assets/Art/Wax/` cũ trước khi thay hình (chỉ ở máy, đã gitignore) |
| `gen_wax_from_art.py` (cũ, không còn dùng) | Dựng sheet quái từ hình AI: nhún, lao tới, nháy trắng, tan chảy, glow kỹ năng; tự thu nhỏ frame để không tràn ô |
| `source/wax/` | 16 hình quái do ChatGPT vẽ, đã tách nền (≤ 768 px) |
| `rig_humanoid.py` | Dựng rig gắn xương từ bảng bộ phận ChatGPT: tách 6 bộ phận, đặt về đúng chỗ, xuất `.psb` nhiều lớp cho PSD Importer, `rig.json`, hình vị trí xương, GIF xem trước. Cần thêm `opencv-python-headless`, `psd-tools`. Bản thử, chưa dùng trong game; kết quả và hướng dẫn Unity nằm trong `source/wax/rig/standard/` (`RIG.md`) |
| `source/wax/rig/<tên>/` | Bảng bộ phận gốc, bộ phận nét cao, `rig.json`, `clips.json` (keyframe đi, đánh), hình vị trí xương |

Hướng mỹ thuật đã chốt cho quái: `Assets/Art/_ArtDirection/options/gothic_v5/`. Muốn đổi animation của một con: vẽ lại bảng tư thế trong `source/wax_poses/` rồi chạy `build_wax_from_poses.py --only <Tên>`. Binh lính: sửa bảng `UNITS` trong `gen_units.py` rồi chạy lại (script sẽ ghi đè PNG).
