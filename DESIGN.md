---
name: moyoo
description: Máy purikura tràn màn hình trên điện thoại: nền mận đen, khung ngắm mặc màu giấy, thấy gì in nấy.
colors:
  night: "#120a12"
  night-2: "#1d121f"
  night-3: "#2b1c2e"
  night-raised: "#3a2740"
  on-night: "#fff4fa"
  on-night-soft: "#c9b2c4"
  shutter-hot-pink: "#ff3e9a"
  label-pink: "#d6116f"
  label-pink-press: "#b30d5c"
  select-violet: "#7a3cff"
  select-violet-soft: "#ece4ff"
  danger-red: "#b3132b"
  sheet-white: "#ffffff"
  plum-ink: "#2b1030"
  plum-ink-soft: "#6e3f62"
  blush-line: "#f6c3dd"
  candy-ground: "#ffe3f1"
  date-stamp-orange: "#ff7a00"
  film-base: "#1a1410"
  film-ink: "#f2b33d"
typography:
  display:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "clamp(6rem, 34cqw, 9.5rem)"
    fontWeight: 800
    lineHeight: 1
  brand:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "26px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  body:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.4
  label:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 700
    lineHeight: 1
  label-sm:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
    lineHeight: 1
  caption:
    fontFamily: "'Baloo 2 Variable', 'Baloo 2', ui-rounded, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  pill: "999px"
  lg: "28px"
  md: "18px"
  rail: "14px"
  sm: "12px"
  slot: "10px"
  print: "4px"
spacing:
  3xs: "2px"
  2xs: "4px"
  xs: "6px"
  sm: "8px"
  sm-plus: "10px"
  md: "12px"
  gutter: "16px"
  lg: "20px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.label-pink}"
    textColor: "{colors.sheet-white}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.label-pink-press}"
  button-primary-wide:
    backgroundColor: "{colors.label-pink}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.pill}"
    height: "56px"
  button-ghost:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-ghost-hover:
    backgroundColor: "{colors.night-raised}"
  button-quiet:
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-quiet-hover:
    backgroundColor: "{colors.select-violet-soft}"
  button-violet:
    backgroundColor: "{colors.select-violet}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-danger:
    backgroundColor: "{colors.danger-red}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.pill}"
    padding: "0 20px"
    height: "48px"
  button-square:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.md}"
    size: "56px"
  shutter:
    backgroundColor: "{colors.shutter-hot-pink}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.pill}"
    size: "80px"
  shutter-counting:
    backgroundColor: "{colors.night-3}"
  round-button:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    size: "52px"
  icon-button:
    textColor: "{colors.on-night}"
    rounded: "{rounded.pill}"
    size: "44px"
  icon-button-hover:
    backgroundColor: "{colors.night-3}"
  tool-pill:
    backgroundColor: "{colors.night-2}"
    textColor: "{colors.on-night}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "40px"
  tool-pill-on:
    backgroundColor: "{colors.select-violet}"
  mode:
    textColor: "{colors.on-night-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 12px"
    height: "40px"
  mode-selected:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.sheet-white}"
  tab:
    textColor: "{colors.on-night-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "0 14px"
    height: "40px"
  tab-selected:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.plum-ink}"
  rail-item:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.on-night-soft}"
    typography: "{typography.label-sm}"
    rounded: "{rounded.rail}"
    padding: "8px 10px"
    width: "66px"
  rail-item-selected:
    backgroundColor: "{colors.night-raised}"
    textColor: "{colors.sheet-white}"
  reel-cell:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.on-night-soft}"
    rounded: "{rounded.sm}"
    size: "42px"
  input-note:
    backgroundColor: "{colors.night-3}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.sm}"
    padding: "0 16px"
    height: "48px"
  gate-card:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.plum-ink}"
    rounded: "22px"
    padding: "22px 18px 14px"
  sheet:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.lg}"
    padding: "10px 20px 20px"
  segmented-selected:
    backgroundColor: "{colors.plum-ink}"
    textColor: "{colors.sheet-white}"
    rounded: "{rounded.pill}"
    height: "36px"
  toast:
    backgroundColor: "{colors.sheet-white}"
    textColor: "{colors.plum-ink}"
    rounded: "{rounded.md}"
    padding: "12px 18px"
  toast-error:
    backgroundColor: "{colors.danger-red}"
    textColor: "{colors.sheet-white}"
