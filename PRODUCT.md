# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Nhóm bạn thân 16–24 tuổi tại Việt Nam, dùng điện thoại là chính. Họ mở moyoo khi đang ở cùng nhau (quán cà phê, phòng trọ, đi chơi) hoặc khi muốn ghi lại một khoảnh khắc nhanh để gửi cho nhau qua các app nhắn tin họ đã dùng sẵn.

## Product Purpose

moyoo là camera trên trình duyệt để tạo ảnh kỷ niệm kiểu photobooth: chụp hoặc chọn ảnh từ máy, chọn chế độ (ví dụ 1 tấm, dải 4 ảnh, lưới 2x2), khung màu, bộ lọc và dấu chữ, rồi lưu PNG về máy. Thành công là mở lên chụp được ngay, ra một tấm ảnh đủ đẹp để gửi cho bạn bè mà không phải chỉnh thêm.

## Positioning

Cảm giác app camera của Locket (mở là thấy camera, một nút chụp lớn) nhưng đầu ra là một thành phẩm có thiết kế: dải/lưới photobooth với khung màu, bộ lọc và dấu chữ, được dựng ngay trên máy, không cần tài khoản.

## Operating Context

- Dùng một tay trên điện thoại, thường là camera trước, trong ánh sáng trong nhà hoặc buổi tối. Tablet và desktop vẫn phải dùng được.
- Đầu ra rời app: PNG tải về, ảnh lẻ, hoặc sao chép vào clipboard để dán sang app nhắn tin.
- Camera cần HTTPS hoặc localhost và quyền của người dùng; phải có lối đi khi bị từ chối (chọn ảnh từ máy).

## Capabilities and Constraints

- Frontend-only (React 19 + Vite + TypeScript). Không backend, tài khoản, bạn bè, feed, lưu ảnh từ xa hay analytics. Đợt redesign 2026-11 chỉ đổi giao diện/UX; không thêm lưu trữ ảnh (ảnh vẫn mất khi tải lại trang). Chỉ ngôn ngữ được lưu ở localStorage. Có thể cài như PWA; service worker chỉ lưu vỏ app để mở offline, không lưu ảnh.
- Đã có: camera trước/sau, đếm ngược 3/5 giây, chụp tự động hoặc từng tấm, chụp lại từng ô, nhập ảnh từ máy, 6 khung màu, 6 bộ lọc, 3 chế độ (1 tấm, dải 4, lưới 2×2), 3 kiểu dấu, 3 chất giấy (in vào PNG), xuất PNG/ảnh lẻ/clipboard, VI/EN, cài PWA.
- Bỏ trang landing riêng: mở app là vào trải nghiệm camera.
- Nhiều chế độ chụp ngang hàng do người dùng chọn; hiện có 1 tấm, Dải 4, Lưới 2×2.
- Widget màn hình chính kiểu Locket cần app native; PWA không làm được.
- Mở: có thêm chia sẻ qua bảng chia sẻ hệ điều hành (Web Share) hay không; các hướng cộng đồng trong `docs/PRODUCT_DIRECTION.md` vẫn là giả thuyết.

## Brand Commitments

- Tên `moyoo`, viết thường. Copy ngắn, thân thiện, chủ yếu tiếng Việt, có tiếng Anh.
- Không hứa ảnh được lưu/đồng bộ từ xa; nói rõ ảnh nằm trên thiết bị và mất khi tải lại.
- Người dùng muốn giao diện tối giản, dành cho giới trẻ, như một app mobile chứ không như website.

## Evidence on Hand

- Bốn ảnh mẫu local ở `public/samples/shot1.jpg`–`shot4.jpg`.
- Không có người dùng thật, số liệu, đánh giá hay đối tác; không được bịa.

## Product Principles

1. Camera trước tiên: từ lúc mở đến lúc bấm chụp là một chạm.
2. Thành phẩm mới là sản phẩm: mọi tùy chỉnh phục vụ tấm ảnh đầu ra, xem trước phải gần với file xuất.
3. Riêng tư thật: chỉ hứa những gì code làm được.
4. Một tay, ngón cái: hành động chính nằm trong vùng chạm dưới màn hình.

## Accessibility & Inclusion

Pinch zoom và giảm chuyển động phải được tôn trọng; điều khiển dùng được bằng bàn phím và trình đọc màn hình; vùng chạm tối thiểu 44px.
