import { useState, type CSSProperties } from 'react'
import { Camera, Copy, Download, FolderDown, RotateCcw, Save } from 'lucide-react'
import { templateOptions, type Frame, type PaperFinish, type PhotoFilter, type StampStyle, type TemplateId, type TemplateOption } from '../data/frames'
import { getPrintLayout } from '../lib/photo'
import { fill, type Dictionary, type Language } from '../lib/i18n'
import { PrintPreview } from './PrintPreview'
import { FilterRail, FrameRail, LayoutRail, PaperRail, StampPanel } from './Tools'

type Tool = 'frame' | 'filter' | 'layout' | 'stamp' | 'paper'

type Props = {
  t: Dictionary
  lang: Language
  template: TemplateOption
  frame: Frame
  filter: PhotoFilter
  stamp: StampStyle
  paper: PaperFinish
  note: string
  photos: Array<string | null>
  date: Date
  developingSlot: number | null
  busy: boolean
  onFrameChange: (frame: Frame) => void
  onFilterChange: (filter: PhotoFilter) => void
  onTemplateChange: (id: TemplateId) => void
  onStampChange: (stamp: StampStyle) => void
  onPaperChange: (paper: PaperFinish) => void
  onNoteChange: (note: string) => void
  onRetake: (index: number) => void
  onSaveCut: (index: number) => void
  onSave: () => void
  onCopy: () => void
  onSaveCuts: () => void
  onNewSession: () => void
}

export function ReviewScreen(props: Props) {
  const { t, lang, template, frame, filter, stamp, paper, note, photos, date } = props
  const [tool, setTool] = useState<Tool>('frame')
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const multi = template.count > 1
  const siblings = templateOptions.filter((option) => option.count === template.count).length
  const layout = getPrintLayout(template.id)
  const printStyle = { '--print-ar': String(layout.width / layout.height) } as CSSProperties

  const tools: Array<{ id: Tool; label: string }> = [
    { id: 'frame', label: t.toolFrame },
    { id: 'filter', label: t.toolFilter },
    ...(siblings > 1 ? [{ id: 'layout' as const, label: t.toolLayout }] : []),
    { id: 'stamp', label: t.toolStamp },
    { id: 'paper', label: t.toolPaper },
  ]

  return (
    <section className="review" aria-labelledby="review-title">
      <div className="review__stage">
        <h1 id="review-title" className="sr-only">
          {t.reviewTitle}
        </h1>
        <div className={`review__print review__print--${template.id}`} style={printStyle}>
          <PrintPreview
            frame={frame}
            photos={photos}
            template={template.id}
            filterCss={filter.cssFilter}
            stampStyle={stamp}
            customNote={note}
            paperFinish={paper}
            date={date}
            activeSlot={activeSlot}
            developingSlot={props.developingSlot}
            slotLabel={(index) => fill(t.slotLabel, { index: index + 1 })}
            onSlotClick={(index) => setActiveSlot(activeSlot === index ? null : index)}
          />
        </div>
        {activeSlot === null ? (
          <p className="review__hint">
            {t.tapSlotHint}
            <span className="review__privacy">{t.privacyNote}</span>
          </p>
        ) : (
          <div className="slot-sheet" role="group" aria-label={fill(t.slotActions, { index: activeSlot + 1 })}>
            <button
              type="button"
              className="btn btn--violet"
              onClick={() => {
                const index = activeSlot
                setActiveSlot(null)
                props.onRetake(index)
              }}
            >
              <RotateCcw size={18} />
              <span>{t.retakeThis}</span>
            </button>
            {multi && (
              <button type="button" className="btn btn--ghost" onClick={() => props.onSaveCut(activeSlot)}>
                <Download size={18} />
                <span>{t.saveThis}</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="review__panel">
        <div className="tabs" role="tablist" aria-label={t.reviewTitle}>
          {tools.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={tool === item.id}
              aria-controls="tool-panel"
              className={`tab ${tool === item.id ? 'is-selected' : ''}`}
              onClick={() => setTool(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="tool-panel" id="tool-panel" role="tabpanel" aria-labelledby={`tab-${tool}`}>
          {tool === 'frame' && <FrameRail lang={lang} t={t} value={frame} onChange={props.onFrameChange} />}
          {tool === 'filter' && (
            <FilterRail lang={lang} t={t} value={filter} onChange={props.onFilterChange} previewSrc={photos.find(Boolean)} />
          )}
          {tool === 'layout' && (
            <LayoutRail lang={lang} t={t} value={template.id} onChange={props.onTemplateChange} count={template.count} />
          )}
          {tool === 'stamp' && (
            <StampPanel lang={lang} t={t} value={stamp} onChange={props.onStampChange} note={note} onNoteChange={props.onNoteChange} />
          )}
          {tool === 'paper' && <PaperRail lang={lang} t={t} value={paper} onChange={props.onPaperChange} />}
        </div>

      </div>

      <div className="actions">
        <button type="button" className="btn btn--ghost btn--square" onClick={props.onCopy} aria-label={t.copy} title={t.copy}>
          <Copy size={20} />
        </button>
        <button type="button" className="btn btn--primary btn--wide" onClick={props.onSave} disabled={props.busy}>
          <Save size={20} />
          <span>{props.busy ? t.saving : t.save}</span>
        </button>
        {multi && (
          <button type="button" className="btn btn--ghost btn--square" onClick={props.onSaveCuts} aria-label={t.saveCuts} title={t.saveCuts}>
            <FolderDown size={20} />
          </button>
        )}
        <button type="button" className="btn btn--ghost btn--square" onClick={props.onNewSession} aria-label={t.newSession} title={t.newSession}>
          <Camera size={20} />
        </button>
      </div>

    </section>
  )
}