---

# Design System: moyoo

## Overview

**Creative North Star: "Tờ ảnh đang in giữa đêm mận"**

moyoo là một máy purikura tràn màn hình: quanh camera là nền mận đen (`night`), còn khung ngắm là tờ giấy ảnh đang in. Khung ngắm bo 28px, nền là màu giấy của khung đã chọn (`--paper`), và mặt nạ ô ảnh cắt đúng tỉ lệ ô in (`slotAspect` trong `src/data/frames.ts`), viền trắng 3px như mép sticker. Bóng tối lùi lại để màu nằm ở giấy, ở ảnh và ở ba điểm nhấn: hồng nóng là chụp, tím là đang chọn, hồng đậm là hành động có chữ.

Bảy bố cục in (1 tấm, Đôi, Dải 3, Dải 4, Lưới 4, Lưới 6, Cuộn film) dùng chung một nguồn toạ độ (`getPrintLayout` trong `src/lib/photo.ts`) cho khung ngắm, bản xem trước DOM (`PrintPreview`) và PNG. Bố cục dạng cột (dải 3, dải 4, film) biến khung ngắm thành chính dải ảnh: ô đang chụp neo dưới viên trạng thái, các ô kế tiếp xếp bên dưới, cả cột trượt lên một ô sau mỗi tấm. Cuộn film đổi giấy thành nền phim nâu đen với hàng lỗ răng cưa hai bên, lỗ mang màu giấy khung.

Mật độ là của app điện thoại: một cột tối đa 520px, mọi điều khiển ở vùng ngón cái, vùng chạm từ 40–44px. Những thứ cần đọc kỹ (xin quyền, cài đặt, cài app, xác nhận xoá) nổi lên thành bề mặt trắng sáng kiểu bottom sheet iOS với chữ mực mận. Chuyển động có một ngữ pháp: 400ms `--spring` vượt nhẹ cho vị trí và tỉ lệ, 160ms `--out` cho màu và bóng.

**Key Characteristics:**
- Nền mận đen ba bậc (`night`, `night-2`, `night-3`), không đen trung tính.
- Khung ngắm mặc màu giấy; ô ảnh cắt bằng `box-shadow` 200vmax màu giấy, keyline trắng 3px.
- Bề mặt cần đọc là trắng sáng với chữ mực mận; điều khiển trên nền tối là viên mận.
- Một họ chữ Baloo 2, 700 cho mọi thứ bấm được, 800 cho tiêu đề và số.
- Chọn món = vòng tím 3px + nhấc + nghiêng -2deg; chọn chế độ = viên đảo nền + chấm hồng.
- Khi đếm ngược, mọi điều khiển mờ về 0, chỉ còn số đếm và nút hủy.

## Colors

Mận đen làm sân khấu, giấy và ảnh mang màu, ba giọng nhấn mỗi giọng một việc.

### Primary
- **Hồng nóng nút chụp** (`shutter-hot-pink`): màu của khoảnh khắc chụp. Nút chụp 80px, viền chữ số đếm ngược, chấm dưới chế độ đang chọn, vòng 3px quanh ô kế tiếp trong reel, chấm nhịp khi đang mở camera, ô biểu tượng của thẻ xin quyền, chấm báo trên nút cài đặt, và trái tim cạnh chữ `moyoo` (`HEART_PINK`).
- **Hồng đậm nhãn** (`label-pink`, nhấn `label-pink-press`): mọi nút chính có chữ (Mở camera, Thử lại, Lưu ảnh, số bước cài app). Đậm hơn hồng nóng để chữ trắng đủ tương phản.

