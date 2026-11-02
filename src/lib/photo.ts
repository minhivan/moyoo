import { DOODLES, GLOSS_EDGE, GLOSS_ORIGIN, GLOSS_STOPS, HEART_PINK, fiberTile, type DoodleName } from './materials'
import { getTemplate, type Frame, type PaperFinish, type StampStyle, type TemplateId } from '../data/frames'

export const EXPORT_FONT = '"Baloo 2 Variable", "Baloo 2", sans-serif'

/** Share of the viewfinder width taken by the slot mask. The rest shows the frame colour. */
export const VIEWFINDER_MASK = 0.86

export interface PrintOptions {
  template?: TemplateId
  filterCss?: string
  /** Moment printed in the stamp. Defaults to now. */
  date?: Date
  customNote?: string
  stampStyle?: StampStyle
  paperFinish?: PaperFinish
}

export type Rect = { x: number; y: number; w: number; h: number }

export type FilmDecor = {
  /** Film base colour; replaces the frame paper. */
  base: string
  /** Edge print colour for numbers, brand and stamp. */
  ink: string
  /** Sprocket holes, filled with the frame colour so the paper shows through. */
  holes: Rect[]
  marks: Array<{ x: number; y: number; text: string; align: 'left' | 'right' }>
}

export type PrintLayout = {
  width: number
  height: number
  slots: Rect[]
  /** White border around each photo, in px. */
  mat: number
  brandY: number
  brandSize: number
  stampY: number
  film?: FilmDecor
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Local calendar date as YYYY.MM.DD (never UTC). */
export function formatStampDate(date: Date): string {
  return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`
}

export function formatStampTime(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** The footer text. Preview and export both read this so they cannot drift. */
export function stampLabel(style: StampStyle, note: string, date: Date): string {
  if (style === 'timestamp') return `'${formatStampDate(date).slice(2)} ${formatStampTime(date)}`
  if (style === 'clean') return 'moyoo studio'
  const trimmed = note.trim()
  return `${trimmed || 'moyoo studio'} • ${formatStampDate(date)}`
}

function filmLayout(): PrintLayout {
  const width = 460
  const height = 1900
  const slots = [0, 1, 2, 3].map((index) => ({ x: 90, y: 70 + index * 444, w: 280, h: 420 }))
  const holes: Rect[] = []
  for (let y = 22; y < height - 30; y += 40) {
    holes.push({ x: 26, y, w: 26, h: 18 }, { x: width - 52, y, w: 26, h: 18 })
  }
  const marks: FilmDecor['marks'] = slots.flatMap((slot, index) => [
    { x: slot.x + 2, y: slot.y + slot.h + 18, text: `${index + 1}  ${index + 1}A`, align: 'left' as const },
    { x: slot.x + slot.w - 2, y: slot.y + slot.h + 18, text: 'MOYOO 400', align: 'right' as const },
  ])
  return {
    width,
    height,
    slots,
    mat: 0,
    brandY: 50,
    brandSize: 26,
    stampY: 1868,
    film: { base: '#1A1410', ink: '#F2B33D', holes, marks },
  }
}

export function getPrintLayout(template: TemplateId): PrintLayout {
  switch (template) {
    case 'single':
      return { width: 800, height: 920, slots: [{ x: 40, y: 40, w: 720, h: 700 }], mat: 3, brandY: 812, brandSize: 40, stampY: 866 }
    case 'duo':
      return {
        width: 1000,
        height: 760,
        slots: [
          { x: 40, y: 40, w: 440, h: 587 },
          { x: 520, y: 40, w: 440, h: 587 },
        ],
        mat: 3,
        brandY: 690,
        brandSize: 40,
        stampY: 734,
      }
    case 'strip-3':
      return {
        width: 660,
        height: 1420,
        slots: [0, 1, 2].map((index) => ({ x: 34, y: 110 + index * 412, w: 592, h: 390 })),
        mat: 3,
        brandY: 75,
        brandSize: 42,
        stampY: 1385,
      }
    case 'grid-2x2': {
      const size = 475
      return {
        width: 1080,
        height: 1260,
        slots: [
          { x: 45, y: 110, w: size, h: size },
          { x: 560, y: 110, w: size, h: size },
          { x: 45, y: 620, w: size, h: size },
          { x: 560, y: 620, w: size, h: size },
        ],
        mat: 3,
        brandY: 72,
        brandSize: 42,
        stampY: 1195,
      }
    }
    case 'grid-6':
      return {
        width: 1050,
        height: 2010,
        slots: [0, 1, 2, 3, 4, 5].map((index) => ({
          x: 50 + (index % 2) * 490,
          y: 120 + Math.floor(index / 2) * 605,
          w: 460,
          h: 575,
        })),
        mat: 3,
        brandY: 80,
        brandSize: 46,
        stampY: 1965,
      }
    case 'film-4':
      return filmLayout()
    case 'strip-4':
    default:
      return {
        width: 660,
        height: 1820,
        slots: [0, 1, 2, 3].map((index) => ({ x: 34, y: 110 + index * 412, w: 592, h: 390 })),
        mat: 3,
        brandY: 75,
        brandSize: 42,
        stampY: 1785,
      }
  }
}

export type CaptureOptions = {
  /** Width / height of the slot the photo will fill. */
  aspect: number
  /** Width / height of the on-screen viewfinder box that shows the video with object-fit: cover. */
  boxAspect: number
  /** Share of the box width the slot mask occupies when it is centred (fallback). */
  maskFraction?: number
  /**
   * The slot mask as measured on screen, in fractions of the box (0–1). When given it wins
   * over the centred fallback, so a mask anchored anywhere is captured exactly.
   */
  mask?: Rect
  mirror?: boolean
}

/**
 * The source rectangle, in video pixels, that sits inside the viewfinder's slot mask
 * when the video is shown with object-fit: cover.
 */
export function captureRect(videoWidth: number, videoHeight: number, options: CaptureOptions): Rect {
  const { aspect, boxAspect, maskFraction = VIEWFINDER_MASK, mask, mirror = true } = options
  const videoAspect = videoWidth / videoHeight
  const visibleW = videoAspect > boxAspect ? videoHeight * boxAspect : videoWidth
  const visibleH = videoAspect > boxAspect ? videoHeight : videoWidth / boxAspect

  if (mask && mask.w > 0 && mask.h > 0) {
    // The preview is mirrored for the front camera, so a mask on the left of the screen
    // covers the right side of the raw video.
    const fx = mirror ? 1 - mask.x - mask.w : mask.x
    return {
      x: (videoWidth - visibleW) / 2 + fx * visibleW,
      y: (videoHeight - visibleH) / 2 + mask.y * visibleH,
      w: mask.w * visibleW,
      h: mask.h * visibleH,
    }
  }

  let w = visibleW * maskFraction
  let h = w / aspect
  if (h > visibleH * maskFraction) {
    h = visibleH * maskFraction
    w = h * aspect
  }
  return { x: (videoWidth - w) / 2, y: (videoHeight - h) / 2, w, h }
}

/**
 * Captures exactly the region shown inside the viewfinder's slot mask, so what the
 * person framed is what gets printed. Pixels are stored without a filter.
 */
export function captureFrame(video: HTMLVideoElement | null, options: CaptureOptions): string | null {
  if (!video || !video.videoWidth || !video.videoHeight) return null
  const source = captureRect(video.videoWidth, video.videoHeight, options)
  const longest = Math.min(1200, Math.max(source.w, source.h))
  const outW = Math.round(options.aspect >= 1 ? longest : longest * options.aspect)
  const outH = Math.round(options.aspect >= 1 ? longest / options.aspect : longest)

  const canvas = document.createElement('canvas')
  canvas.width = outW
  canvas.height = outH
  const context = canvas.getContext('2d')
  if (!context) return null

  if (options.mirror ?? true) {
    context.translate(outW, 0)
    context.scale(-1, 1)
  }
  context.drawImage(video, source.x, source.y, source.w, source.h, 0, 0, outW, outH)
  return canvas.toDataURL('image/jpeg', 0.94)
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Image could not be decoded'))
    image.src = source
  })
}

