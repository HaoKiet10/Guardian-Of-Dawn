# Bậc 1 – rig gắn xương (bản thử, không dùng trong game)

> Bản thử làm với hình Bậc 1 kiểu phẳng cũ, trước khi chốt hướng Gothic v5. Animation trong game hiện dùng sprite sheet từ bảng tư thế (`Tools/ArtGen/build_wax_from_poses.py`). File này và `wax_standard_rig.psb` được giữ lại làm tài liệu.

Bậc 1 bản mới (theo art bible `Assets/Art/_ArtDirection/`) làm theo cách gắn xương: 1 hình tách 6 bộ phận, Unity tự tính khung ở giữa nên chuyển động mượt ở mọi fps. Các sprite sheet `wax_standard_*.png` trong folder này là **bản cũ**, dùng tới khi rig xong.

| File | Nội dung |
|---|---|
| `wax_standard_rig.psb` | 6 lớp (`leg_L`, `leg_R`, `arm_L`, `arm_R`, `torso`, `head`, từ sau ra trước), 181×256 px, gấp đôi cỡ trong game |
| `Tools/ArtGen/source/wax/rig/standard/bone_guide.png` | Chỗ đặt xương (chấm xanh = đầu xương, vòng xanh lá = xương gốc) |
| `Tools/ArtGen/source/wax/rig/standard/rig.json` | Tọa độ khớp và xương (px trong PSB, gốc trên trái, y hướng xuống) |
| `Tools/ArtGen/source/wax/rig/standard/clips.json` | Keyframe `walk` và `attack` |
| `Tools/ArtGen/source/wax/rig/standard/preview_walk_attack.gif` | Bản xem trước chuyển động |

`_L` / `_R` là bên trái / phải **trên màn hình**, không phải tay trái / phải của quái.

## 1. Import PSB
Chọn `wax_standard_rig.psb`, ở Inspector:
- Texture Type: **Sprite (2D and UI)**, Sprite Mode: **Multiple**
- Pixels Per Unit: **256** (quái cao 0,81 unit = 104 px trong game, giống bản cũ)
- **Mosaic**: bật, **Character Rig**: bật
- Filter Mode: Bilinear, Compression: None

Bấm Apply.

## 2. Gắn xương (Sprite Editor → Skinning Editor)
Dùng **Create Bone**, đặt xương theo `bone_guide.png`. Tọa độ trong bảng là px trên PSB, đo từ góc trên trái:

| Xương | Cha | Từ → tới |
|---|---|---|
| `hip` (gốc) | – | (90, 160) → (91, 128) |
| `chest` | hip | (91, 128) → (92, 96) |
| `head` | chest | (92, 96) → (92, 45) |
| `upper_arm_L` | chest | (60, 106) → (42, 138) |
| `forearm_L` | upper_arm_L | (42, 138) → (37, 170) |
| `upper_arm_R` | chest | (122, 107) → (138, 137) |
| `forearm_R` | upper_arm_R | (138, 137) → (143, 167) |
| `thigh_L` | hip | (78, 153) → (71, 187) |
| `shin_L` | thigh_L | (71, 187) → (75, 224) |
| `thigh_R` | hip | (104, 151) → (105, 182) |
| `shin_R` | thigh_R | (105, 182) → (111, 215) |

Sau đó:
1. **Auto Geometry**: chọn cả 6 sprite rồi Generate.
2. **Bone Influence**: giới hạn xương cho từng sprite để thân không kéo theo tay:
   - `torso`: hip, chest
   - `head`: head
   - `arm_L`: upper_arm_L, forearm_L
   - `arm_R`: upper_arm_R, forearm_R
   - `leg_L`: thigh_L, shin_L
   - `leg_R`: thigh_R, shin_R
3. **Auto Weights**: Generate. Tay sáp sẽ cong mềm ở khuỷu.
4. Apply. Kéo PSB vào Scene, prefab sẽ có `SpriteSkin` trên từng bộ phận.

## 3. Animation
Tạo clip `wax_standard_walk` (1,0 giây, Loop Time bật) và `wax_standard_attack` (0,8 giây). Key **góc xoay Z** của xương. Số là góc **cộng thêm** vào góc ban đầu của xương, dương = ngược chiều kim đồng hồ.

**walk** (chủ yếu tay vung, chân nhấc, thân gần như đứng yên):

| Giây | 0 | 0,25 | 0,5 | 0,75 | 1,0 |
|---|---|---|---|---|---|
| `hip` | −1,5° | | +1,5° | | −1,5° |
| `head` | +1,5° | +2,5° | −1,5° | −2,5° | +1,5° |
| `upper_arm_L` | 0 | −6° | 0 | +9° (scale Y 0,9) | 0 |
| `upper_arm_R` | 0 | −9° (scale Y 0,9) | 0 | +6° | 0 |
| `thigh_L` | 0 | −4°, nhấc lên 3 px | 0 | 0 | 0 |
| `thigh_R` | 0 | 0 | 0 | +4°, nhấc lên 3 px | 0 |

`hip` hạ xuống khoảng 1,5 px ở giây 0 và 0,5 (lúc chân chạm đất). Muốn tay mềm như sáp thì cho `forearm` trễ theo `upper_arm` 3–5°.

**attack** (2 tay giơ lên rồi đập xuống):

| Giây | 0 | 0,22 | 0,34 | 0,40 | 0,46 (trúng) | 0,55 | 0,80 |
|---|---|---|---|---|---|---|---|
| `upper_arm_L` | 0 | −60° | −122° | −130° | −4° (scale Y 0,82) | +4° | 0 |
| `upper_arm_R` | 0 | +60° | +122° | +130° | +4° (scale Y 0,82) | −4° | 0 |
| `hip` | 0 | | nhổm lên 1,5 px, scale Y 1,04 | | hạ 2,5 px, scale Y 0,92 | | 0 |
| `head` | 0 | | −4° | | +5° | | 0 |

Đặt **Animation Event** ở giây 0,46 để code trừ máu tường đúng lúc tay chạm.

## Làm lại hoặc làm cho con khác
```bash
sprite-gen cutout parts_sheet.png --key magenta --out sheet_cut.png
python Tools/ArtGen/rig_humanoid.py sheet_cut.png --name standard --folder Standard \
    --game-height 104 --clips Tools/ArtGen/source/wax/rig/standard/clips.json
```
Bảng bộ phận phải theo bố cục của `Tools/ArtGen/source/wax/rig/standard/parts_sheet_gpt.png`: bên trái là con quái lắp sẵn, bên phải là 6 bộ phận rời.