### Secondary
- **Tím chọn** (`select-violet`, nền nhạt `select-violet-soft`): trạng thái đang chọn hoặc đang bật. Viên công cụ đang mở hoặc Tự chụp bật, vòng 3px quanh ô rail đã chọn và dấu tick, ô ảnh đang chỉnh trên tờ in, công tắc bật, viền trong ô nhập khi focus, vòng focus 3px toàn cục, `accent-color`, `::selection`. Nền nhạt chỉ dùng trong bề mặt trắng (hover nút quiet, ô biểu tượng lợi ích cài app).

### Tertiary (vật liệu in, không phải chrome)
- **Cam dấu ngày** (`date-stamp-orange`): chữ của dấu "Dấu ngày giờ" trên tờ in và PNG. Chip xem trước trên giấy kem dùng bản đậm hơn `#c25a00` để đọc được.
- **Nền phim** (`film-base`) và **mực phim** (`film-ink`): nền và chữ số khung, `MOYOO 400`, chữ `moyoo` của bố cục Cuộn film. Lỗ răng cưa tô bằng màu giấy khung.

### Neutral
- **Mận đen** (`night`): nền toàn app, thanh hành động dính đáy ở màn xem lại, vòng trong 5px của nút chụp.
- **Mận đêm 2** (`night-2`): viên công cụ, khay tab.
- **Mận đêm 3** (`night-3`): nút ghost, nút tròn, nút vuông, viên chế độ đang chọn, ô rail, ô reel, ô nhập, hover nút icon, thanh cuộn.
- **Mận nổi** (`night-raised`): hover nút ghost và nền ô rail đã chọn; bậc sáng nhất của nền tối.
- **Chữ trên đêm** (`on-night`): chữ chính trên nền tối, chữ `moyoo`.
- **Chữ phụ trên đêm** (`on-night-soft`): chế độ và tab chưa chọn, nhãn rail, gợi ý dưới tờ in, nhãn ô nhập.
- **Trắng sheet** (`sheet-white`): bottom sheet, thẻ gate, toast, tab đang chọn, nút Xong của khay, và mọi keyline.
- **Mực mận** (`plum-ink`): chữ chính trong bề mặt trắng, viên segmented đang chọn.
- **Mận nhạt** (`plum-ink-soft`): chữ phụ trong bề mặt trắng, link, ô lưới trong biểu tượng bố cục.
- **Viền phấn hồng** (`blush-line`): viền trong 2px của nút quiet trên bề mặt trắng.
- **Hồng kẹo** (`candy-ground`): nền khối hướng dẫn các bước trong sheet cài app; không dùng làm nền app.
- **Đỏ lỗi** (`danger-red`): nút xoá phiên, toast lỗi.

### Giấy in (catalog, không phải token giao diện)
Sáu khung trong `src/data/frames.ts` (Kem, Đen, Bơ, Hồng phấn, Xanh dương, Xanh lá), mỗi khung có `background`, `ink`, `stage`. Khung ngắm nhận qua `--paper`, `--paper-ink` và `--hole`; ô trống và số ô pha bằng `color-mix(in srgb, var(--paper-ink) 8–10%, var(--paper))`, chữ số ô 55%.

### Named Rules
**The Three Voices Rule.** Hồng nóng là chụp (và "ảnh tiếp theo rơi vào đâu"), hồng đậm là hành động có chữ, tím là đang chọn hoặc đang bật. Không đổi vai: không dùng tím cho nút lưu, không dùng hồng nóng cho nút có chữ.

**The Paper Carries The Colour Rule.** Màu giấy khung chỉ sống trong khung ngắm, swatch và tờ in. Chrome luôn là mận đen + bề mặt trắng + ba giọng nhấn.

## Typography

**Display Font:** Baloo 2 Variable (với Baloo 2, ui-rounded, system-ui)
**Body Font:** Baloo 2 Variable, cùng họ
**Label/Mono Font:** không có họ riêng; số dùng `font-variant-numeric: tabular-nums` (`.tabular`)

**Character:** Một họ chữ tròn, béo, thân thiện như chữ in trên sticker; độ đậm gánh phân cấp nhiều hơn cỡ chữ. PNG dùng cùng họ (`EXPORT_FONT`) và chờ font tải xong trước khi vẽ.