export function readImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result)
      else reject(new Error('Failed to read image file'))
    }
    reader.onerror = () => reject(new Error('Failed to read image file'))
    reader.readAsDataURL(file)
  })
}

async function fontsReady(): Promise<void> {
  try {
    await document.fonts?.load(`700 40px ${EXPORT_FONT}`)
  } catch {
    // Fallback font is acceptable when the font API is unavailable.
  }
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, slot: Rect) {
  const ratio = Math.max(slot.w / image.width, slot.h / image.height)
  const cropW = slot.w / ratio
  const cropH = slot.h / ratio
  context.drawImage(image, (image.width - cropW) / 2, (image.height - cropH) / 2, cropW, cropH, slot.x, slot.y, slot.w, slot.h)
}

function drawPaperFinish(context: CanvasRenderingContext2D, finish: PaperFinish, ink: string, slots: Rect[]) {
  const { width, height } = context.canvas
  if (finish === 'glossy') {
    slots.forEach((slot) => {
      const edge = context.createLinearGradient(0, slot.y, 0, slot.y + slot.h * GLOSS_EDGE.depth)
      edge.addColorStop(0, `rgba(255,255,255,${GLOSS_EDGE.alpha})`)
      edge.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = edge
      context.fillRect(slot.x, slot.y, slot.w, slot.h * GLOSS_EDGE.depth)
    })
    const x = width * GLOSS_ORIGIN.x
    const y = height * GLOSS_ORIGIN.y
    const radius = Math.hypot(width - x, height - y)
    const sheen = context.createRadialGradient(x, y, 0, x, y, radius)
    GLOSS_STOPS.forEach(([stop, alpha]) => sheen.addColorStop(stop, `rgba(255,255,255,${alpha})`))
    context.fillStyle = sheen
    context.fillRect(0, 0, width, height)
  } else if (finish === 'fiber') {
    const tile = fiberTile(ink)
    const pattern = tile ? context.createPattern(tile, 'repeat') : null
    if (!pattern) return
    context.fillStyle = pattern
    context.fillRect(0, 0, width, height)
  }
}

