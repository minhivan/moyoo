export type Frame = {
  id: string
  name: string
  nameEn: string
  background: string
  ink: string
  stage: string
}

export type PhotoFilter = {
  id: string
  nameVi: string
  nameEn: string
  cssFilter: string
}

export type TemplateId = 'strip-4' | 'grid-2x2'

export type TemplateOption = {
  id: TemplateId
  nameVi: string
  nameEn: string
  tagVi: string
  tagEn: string
}

export type StampStyle = 'letterpress' | 'timestamp' | 'clean'

export interface StampOption {
  id: StampStyle
  nameVi: string
  nameEn: string
  previewText: string
}

export const stampOptions: StampOption[] = [
  { id: 'letterpress', nameVi: 'Dập chìm Studio', nameEn: 'Letterpress', previewText: 'moyoo studio • 2026' },
  { id: 'timestamp', nameVi: 'Dấu cam cổ điển', nameEn: 'Orange Cam', previewText: "'26 10 28 17:30" },
  { id: 'clean', nameVi: 'Tối giản', nameEn: 'Clean Border', previewText: 'moyoo' },
]

export type PaperFinish = 'matte' | 'glossy' | 'fiber'

export interface PaperFinishOption {
  id: PaperFinish
  nameVi: string
  nameEn: string
}

export const paperFinishes: PaperFinishOption[] = [
  { id: 'matte', nameVi: 'Lì mỹ thuật', nameEn: 'Fine Matte' },
  { id: 'glossy', nameVi: 'Tráng bóng', nameEn: 'Resin Gloss' },
  { id: 'fiber', nameVi: 'Thớ sợi film', nameEn: 'Raw Fiber' },
]

export const samplePhotos: string[] = [
  '/samples/shot1.jpg',
  '/samples/shot2.jpg',
  '/samples/shot3.jpg',
  '/samples/shot4.jpg',
]

export const frames: Frame[] = [
  {
    id: 'cream',
    name: 'Kem',
    nameEn: 'Cream',
    background: '#F4EFEB',
    ink: '#2B2927',
    stage: '#EDE8E3',
  },
  {
    id: 'noir',
    name: 'Đen',
    nameEn: 'Noir',
    background: '#1C1B1A',
    ink: '#F5F3EF',
    stage: '#2E2C2A',
  },
  {
    id: 'butter',
    name: 'Butter',
    nameEn: 'Butter',
    background: '#F5E8BA',
    ink: '#4A422D',
    stage: '#EDE0B2',
  },
  {
    id: 'blush',
    name: 'Blush Note',
    nameEn: 'Blush Note',
    background: '#F0CDCE',
    ink: '#57373A',
    stage: '#E5BFBF',
  },
  {
    id: 'blue',
    name: 'Blue',
    nameEn: 'Blue',
    background: '#C9D8E6',
    ink: '#324A5E',
    stage: '#BCCDD9',
  },
  {
    id: 'sage',
    name: 'Sage',
    nameEn: 'Sage',
    background: '#CBD5C8',
    ink: '#30422E',
    stage: '#BDC7B9',
  },
]

export const photoFilters: PhotoFilter[] = [
  {
    id: 'normal',
    nameVi: 'Gốc',
    nameEn: 'Original',
    cssFilter: 'none',
  },
  {
    id: 'vintage',
    nameVi: 'Film',
    nameEn: 'Film',
    cssFilter: 'sepia(0.3) contrast(1.15) brightness(1.03) saturate(1.2)',
  },
  {
    id: 'mono',
    nameVi: 'Đen trắng',
    nameEn: 'B&W',
    cssFilter: 'grayscale(1) contrast(1.25) brightness(1.02)',
  },
  {
    id: 'warm',
    nameVi: 'Tông ấm',
    nameEn: 'Warm',
    cssFilter: 'sepia(0.15) saturate(1.3) brightness(1.04) contrast(1.04)',
  },
  {
    id: 'cool',
    nameVi: 'Tông lạnh',
    nameEn: 'Cool',
    cssFilter: 'contrast(1.08) brightness(1.02) saturate(0.88) hue-rotate(15deg)',
  },
  {
    id: 'fade',
    nameVi: 'Mờ nhẹ',
    nameEn: 'Faded',
    cssFilter: 'brightness(1.06) contrast(0.92) saturate(1.1)',
  },
]

export const templateOptions: TemplateOption[] = [
  {
    id: 'strip-4',
    nameVi: 'Dải dọc (1x4)',
    nameEn: 'Strip (1x4)',
    tagVi: '4 ảnh xếp dọc',
    tagEn: '4 vertical cuts',
  },
  {
    id: 'grid-2x2',
    nameVi: 'Lưới vuông (2x2)',
    nameEn: 'Grid (2x2)',
    tagVi: '4 ảnh ô vuông',
    tagEn: '4 square cuts',
  },
]
