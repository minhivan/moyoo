import { useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Camera, ExternalLink, HelpCircle, Images, Repeat, RotateCcw, SwitchCamera, Timer, Wand2, X } from 'lucide-react'
import { templateOptions, type Frame, type PhotoFilter, type TemplateId, type TemplateOption } from '../data/frames'
import { VIEWFINDER_MASK, getPrintLayout } from '../lib/photo'
import type { CameraErrorKey } from '../lib/camera'
import { fill, type Dictionary, type Language } from '../lib/i18n'
import { FilterRail, FrameRail } from './Tools'

export type CameraStatus = 'idle' | 'starting' | 'ready' | 'error'

type Props = {
  t: Dictionary
  lang: Language
  template: TemplateOption
  frame: Frame
  filter: PhotoFilter
  photos: Array<string | null>
  retakeSlot: number | null
  status: CameraStatus
  error: string | null
  errorTitle: string | null
  errorKey: CameraErrorKey | null
  errorCode: string | null
  countdown: number | null
  flash: boolean
  developingSlot: number | null
  facingMode: 'user' | 'environment'
  timerSeconds: 3 | 5
  autoPaced: boolean
  videoRef: RefObject<HTMLVideoElement | null>
  boxRef: RefObject<HTMLDivElement | null>
  onOpenCamera: () => void
  onPickPhotos: () => void
  onShutter: () => void
  onFlip: () => void
  onModeChange: (id: TemplateId) => void
  onFrameChange: (frame: Frame) => void
  onFilterChange: (filter: PhotoFilter) => void
  onTimerToggle: () => void
  onAutoToggle: () => void
}

type OpenTool = 'frame' | 'filter' | null

