import type { Frame, PaperFinish, StampStyle, TemplateId } from '../data/frames'

export interface StripOptions {
  template?: TemplateId
  filterCss?: string
  dateText?: string
  customNote?: string
  stampStyle?: StampStyle
  paperFinish?: PaperFinish
}

export function captureFrame(video: HTMLVideoElement | null, filterCss = 'none', mirror = true): string | null {
  if (!video || !video.videoWidth || !video.videoHeight) return null
  const canvas = document.createElement('canvas')
  canvas.width = 960
  canvas.height = 720
  const context = canvas.getContext('2d')
  if (!context) return null

  const sourceRatio = video.videoWidth / video.videoHeight
  const targetRatio = canvas.width / canvas.height
  const sourceWidth = sourceRatio > targetRatio ? video.videoHeight * targetRatio : video.videoWidth
  const sourceHeight = sourceRatio > targetRatio ? video.videoHeight : video.videoWidth / targetRatio

  if (mirror) {
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
  }

  if (filterCss && filterCss !== 'none') {
    context.filter = filterCss
  }

  context.drawImage(
    video,
    (video.videoWidth - sourceWidth) / 2,
    (video.videoHeight - sourceHeight) / 2,
    sourceWidth,
    sourceHeight,
    0,
    0,
    canvas.width,
    canvas.height
  )

  return canvas.toDataURL('image/jpeg', 0.94)
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
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
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function createStrip(
  frame: Frame,
  photos: string[],
  options?: StripOptions
): Promise<string> {
  if (photos.length !== 4) throw new Error('A strip needs four photos.')

  const template = options?.template ?? 'strip-4'
  const filterCss = options?.filterCss ?? 'none'
  const dateText = options?.dateText ?? new Date().toISOString().slice(0, 10).replace(/-/g, '.')
  const customNote = options?.customNote?.trim()
  const stampStyle = options?.stampStyle ?? 'letterpress'

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas is unavailable.')

  const images = await Promise.all(photos.map(loadImage))

  if (template === 'grid-2x2') {
    // 2x2 Square Grid format (1080 x 1260)
    canvas.width = 1080
    canvas.height = 1260

    context.fillStyle = frame.background
    context.fillRect(0, 0, canvas.width, canvas.height)

    // Header brand
    context.fillStyle = frame.ink
    context.textAlign = 'center'
    context.font = '700 42px "Google Sans Flex", sans-serif'
    context.fillText('moyoo', canvas.width / 2, 72)

    // 2x2 photo positioning
    const photoWidth = 475
    const photoHeight = 475
    const positions = [
      { x: 45, y: 110 },
      { x: 560, y: 110 },
      { x: 45, y: 620 },
      { x: 560, y: 620 },
    ]

    images.forEach((image, index) => {
      const pos = positions[index]
      context.fillStyle = '#FFFFFF'
      context.fillRect(pos.x - 3, pos.y - 3, photoWidth + 6, photoHeight + 6)

      if (filterCss !== 'none') {
        context.filter = filterCss
      } else {
        context.filter = 'none'
      }

      const ratio = Math.max(photoWidth / image.width, photoHeight / image.height)
      const cropWidth = photoWidth / ratio
      const cropHeight = photoHeight / ratio

      context.drawImage(
        image,
        (image.width - cropWidth) / 2,
        (image.height - cropHeight) / 2,
        cropWidth,
        cropHeight,
        pos.x,
        pos.y,
        photoWidth,
        photoHeight
      )
    })

    // Reset filter for stamp
    context.filter = 'none'
    if (stampStyle === 'timestamp') {
      context.fillStyle = '#FF7A00'
      context.font = '700 24px "Google Sans Flex", sans-serif'
      context.fillText(`'${dateText.slice(2)} ${new Date().toTimeString().slice(0, 5)}`, canvas.width / 2, 1195)
    } else if (stampStyle === 'clean') {
      context.fillStyle = frame.ink
      context.font = '500 18px "Google Sans Flex", sans-serif'
      context.fillText('moyoo studio', canvas.width / 2, 1195)
    } else {
      context.fillStyle = frame.ink
      context.font = '600 21px "Google Sans Flex", sans-serif'
      const label = customNote ? `${customNote} • ${dateText}` : `moyoo studio • ${dateText}`
      context.fillText(label, canvas.width / 2, 1195)
    }
  } else {
    // Classic 1x4 vertical photostrip (660 x 1820)
    canvas.width = 660
    canvas.height = 1820

    context.fillStyle = frame.background
    context.fillRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = frame.ink
    context.textAlign = 'center'
    context.font = '700 42px "Google Sans Flex", sans-serif'
    context.fillText('moyoo', 330, 75)

    images.forEach((image, index) => {
      const x = 34
      const y = 110 + index * 412
      const width = 592
      const height = 390

      context.fillStyle = '#FFFFFF'
      context.fillRect(x - 3, y - 3, width + 6, height + 6)

      if (filterCss !== 'none') {
        context.filter = filterCss
      } else {
        context.filter = 'none'
      }

      const ratio = Math.max(width / image.width, height / image.height)
      const cropWidth = width / ratio
      const cropHeight = height / ratio

      context.drawImage(
        image,
        (image.width - cropWidth) / 2,
        (image.height - cropHeight) / 2,
        cropWidth,
        cropHeight,
        x,
        y,
        width,
        height
      )
    })

    // Reset filter for stamp
    context.filter = 'none'
    if (stampStyle === 'timestamp') {
      context.fillStyle = '#FF7A00'
      context.font = '700 24px "Google Sans Flex", sans-serif'
      context.fillText(`'${dateText.slice(2)} ${new Date().toTimeString().slice(0, 5)}`, 330, 1785)
    } else if (stampStyle === 'clean') {
      context.fillStyle = frame.ink
      context.font = '500 18px "Google Sans Flex", sans-serif'
      context.fillText('moyoo studio', 330, 1785)
    } else {
      context.fillStyle = frame.ink
      context.font = '600 21px "Google Sans Flex", sans-serif'
      const label = customNote ? `${customNote} • ${dateText}` : `moyoo studio • ${dateText}`
      context.fillText(label, 330, 1785)
    }
  }

  return canvas.toDataURL('image/png')
}

export async function downloadStrip(
  frame: Frame,
  photos: string[],
  options?: StripOptions
): Promise<void> {
  const image = await createStrip(frame, photos, options)
  const templateName = options?.template ?? 'strip'
  const link = document.createElement('a')
  link.href = image
  link.download = `moyoo-${templateName}-${frame.id}-${new Date().toISOString().slice(0, 10)}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function downloadSingleCut(
  photoUrl: string,
  index: number,
  frame: Frame
): Promise<void> {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 920
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = frame.background
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const img = await loadImage(photoUrl)
  const pad = 40
  const photoW = canvas.width - pad * 2
  const photoH = 700

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(pad - 2, pad - 2, photoW + 4, photoH + 4)

  const ratio = Math.max(photoW / img.width, photoH / img.height)
  const cropW = photoW / ratio
  const cropH = photoH / ratio

  ctx.drawImage(
    img,
    (img.width - cropW) / 2,
    (img.height - cropH) / 2,
    cropW,
    cropH,
    pad,
    pad,
    photoW,
    photoH
  )

  ctx.fillStyle = frame.ink
  ctx.textAlign = 'center'
  ctx.font = '700 26px "Google Sans Flex", sans-serif'
  ctx.fillText(`moyoo • 0${index + 1}`, canvas.width / 2, 855)

  const link = document.createElement('a')
  link.href = canvas.toDataURL('image/png')
  link.download = `moyoo-cut-0${index + 1}-${frame.id}.png`
  document.body.appendChild(link)
  link.click()
  link.remove()
}

export async function copyStripToClipboard(
  frame: Frame,
  photos: string[],
  options?: StripOptions
): Promise<boolean> {
  try {
    const dataUrl = await createStrip(frame, photos, options)
    const res = await fetch(dataUrl)
    const blob = await res.blob()
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ])
    return true
  } catch {
    return false
  }
}

