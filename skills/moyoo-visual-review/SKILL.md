---
name: moyoo-visual-review
description: Review or refine Moyoo photobooth visual hierarchy and responsive layouts on phones, tablets and desktop.
---

# Moyoo visual review

Đọc [DESIGN_SYSTEM.md](../../docs/DESIGN_SYSTEM.md) và xem source/UI hiện tại. Giữ hướng Purikura trong [DESIGN.md](../../DESIGN.md): Baloo 2, nền hồng kẹo, viền sticker trắng, tím cho trạng thái chọn, một nhịp chuyển động `--spring`. Không quay lại giao diện editorial/landing cũ.

- Ưu tiên phone, sau đó tablet dọc/ngang và desktop. Dùng viewport tham chiếu trong [WORKFLOWS.md](../../docs/WORKFLOWS.md), ghi rõ viewport thực sự đã xem.
- Kiểm tra cổng camera (mời, đang mở, lỗi), khung ngắm ở ba chế độ, khay Khung/Lọc, nút chụp, màn tờ ảnh với 5 tab và thanh hành động. Camera là cột app tối đa 520px ở mọi cỡ; review hai cột từ 960px.
- CSS nằm ở `src/index.css` (token) và `src/App.css` (thành phần, responsive cuối file). Khung ngắm là size container: dùng `cqw/cqh` và container query cho nội dung bên trong.
- Kiểm tra chữ VI/EN dài, focus/keyboard slot, vùng chạm, safe-area, cuộn, pinch zoom và reduced motion. Không suy ra tương tác thiết bị thật từ screenshot viewport.
- Preview và PNG dùng chung hình học; vẫn tải PNG thật để so khi đổi renderer. Xem [pipeline](../../docs/CANVAS_PIPELINE.md).
- Cập nhật docs nếu thay đổi token/breakpoint/hành vi. Một build đạt không chứng minh giao diện đẹp hoặc không bị che; kiểm tra browser khi có thể và báo giới hạn thực tế.
