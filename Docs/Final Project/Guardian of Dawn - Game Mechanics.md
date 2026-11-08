## **Core gameplay loop**

1. (Ban đêm) Người chơi sử dụng tài nguyên để xây dựng/ nâng cấp công trình, binh lính, tường thành
2. (Bình minh) Hệ thống phát cảnh báo bắt đầu phòng thủ và vị trí vùng chiếu sáng
3. (Ban ngày) Công trình, binh lính tự động chống lại dị thể sáp
	1. Khi tiêu diệt dị thể sáp sẽ nhận được tài nguyên và các mẫu vật nghiên cứu
	2. Khi dị thể sáp đến được tường thành sẽ gây sát thương liên tục lên tường
	3. Dị thể sáp càng ngày càng trở nên mạnh mẽ
	4. Tiêu diệt toàn bộ dị thể sáp để hoàn thành ngày
4. (Ban đêm) Sử dụng các mẫu vật thu thập được để nghiên cứu công nghệ, công trình và kỹ thuật mới

## **Player Action**
| Hành động                                   | Điều kiện                    | Kết quả / Ảnh hưởng                                                                                                                        |
| ------------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Xây dựng công trình/ binh lính              | Ban đêm, có đủ tài nguyên    | Công trình được xây dựng để bảo vệ DawnHold                                                                                                |
| Nâng cấp công trình/ binh lính/ tường thành | Ban đêm, có đủ tài nguyên    | Công trình/ binh lính được tăng chỉ số và mở khóa kỹ năng mới<br>Tường thành tăng chỉ số và mở rộng khu vực được đặt công trình/ binh lính |
| Sử dụng kỹ năng                             | Mở khóa nghiên cứu nhất định | Tùy thuộc vào loại kỹ năng bao gồm tăng chỉ số công trình/ binh lính, làm suy yếu/ gây sát thương lên dị thể sáp, ...                      |
| Nghiên cứu                                  | Ban đêm, có thời gian chờ    | Mở khóa nâng cấp công trình/ binh lính/ tường thành/ kỹ năng<br>Dẫn đến good ending                                                        |
## **Game objective**

- Mục tiêu ngắn hạn: Phòng thủ Dawnhold, bảo vệ tường thành
- Mục tiêu dài hạn: Mở khóa nghiên cứu dẫn đến good ending
- Cách phát triển: Sống sót và thu thập mẫu vật để nghiên cứu

## **Tổ chức phòng thủ**

1. Người chơi quyết định: Xây mới hay nâng cấp công trình/ binh lính, sửa chữa tường thành
2. Điều kiện kích hoạt: Khi đang là ban đêm và người chơi có đủ tài nguyên để thực hiện hành động
3. Quy định: Công trình/ binh lính phải đặt ở vị trí đủ rộng (bằng hoặc hơn kích thước của công trình/ binh lính) và không được vượt quá giới hạn công trình/ binh lính. Nâng cấp công trình cần mở khóa nghiên cứu nhất định
4. Phản hồi cho người chơi: công trình được xây dựng và hiển thị trên UI, kèm theo âm thanh và báo hiệu
5. Điều kiện thất bại: Người chơi không có đủ tài nguyên hoặc vị trí đặt công trình/ binh lính không phù hợp



6. Mục đích: xây dựng công trình phòng thủ
7. Đầu vào: Danh sách công trình, vị trí đặt, số lượng tài nguyên cần và số lượng tài nguyên hiện có
8. Cơ chế: Mỗi loại công trình có kích thước khác nhau, số lượng và loại tài nguyên cần thiết cũng sẽ khác nhau