# Sprite các tháp (Towers)

Mỗi folder là một tháp, gồm sprite sheet PNG và `README.md` ghi số frame, fps, pivot, `localPosition` và nhịp hoạt động.

- Góc nhìn 3/4 từ trên cao, ô 128×128, Pixels Per Unit = 128 (1 ô xây = 1 unit)
- Tháp có đầu xoay: sheet `head` (hoặc `gunner`) có 5 hàng theo thứ tự S, SE, E, NE, N. SW, W, NW dùng hàng SE, E, NE lật ngang (flipX)
- `Assets/Editor/TowerSpriteImporter.cs` tự đặt thông số import và cắt ô khi PNG được import lần đầu. Muốn áp lại: Tools > Towers > Reapply Sprite Import Settings
- Thứ tự vẽ: Renderer2D đã đặt Transparency Sort Axis (0, 1, 0). Sprite Renderer của tháp đặt Sprite Sort Point = Pivot
- Hình hiện tại là placeholder dựng bằng code. Người vẽ bản thật giữ nguyên kích thước ô, pivot và thứ tự frame để thay thẳng vào

| Folder | Tháp | Bản MVP |
|---|---|---|
| `MachineGun` | Súng máy | có |
| `Flamethrower` | Súng phun lửa | có |
| `Mortar` | Súng cối | có |
| `Fortifier` | Tháp gia cố | có |
| `ChainTesla` | Tháp điện chuỗi | có |
| `NetLauncher` | Tháp phóng lưới | có |
| `CryoTower` | Tháp làm lạnh | sau MVP |
| `SunRod` | Cột thu sáng | sau MVP |
| `SolventSprayer` | Tháp phun dung môi | sau MVP |
| `HeatDecoy` | Mồi nhiệt | sau MVP |
| `PiercingCannon` | Pháo xuyên giáp | sau MVP |
| `SniperNest` | Tháp bắn tỉa | đề xuất, chưa có trong GDD |
| `_Shared` | Phần dùng chung (bóng đổ, vòng bão nhắm...) | chưa có PNG |
