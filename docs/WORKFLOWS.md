# Quy trình phát triển và kiểm tra

Đối chiếu source ngày **2026-11-02**. Đọc [AGENTS.md](../AGENTS.md) trước khi sửa; xem trạng thái Git và giữ thay đổi đang có của người dùng.

## Thay đổi chức năng

### Frame và filter

Thêm frame/filter tại `src/data/frames.ts`, đủ nhãn VI/EN. Khung ngắm, preview và PNG đọc màu trực tiếp từ catalog nên không cần CSS mới. Xác minh độ tương phản của `ink` trên `background`, khay Khung ở camera và tab Khung ở tờ ảnh, preview và PNG.

Filter có chuỗi `cssFilter`; giữ capture của App ở `none` để đổi filter sau chụp và export không bị áp hai lần. Với chế độ/bố cục mới: thêm `TemplateId` và `TemplateOption` (`count`, `slotAspect`), thêm nhánh trong `getPrintLayout`, glyph trong `LayoutGlyph` (`Tools.tsx`) và CSS `.layout-glyph--{id}`, `.review__print--{id}`. Khung ngắm tự theo `slotAspect`; cột dải ảnh chỉ dành cho `strip-4`.

### Copy và thiết kế

Mọi chữ giao diện nằm trong `src/lib/i18n.ts`; thêm khóa vào bản `vi`, TypeScript sẽ báo nếu bản `en` thiếu. Token ở `index.css`, thành phần và responsive ở `App.css` (media query cuối file).

### Camera, nhập ảnh và export

State/lifecycle nằm trong App; Canvas và FileReader nằm trong photo.ts. Kiểm tra phiên đủ/thiếu ảnh, slot ngoài thứ tự, hủy countdown/auto, request camera trả muộn, camera trước/sau và kết thúc stream. Với export, đọc [CANVAS_PIPELINE.md](CANVAS_PIPELINE.md) và kiểm tra ảnh tải thực tế; không chỉ preview DOM.

## Bộ kiểm tra bắt buộc

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

- Lint: oxlint; typecheck: `tsc -b --pretty false`; build: TypeScript rồi Vite.
- Test: Vitest + React Testing Library + jsdom, cấu hình qua script package.json.
- `vitest.setup.cjs` là shim cho `node:zlib.createZstdDecompress` nếu thiếu, không phải bộ mock camera/Canvas. Không coi shim này là bảo đảm tương thích mọi phiên bản Node.
- Mock browser và photo helper được khai báo trong `src/App.test.tsx`. BeforeEach clear localStorage và mock scrollIntoView; afterEach cleanup, gỡ globals/mocks và trả timer về thật.

Hiện có **17 test**. Luồng app: mở thẳng vào camera; đổi chế độ; camera không khả dụng; đổi ngôn ngữ và lưu lựa chọn; localStorage bị chặn vẫn chạy; âm thanh; chọn khung từ khay; nhập 4 file vào đúng ô; chế độ 1 tấm; lỗi đọc file hiện thông báo; tự chụp 4 tấm khác nhau và dừng stream; bấm lại nút chụp để hủy; bỏ bộ ảnh có xác nhận; chụp lại một ô từ tờ ảnh. Helper: ngày giờ địa phương và nội dung dấu; vùng chụp theo mặt nạ; kích thước bố cục.

Test capture mock `getUserMedia`, video.play và `captureFrame`; test file mock `readImageFile`. Chưa kiểm tra decode file thật, Canvas pixel, PNG thật, clipboard hệ điều hành, quyền camera hoặc thiết bị thật. Đừng dùng “12 test đạt” để xác nhận những phần đó.

## Checklist browser và thiết bị

| Viewport tham chiếu | Nội dung |
| --- | --- |
| 360×640 | Điện thoại thấp: thẻ mời camera nằm gọn trong khung ngắm, bốn công cụ một hàng, nút chụp không bị cắt |
| 390×844 | Điện thoại: camera ba chế độ, khay Khung/Lọc, tờ ảnh với thanh hành động dính đáy không che ô ghi chú khi cuộn |
| 768×1024 | Tablet dọc: cột app căn giữa, không cắt chữ |
| 1440×900 | Desktop: camera là cột giữa vừa màn hình; tờ ảnh hai cột |

Đây là viewport mục tiêu, không phải danh sách đã xác minh trong mọi lần bàn giao. Ảnh chụp màn hình gần nhất nằm ở `.impeccable/review/`.

- [ ] Cổng camera: mời, đang mở, từ chối quyền, không hỗ trợ; Thử lại, Chọn ảnh từ máy, hộp hướng dẫn.
- [ ] Ba chế độ: tỉ lệ mặt nạ đúng; Dải 4 cột trượt sau mỗi tấm; đổi chế độ bị khóa khi đang chụp dở.
- [ ] Tự chụp/Từng tấm, hẹn giờ 3/5, bấm lại nút chụp để hủy, đổi camera, bỏ bộ ảnh (xác nhận).
- [ ] Chọn 1–4 file, file không đọc được, nhập thêm vào ô trống.
- [ ] Tờ ảnh: chạm ô, chụp lại, lưu riêng; 5 tab; lưu PNG, sao chép (thành công và bị chặn), lưu từng tấm; so PNG thật với preview.
- [ ] VI/EN, ngôn ngữ còn sau refresh, ảnh không còn; âm thanh; giảm chuyển động; focus bàn phím.

Thử trên điện thoại bằng `npm run dev:https` (HTTPS tự ký qua `@vitejs/plugin-basic-ssl`, chỉ bật khi `MOYOO_HTTPS=1`). Kiểm tra PWA bằng `npm run build && npm run preview` vì service worker không đăng ký ở chế độ dev; khi đổi `public/sw.js` hãy tăng tên `CACHE`.

- [ ] PWA: nút Cài app ẩn khi đã cài; Android hộp cài; iOS 3 bước; mở offline; giữ biểu tượng có 3 lối tắt.

Camera cần HTTPS/localhost. Muốn mở từ điện thoại qua mạng LAN, cần cấu hình host truy cập được và secure context phù hợp; chỉ thêm `--host` không giải quyết HTTPS. Ghi thiết bị/trình duyệt đã thử, và báo rõ những bước chưa thể thử vì quyền hoặc môi trường.

## Đồng bộ tài liệu

1. Xác định source hoặc quyết định sản phẩm làm bằng chứng.
2. Cập nhật đúng tài liệu chuyên mục và README/AGENTS/skill nếu hướng dẫn bị ảnh hưởng.
3. Giữ [PRODUCT_DIRECTION.md](PRODUCT_DIRECTION.md) ở trạng thái giả thuyết cho đến khi chủ sản phẩm quyết định; không tự chuyển ý tưởng thành roadmap cam kết.
4. Kiểm tra liên kết Markdown, đường dẫn source và tìm các mô tả cũ còn sót.
5. Báo phạm vi kiểm tra thực tế. Đợt chỉ sửa docs không tự sửa code để che chênh lệch; ghi giới hạn đang có.