### Hierarchy
- **Display** (800, clamp(6rem, 34cqw, 9.5rem), 1): chỉ số đếm ngược; chữ trắng, viền `-webkit-text-stroke` 7px hồng nóng, `paint-order: stroke fill`.
- **Brand** (800, 26px, -0.04em): chữ `moyoo` viết thường trên thanh trên, kèm tim hồng nóng nghiêng 12deg. Trong khung ngắm và trên tờ in, `moyoo` 800 mang mực của giấy.
- **Headline** (800, 22px, 1.15, -0.02em): tiêu đề thẻ gate và sheet; số thứ tự ô trong dải khung ngắm. Khung thấp dưới 420px thì tiêu đề gate xuống 19px.
- **Body** (400, 16px, 1.4): nội dung chung; ô nhập 16px/600 để iOS không zoom; dòng cài đặt 16px/700.
- **Label** (700, 15px, 1): chế độ, tab; nút 16px, nút rộng 18px.
- **Label-sm** (700, 14px, 1): viên công cụ, ô rail, viên trạng thái, chip.
- **Caption** (400–600, 13–15px): gợi ý dưới tờ in, ghi chú quyền riêng tư (13px), nội dung gate (15px), ghi chú cài đặt.

### Named Rules
**The Weight-Not-Size Rule.** Bấm được thì 700, tiêu đề và số 800, đọc thì 400. Cỡ hiển thị lớn chỉ dành cho số đếm ngược.

## Layout

Một cột app căn giữa, `max-width: 520px`, cao `100dvh`, tôn trọng safe-area. Thanh trên cao 56px (64px từ 768px), lề `0 10px 0 16px`.

Màn camera: thanh trên mỏng, khung ngắm `flex: 1` chiếm gần hết chiều cao (tối thiểu 260px, lề ngang 8px, 12px từ 768px), rồi dock: hàng viên công cụ căn giữa (Khung, Lọc, Hẹn giờ, Tự chụp), dải chế độ cuộn ngang có snap căn giữa với mép mờ 32px, và thanh chụp lưới `1fr auto 1fr` tối đa 360px (chọn ảnh, nút chụp, đổi camera). Khi đã chụp dở, dải chế độ nhường chỗ cho reel ô nhỏ 42px; khi mở Khung hoặc Lọc, hàng công cụ thành khay rail + nút Xong. Từ 960px màn camera nới tới `min(100vw − 48px, 1200px)` và khung ngắm thành ngang.

Khung ngắm là container `size`: chiều rộng mặt nạ là `min(N·cqw, N·cqh·slotAspect)`, khoảng giữa các ô dải là 3.2cqw. Bố cục cột neo ô đang chụp ở `--live-top` 56px (64px từ 960px).

Màn xem lại trên điện thoại: tờ in nghiêng -1.5deg rộng `min(86vw, 380px, 56dvh × tỉ lệ tờ)`, gợi ý, khay tab, rail công cụ, rồi thanh hành động dính đáy (nền `night`, nút vuông hai bên nút Lưu ảnh rộng). Từ 960px: hai cột `minmax(0, 1.1fr) minmax(320px, 0.9fr)`, khoảng cột 48px, tờ in dính trên cột trái (tới 460px), app nới tới 1040px, rail bọc dòng, thanh hành động thôi dính.

Nhịp khoảng cách là các bước nhỏ 2–24px (xem `spacing`): 2–8px giữa các viên trong một nhóm, 10–12px giữa các nhóm trong dock, 16px lề màn xem lại, 20px lề sheet.

## Elevation & Depth

Chiều sâu có hai chế độ theo bề mặt. Trên nền mận đen, chiều sâu là các bậc sáng dần của mận (`night` → `night-2` → `night-3` → `night-raised`), và bóng (khi có) là bóng tối thuần làm chìm nền xung quanh: tờ in, thanh hành động, toast. Trên giấy và bề mặt trắng, bóng nhuộm mận. Vòng 0-blur (keyline trắng, vòng tím, vòng hồng) là nét viền của thế giới này, thay cho `border`.

