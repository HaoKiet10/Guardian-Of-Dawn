# Art bible – Dị Thể Sáp

> **Cập nhật:** hướng mỹ thuật cuối cùng đã chốt là **Gothic v5** (`options/gothic_v5/`: quái dạng chibi, giáp sáp cháy đen, mỗi con một màu nhấn, mắt sáng, vũ khí nhặt ở bản đồ, mỗi con một chi tiết sáp). Các luật về hình dáng và màu thân bên dưới là bản art bible kiểu phẳng trước đó; phần luật chung (góc nhìn, viền `#2c2240`, ánh sáng, màu dành cho trạng thái, không vũng sáp) vẫn áp dụng.

Bản đọc cho người của `art-spec.yaml`. Muốn đổi luật thì sửa `art-spec.yaml` trước, rồi cập nhật file này.
Nguồn: GDD v2.0 (mục 1.7, 4.6, 5.3, 6.2, 6.6, 7.3, 8.1–8.5) và chính sprite map, tháp đã vẽ. Mã màu dưới đây lấy mẫu từ các sprite đó.

## 1. Luật chung (áp cho mọi Dị Thể Sáp)

| Hạng mục | Luật | Lý do (GDD) |
|---|---|---|
| Góc nhìn | 3/4 từ trên cao (camera khoảng 40°), chân chạm mặt đất | 8.1, giống tháp và map |
| Tô bóng | Phẳng kiểu hoạt hình, 3 tông mỗi màu, tối đa 1 vệt sáng mềm | 8.1 "mỗi màu 3 tông" |
| Viền | Viền dày đều `#2c2240` | 8.1 |
| Ánh sáng | Một nguồn sáng mềm từ trên bên trái | 8.1 |
| Độ chi tiết | Tối đa 3 chi tiết bên trong mỗi con, phải đọc được ở ô 128 px | 8.2 nhận ra qua hình bóng |
| Chất liệu | Sáp nến **mờ**, rìa hơi trong, giọt chảy kết thúc bằng hạt tròn, không bóng loáng | Sáp trên map |
| Màu sáp | Vàng bơ `#f8d888` / `#e8c868` / `#d8a848`, bóng `#c89838`, tối `#9a6c2c` | 8.1 "vàng – trắng", lấy từ cây sáp và vòm sáp trên map |
| Khuôn mặt | Mặt người đơn giản: 2 hốc mắt bầu dục tối `#2a1206`, miệng tròn há (buồn, sợ). **Không đầu lâu, không mắt lửa** | 7.3 "bên trong vẫn còn con người – có thể được chữa" |
| Bàn tay | Tay người màu kem `#f6eac6` cho dạng người | Vòm sáp ở Đài thiên văn |
| Hình người bên trong | Giữ dáng người và vài mảnh quần áo thường ngày | 5.3 Trùm 1 "dính mảnh quần áo", 7.4 "những người đã mất" |
| Phát sáng | **Không lửa, dung nham, than hồng**. Chỉ phát sáng trắng vàng `#fff6d8` ở frame cảnh báo kỹ năng | 6.6 thứ tự ưu tiên thị giác, 8.3 |
| Dưới chân | **Không vũng sáp**, không bóng đổ trong ảnh gốc (script tự thêm bóng mềm) | Phản hồi: vũng sáp nhìn giả |

**Màu cấm dùng làm màu thân** (để không lẫn với trạng thái, GDD 8.5):
- đỏ cam lửa `#ef5b31` (cháy)
- xanh acid `#a6ff4d` (dung môi)
- cyan nhạt `#93cdd9` / `#8ff1ff` (băng; quái bị đóng băng được code tô xanh nhạt)
- xanh lá (vùng hồi máu bậc 3, chỉ xuất hiện trong frame `heal`)

**Hình bóng theo bậc** (GDD 8.1), tô đen hết vẫn phải phân biệt được:
- Bậc 1: người gầy, khom, tay dài thõng
- Bậc 2: thú bốn chân dài, thấp (hổ)
- Bậc 3: người có cành và tán phồng
- Bậc 4: người cao hình giọt nước
- Bậc 5: khối rộng nhiều đầu, nhiều tay

## 2. Theo từng map

Quái lấy **màu sáp chung**, chỉ mượn **màu điểm nhấn** của vùng đất để thấy chúng sinh ra từ nơi đó.

| Map | Nền map | Quái mượn gì | Lưu ý tương phản |
|---|---|---|---|
| 1. Ngoại ô | Nâu xám, đường nhựa, nhà bỏ hoang | Mảnh quần áo bạc màu (jeans `#5c6a8a`, xám `#8a8a80`, ô liu `#5a6a3a`), giày | Sáp vàng nổi tốt trên đường xám, cỏ ô liu |
| 2. Cầu cảng | Nước tối, cỏ rêu, ván gỗ, container | Gỉ sắt `#9c5a3a`, xích sắt `#5a5050`, hà bám `#e8e0c8` | Tốt trên nước tối; trên ván gỗ nâu cần viền rõ |
| 3. Phố cổ | Đá lát vàng be, cây sáp tán phồng, mái ngói đỏ nâu | **Tán phồng giống hệt cây sáp trên map**, thân rễ nâu đen `#422a1e`, ngói `#8a3a2a` | Nền vàng be, phải dựa vào viền, thân tối và bóng sáp đậm |
| 4. Đồng bằng trắng | Muối trắng chói, ô muối hồng/xanh/cam đào, biển xanh | Nước biển xanh mòng két `#2f9fb5` / `#1d5f78`, tinh thể muối hồng `#f0a0b0`, cam đào `#f6c890` | Nền gần trắng, **thân quái phải tối hơn nền**, cấm trắng/óng ánh cầu vồng |
| 5. Đài thiên văn | Tuyết trắng, vực tím oải hương, vòm sáp | Sáp vòm y như map (nhiều mặt, nhiều tay kem), đỏ thẫm `#8e2a4e` cho Sáp kích động | Sáp vàng nổi tốt trên tím và trắng |

