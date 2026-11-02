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

export type TemplateId = 'single' | 'duo' | 'strip-3' | 'strip-4' | 'grid-2x2' | 'grid-6' | 'film-4'

export type TemplateOption = {
  id: TemplateId
  nameVi: string
  nameEn: string
  /** Number of photos this layout needs. */
  count: 1 | 2 | 3 | 4 | 6
  /** Width / height of one photo slot, shared by viewfinder, preview and export. */
  slotAspect: number
  /** Slots stack in one column, so the viewfinder can show the strip itself. */
  column: boolean
}

export type StampStyle = 'letterpress' | 'timestamp' | 'clean'

export interface StampOption {
  id: StampStyle
  nameVi: string
  nameEn: string
  previewText: string
}

export const stampOptions: StampOption[] = [
  { id: 'letterpress', nameVi: 'Ghi chú', nameEn: 'Note', previewText: 'moyoo studio • 2026' },
  { id: 'timestamp', nameVi: 'Dấu ngày giờ', nameEn: 'Date stamp', previewText: "'26.11.02 17:30" },
  { id: 'clean', nameVi: 'Tối giản', nameEn: 'Clean', previewText: 'moyoo studio' },
]

export type PaperFinish = 'matte' | 'glossy' | 'fiber'

export interface PaperFinishOption {
  id: PaperFinish
  nameVi: string
  nameEn: string
}

export const paperFinishes: PaperFinishOption[] = [
  { id: 'matte', nameVi: 'Giấy lì', nameEn: 'Matte' },
  { id: 'glossy', nameVi: 'Giấy bóng', nameEn: 'Glossy' },
  { id: 'fiber', nameVi: 'Giấy sợi', nameEn: 'Fiber' },
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
    name: 'Bơ',
    nameEn: 'Butter',
    background: '#F5E8BA',
    ink: '#4A422D',
    stage: '#EDE0B2',
  },
  {
    id: 'blush',
    name: 'Hồng phấn',
    nameEn: 'Blush Note',
    background: '#F0CDCE',
    ink: '#57373A',
    stage: '#E5BFBF',
  },
  {
    id: 'blue',
    name: 'Xanh dương',
    nameEn: 'Blue',
    background: '#C9D8E6',
    ink: '#324A5E',
    stage: '#BCCDD9',
  },
  {
    id: 'sage',
    name: 'Xanh lá',
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
  { id: 'single', nameVi: '1 tấm', nameEn: 'Single', count: 1, slotAspect: 720 / 700, column: false },
  { id: 'duo', nameVi: 'Đôi', nameEn: 'Duo', count: 2, slotAspect: 440 / 587, column: false },
  { id: 'strip-3', nameVi: 'Dải 3', nameEn: 'Strip 3', count: 3, slotAspect: 592 / 390, column: true },
  { id: 'strip-4', nameVi: 'Dải 4', nameEn: 'Strip 4', count: 4, slotAspect: 592 / 390, column: true },
  { id: 'grid-2x2', nameVi: 'Lưới 4', nameEn: 'Grid 4', count: 4, slotAspect: 1, column: false },
  { id: 'grid-6', nameVi: 'Lưới 6', nameEn: 'Grid 6', count: 6, slotAspect: 460 / 575, column: false },
  { id: 'film-4', nameVi: 'Cuộn film', nameEn: 'Film roll', count: 4, slotAspect: 280 / 420, column: true },
]

export const TEMPLATE_IDS = templateOptions.map((option) => option.id)

export function getTemplate(id: TemplateId): TemplateOption {
  return templateOptions.find((option) => option.id === id) ?? templateOptions[3]
}