export function CameraScreen(props: Props) {
  const { t, lang, template, frame, filter, photos, retakeSlot, status, countdown, flash, developingSlot, facingMode, timerSeconds, autoPaced, videoRef, boxRef } = props
  const [openTool, setOpenTool] = useState<OpenTool>(null)
  const modesRef = useRef<HTMLDivElement>(null)

  const taken = photos.filter(Boolean).length
  const inSession = taken > 0 || retakeSlot !== null
  const nextSlot = retakeSlot ?? Math.max(0, photos.findIndex((photo) => !photo))
  const lastPhoto = [...photos].reverse().find(Boolean) ?? null
  const ready = status === 'ready'
  const multi = template.count > 1
  const filterStyle = filter.cssFilter === 'none' ? undefined : filter.cssFilter

  // Keep the chosen mode centred in the rail, like a native camera's mode dial.
  useEffect(() => {
    const rail = modesRef.current
    const selected = rail?.querySelector<HTMLElement>('[aria-pressed="true"]')
    if (!rail || !selected) return
    const railBox = rail.getBoundingClientRect()
    const box = selected.getBoundingClientRect()
    const left = rail.scrollLeft + (box.left - railBox.left) - (railBox.width - box.width) / 2
    rail.scrollTo?.({ left, behavior: 'smooth' })
  }, [template.id])

  const film = getPrintLayout(template.id).film
  const vfStyle = {
    '--paper': film ? film.base : frame.background,
    '--paper-ink': film ? film.ink : frame.ink,
    '--hole': frame.background,
    '--mask-num': String(VIEWFINDER_MASK * 100),
    '--slot-aspect': String(template.slotAspect),
  } as CSSProperties

  const statusText =
    retakeSlot !== null
      ? fill(t.retakeSlot, { index: retakeSlot + 1 })
      : multi
        ? fill(t.shotOf, { current: Math.min(taken + 1, template.count), total: template.count })
        : null

  return (
    <section className="camera" aria-label={t.modeGroup}>
      <div className={`vf vf--${template.id} ${ready ? 'is-ready' : ''} ${template.column ? 'vf--column' : ''}`} ref={boxRef} style={vfStyle}>
        <video
          ref={videoRef}
          className={`vf__video ${facingMode === 'user' ? 'is-mirrored' : ''} ${ready ? 'is-live' : ''}`}
          style={{ filter: filterStyle }}
          autoPlay
          playsInline
          muted
          aria-hidden="true"
        />
        <div className="vf__mask" aria-hidden="true" />

        {template.column && (
          <div className="vf__strip" style={{ '--i': nextSlot } as CSSProperties} aria-hidden="true">
            {photos.map((photo, index) => (
              <div
                key={index}
                className={['strip-cell', ready && index === nextSlot ? 'is-live' : '', developingSlot === index ? 'is-developing' : ''].join(' ')}
              >
                {photo && !(ready && index === nextSlot) ? <img src={photo} alt="" style={{ filter: filterStyle }} /> : <span className="tabular">0{index + 1}</span>}
              </div>
            ))}
          </div>
        )}

        {!template.column && (
          <div className="vf__brand" aria-hidden="true">
            moyoo
          </div>
        )}

        {statusText && ready && (
          <span className="vf__status" aria-live="polite">
            {statusText}
          </span>
        )}

        {!ready && (
          <div className="vf__gate">
            {status === 'starting' ? (
              <div className="gate__wait" role="status">
                <span className="gate__pulse" aria-hidden="true" />
                <p>{t.cameraConnecting}</p>
                <p className="gate__hint">{t.cameraPromptHint}</p>
              </div>
            ) : (
              <div className={`gate__card ${status === 'error' ? 'is-error' : ''}`} role={status === 'error' ? 'alert' : undefined}>
                {status === 'error' ? (
                  <>
                    {props.errorTitle && <h1 className="gate__title">{props.errorTitle}</h1>}
                    <p className="gate__body">{props.error}</p>
                    {props.errorCode && <p className="gate__code">{fill(t.errorCode, { code: props.errorCode })}</p>}
                  </>
                ) : (
                  <>
                    <span className="gate__icon" aria-hidden="true">
                      <Camera size={26} />
                    </span>
                    <h1 className="gate__title">{t.permissionTitle}</h1>
                    <p className="gate__body">{t.permissionBody}</p>
                  </>
                )}
                {props.errorKey === 'cameraEmbedded' ? (
                  <button type="button" className="btn btn--primary" onClick={() => window.open(window.location.href, '_blank', 'noopener')}>
                    <ExternalLink size={18} />
                    <span>{t.openInTab}</span>
                  </button>
                ) : (
                  <button type="button" className="btn btn--primary" onClick={props.onOpenCamera}>
                    {status === 'error' ? <RotateCcw size={18} /> : <Camera size={18} />}
                    <span>{status === 'error' ? t.retry : t.openCamera}</span>
                  </button>
                )}
                <button type="button" className="btn btn--quiet" onClick={props.onPickPhotos}>
                  <Images size={18} />
                  <span>{t.pickPhotos}</span>
                </button>
                {status === 'error' && <HelpDialog t={t} />}
              </div>
            )}
          </div>
        )}

        {countdown !== null && (
          <div className="vf__count" aria-live="assertive">
            <span key={countdown}>{countdown}</span>
          </div>
        )}
        {flash && <div className="vf__flash" aria-hidden="true" />}
      </div>

      <div className="dock">
        {(
          <div className="tools-row" role="group" aria-label={t.toolsGroup}>
            <button
              type="button"
              className={`tool-pill ${openTool === 'frame' ? 'is-on' : ''}`}
              onClick={() => setOpenTool(openTool === 'frame' ? null : 'frame')}
              aria-label={t.toolFrame}
              aria-expanded={openTool === 'frame'}
            >
              <span className="tool-pill__swatch" style={{ background: frame.background }} aria-hidden="true" />
              <span className="tool-pill__label">{t.toolFrame}</span>
            </button>
            <button
              type="button"
              className={`tool-pill ${openTool === 'filter' ? 'is-on' : ''}`}
              onClick={() => setOpenTool(openTool === 'filter' ? null : 'filter')}
              aria-label={`${t.toolFilter}: ${lang === 'vi' ? filter.nameVi : filter.nameEn}`}
              aria-expanded={openTool === 'filter'}
            >
              <Wand2 size={20} aria-hidden="true" />
              <span className="tool-pill__label">{lang === 'vi' ? filter.nameVi : filter.nameEn}</span>
            </button>
            <button type="button" className="tool-pill" onClick={props.onTimerToggle} aria-label={`${t.toolTimer} ${timerSeconds}s`}>
              <Timer size={20} aria-hidden="true" />
              <span className="tool-pill__label tabular">{timerSeconds}s</span>
            </button>
            {multi && retakeSlot === null && (
              <button
                type="button"
                className={`tool-pill ${autoPaced ? 'is-on' : ''}`}
                onClick={props.onAutoToggle}
                aria-pressed={autoPaced}
                aria-label={autoPaced ? t.toolAuto : t.toolManual}
                title={autoPaced ? t.autoHint : t.manualHint}
              >
                <Repeat size={20} aria-hidden="true" />
                <span className="tool-pill__label">{autoPaced ? t.toolAuto : t.toolManual}</span>
              </button>
            )}
          </div>
        )}
        {openTool ? (
          <div className="dock__tray">
            {openTool === 'frame' ? (
              <FrameRail lang={lang} t={t} value={frame} onChange={props.onFrameChange} />
            ) : (
              <FilterRail lang={lang} t={t} value={filter} onChange={props.onFilterChange} previewSrc={lastPhoto} />
            )}
            <button type="button" className="dock__done" onClick={() => setOpenTool(null)}>
              {t.toolDone}
            </button>
          </div>
        ) : inSession && multi ? (
          <ol className="reel" aria-label={fill(t.shotsDone, { done: taken, total: template.count })}>
            {photos.map((photo, index) => (
              <li
                key={index}
                className={['reel__cell', photo ? 'is-done' : '', index === nextSlot ? 'is-next' : '', developingSlot === index ? 'is-developing' : ''].join(' ')}
              >
                {photo ? <img src={photo} alt="" style={{ filter: filterStyle }} /> : <span className="tabular">{index + 1}</span>}
              </li>
            ))}
          </ol>
        ) : (
          <div className="modes" ref={modesRef} role="group" aria-label={t.modeGroup}>
            {templateOptions.map((option) => {
              const selected = option.id === template.id
              return (
                <button
                  key={option.id}
                  type="button"
                  className={`mode ${selected ? 'is-selected' : ''}`}
                  aria-pressed={selected}
                  disabled={inSession && !selected}
                  onClick={() => props.onModeChange(option.id)}
                >
                  {lang === 'vi' ? option.nameVi : option.nameEn}
                </button>
              )
            })}
          </div>
        )}

        <div className="shutter-bar">
          <button
            type="button"
            className="round-btn round-btn--photo"
            onClick={props.onPickPhotos}
            aria-label={t.pickPhotos}
            disabled={retakeSlot !== null || countdown !== null}
          >
            {lastPhoto ? <img src={lastPhoto} alt="" /> : <Images size={22} />}
          </button>
          <button
            type="button"
            className={`shutter ${countdown !== null ? 'is-counting' : ''}`}
            onClick={props.onShutter}
            disabled={!ready}
            aria-label={countdown !== null ? t.cancelCountdown : fill(t.shutterLabel, { current: nextSlot + 1, total: template.count })}
          >
            {countdown !== null ? <X size={30} strokeWidth={3} /> : null}
          </button>
          <button type="button" className="round-btn" onClick={props.onFlip} aria-label={t.flipCamera} disabled={!ready || countdown !== null}>
            <SwitchCamera size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}

export function HelpDialog({ t }: { t: Dictionary }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="link-btn">
          <HelpCircle size={16} />
          <span>{t.cameraHelp}</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="sheet">
          <span className="sheet__grip" aria-hidden="true" />
          <Dialog.Title className="sheet__title">{t.helpTitle}</Dialog.Title>
          <Dialog.Description className="sheet__body">{t.helpBody}</Dialog.Description>
          <Dialog.Close asChild>
            <button type="button" className="btn btn--primary">
              {t.helpClose}
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
