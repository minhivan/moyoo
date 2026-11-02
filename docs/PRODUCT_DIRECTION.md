# Định hướng sản phẩm đang thảo luận

Cập nhật **2026-11-02** từ trao đổi với chủ sản phẩm. Tài liệu này lưu bối cảnh quyết định, **không phải đặc tả đã duyệt hoặc chức năng đã triển khai**.

## Hiện trạng

Moyoo hiện là photobooth frontend dùng một mình trên trình duyệt, tạo dải 4 ảnh và xuất file local. Xem [README](../README.md) và [ARCHITECTURE.md](ARCHITECTURE.md) để biết phạm vi thực tế. Chưa có backend/Supabase, tài khoản, bạn bè, cộng đồng hoặc lưu trữ ảnh dùng chung.

## Đã quyết định (2026-11-02)

- Bỏ trang landing; app mở thẳng vào camera như Locket. Đợt này chỉ đổi giao diện/UX, không thêm lưu trữ hay backend.
- Người dùng đầu tiên: nhóm bạn thân 16–24 tuổi.
- Nhiều chế độ chụp ngang hàng: 1 tấm, Dải 4, Lưới 2×2.
- Hướng hình ảnh: Purikura (chủ sản phẩm chọn sau một lần bốc lại).

## Mong muốn đã nêu

- Ưu tiên điện thoại, có tablet và desktop.
- Giao diện có gu riêng, đạt mức thẩm mỹ cao hơn một MVP cơ bản.
- Khám phá hướng kết nối người trẻ, từng lấy Locket làm điểm tham chiếu.
- Cần giá trị khác biệt, cộng đồng và lý do quay lại; chủ sản phẩm cho rằng chỉ cùng ghép một dải ảnh chưa đủ thuyết phục.
- Thảo luận các ngách và bản sắc trước khi triển khai thay đổi sản phẩm. Yêu cầu đồng bộ docs không phải phê duyệt xây các chức năng social.

## Các giả thuyết đã trao đổi

| Hướng | Giá trị được đề xuất | Trạng thái |
| --- | --- | --- |
| Bạn thân cùng góp ảnh | Dành ô cho nhau, lưu kỷ niệm chung từ xa | Đã thảo luận; bị đặt câu hỏi về khả năng giữ chân, chưa chọn |
| Phối đồ/tìm gu | Xin góp ý outfit và tương tác qua gu cá nhân | Ngách đề xuất, chưa chọn |
| Fandom | Tạo photocard, scrapbook, bộ ảnh cho hoạt động chung | Ngách đề xuất, chưa chọn |
| Sáng tạo theo mẫu | Tác giả tạo mẫu, người khác tạo phiên bản và theo dõi | Ngách đề xuất, chưa chọn |
| CLB/sự kiện | Album và hoạt động chung của nhóm ngoài đời | Ngách đề xuất, chưa chọn |
| Sáng tạo chung để kết nối | Một người mở chủ đề, người khác góp ảnh, hình thành tác phẩm/nhóm chung | Đề xuất gần nhất của assistant; chưa được chủ sản phẩm chấp thuận |

Các câu như “chừa cho bạn một ô” hoặc “tìm thấy người cùng cảm hứng qua những điều tạo cùng nhau” là ý tưởng thử nghiệm. Chưa đổi định vị, tagline, UI hay phạm vi source theo các câu này. Chưa có dữ liệu chứng minh retention, hiệu ứng cộng đồng hay khả năng “thay đổi cuộc chơi”.

## Quyết định còn mở

- Cách tiếp cận nhóm bạn thân 16–24 tuổi.
- Giá trị trung tâm: tạo nội dung, giữ liên hệ hay tìm người hợp mình.
- Hoạt động lặp lại đủ giá trị và cách kiểm chứng với người dùng thật.
- Nội dung riêng tư/công khai, quyền tham gia, quyền sử dụng ảnh và cách xử lý nội dung cộng đồng.
- Vai trò photobooth trong sản phẩm mới, nhu cầu web/native/widget và phạm vi backend.
- Tiêu chí xác nhận giả thuyết trước khi mở rộng tính năng; chưa đặt KPI hoặc lịch phát hành.

Khi có quyết định rõ, cập nhật trạng thái tại đây trước, rồi mới viết đặc tả và kế hoạch triển khai tương ứng. Không suy luận rằng các ngách đã được gộp thành một sản phẩm.
