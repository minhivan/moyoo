# Tài liệu moyoo

Đối chiếu source ngày **2026-11-02**. Đây là tài liệu của phiên bản photobooth frontend hiện có. Các đề xuất kết nối cộng đồng chưa được chọn làm hướng triển khai.

## Đọc theo công việc

| Tài liệu | Nội dung |
| --- | --- |
| [README dự án](../README.md) | Khởi chạy, chức năng hiện có, giới hạn tổng quan |
| [PRODUCT.md](../PRODUCT.md) | Người dùng, mục đích, nguyên tắc sản phẩm đã xác nhận |
| [DESIGN.md](../DESIGN.md) | Hệ thống hình ảnh Purikura (token và thành phần) |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Trạng thái màn hình, camera, nhập ảnh, lifecycle và lưu trữ |
| [DATA_MODELS.md](DATA_MODELS.md) | Catalog, kiểu dữ liệu và mặc định phiên |
| [CANVAS_PIPELINE.md](CANVAS_PIPELINE.md) | Capture, kích thước PNG, chữ/dấu và khác biệt preview–export |
| [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) | Nhận diện hiện tại, CSS, token và responsive |
| [WORKFLOWS.md](WORKFLOWS.md) | Cách sửa chức năng, đồng bộ docs và xác minh |
| [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) | Mong muốn của chủ sản phẩm, giả thuyết đang thảo luận và quyết định còn mở |
| [AGENTS.md](../AGENTS.md) | Quy ước làm việc cho agent |
| [Skill feature](../skills/moyoo-feature/SKILL.md) | Hướng dẫn thay đổi luồng photobooth |
| [Skill visual](../skills/moyoo-visual-review/SKILL.md) | Hướng dẫn review UI và responsive |

## Bản đồ source

```text
src/
  main.tsx                  React StrictMode và CSS nền
  index.css                 Tailwind import, reset, token màu và font
  App.tsx                   State, camera/timer, file input, lưu/sao chép, toast, xác nhận bỏ ảnh
  App.css                   Toàn bộ thành phần và responsive (Purikura)
  App.test.tsx              Test luồng app và helper ảnh (camera giả lập)
  components/CameraScreen.tsx  Khung ngắm, chế độ, công cụ, nút chụp, trợ giúp camera
  components/ReviewScreen.tsx  Tờ ảnh, tab chỉnh, thanh hành động
  components/PrintPreview.tsx  Bản DOM của PNG theo getPrintLayout
  components/Tools.tsx         Rail chọn khung/lọc/bố cục/dấu/giấy
  data/frames.ts            Frame/filter/template/stamp/paper và đường dẫn ảnh mẫu
  lib/photo.ts              FileReader, capture, PNG và clipboard
  lib/i18n.ts               Dictionary VI/EN
  lib/sound.ts              Web Audio effects
public/samples/             Bốn ảnh mẫu local
index.html                  Metadata và viewport
vite.config.ts              React + Tailwind Vite plugins
vitest.setup.cjs             Shim Node zlib, không phải bộ mock browser
```

## Quy tắc duy trì tài liệu

Source xác định hành vi thực tế. Docs phải mô tả đúng hành vi ấy, kể cả giới hạn; không tự sửa code để làm khớp một mô tả cũ. Khi thay đổi code, cập nhật tài liệu tương ứng trong cùng công việc. Giữ số liệu kỹ thuật ở tài liệu chuyên mục, tránh sao chép nhiều phiên bản dễ lệch.

Kiểm tra build/test là bằng chứng tĩnh và giả lập. Camera thật, clipboard, xuất ảnh trên điện thoại và chất lượng hình ảnh phải có kiểm tra riêng. Không coi mục tiêu thiết kế hoặc ý tưởng sản phẩm là kết quả đã xác minh.
