# Thiết kế và responsive

Đối chiếu source ngày **2026-11-02**. Hướng hiện tại: **Purikura, biến thể camera tràn màn hình** (chủ sản phẩm chọn 2026-11-02): nền mận đen quanh khung ngắm, khung ngắm mang màu giấy, hồng/tím làm điểm nhấn, bottom sheet sáng. Token đầy đủ nằm ở [DESIGN.md](../DESIGN.md) khi đã được ghi; file này giữ quy tắc làm việc.

## Ý tưởng

Điện thoại là máy purikura: khung ngắm "mặc" màu giấy đã chọn, bên trong là ô cắt đúng tỉ lệ ô sẽ in. Ở chế độ Dải 4, khung ngắm chính là cột dải ảnh: tấm đã chụp nằm trên, ô kế tiếp nằm dưới, cột trượt lên sau mỗi tấm. Chọn một thứ giống bóc một sticker: nhấc lên, viền tím, nghiêng nhẹ, có dấu tick.

## Màu

| Token | Giá trị | Dùng cho |
| --- | --- | --- |
| `--ground` | `#FFE3F1` | Nền app |
| `--surface` | `#FFFFFF` | Nút, thẻ, rail |
| `--ink` | `#2B1030` | Chữ chính, tab đang chọn |
| `--ink-soft` | `#6E3F62` | Chữ phụ (≥4.5:1 trên nền hồng và trắng) |
| `--hot` | `#FF3E9A` | Nút chụp (không có chữ) |
| `--pink` | `#D6116F` | Nút chính có chữ (Lưu ảnh, Mở camera) |
| `--violet` | `#7A3CFF` | Trạng thái đang chọn |
| `--danger` | `#B3132B` | Lỗi, xác nhận bỏ ảnh |

Màu khung giấy ở [catalog](DATA_MODELS.md) chỉ dùng cho khung ngắm, preview và PNG.

## Chữ

Một họ chữ: **Baloo 2** (variable, self-host qua `@fontsource-variable/baloo-2`, có tập Vietnamese). Cỡ làm việc 16px (nút, rail 14–15px, chú thích 13–14px); cỡ hiển thị chỉ cho logo (28px) và số đếm ngược; tiêu đề màn tờ ảnh chỉ dành cho trình đọc màn hình. Canvas dùng cùng font.

## Hình khối và chuyển động

- Bo góc 28 / 18 / 12px, viên thuốc cho chế độ và tab. Viền trắng 3–4px kiểu sticker quanh khung ngắm và ô ảnh.
- Một ngữ pháp chuyển động: `--spring` 400ms có vượt nhẹ cho chọn, khay, sheet, toast; số đếm ngược bật ra; ảnh "tráng" từ sáng mờ về rõ trong 1,2s. `prefers-reduced-motion` tắt gần hết chuyển động.
- Hình vẽ tay: trái tim hồng cạnh logo và trên dấu Ghi chú, ngôi sao trên dấu Tối giản (`src/lib/materials.ts`). Không dùng emoji hay ký tự Unicode thay icon; icon lấy từ Lucide.
- Chuyển động `--spring` có vượt nhẹ là chủ ý của hướng Purikura; bộ phát hiện thiết kế báo advisory "bounce-easing" và được để nguyên. Layout (như `aspect-ratio`) dùng `--out`, không nảy.

## Bố cục

| Kích thước | Hành vi |
| --- | --- |
| Điện thoại | Cột app toàn màn hình, tối đa 520px. Khung ngắm 3:4 rộng `min(100%, (100dvh − 372px) × 0.75)`, tối thiểu 200px. Nút chụp ở vùng ngón cái. Review có thanh hành động dính đáy: Sao chép · Lưu ảnh · Chụp mới |
| ≥768px | Thanh trên cao hơn, khoảng cách rộng hơn; camera vẫn là cột giữa |
| ≥960px | Review hai cột: tờ ảnh bên trái (dính khi cuộn), công cụ và hành động bên phải; cột app rộng tối đa 1040px |

Pinch zoom được giữ (`viewport` không khóa zoom), safe-area được tôn trọng.

## Âm thanh

`sound.ts` tạo âm bằng Web Audio với một `AudioContext` dùng chung: tiếng màn trập, tiếng tua phim (sawtooth 420→320Hz, 140ms), tiếng chạm. Nút loa ở thanh trên bật/tắt.

## Review hình ảnh

Kiểm tra theo [WORKFLOWS.md](WORKFLOWS.md). Ảnh chụp màn hình theo viewport không xác nhận camera thật, safe-area hay bàn phím trên thiết bị.
