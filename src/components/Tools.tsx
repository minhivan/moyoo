import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import {
  frames,
  paperFinishes,
  photoFilters,
  samplePhotos,
  stampOptions,
  templateOptions,
  type Frame,
  type PaperFinish,
  type PhotoFilter,
  type StampStyle,
  type TemplateId,
} from '../data/frames'
import type { Dictionary, Language } from '../lib/i18n'
import { stampDoodle } from '../lib/photo'
import { fiberTileUrl } from '../lib/materials'
import { Doodle } from './Doodle'

type RailItem = {
  id: string
  label: string
  selected: boolean
  onSelect: () => void
  swatch?: ReactNode
}

function Rail({ label, items }: { label: string; items: RailItem[] }) {
  return (
    <div className="rail" role="group" aria-label={label}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`rail__item ${item.selected ? 'is-selected' : ''}`}
          aria-pressed={item.selected}
          onClick={(event) => {
            item.onSelect()
            event.currentTarget.scrollIntoView?.({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
          }}
        >
          {item.swatch}
          <span className="rail__label">{item.label}</span>
          {item.selected && (
            <span className="rail__tick" aria-hidden="true">
              <Check size={12} strokeWidth={3.2} />
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export function FrameRail({ lang, t, value, onChange }: { lang: Language; t: Dictionary; value: Frame; onChange: (frame: Frame) => void }) {
  return (
    <Rail
      label={t.toolFrame}
      items={frames.map((frame) => ({
        id: frame.id,
        label: lang === 'vi' ? frame.name : frame.nameEn,
        selected: frame.id === value.id,
        onSelect: () => onChange(frame),
        swatch: <span className="rail__swatch" style={{ background: frame.background }} aria-hidden="true" />,
      }))}
    />
  )
}

export function FilterRail({
  lang,
  t,
  value,
  onChange,
  previewSrc,
}: {
  lang: Language
  t: Dictionary
  value: PhotoFilter
  onChange: (filter: PhotoFilter) => void
  previewSrc?: string | null
}) {
  return (
    <Rail
      label={t.toolFilter}
      items={photoFilters.map((filter) => ({
        id: filter.id,
        label: lang === 'vi' ? filter.nameVi : filter.nameEn,
        selected: filter.id === value.id,
        onSelect: () => onChange(filter),
        swatch: (
          <img
            className="rail__thumb"
            src={previewSrc ?? samplePhotos[0]}
            alt=""
            style={{ filter: filter.cssFilter === 'none' ? undefined : filter.cssFilter }}
          />
        ),
      }))}
    />
  )
}

export function LayoutRail({
  lang,
  t,
  value,
  onChange,
  count,
}: {
  lang: Language
  t: Dictionary
  value: TemplateId
  onChange: (id: TemplateId) => void
  count: number
}) {
  return (
    <Rail
      label={t.toolLayout}
      items={templateOptions
        .filter((option) => option.count === count)
        .map((option) => ({
          id: option.id,
          label: lang === 'vi' ? option.nameVi : option.nameEn,
          selected: option.id === value,
          onSelect: () => onChange(option.id),
          swatch: <LayoutGlyph id={option.id} />,
        }))}
    />
  )
}

export function LayoutGlyph({ id }: { id: TemplateId }) {
  const cells = templateOptions.find((option) => option.id === id)?.count ?? 1
  return (
    <span className={`layout-glyph layout-glyph--${id}`} aria-hidden="true">
      {Array.from({ length: cells }, (_, index) => (
        <i key={index} />
      ))}
    </span>
  )
}

export function StampPanel({
  lang,
  t,
  value,
  onChange,
  note,
  onNoteChange,
}: {
  lang: Language
  t: Dictionary
  value: StampStyle
  onChange: (style: StampStyle) => void
  note: string
  onNoteChange: (note: string) => void
}) {
  return (
    <div className="stamp-panel">
      <Rail
        label={t.toolStamp}
        items={stampOptions.map((option) => {
          const doodle = stampDoodle(option.id)
          return {
            id: option.id,
            label: lang === 'vi' ? option.nameVi : option.nameEn,
            selected: option.id === value,
            onSelect: () => onChange(option.id),
            swatch: (
              <span className={`stamp-chip stamp-chip--${option.id}`} aria-hidden="true">
                {option.id === 'timestamp' ? "'26.11" : 'moyoo'}
                {doodle && <Doodle name={doodle} className="stamp-chip__doodle" />}
              </span>
            ),
          }
        })}
      />
      {value === 'letterpress' && (
        <label className="note-field">
          <span>{t.noteLabel}</span>
          <input
            type="text"
            value={note}
            maxLength={28}
            placeholder={t.notePlaceholder}
            onChange={(event) => onNoteChange(event.target.value)}
          />
        </label>
      )}
    </div>
  )
}

export function PaperRail({ lang, t, value, onChange }: { lang: Language; t: Dictionary; value: PaperFinish; onChange: (finish: PaperFinish) => void }) {
  return (
    <div className="stamp-panel">
      <Rail
        label={t.toolPaper}
        items={paperFinishes.map((finish) => ({
          id: finish.id,
          label: lang === 'vi' ? finish.nameVi : finish.nameEn,
          selected: finish.id === value,
          onSelect: () => onChange(finish.id),
          swatch: (
            <span
              className={`paper-chip paper-chip--${finish.id}`}
              style={finish.id === 'fiber' ? { backgroundImage: `url(${fiberTileUrl('#2B1030') ?? ''})` } : undefined}
              aria-hidden="true"
            />
          ),
        }))}
      />
      <p className="tool-note">{t.paperNote}</p>
    </div>
  )
}