### Shadow Vocabulary
- **Shutter rings** (`box-shadow: 0 0 0 5px var(--night), 0 0 0 8px #fff`): chỉ nút chụp; khe mận rồi vòng trắng như nút máy purikura.
- **Keyline** (`box-shadow: 0 0 0 3px #fff`): mép sticker quanh mặt nạ ô ảnh và ô dải; 2px cho ô reel đã chụp và swatch trong viên công cụ.
- **Paper mask** (`box-shadow: 0 0 0 3px #fff, 0 0 0 200vmax var(--paper)`): phủ màu giấy ra ngoài ô ảnh. Film bỏ keyline, chỉ còn lớp giấy.
- **Select ring** (`box-shadow: 0 0 0 3px var(--violet)`): ô rail đã chọn.
- **Next ring** (`box-shadow: 0 0 0 3px var(--hot)`): ô kế tiếp trong reel, kèm nhấc 3px.
- **Pink lift** (`box-shadow: 0 6px 16px rgb(214 17 111 / 0.3)`): nút chính hồng đậm.
- **Lift** (`box-shadow: 0 6px 16px rgb(122 60 255 / 0.28)`, `--lift`): nút tím.
- **Soft** (`box-shadow: 0 10px 28px rgb(107 22 74 / 0.14)`, `--soft`): thẻ chờ camera, icon app trong sheet cài đặt.
- **Gate** (`box-shadow: 0 16px 40px rgb(18 10 18 / 0.28)`): thẻ gate trên giấy khung ngắm.
- **Print drop** (`filter: drop-shadow(0 18px 28px rgb(0 0 0 / 0.45))`): tờ in trên màn xem lại.
- **Night drop** (`0 -10px 24px rgb(0 0 0 / 0.35)` cho thanh hành động, `0 12px 28px rgb(0 0 0 / 0.35)` cho toast): bề mặt nổi trên nền tối.

### Named Rules
**The Rings Not Borders Rule.** Viền là vòng `box-shadow` 0-blur (trắng 2–3px, tím 3px, hồng 3px) hoặc viền trong `inset`; không dùng `border` nét cho bề mặt.

**The Surface-Tinted Shadow Rule.** Trên giấy và bề mặt trắng, bóng nhuộm mận (`rgb(107 22 74)` hoặc `rgb(18 10 18)`); bóng đen thuần chỉ dùng để thả vật thể xuống nền mận đen. Không bóng lệch cứng.

## Shapes

Bo tròn hào phóng và có thứ bậc: viên thuốc (`pill`) cho mọi nút, viên công cụ, chế độ, tab và segmented; `lg` 28px cho khung ngắm và mép trên sheet; 22px cho thẻ gate; `md` 18px cho toast, thẻ chờ và nút vuông; 16px cho nút chọn ảnh; `rail` 14px cho ô rail; `sm` 12px cho mặt nạ ô ảnh, ô dải, ô reel và ô nhập; `slot` 10px cho swatch, ảnh thu nhỏ và chip giấy. Tờ in là ngoại lệ có chủ ý: góc `print` 4px như giấy ảnh thật, ô ảnh trên tờ in vuông góc với viền giấy trắng 3px (`mat`). Bố cục film hạ mặt nạ và ô dải về 4px, lỗ răng cưa bo 3–4px.

Nghiêng là một phần của hình: ô rail đã chọn -2deg, tờ in -1.5deg, ô biểu tượng thẻ gate -6deg, tim logo 12deg. Nét vẽ tay (tim, sao trong `DOODLES`) là một nét 2px đầu tròn trên lưới 24×24, chỉ ở dấu ấn trên tờ in và chip xem trước dấu.

## Components