/** Stamp text plus its doodle, centred as one group. */
function drawStamp(context: CanvasRenderingContext2D, label: string, doodle: DoodleName | null, centerX: number, baseline: number, size: number) {
  if (!doodle || typeof Path2D === 'undefined') {
    context.fillText(label, centerX, baseline)
    return
  }
  const mark = size * 1.05
  const gap = size * 0.4
  const textWidth = context.measureText(label).width
  const left = centerX - (textWidth + gap + mark) / 2
  context.textAlign = 'left'
  context.fillText(label, left, baseline)
  context.textAlign = 'center'

  context.save()
  context.translate(left + textWidth + gap, baseline - mark * 0.86)
  context.scale(mark / 24, mark / 24)
  context.strokeStyle = doodle === 'heart' ? HEART_PINK : (context.fillStyle as string)
  context.lineWidth = 2.2
  context.lineJoin = 'round'
  context.lineCap = 'round'
  context.stroke(new Path2D(DOODLES[doodle]))
  context.restore()
}

export function stampDoodle(style: StampStyle): DoodleName | null {
  if (style === 'letterpress') return 'heart'
  if (style === 'clean') return 'star'
  return null
}

export async function createPrintCanvas(frame: Frame, photos: string[], options: PrintOptions = {}): Promise<HTMLCanvasElement> {
  const template = options.template ?? 'strip-4'
  const { count } = getTemplate(template)
  const usable = photos.slice(0, count)
  if (usable.length !== count || usable.some((photo) => !photo)) {
    throw new Error(`This layout needs ${count} photo${count > 1 ? 's' : ''}.`)
  }

  const layout = getPrintLayout(template)
  const filterCss = options.filterCss ?? 'none'
  const date = options.date ?? new Date()
  const stampStyle = options.stampStyle ?? 'letterpress'

  const canvas = document.createElement('canvas')
  canvas.width = layout.width
  canvas.height = layout.height
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable.')

  const [images] = await Promise.all([Promise.all(usable.map(loadImage)), fontsReady()])

  const film = layout.film
  const ink = film ? film.ink : frame.ink
  context.fillStyle = film ? film.base : frame.background
  context.fillRect(0, 0, layout.width, layout.height)

  if (film) {
    context.fillStyle = frame.background
    film.holes.forEach((hole) => {
      context.beginPath()
      context.roundRect(hole.x, hole.y, hole.w, hole.h, 4)
      context.fill()
    })
    context.fillStyle = film.ink
    context.font = `600 14px ${EXPORT_FONT}`
    film.marks.forEach((mark) => {
      context.textAlign = mark.align
      context.fillText(mark.text, mark.x, mark.y)
    })
  }

  layout.slots.forEach((slot, index) => {
    context.filter = 'none'
    if (layout.mat > 0) {
      context.fillStyle = '#FFFFFF'
      context.fillRect(slot.x - layout.mat, slot.y - layout.mat, slot.w + layout.mat * 2, slot.h + layout.mat * 2)
    }
    context.filter = filterCss
    drawCover(context, images[index], slot)
  })
  context.filter = 'none'

  context.textAlign = 'center'
  context.fillStyle = ink
  context.font = `800 ${layout.brandSize}px ${EXPORT_FONT}`
  context.fillText('moyoo', layout.width / 2, layout.brandY)

  const label = stampLabel(stampStyle, options.customNote ?? '', date)
  if (stampStyle === 'timestamp') {
    context.fillStyle = '#FF7A00'
    context.font = `700 24px ${EXPORT_FONT}`
  } else {
    context.fillStyle = ink
    context.font = `${stampStyle === 'clean' ? 500 : 600} 22px ${EXPORT_FONT}`
  }
  drawStamp(context, label, stampDoodle(stampStyle), layout.width / 2, layout.stampY, stampStyle === 'timestamp' ? 24 : 22)

  drawPaperFinish(context, options.paperFinish ?? 'matte', ink, layout.slots)
  return canvas
}

