# moyoo

moyoo là app photobooth chạy trong trình duyệt, thiết kế cho điện thoại trước: mở lên là vào camera tràn màn hình, chọn một trong 7 bố cục, chụp rồi lưu tờ ảnh PNG. Giao diện: nền mận đen quanh khung ngắm, khung ngắm mang màu giấy, điểm nhấn hồng/tím kiểu Purikura, chữ tròn Baloo 2.

Tài liệu được đối chiếu với source ngày **2026-11-02**. Các ý tưởng cộng đồng vẫn đang thảo luận, chưa triển khai; xem [định hướng sản phẩm](docs/PRODUCT_DIRECTION.md) và [PRODUCT.md](PRODUCT.md).

## Khởi chạy

```bash
npm install
npm run dev
```

Mở địa chỉ Vite in ra. Bản build: `npm run build` rồi `npm run preview`.

**Thử trên điện thoại:** `npm run dev:https` chạy HTTPS trong mạng LAN (chứng chỉ tự ký). Mở `https://<IP-máy>:5173` trên điện thoại, chấp nhận cảnh báo chứng chỉ một lần. Camera không mở được qua `http://IP`; app sẽ báo mã lỗi `InsecureContext`.

Không cần biến môi trường. Stack: React 19, TypeScript, Vite 8, Tailwind CSS 4 (chỉ import nền), CSS tùy chỉnh, Radix Dialog, Lucide, font Baloo 2 self-host.

## Trải nghiệm

1. **Camera** (màn đầu tiên): khung ngắm tràn màn hình "mặc" màu giấy, ô cắt đúng tỉ lệ ô in. Vuốt dải chế độ để chọn bố cục: 1 tấm, Đôi, Dải 3, Dải 4, Lưới 4, Lưới 6, Cuộn film. Công cụ nổi bên phải: Khung, Lọc, Hẹn giờ 3/5 giây, Tự chụp/Từng tấm. Khi đếm ngược, mọi nút lùi đi; khi đang chụp dở, dải chế độ thành cuộn ảnh thu nhỏ. Quyền camera được đọc ngay khi mở: đã cấp thì camera tự mở, bị chặn thì hiện cách mở lại theo trình duyệt và tự mở camera khi quyền được bật lại. Âm thanh, ngôn ngữ, cài app và hướng dẫn camera nằm trong nút Cài đặt.
2. **Tờ ảnh**: bản xem trước dùng cùng hình học với PNG. Chạm một tấm để chụp lại hoặc lưu riêng. Đổi khung, lọc, bố cục (cùng số ảnh), dấu (ghi chú, ngày giờ, tối giản) và chất giấy. Lưu PNG, sao chép vào clipboard, lưu từng tấm, hoặc chụp bộ mới (hỏi lại nếu chưa lưu).

## Cài như app (PWA)

- Có `manifest.webmanifest`, biểu tượng (192, 512, maskable, Apple 180) và service worker (`public/sw.js`, chỉ đăng ký ở bản build).
- Nút **Cài app** (biểu tượng tải xuống trên thanh trên) chỉ hiện khi chưa cài: Android/Chrome/Edge mở hộp cài của trình duyệt; iPhone/iPad hiện 3 bước Chia sẻ → Thêm vào MH chính; Safari trên Mac hướng dẫn Tệp → Thêm vào Dock.
- Sau khi cài: mở toàn màn hình, có màn chờ màu `#FFE3F1`, mở được khi mất mạng (service worker chỉ lưu vỏ app, không bao giờ lưu ảnh).
- Lối tắt khi giữ biểu tượng (Android, Chrome/Edge desktop; iOS không hỗ trợ): Chụp dải 4, Chụp 1 tấm, Chụp lưới 2×2, mở bằng `/?mode=…`.
- Không có widget màn hình chính kiểu Locket: PWA trên iOS và Android không tạo được widget, việc đó cần app native.

## Dữ liệu và giới hạn

- Ảnh chỉ nằm trong bộ nhớ trang; tải lại là mất. Chỉ ngôn ngữ được lưu ở `localStorage.moyoo_lang`.
- Không tài khoản, backend, database, analytics. Chọn ảnh từ máy không gửi file đi đâu. Font được đóng gói cùng app, không gọi Google Fonts.
- Camera cần HTTPS hoặc localhost. Truy cập bằng IP LAN qua HTTP thường không mở được camera trên điện thoại.
- Clipboard ảnh, nhiều lượt tải và `ctx.filter` trên Safari/iOS chưa được xác nhận trên thiết bị thật.
- PNG có kích thước pixel cố định, không phải chuẩn in 300 DPI. Chất giấy được vẽ vào PNG.

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Test chạy trong jsdom với camera giả; vượt qua không xác nhận camera thật hay chất lượng PNG. Xem [quy trình](docs/WORKFLOWS.md).

## Tài liệu

- [PRODUCT.md](PRODUCT.md): người dùng, mục đích, ràng buộc.
- [DESIGN.md](DESIGN.md): hệ thống hình ảnh Purikura (token, thành phần).
- [docs/](docs/README.md): kiến trúc, pipeline ảnh, dữ liệu, thiết kế, quy trình.
- [AGENTS.md](AGENTS.md) và skill [feature](skills/moyoo-feature/SKILL.md), [visual](skills/moyoo-visual-review/SKILL.md).
