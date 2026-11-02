import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Settings2, Volume2, VolumeX, X } from 'lucide-react'
import {
  frames,
  getTemplate,
  photoFilters,
  TEMPLATE_IDS,
  type Frame,
  type PaperFinish,
  type PhotoFilter,
  type StampStyle,
  type TemplateId,
} from './data/frames'
import { captureFrame, copyPrintToClipboard, downloadPrint, downloadSingleCut, readImageFile } from './lib/photo'
import { playFilmAdvanceSound, playShutterSound, playTapSound } from './lib/sound'
import { translations, type Dictionary, type Language } from './lib/i18n'
import { CameraScreen, type CameraStatus } from './components/CameraScreen'
import { CameraError, classifyCameraError, detectBrowser, openCameraStream, watchCameraPermission } from './lib/camera'
import { SettingsSheet } from './components/SettingsSheet'
import { ReviewScreen } from './components/ReviewScreen'
import { InstallSheet } from './components/InstallSheet'
import { useInstall } from './lib/install'
import './App.css'

type Step = 'camera' | 'review'
type Toast = { id: number; message: string; tone: 'info' | 'error' }

const AUTO_GAP_MS = 1400
const DEVELOP_MS = 1200

function readSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem('moyoo_lang')
    if (saved === 'vi' || saved === 'en') return saved
  } catch {
    // Storage can be blocked; Vietnamese is the default.
  }
  return 'vi'
}

/** Home-screen shortcuts open with ?mode=<template id>. */
function readLaunchMode(): TemplateId {
  try {
    const mode = new URLSearchParams(window.location.search).get('mode')
    if (mode && (TEMPLATE_IDS as string[]).includes(mode)) return mode as TemplateId
  } catch {
    // Fall through to the default.
  }
  return 'strip-4'
}

const emptySlots = (count: number): Array<string | null> => Array.from({ length: count }, () => null)
const isFull = (photos: Array<string | null>) => photos.every(Boolean)

