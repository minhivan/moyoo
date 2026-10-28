import { useState } from 'react'
import { samplePhotos, type Frame, type PaperFinish, type StampStyle, type TemplateId } from '../data/frames'
const PHOTO_COUNT = 4

export function MiniStrip({
  frame,
  photos,
  template = 'strip-4',
  filterCss = 'none',
  stampStyle = 'letterpress',
  customNote = '',
  paperFinish = 'matte',
  activeSlotIndex = null,
  developingIndex = null,
  onSlotClick,
}: {
  frame: Frame
  photos?: string[]
  template?: TemplateId
  filterCss?: string
  stampStyle?: StampStyle
  customNote?: string
  paperFinish?: PaperFinish
  activeSlotIndex?: number | null
  developingIndex?: number | null
  onSlotClick?: (index: number) => void
}) {
  const isGrid = template === 'grid-2x2'
  const activePhotos = photos && photos.length > 0 ? photos : samplePhotos

  const [{ dateText, timeText }] = useState(() => {
    const now = new Date()
    return {
      dateText: now.toISOString().slice(0, 10).replace(/-/g, '.'),
      timeText: now.toTimeString().slice(0, 5),
    }
  })

  let stampLabel = 'moyoo studio'
  if (stampStyle === 'timestamp') {
    stampLabel = `'${dateText.slice(2)} ${timeText}`
  } else if (stampStyle === 'clean') {
    stampLabel = 'moyoo'
  } else if (customNote.trim()) {
    stampLabel = customNote.trim()
  }

  return (
    <div
      className={`mini-strip mini-strip--${frame.id} mini-strip--${paperFinish} ${
        isGrid ? 'mini-strip--grid-2x2' : ''
      }`}
      style={{ background: frame.background, color: frame.ink }}
      data-testid="photostrip"
    >
      <div className="mini-strip__head">moyoo</div>

      <div className={isGrid ? 'mini-strip__grid' : 'mini-strip__column'}>
        {Array.from({ length: PHOTO_COUNT }, (_, index) => {
          const isSlotActive = activeSlotIndex === index
          const isDeveloping = developingIndex === index

          return (
            <div
              className={`mini-strip__photo ${isSlotActive ? 'mini-strip__photo--active' : ''} ${
                isDeveloping ? 'mini-strip__photo--developing' : ''
              } ${onSlotClick ? 'mini-strip__photo--clickable' : ''}`}
              key={index}
              style={{ filter: filterCss !== 'none' ? filterCss : undefined }}
              onClick={() => onSlotClick?.(index)}
              onKeyDown={(event) => {
                if (onSlotClick && (event.key === 'Enter' || event.key === ' ')) {
                  event.preventDefault()
                  onSlotClick(index)
                }
              }}
              role={onSlotClick ? 'button' : undefined}
              tabIndex={onSlotClick ? 0 : undefined}
              aria-label={`Photo slot ${index + 1}`}
            >
              {activePhotos[index] ? (
                <img src={activePhotos[index]} alt={`Shot ${index + 1}`} />
              ) : (
                <div className={`sample-art sample-art--${index + 1}`}>
                  0{index + 1}
                </div>
              )}

              {isDeveloping && (
                <div className="photo-developing-overlay" aria-hidden="true" />
              )}
            </div>
          )
        })}
      </div>

      <div
        className={`mini-strip__foot ${
          stampStyle === 'timestamp' ? 'mini-strip__foot--timestamp' : ''
        }`}
      >
        <span>{stampLabel}</span>
        {stampStyle !== 'timestamp' && <span className="mini-strip__stamp">'26</span>}
      </div>

      <div
        className={`mini-strip__sheen mini-strip__sheen--${paperFinish}`}
        aria-hidden="true"
      />
    </div>
  )
}