export async function createPrint(frame: Frame, photos: string[], options?: PrintOptions): Promise<string> {
  return (await createPrintCanvas(frame, photos, options)).toDataURL('image/png')
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a')
  link.href = href
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export function printFilename(template: TemplateId, frame: Frame, date = new Date()): string {
  return `moyoo-${template}-${frame.id}-${formatStampDate(date).replace(/\./g, '-')}.png`
}

export async function downloadPrint(frame: Frame, photos: string[], options: PrintOptions = {}): Promise<void> {
  const image = await createPrint(frame, photos, options)
  triggerDownload(image, printFilename(options.template ?? 'strip-4', frame, options.date))
}

/** One photo from a multi-photo print as its own single-layout PNG. */
export async function downloadSingleCut(photoUrl: string, index: number, frame: Frame, options: PrintOptions = {}): Promise<void> {
  const image = await createPrint(frame, [photoUrl], { ...options, template: 'single' })
  triggerDownload(image, `moyoo-cut-0${index + 1}-${frame.id}.png`)
}

/**
 * Copies the print as PNG. The ClipboardItem receives a promise synchronously so
 * Safari keeps the user gesture while the canvas renders.
 */
export async function copyPrintToClipboard(frame: Frame, photos: string[], options?: PrintOptions): Promise<boolean> {
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') return false
    const blob = createPrintCanvas(frame, photos, options).then(
      (canvas) =>
        new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((result) => (result ? resolve(result) : reject(new Error('PNG encoding failed'))), 'image/png')
        })
    )
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    return true
  } catch {
    return false
  }
}
