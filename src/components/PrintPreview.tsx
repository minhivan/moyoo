import type { CSSProperties } from 'react'
import type { Frame, PaperFinish, StampStyle, TemplateId } from '../data/frames'
import { getPrintLayout, stampDoodle, stampLabel } from '../lib/photo'
import { FIBER_TILE_SIZE, GLOSS_EDGE, GLOSS_ORIGIN, GLOSS_STOPS, fiberTileUrl } from '../lib/materials'
import { Doodle } from './Doodle'

type Props = {
  frame: Frame
  photos: Array<string | null>
  template: TemplateId
  filterCss: string
  stampStyle: StampStyle
  customNote: string
  paperFinish: PaperFinish
  date: Date
  activeSlot?: number | null
  developingSlot?: number | null
  slotLabel?: (index: number) => string
  onSlotClick?: (index: number) => void
}

/**
 * DOM twin of the Canvas export. Every position comes from getPrintLayout and is
 * expressed as a share of the print width, so preview and PNG keep one geometry.
 */
export function PrintPreview({
  frame,
  photos,
  template,
  filterCss,
  stampStyle,
  customNote,
  paperFinish,
  date,
  activeSlot = null,
  developingSlot = null,
  slotLabel,
  onSlotClick,
}: Props) {
  const layout = getPrintLayout(template)
  const unit = (px: number) => `${(px / layout.width) * 100}cqw`
  const pctX = (px: number) => `${(px / layout.width) * 100}%`
  const pctY = (px: number) => `${(px / layout.height) * 100}%`

  const film = layout.film
  const ink = film ? film.ink : frame.ink
  const style = {
    aspectRatio: `${layout.width} / ${layout.height}`,
    background: film ? film.base : frame.background,
    color: ink,
  } as CSSProperties

  const edgeStyle: CSSProperties = {
    height: `${GLOSS_EDGE.depth * 100}%`,
    background: `linear-gradient(rgb(255 255 255 / ${GLOSS_EDGE.alpha}), rgb(255 255 255 / 0))`,
  }
  const doodle = stampDoodle(stampStyle)
  let finishStyle: CSSProperties | undefined
  if (paperFinish === 'glossy') {
    const stops = GLOSS_STOPS.map(([stop, alpha]) => `rgb(255 255 255 / ${alpha}) ${stop * 100}%`).join(', ')
    finishStyle = { background: `radial-gradient(circle at ${GLOSS_ORIGIN.x * 100}% ${GLOSS_ORIGIN.y * 100}%, ${stops})` }
  } else if (paperFinish === 'fiber') {
    const url = fiberTileUrl(ink)
    if (url) finishStyle = { backgroundImage: `url(${url})`, backgroundSize: `${unit(FIBER_TILE_SIZE)} ${unit(FIBER_TILE_SIZE)}` }
  }

  return (
    <div className={`print print--${template} print--${paperFinish} ${layout.mat ? '' : 'print--bare'}`} style={style} data-testid="print">
      {film?.holes.map((hole, index) => (
        <span
          key={`h${index}`}
          className="print__hole"
          style={{ left: pctX(hole.x), top: pctY(hole.y), width: pctX(hole.w), height: pctY(hole.h), background: frame.background }}
          aria-hidden="true"
        />
      ))}
      {film?.marks.map((mark, index) => (
        <span
          key={`m${index}`}
          className={`print__mark print__mark--${mark.align}`}
          style={{ [mark.align === 'left' ? 'left' : 'right']: pctX(mark.align === 'left' ? mark.x : layout.width - mark.x), top: pctY(mark.y), fontSize: unit(14) }}
          aria-hidden="true"
        >
          {mark.text}
        </span>
      ))}
      {layout.slots.map((slot, index) => {
        const photo = photos[index]
        const slotStyle: CSSProperties = {
          left: pctX(slot.x),
          top: pctY(slot.y),
          width: pctX(slot.w),
          height: pctY(slot.h),
          outlineWidth: unit(layout.mat || 3),
          background: layout.mat ? '#fff' : 'transparent',
        }
        const className = [
          'print__slot',
          activeSlot === index ? 'is-active' : '',
          developingSlot === index ? 'is-developing' : '',
        ].join(' ')
        const content = photo ? <img src={photo} alt="" style={{ filter: filterCss === 'none' ? undefined : filterCss }} /> : null
        return onSlotClick ? (
          <button
            key={index}
            type="button"
            className={className}
            style={slotStyle}
            onClick={() => onSlotClick(index)}
            aria-label={slotLabel?.(index)}
            aria-pressed={activeSlot === index}
          >
            {content}
            {paperFinish === 'glossy' && <span className="print__edge" style={edgeStyle} aria-hidden="true" />}
          </button>
        ) : (
          <div key={index} className={className} style={slotStyle}>
            {content}
            {paperFinish === 'glossy' && <span className="print__edge" style={edgeStyle} aria-hidden="true" />}
          </div>
        )
      })}
      <span className="print__brand" style={{ top: pctY(layout.brandY), fontSize: unit(layout.brandSize) }}>
        moyoo
      </span>
      <span
        className={`print__stamp print__stamp--${stampStyle}`}
        style={{ top: pctY(layout.stampY), fontSize: unit(stampStyle === 'timestamp' ? 24 : 22) }}
      >
        {stampLabel(stampStyle, customNote, date)}
        {doodle && <Doodle name={doodle} className="print__doodle" />}
      </span>
      <span className="print__finish" style={finishStyle} aria-hidden="true" />
    </div>
  )
}
