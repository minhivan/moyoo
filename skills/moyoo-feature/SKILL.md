---
name: moyoo-feature
description: Extend or fix Moyoo photobooth capture, local file import, editing and export flows while preserving the approved product scope.
---

# Moyoo feature work

Đọc [AGENTS.md](../../AGENTS.md) và [kiến trúc](../../docs/ARCHITECTURE.md), đối chiếu source trước khi sửa. Các ý tưởng trong [định hướng](../../docs/PRODUCT_DIRECTION.md) chưa phải quyền triển khai social/backend.

- App.tsx đang giữ state, camera lifecycle, timer và nhập file; photo.ts giữ FileReader, Canvas capture và export. Không giả định đã có service camera hoặc persistence adapter.
- Giữ catalog ở frames.ts và preview dùng PrintPreview. Khi thay template/stamp/filter, sửa `getPrintLayout`/`stampLabel` để preview, khung ngắm và Canvas cùng đổi theo [pipeline](../../docs/CANVAS_PIPELINE.md).
- Capture hiện lưu pixels không bake filter; mirror camera trước. Giữ filter có thể đổi sau chụp, hủy timer khi thoát và dừng stream trả về muộn.
- `photos` là `Array<string | null>` dài bằng số ảnh của chế độ. Điền ô trống đầu tiên; chụp lại thay đúng ô. Đổi chế độ chỉ khi chưa có ảnh.
- Ảnh chỉ ở bộ nhớ; ngôn ngữ có localStorage. Không gọi file picker local là upload server. Chữ mới thêm vào cả hai bản trong `i18n.ts`.
- Làm rõ retry/error và điều hướng bị ảnh hưởng. Theo [WORKFLOWS.md](../../docs/WORKFLOWS.md) để kiểm tra và cập nhật docs; phân biệt mock test với camera/export thật.
