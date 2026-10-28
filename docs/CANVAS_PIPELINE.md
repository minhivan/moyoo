# Canvas 2D Rendering & Export Pipeline

Located in `src/lib/photo.ts`, this module handles all frame capture, center-crop geometry, filter baking, stamp rendering, and multi-format exports.

---

## 1. Canvas Dimensions & Geometry

### A. Classic 1x4 Vertical Photostrip
- **Canvas Size**: `660 x 1820 px` (High-density print standard).
- **Background**: Solid fill with `frame.background`.
- **Header**: Centered at `x = 330, y = 75`, font `700 42px "Google Sans Flex", sans-serif`, color `frame.ink`.
- **4 Photo Cuts**:
  - Dimensions: `width = 592 px`, `height = 390 px`.
  - Position: `x = 34 px`, `y = 110 + index * 412 px`.
  - Photo Mat Border: `#FFFFFF` fill at `(x - 3, y - 3)` with size `(width + 6, height + 6)`.
- **Footer Stamp**: Centered at `x = 330, y = 1785`.

### B. Modern 2x2 Square Grid
- **Canvas Size**: `1080 x 1260 px`.
- **Background**: Solid fill with `frame.background`.
- **Header**: Centered at `x = 540, y = 72`, font `700 42px "Google Sans Flex", sans-serif`, color `frame.ink`.
- **4 Photo Cuts**:
  - Dimensions: `width = 475 px`, `height = 475 px` (1:1 square).
  - Positions:
    - Slot 0: `(45, 110)`
    - Slot 1: `(560, 110)`
    - Slot 2: `(45, 620)`
    - Slot 3: `(560, 620)`
  - Photo Mat Border: `#FFFFFF` fill with 3px outset.
- **Footer Stamp**: Centered at `x = 540, y = 1195`.

### C. Single Cut Polaroid Export (`downloadSingleCut`)
- **Canvas Size**: `800 x 920 px`.
- **Photo Cut**: `width = 720 px`, `height = 700 px`, centered with 40px margin.
- **Footer Caption**: `moyoo • 0{index + 1}` at `y = 855`, font `700 26px "Google Sans Flex"`.

---

## 2. Center-Crop Algorithm
To ensure captured video (varying 4:3 or 16:9 ratios) fills the slot without distortion:

```ts
const ratio = Math.max(targetWidth / image.width, targetHeight / image.height)
const cropWidth = targetWidth / ratio
const cropHeight = targetHeight / ratio

context.drawImage(
  image,
  (image.width - cropWidth) / 2,   // Center source X
  (image.height - cropHeight) / 2, // Center source Y
  cropWidth,
  cropHeight,
  targetX,
  targetY,
  targetWidth,
  targetHeight
)
```

---

## 3. Live Filter Baking
Filter effects (B&W, Vintage Film, Warm, Cool, Faded) are baked directly into the canvas pixels:
```ts
if (filterCss !== 'none') {
  context.filter = filterCss
} else {
  context.filter = 'none'
}
// Draw photo...
context.filter = 'none' // ALWAYS reset before drawing branding & stamps!
```

---

## 4. Stamp & Deboss Rendering

| Stamp Style (`StampStyle`) | Color / Font | Content Format |
| :--- | :--- | :--- |
| `'letterpress'` | `frame.ink`, `600 21px "Google Sans Flex"` | `{customNote} • {dateText}` (or fallback `moyoo studio • {dateText}`) |
| `'timestamp'` | `#FF7A00` (Retro Camcorder), `700 24px "Google Sans Flex"` | `'26 10 28 17:30` (Year, month, day, 24h time) |
| `'clean'` | `frame.ink`, `500 18px "Google Sans Flex"` | `moyoo studio` |

---

## 5. Keepsake Export Utilities

- **`downloadStrip(frame, photos, options)`**:
  Generates PNG and triggers browser file download named `moyoo-{template}-{frame.id}-{YYYY-MM-DD}.png`.
- **`downloadSingleCut(photoUrl, index, frame)`**:
  Renders individual Polaroid cut and downloads as `moyoo-cut-0{index + 1}-{frame.id}.png`.
- **`copyStripToClipboard(frame, photos, options)`**:
  Converts data URL to PNG Blob and writes directly to system clipboard via `navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])`. Returns `boolean` success status for toast notification.
