# Capture và xuất ảnh Canvas

Đối chiếu `src/lib/photo.ts`, `src/components/PrintPreview.tsx`, `src/components/CameraScreen.tsx` ngày **2026-11-02**. Nguyên tắc: thấy gì in nấy. Khung ngắm, bản xem trước và PNG dùng chung một hình học.

## Capture theo mặt nạ ô in

Khung ngắm là hộp 3:4 hiển thị video bằng `object-fit: cover`. Bên trong có mặt nạ rộng `VIEWFINDER_MASK` (86%) chiều rộng hộp, tỉ lệ đúng bằng `slotAspect` của chế độ. Phần ngoài mặt nạ được phủ màu khung.

`captureRect(videoW, videoH, { aspect, boxAspect, maskFraction })` tính vùng video nằm trong mặt nạ:

1. Vùng video hiển thị trong hộp (cover theo `boxAspect`).
2. Mặt nạ = `maskFraction` × chiều rộng vùng đó, cao theo `aspect` (hoặc giới hạn theo chiều cao).
3. Căn giữa trong video.

`captureFrame(video, options)` cắt đúng vùng đó, cạnh dài tối đa 1200px, lật gương nếu camera trước, trả JPEG 0.94, **không** áp bộ lọc. `boxAspect` lấy từ kích thước thật của khung ngắm lúc chụp.

`readImageFile(file)` trả data URL; ảnh nhập được crop giữa khi dựng PNG.

## Bố cục PNG (`getPrintLayout`)

| Chế độ | Canvas | Ô ảnh | Tỉ lệ ô | Tên app | Dấu |
| --- | --- | --- | --- | --- | --- |
| `single` (1 tấm) | 800×920 | 720×700 tại (40,40) | 720/700 | y=812, 40px | y=866 |
| `duo` (Đôi) | 1000×760 | 440×587 tại (40,40), (520,40) | 3:4 | y=690, 40px | y=734 |
| `strip-3` (Dải 3) | 660×1420 | 592×390; x=34, y=110+i×412 | 592/390 | y=75, 42px | y=1385 |
| `strip-4` (Dải 4) | 660×1820 | 592×390; x=34, y=110+i×412 | 592/390 | y=75, 42px | y=1785 |
| `grid-2x2` (Lưới 4) | 1080×1260 | 475×475 tại (45,110), (560,110), (45,620), (560,620) | 1 | y=72, 42px | y=1195 |
| `grid-6` (Lưới 6) | 1050×2010 | 460×575; x=50+(i mod 2)×490, y=120+⌊i/2⌋×605 | 4:5 | y=80, 46px | y=1965 |
| `film-4` (Cuộn film) | 460×1900 | 280×420; x=90, y=70+i×444 | 2:3 | y=50, 26px | y=1868 |

Mỗi ô có viền trắng 3px (`mat`), trừ `film-4` (`mat: 0`). `film-4` có `film`: nền film `#1A1410`, chữ cạnh `#F2B33D`, lỗ răng cưa hai bên (tô bằng màu khung, như giấy lộ qua lỗ) và số khung `1  1A` / `MOYOO 400` dưới mỗi ô; preview vẽ cùng dữ liệu. Kích thước pixel cố định, không ghi metadata 300 DPI.

## Thứ tự vẽ

1. Nền màu khung.
2. Mỗi ô: `filter = none`, vẽ viền trắng, rồi `filter = cssFilter` và vẽ ảnh crop giữa. Viền không bị nhuộm bộ lọc.
3. `filter = none`, chữ `moyoo` (800) và dấu.
4. Chất giấy (hằng số chung trong `src/lib/materials.ts`, preview dùng cùng giá trị):
   - `glossy`: một vùng phản sáng tròn rộng từ góc trên trái (`GLOSS_STOPS`, `GLOSS_ORIGIN`) phủ cả tờ, cộng một dải sáng ở mép trên mỗi ô ảnh (`GLOSS_EDGE`).
   - `fiber`: tile 180px các sợi giấy cong và chấm li ti theo màu mực, sinh bằng code với seed cố định (`fiberTile`), lặp liền mạch.
   - `matte`: không thêm gì.

Trước khi vẽ chữ, renderer chờ `document.fonts.load` cho Baloo 2; nếu API không có, dùng font dự phòng.

## Dấu chữ

`stampLabel(style, note, date)` dùng chung cho preview và PNG:

| Kiểu | Nội dung | Màu / font |
| --- | --- | --- |
| `letterpress` (Ghi chú) | `{ghi chú đã trim hoặc "moyoo studio"} • YYYY.MM.DD` | mực khung, 600 22px |
| `timestamp` (Dấu ngày giờ) | `'YY.MM.DD HH:mm` | `#FF7A00`, 700 24px |
| `clean` (Tối giản) | `moyoo studio` | mực khung, 500 22px |

Dấu Ghi chú có trái tim hồng vẽ tay, dấu Tối giản có ngôi sao theo màu mực, dấu ngày giờ không có hình. Hình vẽ là path SVG trong `DOODLES` (`materials.ts`), vẽ bằng `Path2D` cạnh chữ và căn giữa cả nhóm; preview dùng cùng path qua `components/Doodle.tsx`.

Ngày giờ là **giờ địa phương** (`formatStampDate`, `formatStampTime`), lấy từ `shotDate` của bộ ảnh.

## API

- `createPrintCanvas` / `createPrint(frame, photos, options)`: cần đủ số ảnh của bố cục, ném lỗi nếu thiếu.
- `downloadPrint`: tên file `moyoo-{template}-{frame.id}-YYYY-MM-DD.png` (ngày địa phương).
- `downloadSingleCut(photo, index, frame, options)`: một tấm theo bố cục `single`, tên `moyoo-cut-0{n}-{frame.id}.png`. "Lưu từng tấm" gọi tuần tự, là nhiều lượt tải, không phải ZIP.
- `copyPrintToClipboard`: truyền Promise<Blob> vào `ClipboardItem` ngay trong thao tác người dùng (để Safari giữ quyền), trả `boolean`. UI báo cả thành công và thất bại.

## Preview

`PrintPreview` đặt ô, tên app và dấu theo phần trăm của `getPrintLayout`; cỡ chữ theo `cqw`. Bộ lọc chỉ áp lên ảnh, chất giấy vẽ bằng lớp CSS tương ứng. Khác biệt còn lại: kết xuất font của trình duyệt và Canvas có thể lệch vài pixel; vị trí baseline chữ trong DOM là ước lượng.

## Chưa xác minh

Không có test pixel Canvas. `CanvasRenderingContext2D.filter` cần được kiểm tra trên Safari/iOS thật; nếu không hỗ trợ, PNG sẽ không có bộ lọc dù preview có.