## 3. Soát 16 con hiện tại

Cách soát: đặt hình gốc lên nền map của nó, so với cây sáp, vòm sáp và tháp trên map (ảnh tham chiếu nằm trong `refs/`).

**Kết luận chung: ý tưởng con nào thuộc map nào gần như đúng GDD, nhưng cách vẽ lệch hẳn khỏi map.**
- Quái vẽ bóng loáng, nhiều chi tiết, màu cam rực, mắt lửa, lõi dung nham. Map và tháp thì phẳng, 3 tông, viền đậm, ít chi tiết, sáp vàng bơ xỉn.
- Quái vẽ nhìn ngang tầm mắt, còn map và tháp nhìn 3/4 từ trên cao.

| Quái | Map | Lệch ở đâu | Việc cần làm |
|---|---|---|---|
| Bậc 1 – tiêu chuẩn | 1 | Đầu lâu, mắt lửa, cam bóng, vũng sáp | Vẽ lại, giữ dáng gầy tay dài, thêm cổ áo jeans và giày |
| Sáp vụn | 1 | Đầu lâu, giọt bóng | Vẽ lại |
| Trùm 1 – Sáp Nguyên Thủy | 1 | Vết nứt như dung nham cam | Vẽ lại, vết nứt tối; chỉ sáng ở frame `shed` |
| Bậc 2 – hổ | 2 | Đúng dáng dài thấp; sai cách vẽ, vũng sáp | Vẽ lại, giữ dáng, thêm vệt gỉ ở chân |
| Sáp vỏ cua | 2 | **Sai gốc**: GDD ghi gốc bậc 1 (người) nhưng đang là con cua có đầu lâu | Vẽ lại thành người khom đội mai cua, mai có hà và gỉ |
| Trùm 2 – Hổ Sáp Đầu Đàn | 2 | Đúng ý (sẹo, xích gãy, không vũng); sai cách vẽ | Vẽ lại, giữ ý |
| Hổ con | 2 | Sai cách vẽ, vũng sáp | Vẽ lại |
| Bậc 3 – hồi phục | 3 | Lá xanh, cầu sáng xanh ở tay (trùng màu vùng hồi máu); tán không giống cây sáp trên map | Vẽ lại với tán phồng như map; xanh chỉ ở frame `heal` |
| Sáp bào tử | 3 | Nấm cam bóng | Vẽ lại, tán phồng thành 3 túi sắp nứt |
| Trùm 3 – Cây Sáp Mẹ | 3 | Đúng ý (mảnh nhà); cây trơ cành, không giống cây sáp trên map | Vẽ lại thành cây sáp tán phồng khổng lồ đi bằng rễ |
| Bậc 4 – thấu kính | 4 | **Trắng óng ánh trên nền muối trắng, gần như không thấy** | Vẽ lại, thân nước xanh mòng két, viền sáp vàng |
| Sáp gương | 4 | Như trên | Vẽ lại, tinh thể muối hồng và cam đào |
| Trùm 4 – Lăng Kính Sống | 4 | Như trên; tia cầu vồng vẽ dính vào hình | Vẽ lại; tia sáng là VFX riêng, không vẽ vào sprite |
| Bậc 5 – tối thượng | 5 | Lõi lửa giữa ngực | Vẽ lại, bỏ lõi lửa, giữ nhiều đầu |
| Sáp kích động | 5 | Đang tô đỏ bằng code; sóng âm vẽ dính vào hình | Vẽ lại, sọc và bờm đỏ thẫm; sóng âm là VFX |
| Trùm 5 – Khối Sáp Vạn Người | 5 | Đúng ý (nhiều mặt); cam rực, tim lửa | Vẽ lại giống khối sáp phủ vòm trên map |

## 4. Quy trình vẽ lại

1. **Hình mẫu chuẩn (canon)**: vẽ Bậc 1 trước bằng ChatGPT, kèm 2 ảnh `refs/` và câu `style_token` trong `art-spec.yaml`. Duyệt xong thì lưu vào `sheets/standard_canon.png` và ghi đường dẫn vào `characters.standard.canon_sheet`.
2. **Mỗi map một ảnh**: vẽ cả nhóm quái của map đó trong **một lần** (bậc mới, biến thể, trùm đứng cạnh nhau) để cùng nét, cùng màu, cùng ánh sáng. Kèm hình Bậc 1 chuẩn và ảnh map.
3. Prompt luôn dán nguyên văn `style_token` và `identity_string` của từng con, không diễn đạt lại.
4. **Soát lại** từng con (bảng kiểm trong `.claude/skills/unity-asset-designer/references/consistency-qa.md`):
   - tô đen vẫn nhận ra
   - nhìn rõ ở đúng cỡ trong game
   - đúng màu, đúng nét
   - nổi trên nền map của nó

   Con nào lệch thì vẽ lại cả nhóm, không sửa riêng một con.
5. Tách nền: `sprite-gen cutout --key magenta`, lưu vào `Tools/ArtGen/source/wax/`, rồi chạy `gen_wax_from_art.py` và `embed_wax_in_prototype.py`.