### Buttons
Viên thuốc chắc, đậm, nhấn xuống là co lại.
- **Shape:** viên thuốc (999px), cao 48px; nút rộng 56px chữ 18px.
- **Primary:** hồng đậm, chữ trắng 700, bóng pink lift; hover sang hồng nhấn.
- **Ghost (trên nền tối):** mận đêm 3, chữ on-night; hover mận nổi. Trong sheet trắng, ghost thành trong suốt với viền trong phấn hồng 2px.
- **Quiet (trong bề mặt trắng):** trong suốt, chữ mực mận, viền trong phấn hồng 2px; hover tím nhạt.
- **Violet / Danger:** tím đặc cho hành động phụ trên tờ in (chụp lại ô); đỏ cho xoá phiên.
- **Square:** 56×56, bo 18px, chỉ icon, hai bên nút Lưu ảnh.
- **Press:** `scale(0.96)` theo 400ms `--spring`; disabled 0.6 opacity.
- **Link:** chữ mận nhạt 14px/600, gạch chân lệch 3px.

### Shutter
Nút chụp 80px hồng nóng, khe mận 5px rồi vòng trắng 8px. Nhấn `scale(0.9)`; đang đếm chuyển mận đêm 3; disabled `#5b3550` với vòng `#6d5468`. Hai bên là nút 52px mận đêm 3 (chọn ảnh bo 16px và hiện ảnh mới nhất; đổi camera tròn), nhấn `scale(0.92)`.

### Chips (tool pill, mode, tab, segmented)
- **Tool pill:** viên mận đêm 2, 40px, icon + nhãn 14px/700 (tối đa 120px, cắt bằng dấu ba chấm); Khung có swatch 18px viền trắng 2px. Bật là tím đặc.
- **Mode:** chữ 15px/700 on-night-soft trên nền trong suốt; mục chọn là viên mận đêm 3 chữ trắng, chấm hồng nóng 6px ngay dưới. Cuộn ngang snap giữa, mép mờ hai bên.
- **Tabs:** khay viên mận đêm 2, tab chọn là viên trắng chữ mực mận.
- **Segmented (trong sheet):** khay `#f6e9f0`, mục chọn mực mận đặc chữ trắng.
- **Chip btn:** viên mận đêm 3, 40px, ở thanh trên khi chụp lại một ô.

### Rail (chọn khung, lọc, bố cục, dấu, giấy)
Hàng ngang cuộn snap, mép phải mờ 28px. Ô mận đêm 3, bo 14px, tối thiểu 66×44px, swatch 40px hoặc ảnh 52px bo 10px. Ô chọn: nền mận nổi, chữ trắng, vòng tím 3px, nhấc 3px, nghiêng -2deg, dấu tick tím 22px tách nền bằng vòng mận 3px. Biểu tượng bố cục là lưới ô nhỏ trên nền kem (`layout-glyph`), film có nền phim, ô vàng phim và mép chấm. Từ 960px rail bọc dòng.

### Reel
Hàng ô 42px bo 12px thay chỗ dải chế độ khi đã chụp dở: ô trống mận đêm 3 mang số; ô đã chụp có keyline trắng 2px; ô kế tiếp có vòng hồng nóng 3px và nhấc 3px. Ảnh mới "hiện hình" 1.2s.

### Cards / Containers
- **Gate card:** trắng, bo 22px, bóng gate, đặt trong khung ngắm trên màu giấy; ô biểu tượng 52px hồng nóng nghiêng -6deg có keyline trắng. Container query: khung thấp dưới 420px thì ẩn biểu tượng và nén khoảng cách.
- **Thẻ chờ camera:** trắng, bo 18px, chấm hồng nóng nhịp 1.2s.
- **Sheet:** bottom sheet trắng, bo 28px hai góc trên, tay nắm 40×5px, lớp phủ đen 50%, trượt lên theo 400ms `--spring`; hai nút chia đôi. Dòng cài đặt 56px, phân cách 1px `#f3e3ec`; công tắc 52×32 tím khi bật.
- **Toast:** trắng chữ mực mận (lỗi: đỏ chữ trắng), bo 18px, rơi xuống từ dưới thanh trên.

### Inputs / Fields
- **Style:** mận đêm 3, bo 12px, cao 48px, chữ trắng 16px/600, placeholder `#a58ea0`.
- **Focus:** viền trong chuyển tím 2px (thay cho outline).

