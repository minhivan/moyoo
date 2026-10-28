# Data Models & Catalog Schemas

This document defines all TypeScript data models, frame catalogs, filter configurations, and internationalization schemas.

---

## 1. Frame Catalog (`src/data/frames.ts`)

```ts
export type Frame = {
  id: string          // Unique identifier (used in CSS classes .mini-strip--{id})
  name: string        // Vietnamese label
  nameEn: string      // English label
  background: string  // Hex color for paper background and Canvas fill
  ink: string         // Hex color for typography and branding
  stage: string       // Ambient backdrop tint for the frame
}
```

### Registered Frames:
| ID | Vietnamese Name | English Name | Background (`background`) | Ink (`ink`) | Stage (`stage`) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `cream` | Kem | Cream | `#F4EFEB` | `#2B2927` | `#EDE8E3` |
| `noir` | Đen | Noir | `#1C1B1A` | `#F5F3EF` | `#2E2C2A` |
| `butter` | Butter | Butter | `#F5E8BA` | `#4A422D` | `#EDE0B2` |
| `blush` | Blush Note | Blush Note | `#F0CDCE` | `#57373A` | `#E5BFBF` |
| `blue` | Blue | Blue | `#C9D8E6` | `#324A5E` | `#BCCDD9` |
| `sage` | Sage | Sage | `#CBD5C8` | `#30422E` | `#BDC7B9` |

---

## 2. Photo Filters Catalog

```ts
export type PhotoFilter = {
  id: string
  nameVi: string
  nameEn: string
  cssFilter: string // Standard CSS filter string applied to video & Canvas
}
```

| ID | Vietnamese | English | CSS Filter String |
| :--- | :--- | :--- | :--- |
| `normal` | Gốc | Original | `none` |
| `vintage` | Film | Film | `sepia(0.3) contrast(1.15) brightness(1.03) saturate(1.2)` |
| `mono` | Đen trắng | B&W | `grayscale(1) contrast(1.25) brightness(1.02)` |
| `warm` | Tông ấm | Warm | `sepia(0.15) saturate(1.3) brightness(1.04) contrast(1.04)` |
| `cool` | Tông lạnh | Cool | `contrast(1.08) brightness(1.02) saturate(0.88) hue-rotate(15deg)` |
| `fade` | Mờ nhẹ | Faded | `brightness(1.06) contrast(0.92) saturate(1.1)` |

---

## 3. Template Layouts

```ts
export type TemplateId = 'strip-4' | 'grid-2x2'

export type TemplateOption = {
  id: TemplateId
  nameVi: string
  nameEn: string
  tagVi: string
  tagEn: string
}
```

---

## 4. Stamps & Archival Papers

```ts
export type StampStyle = 'letterpress' | 'timestamp' | 'clean'

export interface StampOption {
  id: StampStyle
  nameVi: string
  nameEn: string
  previewText: string
}

export type PaperFinish = 'matte' | 'glossy' | 'fiber'

export interface PaperFinishOption {
  id: PaperFinish
  nameVi: string
  nameEn: string
}
```

---

## 5. Strip Options (`src/lib/photo.ts`)

```ts
export interface StripOptions {
  template?: TemplateId
  filterCss?: string
  dateText?: string
  customNote?: string
  stampStyle?: StampStyle
  paperFinish?: PaperFinish
}
```

---

## 6. Internationalization (`src/lib/i18n.ts`)
- **Languages**: `'vi'` (Vietnamese - Default) | `'en'` (English).
- **Structure**: Strongly typed dictionary covering:
  - `welcomeHeading`, `welcomeSubtitle`, `welcomeCta`
  - `tabFrame`, `tabTemplate`, `tabFilter`, `tabStamp`, `tabFinish`
  - `signatureLabel`, `signaturePlaceholder`
  - `retakeSingleSlot`, `retakeThisPhoto`, `downloadSingleCuts`, `copyStripBtn`
  - Camera error dialogues and permission alerts.
