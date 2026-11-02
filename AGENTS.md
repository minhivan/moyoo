# Moyoo working agreement

## Phạm vi và nguồn sự thật

- Đọc [docs/README.md](docs/README.md), sau đó chỉ đọc tài liệu liên quan. Khi docs và source lệch nhau, kiểm tra source và ghi nhận chênh lệch; docs không phải bằng chứng tính năng đã chạy trên thiết bị thật.
- Hiện tại là photobooth frontend dùng dữ liệu local và browser APIs. Các ý tưởng social/community trong [PRODUCT_DIRECTION.md](docs/PRODUCT_DIRECTION.md) chưa phải yêu cầu triển khai đã duyệt. Không tự thêm backend, Supabase, auth, analytics hoặc lưu ảnh từ xa từ các cuộc thảo luận đó.
- Kiểm tra `git status` và diff trước khi sửa; giữ nguyên thay đổi đã có và trạng thái staged của người dùng. Không reset hoặc stage hộ nếu không được yêu cầu.

## Cấu trúc và hành vi

- `src/App.tsx` sở hữu trạng thái `camera/review`, lifecycle camera, timer, nhập file, lưu/sao chép và toast. Không có trang landing: app mở thẳng vào camera. `src/lib/photo.ts` chứa đọc file, tính vùng chụp, capture Canvas và export; chưa có service/hook camera riêng.
- Catalog (khung, lọc, chế độ/bố cục, dấu, giấy) ở `src/data/frames.ts`. Giao diện: `components/CameraScreen.tsx`, `ReviewScreen.tsx`, `PrintPreview.tsx` (bản DOM của PNG, dùng `getPrintLayout`), `Tools.tsx`.
- Ảnh ở bộ nhớ phiên; ngôn ngữ lưu qua `localStorage.moyoo_lang`. Không nói mọi dữ liệu đều không lưu, cũng không nói ảnh được đồng bộ từ xa.
- Thấy gì in nấy: khung ngắm, preview và PNG dùng chung `slotAspect`, `captureRect` và `getPrintLayout`; dấu chữ dùng chung `stampLabel` (giờ địa phương). Capture không bake filter. Camera trước mirror, camera sau không.
- Khi sửa camera: giữ hủy countdown/auto timer, dừng media tracks và vô hiệu hóa yêu cầu camera cũ khi thoát/đổi camera. Kiểm tra chụp ô riêng và phiên chưa đủ 4 ảnh.
- PNG dùng kích thước pixel cố định; không gọi là xuất chuẩn 300 DPI. Chất giấy được vẽ cả vào PNG.

## Thiết kế và xác minh

- Ưu tiên mobile, có tablet dọc/ngang và desktop. Theo [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md) và [DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md): hướng Purikura, một họ chữ Baloo 2 self-host, nền hồng kẹo, tím cho trạng thái chọn. Mọi chữ giao diện nằm trong `src/lib/i18n.ts` (VI mặc định, EN đủ khóa).
- Khi phù hợp, dùng [moyoo-feature](skills/moyoo-feature/SKILL.md) hoặc [moyoo-visual-review](skills/moyoo-visual-review/SKILL.md).
- Trước bàn giao chạy `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`. Báo riêng những gì chưa kiểm tra trên browser/thiết bị thật. Với thay đổi docs, kiểm tra cả liên kết nội bộ và độ khớp source; không thêm test chỉ để kiểm tra câu chữ.
- Cập nhật docs cùng thay đổi hành vi, API, catalog hoặc bố cục. Giữ định hướng, hiện trạng và giới hạn ở các mục riêng; không biến đề xuất thành tính năng đã có.