export default function App() {
  const [lang, setLang] = useState<Language>(readSavedLanguage)
  const [soundOn, setSoundOn] = useState(true)
  const [step, setStep] = useState<Step>('camera')

  const [templateId, setTemplateId] = useState<TemplateId>(readLaunchMode)
  const [frame, setFrame] = useState<Frame>(frames[0])
  const [filter, setFilter] = useState<PhotoFilter>(photoFilters[0])
  const [stamp, setStamp] = useState<StampStyle>('letterpress')
  const [paper, setPaper] = useState<PaperFinish>('matte')
  const [note, setNote] = useState('')

  const [photos, setPhotos] = useState<Array<string | null>>(() => emptySlots(getTemplate(readLaunchMode()).count))
  const [shotDate, setShotDate] = useState(() => new Date())
  const [retakeSlot, setRetakeSlot] = useState<number | null>(null)
  const [developingSlot, setDevelopingSlot] = useState<number | null>(null)

  const [status, setStatus] = useState<CameraStatus>('idle')
  const [cameraError, setCameraError] = useState<CameraError | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [timerSeconds, setTimerSeconds] = useState<3 | 5>(3)
  const [autoPaced, setAutoPaced] = useState(true)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)

  const [toast, setToast] = useState<Toast | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [installOpen, setInstallOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [browser] = useState(() => detectBrowser())
  const install = useInstall()

  const t: Dictionary = translations[lang]
  const template = getTemplate(templateId)

  const videoRef = useRef<HTMLVideoElement>(null)
  const boxRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const requestRef = useRef(0)
  const countdownRef = useRef<number | null>(null)
  const autoRef = useRef<number | null>(null)
  const photosRef = useRef(photos)

  // Latest settings for timer callbacks, so a running auto sequence follows changes.
  const latest = useRef({ timerSeconds, autoPaced, soundOn, facingMode, retakeSlot, templateId, step })
  useEffect(() => {
    latest.current = { timerSeconds, autoPaced, soundOn, facingMode, retakeSlot, templateId, step }
  })

  const commitPhotos = useCallback((next: Array<string | null>) => {
    photosRef.current = next
    setPhotos(next)
  }, [])

  const tap = () => {
    if (latest.current.soundOn) playTapSound()
  }

  const showToast = useCallback((message: string, tone: Toast['tone'] = 'info') => {
    setToast({ id: Date.now(), message, tone })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  const clearTimers = useCallback(() => {
    if (countdownRef.current) window.clearInterval(countdownRef.current)
    if (autoRef.current) window.clearTimeout(autoRef.current)
    countdownRef.current = null
    autoRef.current = null
    setCountdown(null)
  }, [])

  const stopCamera = useCallback(() => {
    requestRef.current += 1
    clearTimers()
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStatus((current) => (current === 'error' ? current : 'idle'))
  }, [clearTimers])

  const startCamera = useCallback(
    async (mode: 'user' | 'environment' = latest.current.facingMode) => {
      stopCamera()
      setCameraError(null)
      const request = requestRef.current
      setStatus('starting')
      try {
        const stream = await openCameraStream(mode)
        if (request !== requestRef.current) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        setStatus('ready')
      } catch (error) {
        if (request !== requestRef.current) return
        setCameraError(classifyCameraError(error))
        setStatus('error')
      }
    },
    [stopCamera]
  )

  // Attach the stream once the video element and stream both exist.
  useEffect(() => {
    const video = videoRef.current
    if (step !== 'camera' || status !== 'ready' || !video || !streamRef.current) return
    video.srcObject = streamRef.current
    void video.play().catch((error: unknown) => {
      // A newer srcObject interrupting play() is not a failure.
      if (error instanceof DOMException && error.name === 'AbortError') return
      setCameraError(classifyCameraError(error))
      setStatus('error')
    })
  }, [step, status])

  // Read the camera permission up front: granted opens the live view, denied explains the
  // fix before anyone taps, and switching access back on reopens the camera by itself.
  useEffect(() => {
    let cancelled = false
    let stop = () => {}
    const apply = (state: PermissionState) => {
      if (cancelled || latest.current.step !== 'camera') return
      if (state === 'granted') {
        if (!streamRef.current) void startCamera()
      } else if (state === 'denied') {
        stopCamera()
        setCameraError(new CameraError('cameraDenied', 'PermissionState', 'denied'))
        setStatus('error')
      } else {
        setCameraError(null)
        setStatus((current) => (current === 'error' ? 'idle' : current))
      }
    }
    void watchCameraPermission(apply).then((watcher) => {
      if (cancelled) {
        watcher.stop()
        return
      }
      stop = watcher.stop
      if (watcher.state !== 'unknown') apply(watcher.state)
    })
    return () => {
      cancelled = true
      stop()
    }
  }, [startCamera, stopCamera])

  useEffect(
    () => () => {
      requestRef.current += 1
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (countdownRef.current) window.clearInterval(countdownRef.current)
      if (autoRef.current) window.clearTimeout(autoRef.current)
    },
    []
  )

  const markDeveloping = (index: number) => {
    setDevelopingSlot(index)
    window.setTimeout(() => setDevelopingSlot((current) => (current === index ? null : current)), DEVELOP_MS)
  }

  const goReview = useCallback(() => {
    stopCamera()
    setSaved(false)
    setStep('review')
  }, [stopCamera])

  const capture = () => {
    const settings = latest.current
    const box = boxRef.current
    const current = getTemplate(settings.templateId)
    const boxRect = box?.getBoundingClientRect()
    const maskRect = box?.querySelector('.vf__mask')?.getBoundingClientRect()
    const mask =
      boxRect && maskRect && boxRect.width > 0 && boxRect.height > 0
        ? {
            x: (maskRect.left - boxRect.left) / boxRect.width,
            y: (maskRect.top - boxRect.top) / boxRect.height,
            w: maskRect.width / boxRect.width,
            h: maskRect.height / boxRect.height,
          }
        : undefined
    const image = captureFrame(videoRef.current, {
      aspect: current.slotAspect,
      boxAspect: boxRect && boxRect.height ? boxRect.width / boxRect.height : 3 / 4,
      mask,
      mirror: settings.facingMode === 'user',
    })
    if (settings.soundOn) {
      playShutterSound()
      window.setTimeout(playFilmAdvanceSound, 160)
    }
    setFlash(true)
    window.setTimeout(() => setFlash(false), 260)
    if (!image) {
      showToast(t.captureFailed, 'error')
      return
    }

    const before = photosRef.current
    const target = settings.retakeSlot ?? before.findIndex((photo) => !photo)
    if (target < 0) return
    const next = [...before]
    next[target] = image
    commitPhotos(next)
    markDeveloping(target)
    if (before.every((photo) => !photo)) setShotDate(new Date())

    if (settings.retakeSlot !== null) {
      setRetakeSlot(null)
      if (isFull(next)) goReview()
      return
    }
    if (isFull(next)) {
      goReview()
    } else if (settings.autoPaced) {
      autoRef.current = window.setTimeout(() => {
        autoRef.current = null
        runCountdown()
      }, AUTO_GAP_MS)
    }
  }

  function runCountdown() {
    if (countdownRef.current || !streamRef.current) return
    let count = latest.current.timerSeconds
    setCountdown(count)
    countdownRef.current = window.setInterval(() => {
      count -= 1
      if (count > 0) {
        setCountdown(count)
        return
      }
      if (countdownRef.current) window.clearInterval(countdownRef.current)
      countdownRef.current = null
      setCountdown(null)
      capture()
    }, 1000)
  }

  const onShutter = () => {
    if (countdownRef.current || autoRef.current) {
      clearTimers()
      return
    }
    runCountdown()
  }

  const onModeChange = (id: TemplateId) => {
    if (id === templateId) return
    tap()
    setTemplateId(id)
    commitPhotos(emptySlots(getTemplate(id).count))
  }

  const discardSession = () => {
    setConfirmOpen(false)
    clearTimers()
    setRetakeSlot(null)
    commitPhotos(emptySlots(template.count))
    if (step === 'review') {
      setStep('camera')
      void startCamera()
    }
  }

  const requestDiscard = () => {
    tap()
    if (step === 'review' && saved) discardSession()
    else setConfirmOpen(true)
  }

  const cancelRetake = () => {
    tap()
    stopCamera()
    setRetakeSlot(null)
    setStep('review')
  }

  const onRetake = (index: number) => {
    tap()
    setRetakeSlot(index)
    setStep('camera')
    void startCamera()
  }

  const onPickPhotos = () => {
    tap()
    fileInputRef.current?.click()
  }

  const onFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target
    const files = Array.from(input.files ?? [])
    if (files.length === 0) return
    try {
      const next = [...photosRef.current]
      const empty = next.flatMap((photo, index) => (photo ? [] : [index]))
      const loaded = await Promise.all(files.slice(0, empty.length).map(readImageFile))
      loaded.forEach((image, order) => {
        next[empty[order]] = image
      })
      if (next.every((photo) => !photo)) return
      if (photosRef.current.every((photo) => !photo)) setShotDate(new Date())
      commitPhotos(next)
      if (isFull(next)) goReview()
    } catch {
      showToast(t.fileReadFailed, 'error')
    } finally {
      input.value = ''
    }
  }

  const printOptions = () => ({
    template: templateId,
    filterCss: filter.cssFilter,
    customNote: note,
    stampStyle: stamp,
    paperFinish: paper,
    date: shotDate,
  })

  const onSave = async () => {
    tap()
    setBusy(true)
    try {
      await downloadPrint(frame, photos as string[], printOptions())
      setSaved(true)
      showToast(t.saved)
    } catch {
      showToast(t.saveFailed, 'error')
    } finally {
      setBusy(false)
    }
  }

  const onCopy = async () => {
    tap()
    const ok = await copyPrintToClipboard(frame, photos as string[], printOptions())
    showToast(ok ? t.copied : t.copyFailed, ok ? 'info' : 'error')
  }

  const onSaveCut = async (index: number) => {
    tap()
    try {
      await downloadSingleCut(photos[index] as string, index, frame, printOptions())
    } catch {
      showToast(t.saveFailed, 'error')
    }
  }

  const onSaveCuts = async () => {
    tap()
    try {
      for (let index = 0; index < photos.length; index++) {
        await downloadSingleCut(photos[index] as string, index, frame, printOptions())
      }
      setSaved(true)
    } catch {
      showToast(t.saveFailed, 'error')
    }
  }

  const switchLanguage = (next: Language) => {
    setLang(next)
    document.documentElement.lang = next
    try {
      localStorage.setItem('moyoo_lang', next)
    } catch {
      // Language still switches for this visit.
    }
  }

  const onInstall = async () => {
    const accepted = await install.promptInstall()
    setInstallOpen(false)
    if (accepted) showToast(t.installed)
  }

  const inSession = photos.some(Boolean)
  const deniedHelp = {
    chrome: t.cameraDeniedChrome,
    edge: t.cameraDeniedEdge,
    safari: t.cameraDeniedSafari,
    firefox: t.cameraDeniedFirefox,
    ios: t.cameraDeniedIos,
    android: t.cameraDeniedAndroid,
    other: t.cameraDeniedChrome,
  }[browser]
  const errorMessage = !cameraError ? null : cameraError.key === 'cameraDenied' ? deniedHelp : t[cameraError.key]
  const errorTitle =
    cameraError && ['cameraDenied', 'cameraSystemDenied', 'cameraEmbedded'].includes(cameraError.key) ? t.cameraBlockedTitle : null

  return (
    <div className={`app app--${step} ${countdown !== null ? 'is-counting' : ''}`}>
      <header className="topbar">
        {step === 'camera' && retakeSlot !== null ? (
          <button type="button" className="chip-btn" onClick={cancelRetake}>
            <X size={16} />
            <span>{t.cancelRetake}</span>
          </button>
        ) : step === 'camera' && inSession ? (
          <button type="button" className="icon-btn" onClick={requestDiscard} aria-label={t.discardSession} title={t.discardSession}>
            <X size={22} />
          </button>
        ) : (
          <span className="brand">
            moyoo
            <svg className="brand__heart" viewBox="0 0 24 22" aria-hidden="true">
              <path d="M12 21C6.2 16.7 1.8 13 1.8 7.6 1.8 4.3 4.3 1.8 7.4 1.8c2 0 3.6 1 4.6 2.6 1-1.6 2.6-2.6 4.6-2.6 3.1 0 5.6 2.5 5.6 5.8 0 5.4-4.4 9.1-10.2 13.4Z" />
            </svg>
          </span>
        )}
        <div className="topbar__actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => setSoundOn(!soundOn)}
            aria-label={soundOn ? t.soundOn : t.soundOff}
            title={soundOn ? t.soundOn : t.soundOff}
          >
            {soundOn ? <Volume2 size={21} /> : <VolumeX size={21} />}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => {
              tap()
              setSettingsOpen(true)
            }}
            aria-label={t.settings}
            title={t.settings}
          >
            <Settings2 size={21} />
            {install.route && <span className="icon-btn__dot" aria-hidden="true" />}
          </button>
        </div>
      </header>

      <main className="screen">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={template.count > 1}
          hidden
          aria-label={t.pickPhotos}
          onChange={(event) => void onFiles(event)}
        />
        {step === 'camera' ? (
          <CameraScreen
            t={t}
            lang={lang}
            template={template}
            frame={frame}
            filter={filter}
            photos={photos}
            retakeSlot={retakeSlot}
            status={status}
            error={errorMessage}
            errorTitle={errorTitle}
            errorKey={cameraError?.key ?? null}
            errorCode={cameraError?.code ?? null}
            countdown={countdown}
            flash={flash}
            developingSlot={developingSlot}
            facingMode={facingMode}
            timerSeconds={timerSeconds}
            autoPaced={autoPaced}
            videoRef={videoRef}
            boxRef={boxRef}
            onOpenCamera={() => {
              tap()
              void startCamera()
            }}
            onPickPhotos={onPickPhotos}
            onShutter={onShutter}
            onFlip={() => {
              tap()
              const next = facingMode === 'user' ? 'environment' : 'user'
              setFacingMode(next)
              void startCamera(next)
            }}
            onModeChange={onModeChange}
            onFrameChange={(next) => {
              tap()
              setFrame(next)
            }}
            onFilterChange={(next) => {
              tap()
              setFilter(next)
            }}
            onTimerToggle={() => {
              tap()
              setTimerSeconds(timerSeconds === 3 ? 5 : 3)
            }}
            onAutoToggle={() => {
              tap()
              setAutoPaced(!autoPaced)
            }}
          />
        ) : (
          <ReviewScreen
            t={t}
            lang={lang}
            template={template}
            frame={frame}
            filter={filter}
            stamp={stamp}
            paper={paper}
            note={note}
            photos={photos}
            date={shotDate}
            developingSlot={developingSlot}
            busy={busy}
            onFrameChange={(next) => {
              tap()
              setFrame(next)
            }}
            onFilterChange={(next) => {
              tap()
              setFilter(next)
            }}
            onTemplateChange={(id) => {
              tap()
              setTemplateId(id)
            }}
            onStampChange={(next) => {
              tap()
              setStamp(next)
            }}
            onPaperChange={(next) => {
              tap()
              setPaper(next)
            }}
            onNoteChange={setNote}
            onRetake={onRetake}
            onSaveCut={(index) => void onSaveCut(index)}
            onSave={() => void onSave()}
            onCopy={() => void onCopy()}
            onSaveCuts={() => void onSaveCuts()}
            onNewSession={requestDiscard}
          />
        )}
      </main>

      <div className="toast-region" aria-live="polite">
        {toast && (
          <p key={toast.id} className={`toast toast--${toast.tone}`} role={toast.tone === 'error' ? 'alert' : 'status'}>
            {toast.message}
          </p>
        )}
      </div>

      <SettingsSheet
        t={t}
        lang={lang}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onLanguage={switchLanguage}
        soundOn={soundOn}
        onSound={setSoundOn}
        canInstall={install.route !== null}
        onInstall={() => {
          setSettingsOpen(false)
          setInstallOpen(true)
        }}
      />

      <InstallSheet t={t} route={install.route} open={installOpen} onOpenChange={setInstallOpen} onInstall={() => void onInstall()} />

      <Dialog.Root open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="sheet-overlay" />
          <Dialog.Content className="sheet">
            <Dialog.Title className="sheet__title">{t.discardTitle}</Dialog.Title>
            <Dialog.Description className="sheet__body">{t.discardBody}</Dialog.Description>
            <div className="sheet__actions">
              <Dialog.Close asChild>
                <button type="button" className="btn btn--ghost">
                  {t.keepPhotos}
                </button>
              </Dialog.Close>
              <button type="button" className="btn btn--danger" onClick={discardSession}>
                {t.discardConfirm}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
