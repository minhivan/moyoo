# Kiểu dữ liệu và catalog

Đối chiếu source ngày **2026-11-02**. Nguồn: `src/data/frames.ts`, `src/lib/photo.ts`, `src/lib/i18n.ts`, state trong `src/App.tsx`. Chưa có schema database hay model người dùng.

## Catalog

| Kiểu | Trường hoặc giá trị |
| --- | --- |
| `Frame` | `id`, `name` (VI), `nameEn`, `background`, `ink`, `stage` |
| `PhotoFilter` | `id`, `nameVi`, `nameEn`, `cssFilter` |
| `TemplateId` | `single`, `duo`, `strip-3`, `strip-4`, `grid-2x2`, `grid-6`, `film-4` |
| `TemplateOption` | `id`, `nameVi`, `nameEn`, `count: 1 \| 2 \| 3 \| 4 \| 6`, `slotAspect` (rộng/cao một ô), `column` (ô xếp một cột, khung ngắm hiện cột dải ảnh) |
| `StampStyle` | `letterpress` (Ghi chú), `timestamp` (Dấu ngày giờ), `clean` (Tối giản) |
| `PaperFinish` | `matte` (Giấy lì), `glossy` (Giấy bóng), `fiber` (Giấy sợi) |

`getTemplate(id)` trả `TemplateOption`. Chế độ chụp chính là template: thanh chế độ ở camera hiển thị cả ba.

### Sáu màu giấy

| ID | VI / EN | Background | Ink |
| --- | --- | --- | --- |
| `cream` | Kem / Cream | `#F4EFEB` | `#2B2927` |
| `noir` | Đen / Noir | `#1C1B1A` | `#F5F3EF` |
| `butter` | Bơ / Butter | `#F5E8BA` | `#4A422D` |
| `blush` | Hồng phấn / Blush Note | `#F0CDCE` | `#57373A` |
| `blue` | Xanh dương / Blue | `#C9D8E6` | `#324A5E` |
| `sage` | Xanh lá / Sage | `#CBD5C8` | `#30422E` |

`stage` vẫn có trong model nhưng UI hiện không đọc.

### Sáu bộ lọc

`normal` (Gốc), `vintage` (Film), `mono` (Đen trắng), `warm` (Tông ấm), `cool` (Tông lạnh), `fade` (Mờ nhẹ). Chuỗi `cssFilter` áp cho video, preview và Canvas.

## Phiên

- `step`: `camera | review`.
- `templateId` mặc định `strip-4`; frame `cream`, filter `normal`, stamp `letterpress`, paper `matte`, ghi chú rỗng (tối đa 28 ký tự ở input).
- `photos: Array<string | null>` dài bằng `count`; `null` là ô trống.
- `shotDate: Date` lúc ảnh đầu tiên của bộ vào.
- `retakeSlot`, `developingSlot`: `number | null`.
- `timerSeconds: 3 | 5` (mặc định 3), `autoPaced` mặc định bật, `facingMode` mặc định `user`, âm thanh bật.

## PrintOptions

```ts
interface PrintOptions {
  template?: TemplateId
  filterCss?: string
  date?: Date
  customNote?: string
  stampStyle?: StampStyle
  paperFinish?: PaperFinish
}
```

## Ngôn ngữ

`translations: Record<Language, Dictionary>`; `Dictionary` được suy ra từ bản tiếng Việt nên bản tiếng Anh phải đủ khóa (TypeScript bắt lỗi). `fill(template, values)` thay `{key}`. Toàn bộ chữ giao diện nằm trong dictionary; chỉ tên catalog (frame/filter/template/stamp/paper) nằm trong `frames.ts`.
