# Surface brief: moyoo app (camera → review)

Scope: toàn bộ app (`src/App.tsx` và các component). Mode: Operate. Mobile-first, không landing; tablet/desktop là cột app căn giữa, review hai cột khi rộng.

Audience/job: nhóm bạn 16–24, mở app là chụp; chọn bố cục (7 chế độ), khung, lọc; xem lại, chỉnh dấu/giấy, lưu PNG hoặc sao chép.

Constraints: frontend-only, không lưu ảnh; camera cần thao tác người dùng hoặc quyền đã cấp; giữ mọi chức năng hiện có. Người dùng chọn (2026-11-02): "Camera tràn màn hình", giao diện clean như app mobile, hiển thị thông minh, đặc trưng; thêm bố cục mới.

## Direction contract

THESIS: Một camera app tràn màn hình mà khung ngắm chính là tờ ảnh đang in: màu giấy bao quanh, ô cắt đúng tỉ lệ bố cục, dải ảnh trượt lên sau mỗi tấm. Từ chối màn camera đen chung chung và giao diện trang web nhiều hộp.

OWN-WORLD: Nền mận đen #120A12 quanh camera, bề mặt #2B1C2E, chữ #FFF4FA. Giữ chất Purikura ở điểm nhấn: nút chụp hồng nóng #FF3E9A viền trắng, tím #7A3CFF cho trạng thái chọn, viền sticker trắng quanh ô ảnh, Baloo 2 một họ chữ, trái tim/ngôi sao vẽ tay trên dấu. Bottom sheet sáng trắng kiểu iOS.

STORY: Mở app thấy chính mình trong ô ảnh trên tờ giấy màu; vuốt chọn bố cục như vòng chế độ của camera; chạm nút hồng; xong thì sang tờ ảnh trên nền tối để chỉnh và lưu.

FIRST VIEWPORT: Thanh trên mỏng (moyoo, âm thanh, cài đặt). Khung ngắm tràn ngang, cao gần hết màn hình, bo 28px; Dưới: hàng công cụ dạng viên (Khung, Lọc, Hẹn giờ, Tự chụp), luôn hiện để khung ngắm không đổi cỡ khi camera mở; dải chế độ cuộn ngang 7 mục, mục chọn căn giữa có chấm hồng; đáy: chọn ảnh, nút chụp 80px, đổi camera.

FORM: Purikura, biến thể camera tràn màn hình do người dùng chọn (ghi đè bố cục của lần trước). seed:cc2e24f006b6525c. Signature move: khung ngắm mặc màu giấy và mặt nạ tỉ lệ ô in; dải ảnh trượt lên; khi đếm ngược mọi điều khiển lùi đi, chỉ còn số và nút hủy; khi đang chụp dở, dải chế độ nhường chỗ cho cuộn ảnh thu nhỏ.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
