/**
 * Shared marks and paper materials. Preview and PNG export both read from here so the
 * print on screen and the saved file carry the same doodles and paper.
 */

/** Hand-drawn doodles on a 24×24 grid, drawn as one 2px stroke. */
export const DOODLES = {
  heart:
    'M12 20.4c-1.3-1.2-8.5-6.2-8.8-11.3C2.9 5.7 5.1 3.7 7.6 3.9c2 .1 3.4 1.8 4.3 3.6.9-1.9 2.4-3.7 4.6-3.9 2.7-.1 4.7 2.2 4.4 5.3-.4 5-7.3 10.1-8.9 11.6',
  star: 'M12.2 2.7l2.4 6.2 6.6.4-5.1 4.4 1.8 6.6-5.8-3.7-5.9 3.8 1.7-6.5-5.2-4.3 6.7-.6Z',
} as const

export type DoodleName = keyof typeof DOODLES

export const HEART_PINK = '#FF3E9A'

const fiberCache = new Map<string, HTMLCanvasElement | null>()
const FIBER_TILE = 180

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * A seamless tile of short curled paper fibres in the frame's ink, generated once per
 * ink colour with a fixed seed so every render of a print looks the same.
 */
export function fiberTile(ink: string): HTMLCanvasElement | null {
  if (fiberCache.has(ink)) return fiberCache.get(ink) ?? null
  const tile = typeof document === 'undefined' ? null : document.createElement('canvas')
  const context = tile?.getContext('2d') ?? null
  if (!tile || !context) {
    fiberCache.set(ink, null)
    return null
  }
  tile.width = FIBER_TILE
  tile.height = FIBER_TILE
  const random = mulberry32(20261102)
  context.strokeStyle = ink
  context.lineCap = 'round'

  for (let index = 0; index < 260; index++) {
    const x = random() * FIBER_TILE
    const y = random() * FIBER_TILE
    const length = 4 + random() * 14
    const angle = random() * Math.PI * 2
    const bend = (random() - 0.5) * length * 0.8
    const ex = x + Math.cos(angle) * length
    const ey = y + Math.sin(angle) * length
    const cx = (x + ex) / 2 + Math.cos(angle + Math.PI / 2) * bend
    const cy = (y + ey) / 2 + Math.sin(angle + Math.PI / 2) * bend
    context.globalAlpha = 0.035 + random() * 0.06
    context.lineWidth = 0.5 + random() * 0.7
    // Draw each fibre in the 3×3 neighbourhood so strands crossing an edge wrap seamlessly.
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const ox = dx * FIBER_TILE
        const oy = dy * FIBER_TILE
        context.beginPath()
        context.moveTo(x + ox, y + oy)
        context.quadraticCurveTo(cx + ox, cy + oy, ex + ox, ey + oy)
        context.stroke()
      }
    }
  }
  for (let index = 0; index < 420; index++) {
    context.globalAlpha = 0.03 + random() * 0.05
    context.fillStyle = ink
    context.fillRect(random() * FIBER_TILE, random() * FIBER_TILE, 1, 1)
  }
  fiberCache.set(ink, tile)
  return tile
}

export const FIBER_TILE_SIZE = FIBER_TILE

export function fiberTileUrl(ink: string): string | null {
  try {
    return fiberTile(ink)?.toDataURL('image/png') ?? null
  } catch {
    return null
  }
}

/** Glossy paper: one broad specular falloff from the upper left, no streaks. */
export const GLOSS_STOPS: Array<[number, number]> = [
  [0, 0.42],
  [0.36, 0.12],
  [0.7, 0],
]

/** Glossy paper also catches light along the top edge of every photo. */
export const GLOSS_EDGE = { alpha: 0.24, depth: 0.32 }
export const GLOSS_ORIGIN = { x: 0.24, y: 0.1 }