### Navigation
Thanh trên mỏng: `moyoo` + tim bên trái; nút icon tròn 44px (âm thanh, cài đặt có chấm báo hồng) bên phải. Không có điều hướng nhiều trang; khi đang đếm, cả thanh mờ về 0.

### Viewfinder (signature)
Khung bo 28px, nền `--paper`, mặt nạ ô ảnh đúng tỉ lệ ô in với keyline trắng 3px, phần ngoài phủ màu giấy. Đổi bố cục thì rộng và tỉ lệ mặt nạ chuyển 400ms. Trên đầu: viên trạng thái mận 62% chữ trắng. Bố cục cột: dải ô bên dưới ô đang chụp, cả cột trượt lên theo `--spring`. Bố cục khác: chữ `moyoo` mực giấy ở đáy. Film: nền phim, hàng lỗ răng cưa 12px hai bên mặt nạ, lỗ màu giấy. Chụp xong có chớp trắng 260ms và ảnh hiện hình 1.2s (sáng, nhạt màu, mờ dần về thật).

### Print (signature)
Bản DOM song sinh của PNG: cùng toạ độ ô, lỗ và chữ (`getPrintLayout`), cùng chất liệu (`src/lib/materials.ts`). Bảy bố cục; `moyoo` 800 ở đầu (dải, lưới, film) hoặc đáy (1 tấm, đôi); dấu ấn ở đáy kèm nét vẽ tay. Film thêm số khung và `MOYOO 400` bằng mực phim dưới mỗi ô. Ba chất giấy: lì, bóng (một vệt sáng rộng từ góc trên trái theo `GLOSS_STOPS`, mép trên mỗi ảnh bắt sáng), sợi (tile 180px thớ cong cố định seed, nhuộm mực giấy). Tờ in vào màn bằng animation `stick` (từ nghiêng -6deg, nhỏ, thấp lên vị trí); ô đang chỉnh có outline tím.

## Do's and Don'ts

### Do:
- **Do** dùng đúng một ngữ pháp chuyển động cho vị trí, tỉ lệ, nhấn và vào màn: 400ms `var(--spring)` (`cubic-bezier(0.34, 1.56, 0.64, 1)`). Độ vượt nhẹ này là ngữ pháp duy nhất của thế giới, được giữ có chủ ý dù bộ dò đánh dấu là bounce easing; màu và bóng đi 160ms `var(--out)`, mờ điều khiển 200ms `var(--out)`.
- **Do** để khung ngắm luôn mặc màu giấy và cắt ô đúng `slotAspect`; bố cục mới phải khai báo trong `frames.ts` và `getPrintLayout` trước khi có giao diện.
- **Do** cho xem trước và PNG đọc chung `materials.ts` và `getPrintLayout`; mọi thay đổi chất liệu in sửa ở đó, không ở CSS riêng.
- **Do** đưa nội dung cần đọc kỹ (quyền, cài đặt, xác nhận) lên bề mặt trắng chữ mực mận; điều khiển nhanh ở lại trên nền mận.
- **Do** biểu đạt món đã chọn bằng tím + nhấc + nghiêng -2deg, và chế độ đã chọn bằng viên đảo nền + chấm hồng.
- **Do** để mọi vùng chạm từ 40px (nút icon 44px) và tắt chuyển động khi `prefers-reduced-motion` (đã về 1ms toàn cục).

### Don't:
- **Don't** dùng đen hoặc xám trung tính cho chrome camera; nền là mận đen `night`, và khung ngắm không bao giờ là video trần sát mép trên nền đen.
- **Don't** đưa màu giấy khung vào chrome, hay dùng hồng nóng cho nút có chữ.
- **Don't** dùng bóng lệch cứng, hay bóng đen thuần trên bề mặt trắng.
- **Don't** thêm họ chữ thứ hai; mọi cỡ và trọng lượng đều là Baloo 2.
- **Don't** rải nét vẽ tay tim/sao làm trang trí giao diện; chúng chỉ ở dấu ấn trên tờ in và chip xem trước dấu.
