import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import {
  ArrowLeft,
  Camera,
  Check,
  Copy,
  Download,
  FlipHorizontal,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Palette,
  RotateCcw,
  SlidersHorizontal,
  Upload,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
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
} from './data/frames'
import {
  captureFrame,
  copyStripToClipboard,
  downloadSingleCut,
  downloadStrip,
  readImageFile,
} from './lib/photo'
import {
  playFilmAdvanceSound,
  playShutterSound,
  playTapSound,
} from './lib/sound'
import { translations, type Language } from './lib/i18n'
import { MiniStrip } from './components/MiniStrip'
import { Welcome } from './components/Welcome'
import './App.css'
import './Experience.css'

type Step = 'welcome' | 'select' | 'camera' | 'result'
type StudioTab = 'frame' | 'template' | 'filter' | 'stamp' | 'paper'
const PHOTO_COUNT = 4

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('moyoo_lang')
      if (saved === 'vi' || saved === 'en') return saved
    }
    return 'vi'
  })

  // Start on Welcome screen
  const [step, setStep] = useState<Step>('welcome')

  // Start with Cream so Blush Note is unpressed for selection
  const [selectedFrame, setSelectedFrame] = useState<Frame>(frames[0])
  const [selectedFilter, setSelectedFilter] = useState<PhotoFilter>(photoFilters[0])
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('strip-4')
  const [selectedStamp, setSelectedStamp] = useState<StampStyle>('letterpress')
  const [selectedPaper, setSelectedPaper] = useState<PaperFinish>('matte')
  const [customNote, setCustomNote] = useState<string>('')
  const [activeSlot, setActiveSlot] = useState<number | null>(null)
  const [retakeSlotIndex, setRetakeSlotIndex] = useState<number | null>(null)
  const [developingIndex, setDevelopingIndex] = useState<number | null>(null)
  const [timerSeconds, setTimerSeconds] = useState<3 | 5>(3)
  const [autoPaced, setAutoPaced] = useState(true)
  const [copiedToast, setCopiedToast] = useState(false)
  const [activeTab, setActiveTab] = useState<StudioTab>('frame')

  const [photos, setPhotos] = useState<string[]>([])
  const [countdown, setCountdown] = useState<number | null>(null)
  const [cameraError, setCameraError] = useState('')
  const [cameraReady, setCameraReady] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')
  const [flashActive, setFlashActive] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<number | null>(null)
  const autoTimerRef = useRef<number | null>(null)
  const cameraRequestRef = useRef(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const t = translations[lang]

  function switchLanguage(newLang: Language) {
    setLang(newLang)
    try {
      localStorage.setItem('moyoo_lang', newLang)
    } catch {
      // ignore
    }
  }

  function stopCamera() {
    cameraRequestRef.current += 1
    if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current)
    autoTimerRef.current = null
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
    setCountdown(null)
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setCameraReady(false)
  }

  useEffect(() => {
    return () => {
      cameraRequestRef.current += 1
      streamRef.current?.getTracks().forEach((track) => track.stop())
      if (autoTimerRef.current) window.clearTimeout(autoTimerRef.current)
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (step !== 'camera' || !streamRef.current || !videoRef.current) return
    videoRef.current.srcObject = streamRef.current
    void videoRef.current
      .play()
      .catch(() => setCameraError(t.cameraNotFoundAlert))
  }, [step, cameraReady, t.cameraNotFoundAlert])

  async function startCamera(mode = facingMode) {
    setStep('camera')
    setCameraError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        lang === 'vi'
          ? 'Trình duyệt này không hỗ trợ camera hoặc trang chưa chạy qua HTTPS/localhost.'
          : 'Browser does not support camera or page is not running over HTTPS/localhost.'
      )
      return
    }
    try {
      stopCamera()
      const request = cameraRequestRef.current
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
      })
      if (request !== cameraRequestRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }
      streamRef.current = stream
      setCameraReady(true)
    } catch (error) {
      const name = error instanceof DOMException ? error.name : ''
      setCameraError(name === 'NotAllowedError' ? t.cameraDeniedAlert : t.cameraNotFoundAlert)
    }
  }

  function toggleCameraFlip() {
    const nextMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(nextMode)
    void startCamera(nextMode)
  }

  function startRetakeSlot(slotIndex: number) {
    if (soundEnabled) playTapSound()
    setRetakeSlotIndex(slotIndex)
    setActiveSlot(null)
    void startCamera()
  }

  function takePhoto(currentPhotos = photos) {
    if (timerRef.current || autoTimerRef.current || !cameraReady || !streamRef.current || !videoRef.current) return
    if (retakeSlotIndex === null && currentPhotos.filter(Boolean).length >= PHOTO_COUNT) return

    let count = timerSeconds
    setCountdown(count)
    timerRef.current = window.setInterval(() => {
      count -= 1
      if (count > 0) {
        setCountdown(count)
        return
      }
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
      setCountdown(null)

      if (soundEnabled) {
        playShutterSound()
        window.setTimeout(() => playFilmAdvanceSound(), 160)
      }

      setFlashActive(true)
      window.setTimeout(() => setFlashActive(false), 240)

      const image = captureFrame(videoRef.current, 'none', facingMode === 'user')
      if (!image) {
        setCameraError(
          lang === 'vi'
            ? 'Chưa lấy được hình ảnh. Vui lòng thử lại.'
            : 'Could not capture frame. Please retry.'
        )
        return
      }

      if (retakeSlotIndex !== null) {
        const targetIndex = retakeSlotIndex
        const next = [...currentPhotos]
        next[targetIndex] = image
        setPhotos(next)
        setDevelopingIndex(targetIndex)
        window.setTimeout(() => setDevelopingIndex(null), 1200)
        setRetakeSlotIndex(null)
        stopCamera()
        setStep(next.filter(Boolean).length === PHOTO_COUNT ? 'result' : 'select')
      } else {
        const emptySlot = Array.from({ length: PHOTO_COUNT }, (_, i) => i).find((i) => !currentPhotos[i])
        const targetIndex = emptySlot ?? currentPhotos.length
        const next = [...currentPhotos]
        next[targetIndex] = image
        setPhotos(next)
        setDevelopingIndex(targetIndex)
        window.setTimeout(() => setDevelopingIndex(null), 1200)

        if (next.filter(Boolean).length === PHOTO_COUNT) {
          stopCamera()
          setStep('result')
        } else if (autoPaced) {
          autoTimerRef.current = window.setTimeout(() => {
            autoTimerRef.current = null
            takePhoto(next)
          }, 1600)
        }
      }
    }, 1000)
  }

  async function handleCopyStrip() {
    if (soundEnabled) playTapSound()
    const success = await copyStripToClipboard(selectedFrame, photos, {
      template: selectedTemplate,
      filterCss: selectedFilter.cssFilter,
      customNote,
      stampStyle: selectedStamp,
      paperFinish: selectedPaper,
    })
    if (success) {
      setCopiedToast(true)
      window.setTimeout(() => setCopiedToast(false), 2400)
    }
  }

  async function handleDownloadAllCuts() {
    if (soundEnabled) playTapSound()
    for (let i = 0; i < photos.length; i++) {
      await downloadSingleCut(photos[i], i, selectedFrame)
    }
  }

  async function handleFileUpload(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    try {
      const loaded: string[] = []
      const countToTake = Math.min(files.length, PHOTO_COUNT)
      for (let i = 0; i < countToTake; i++) {
        const dataUrl = await readImageFile(files[i])
        loaded.push(dataUrl)
      }

      const combined = [...photos, ...loaded].slice(0, PHOTO_COUNT)
      setPhotos(combined)

      stopCamera()
      setStep(combined.length === PHOTO_COUNT ? 'result' : 'select')
    } catch {
      setCameraError(lang === 'vi' ? 'Không thể đọc tệp ảnh.' : 'Could not read image files.')
    } finally {
      if (e.target) e.target.value = ''
    }
  }

  function resetSession() {
    stopCamera()
    if (timerRef.current) window.clearInterval(timerRef.current)
    timerRef.current = null
    setPhotos([])
    setCountdown(null)
    setCameraError('')
    setStep('select')
  }

  return (
    <div className={`app-viewport app-viewport--${step}`}>
      {/* Desktop Ambient Backdrop */}
      <div className="ambient-backdrop" aria-hidden="true">
        
      </div>

      {/* Main Native App Shell */}
      <div className="app-container">
        {/* App Bar */}
        <header className="app-header">
          <button
            className="app-brand"
            aria-label={lang === 'vi' ? 'moyoo — Trang đầu' : 'moyoo — Home'}
            style={{ cursor: step !== 'welcome' ? 'pointer' : 'default' }}
            onClick={() => {
              if (step !== 'welcome') {
                stopCamera()
                setStep('welcome')
              }
            }}
          >
            <span>{t.brand}</span>
            <span className="brand-period" aria-hidden="true" />
          </button>
          <span className="header-caption">THE EVERYDAY PHOTO STUDIO</span>

          <div className="app-header__actions">
            {/* Audio Toggle */}
            <button
              className="icon-btn"
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? t.soundOn : t.soundOff}
              aria-label={soundEnabled ? t.soundOn : t.soundOff}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>

            {/* Language Switcher */}
            <div className="lang-switcher" role="group" aria-label="Language selector">
              <button
                className={`lang-btn ${lang === 'vi' ? 'lang-btn--active' : ''}`}
                onClick={() => switchLanguage('vi')}
              >
                VI
              </button>
              <button
                className={`lang-btn ${lang === 'en' ? 'lang-btn--active' : ''}`}
                onClick={() => switchLanguage('en')}
              >
                EN
              </button>
            </div>
          </div>
        </header>

        {/* App Body Content */}
        <main className="app-content">
          <input type="file" ref={fileInputRef} onChange={(e) => void handleFileUpload(e)} multiple accept="image/*" hidden aria-label={t.uploadBtn} />
          {step !== 'welcome' && <div className="workspace-heading">
            <div><span className="section-eyebrow">{step === 'select' ? '01 / YOUR CANVAS' : step === 'camera' ? '02 / IN THE MOMENT' : '03 / THE KEEPSAKE'}</span>
              <h1>{step === 'select' ? (lang === 'vi' ? 'Một khung hình. Rất bạn.' : 'A frame of your own.') : step === 'camera' ? (lang === 'vi' ? 'Cứ là bạn thôi.' : 'Just be yourself.') : (lang === 'vi' ? 'Giữ lại hôm nay.' : 'Keep a little of today.')}</h1></div>
            <div className="workflow-steps" aria-label={lang === 'vi' ? 'Các bước chụp ảnh' : 'Photo session steps'}>
              {(['select', 'camera', 'result'] as const).map((item, index) => <span key={item} className={step === item ? 'workflow-step is-current' : 'workflow-step'} aria-current={step === item ? 'step' : undefined}><b>0{index + 1}</b>{(lang === 'vi' ? ['Tùy chỉnh', 'Chụp ảnh', 'Lưu giữ'] : ['Customize', 'Capture', 'Keep'])[index]}</span>)}
            </div>
          </div>}
          {step === 'welcome' && (
            <Welcome lang={lang} frame={selectedFrame}
              onFrameChange={(frame) => { setSelectedFrame(frame); if (soundEnabled) playTapSound() }}
              onEnter={() => { if (soundEnabled) playTapSound(); setStep('select') }}
              onUpload={() => fileInputRef.current?.click()} />
          )}

          {/* STEP 1: STUDIO SETUP & PREVIEW */}
          {step === 'select' && (
            <div className="studio-main-screen screen-enter">
              {/* Back to Home Link */}
              <button
                className="nav-back-btn"
                onClick={() => setStep('welcome')}
                style={{ padding: '0 0 4px', fontSize: 11 }}
              >
                <ArrowLeft size={14} />
                <span>{t.backToWelcome}</span>
              </button>

              <div className="studio-preview-column">
              <div className="stage-caption"><span>LIVE PREVIEW</span><span>{selectedTemplate === 'strip-4' ? '01 — FOUR CUT STRIP' : '02 — SQUARE PRINT'}</span></div>
              <div className="studio-staging">
                <MiniStrip
                  frame={selectedFrame}
                  photos={photos}
                  template={selectedTemplate}
                  filterCss={selectedFilter.cssFilter}
                  stampStyle={selectedStamp}
                  customNote={customNote}
                  paperFinish={selectedPaper}
                  activeSlotIndex={activeSlot}
                  developingIndex={developingIndex}
                  onSlotClick={(idx) => {
                    if (soundEnabled) playTapSound()
                    setActiveSlot(idx === activeSlot ? null : idx)
                  }}
                />
              </div>

              {/* Contextual Single Slot Action Drawer (Pioneering Feature) */}
              {activeSlot !== null && (
                <div className="slot-action-drawer screen-enter">
                  <div className="slot-action-info">
                    <span className="slot-action-badge">
                      {photos[activeSlot]
                        ? t.retakeSingleSlot.replace('{index}', String(activeSlot + 1))
                        : (lang === 'vi' ? `Ô ảnh số ${activeSlot + 1}` : `Slot ${activeSlot + 1}`)}
                    </span>
                  </div>
                  <div className="slot-action-btns">
                    <button
                      className="slot-btn slot-btn--primary"
                      onClick={() => startRetakeSlot(activeSlot)}
                    >
                      <RotateCcw size={13} />
                      <span>{photos[activeSlot] ? t.retakeThisPhoto : (lang === 'vi' ? 'Chụp riêng ô này' : 'Shoot this slot')}</span>
                    </button>
                    {photos[activeSlot] && (
                      <button
                        className="slot-btn"
                        onClick={() =>
                          void downloadSingleCut(photos[activeSlot], activeSlot, selectedFrame)
                        }
                      >
                        <Download size={13} />
                        <span>{lang === 'vi' ? 'Tách riêng ảnh này' : 'Save cut'}</span>
                      </button>
                    )}
                    <button
                      className="slot-btn slot-btn--icon"
                      onClick={() => setActiveSlot(null)}
                      aria-label="Đóng"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>
              )}

              <div className="preview-caption"><span>{lang === 'vi' ? (photos.some(Boolean) ? 'Chạm vào một ô để chỉnh lại ảnh' : 'Ảnh mẫu · Chạm vào một ô để chụp riêng') : (photos.some(Boolean) ? 'Tap a slot to edit your photo' : 'Sample photos · Tap a slot to shoot it')}</span><span>moyoo / 04</span></div>
              </div>
              <div className="studio-editor-column">
              <div className="editor-heading"><span className="section-eyebrow">MAKE IT YOURS</span><h2>{lang === 'vi' ? 'Từng chút, theo ý bạn.' : 'Every detail, your way.'}</h2><p>{lang === 'vi' ? 'Chọn màu giấy, bố cục và sắc ảnh cho câu chuyện của bạn.' : 'Choose the paper, layout and tones for your little story.'}</p></div>
              {/* Segmented Controls Bar */}
              <div className="studio-tabs" role="tablist">
                <button
                  className={`studio-tab-btn ${activeTab === 'frame' ? 'studio-tab-btn--active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playTapSound()
                    setActiveTab('frame')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'frame'}
                >
                  <Palette size={14} />
                  <span>{t.tabFrame}</span>
                </button>
                <button
                  className={`studio-tab-btn ${activeTab === 'template' ? 'studio-tab-btn--active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playTapSound()
                    setActiveTab('template')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'template'}
                >
                  <Layers size={14} />
                  <span>{t.tabTemplate}</span>
                </button>
                <button
                  className={`studio-tab-btn ${activeTab === 'filter' ? 'studio-tab-btn--active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playTapSound()
                    setActiveTab('filter')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'filter'}
                >
                  <SlidersHorizontal size={14} />
                  <span>{t.tabFilter}</span>
                </button>
                <button
                  className={`studio-tab-btn ${activeTab === 'stamp' ? 'studio-tab-btn--active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playTapSound()
                    setActiveTab('stamp')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'stamp'}
                >
                  <Check size={14} />
                  <span>{t.tabStamp}</span>
                </button>
                <button
                  className={`studio-tab-btn ${activeTab === 'paper' ? 'studio-tab-btn--active' : ''}`}
                  onClick={() => {
                    if (soundEnabled) playTapSound()
                    setActiveTab('paper')
                  }}
                  role="tab"
                  aria-selected={activeTab === 'paper'}
                >
                  <ImageIcon size={14} />
                  <span>{t.tabFinish}</span>
                </button>
              </div>

              {/* Tab 1: Frame Color Swatches */}
              {activeTab === 'frame' && (
                <div className="swatches-row" role="group" aria-label="Màu khung">
                  {frames.map((frame) => {
                    const isSelected = selectedFrame.id === frame.id
                    return (
                      <button
                        key={frame.id}
                        className={`swatch-btn ${isSelected ? 'swatch-btn--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedFrame(frame)
                        }}
                        aria-label={lang === 'vi' ? frame.name : frame.nameEn}
                        aria-pressed={isSelected}
                      >
                        <span
                          className="swatch-dot"
                          style={{ backgroundColor: frame.background }}
                        />
                        <span className="swatch-name">
                          {lang === 'vi' ? frame.name : frame.nameEn}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Tab 2: Layout Templates */}
              {activeTab === 'template' && (
                <div className="templates-row" role="group" aria-label="Bố cục">
                  {templateOptions.map((opt) => {
                    const isSelected = selectedTemplate === opt.id
                    return (
                      <button
                        key={opt.id}
                        className={`template-box ${isSelected ? 'template-box--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedTemplate(opt.id)
                        }}
                        aria-pressed={isSelected}
                      >
                        <div className="template-icon">
                          <span className={`layout-diagram layout-diagram--${opt.id}`} aria-hidden="true"><i/><i/><i/><i/></span>
                        </div>
                        <div className="template-info">
                          <h4>{lang === 'vi' ? opt.nameVi : opt.nameEn}</h4>
                          <p>{lang === 'vi' ? opt.tagVi : opt.tagEn}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Tab 3: Photo Filters */}
              {activeTab === 'filter' && (
                <div className="filter-bar" role="group" aria-label="Bộ lọc">
                  {photoFilters.map((filt) => {
                    const isSelected = selectedFilter.id === filt.id
                    return (
                      <button
                        key={filt.id}
                        className={`filter-chip ${isSelected ? 'filter-chip--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedFilter(filt)
                        }}
                        aria-pressed={isSelected}
                      >
                        <img className="filter-thumbnail" src={samplePhotos[0]} alt="" style={{ filter: filt.cssFilter }} />
                        <span>{lang === 'vi' ? filt.nameVi : filt.nameEn}</span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Tab 4: Stamps & Signatures */}
              {activeTab === 'stamp' && (
                <div className="stamp-editor-panel screen-enter">
                  <div className="stamp-options-row" role="group" aria-label="Kiểu dấu ấn">
                    {stampOptions.map((opt) => {
                      const isSelected = selectedStamp === opt.id
                      return (
                        <button
                          key={opt.id}
                          className={`stamp-option-btn ${isSelected ? 'stamp-option-btn--active' : ''}`}
                          onClick={() => {
                            if (soundEnabled) playTapSound()
                            setSelectedStamp(opt.id)
                          }}
                          aria-pressed={isSelected}
                        >
                          <span className="stamp-option-title">
                            {lang === 'vi' ? opt.nameVi : opt.nameEn}
                          </span>
                          <span className="stamp-option-preview">{opt.previewText}</span>
                        </button>
                      )
                    })}
                  </div>

                  {selectedStamp === 'letterpress' && (
                    <div className="signature-input-wrap">
                      <label className="signature-label">{t.signatureLabel}</label>
                      <input
                        type="text"
                        className="signature-input"
                        value={customNote}
                        onChange={(e) => setCustomNote(e.target.value)}
                        placeholder={t.signaturePlaceholder}
                        maxLength={28}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Paper Finishes */}
              {activeTab === 'paper' && (
                <div className="paper-finishes-row screen-enter" role="group" aria-label="Chất giấy">
                  {paperFinishes.map((finish) => {
                    const isSelected = selectedPaper === finish.id
                    return (
                      <button
                        key={finish.id}
                        className={`paper-finish-btn ${isSelected ? 'paper-finish-btn--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedPaper(finish.id)
                        }}
                        aria-pressed={isSelected}
                      >
                        <span className={`paper-sample paper-sample--${finish.id}`} aria-hidden="true" />
                        <span className="paper-finish-name">
                          {lang === 'vi' ? finish.nameVi : finish.nameEn}
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div className="studio-actions">
                <button
                  className="btn-primary"
                  onClick={() => void startCamera()}
                  aria-label="Bắt đầu chụp"
                >
                  <Camera size={18} />
                  <span>{t.startCameraBtn}</span>
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload size={15} />
                  <span>{t.uploadBtn}</span>
                </button>

                <p className="caption-hint">{t.cameraHint}</p>
              </div>
              </div>
            </div>
          )}

          {/* STEP 2: CAMERA CAPTURE (Pioneering Viewfinder Studio) */}
          {step === 'camera' && (
            <div className="camera-screen screen-enter">
              {/* Top Bar with Timer and Mode Controls */}
              <div className="camera-nav">
                <button
                  className="nav-back-btn"
                  onClick={() => {
                    stopCamera()
                    if (retakeSlotIndex !== null) {
                      setRetakeSlotIndex(null)
                      setStep('result')
                    } else {
                      setPhotos([])
                      setStep('select')
                    }
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>{t.changeFrameBtn}</span>
                </button>

                <div className="camera-mode-group">
                  {/* Timer Selector */}
                  <button
                    className="camera-ctrl-pill"
                    onClick={() => {
                      if (soundEnabled) playTapSound()
                      setTimerSeconds(timerSeconds === 3 ? 5 : 3)
                    }}
                    title={timerSeconds === 3 ? t.timer3s : t.timer5s}
                  >
                    <span>{timerSeconds}s</span>
                  </button>

                  {/* Auto Cadence Toggle */}
                  {retakeSlotIndex === null && (
                    <button
                      className={`camera-ctrl-pill ${autoPaced ? 'camera-ctrl-pill--active' : ''}`}
                      onClick={() => {
                        if (soundEnabled) playTapSound()
                        setAutoPaced(!autoPaced)
                      }}
                      title="Chế độ chụp liên tiếp"
                    >
                      <span>{autoPaced ? 'Auto 4' : 'Manual'}</span>
                    </button>
                  )}

                  {/* Current Slot / Shot Status */}
                  <div className="camera-tag">
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: 2,
                        backgroundColor: selectedFrame.background,
                      }}
                    />
                    <span>
                      {retakeSlotIndex !== null
                        ? t.retakeSingleSlot.replace('{index}', String(retakeSlotIndex + 1))
                        : t.shotsCount.replace('{current}', String(photos.length + 1))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Viewfinder with Live Real-time CSS Filter */}
              <div className="viewfinder">
                <span className="corner-reticle corner-reticle--tl" />
                <span className="corner-reticle corner-reticle--tr" />
                <span className="corner-reticle corner-reticle--bl" />
                <span className="corner-reticle corner-reticle--br" />

                {flashActive && <div className="camera-flash" />}

                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`viewfinder-video ${facingMode === 'user' ? 'viewfinder-video--user' : ''}`}
                  style={{
                    filter:
                      selectedFilter.cssFilter !== 'none'
                        ? selectedFilter.cssFilter
                        : undefined,
                  }}
                  aria-label="Xem trước camera"
                />

                {!cameraReady && (
                  <div className="viewfinder-standby">
                    <Camera size={32} />
                    <span>{t.cameraPreviewLabel}</span>
                  </div>
                )}

                {countdown !== null && (
                  <div className="countdown-overlay" aria-live="assertive">
                    <span className="countdown-digits">{countdown}</span>
                  </div>
                )}
              </div>

              {/* Live Filter Switcher during Shooting */}
              <div className="filter-bar" role="group" aria-label="Bộ lọc trực tiếp">
                {photoFilters.map((filt) => {
                  const isSelected = selectedFilter.id === filt.id
                  return (
                    <button
                      key={filt.id}
                      className={`filter-chip ${isSelected ? 'filter-chip--active' : ''}`}
                      onClick={() => {
                        if (soundEnabled) playTapSound()
                        setSelectedFilter(filt)
                      }}
                    >
                      {lang === 'vi' ? filt.nameVi : filt.nameEn}
                    </button>
                  )
                })}
              </div>

              {/* 4 Cuts Progress Reel with Chemical Development Indicator */}
              <div className="shots-reel">
                {Array.from({ length: PHOTO_COUNT }, (_, index) => {
                  const isDone = Boolean(photos[index])
                  const isCurrent =
                    retakeSlotIndex !== null ? retakeSlotIndex === index : photos.length === index
                  const isDeveloping = developingIndex === index

                  return (
                    <div
                      key={index}
                      className={`reel-slot ${isDone ? 'reel-slot--done' : ''} ${
                        isCurrent ? 'reel-slot--active' : ''
                      } ${isDeveloping ? 'reel-slot--developing' : ''}`}
                    >
                      {photos[index] ? (
                        <>
                          <img src={photos[index]} alt={`Shot ${index + 1}`} />
                          <span className="reel-check">
                            <Check size={8} strokeWidth={3} />
                          </span>
                        </>
                      ) : (
                        <span className="reel-num">0{index + 1}</span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Camera Error Alert */}
              {cameraError && (
                <div className="camera-error-box" role="alert">
                  <span className="camera-error-msg">{cameraError}</span>
                  {!cameraReady && (
                    <button
                      className="btn-secondary"
                      style={{ minHeight: 36, fontSize: 12 }}
                      onClick={() => void startCamera()}
                    >
                      <RotateCcw size={13} />
                      <span>{t.retakeCameraBtn}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Hardware Shutter Bar */}
              <div className="shutter-bar">
                {/* Flip camera */}
                <button
                  className="shutter-sub-btn"
                  onClick={toggleCameraFlip}
                  title={t.flipCameraBtn}
                  aria-label={t.flipCameraBtn}
                >
                  <FlipHorizontal size={18} />
                </button>

                {/* Main Shutter */}
                <div className="shutter-trigger-outer">
                  <div className="shutter-ring" />
                  <button
                    className="shutter-btn"
                    onClick={() => takePhoto()}
                    disabled={!cameraReady || countdown !== null}
                    aria-label={`Chụp ảnh ${photos.length + 1} / 4`}
                  >
                    <Camera size={24} />
                  </button>
                </div>

                {/* Upload fallback */}
                <button
                  className="shutter-sub-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title={t.uploadBtn}
                  aria-label={t.uploadBtn}
                >
                  <ImageIcon size={18} />
                </button>
              </div>

              {/* Help Modal */}
              <Dialog.Root>
                <Dialog.Trigger asChild>
                  <button
                    className="nav-back-btn"
                    style={{ justifyContent: 'center', opacity: 0.7 }}
                  >
                    <HelpCircle size={14} />
                    <span>{t.cameraHelpBtn}</span>
                  </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="dialog-overlay" />
                  <Dialog.Content className="dialog-content">
                    <div className="dialog-header">
                      <Dialog.Title className="dialog-title">
                        {t.dialogTitle}
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button className="dialog-close-btn" aria-label="Đóng">
                          <X size={15} />
                        </button>
                      </Dialog.Close>
                    </div>
                    <Dialog.Description className="dialog-body">
                      {t.dialogDesc}
                    </Dialog.Description>
                    <Dialog.Close asChild>
                      <button className="btn-primary" style={{ minHeight: 44 }}>
                        {t.dialogClose}
                      </button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          )}

          {/* STEP 3: RESULT & DOWNLOAD (Keepsake Suite & Granular Retakes) */}
          {step === 'result' && (
            <div className="result-screen screen-enter">
              <div className="result-card">
                {/* Photostrip View with Interactive Slot Highlighting */}
                <div className="result-preview-column">
                <div className="stage-caption"><span>YOUR LITTLE STORY</span><span>04 / 04</span></div>
                <div className="result-strip-box">
                  <MiniStrip
                    frame={selectedFrame}
                    photos={photos}
                    template={selectedTemplate}
                    filterCss={selectedFilter.cssFilter}
                    stampStyle={selectedStamp}
                    customNote={customNote}
                    paperFinish={selectedPaper}
                    activeSlotIndex={activeSlot}
                    developingIndex={developingIndex}
                    onSlotClick={(idx) => {
                      if (soundEnabled) playTapSound()
                      setActiveSlot(idx === activeSlot ? null : idx)
                    }}
                  />
                </div>

                {/* Single Slot Retake & Cut Action Bar */}
                {activeSlot !== null && photos[activeSlot] ? (
                  <div className="slot-action-drawer screen-enter" style={{ margin: '8px 0 4px' }}>
                    <div className="slot-action-info">
                      <span className="slot-action-badge">
                        {t.retakeSingleSlot.replace('{index}', String(activeSlot + 1))}
                      </span>
                    </div>
                    <div className="slot-action-btns">
                      <button
                        className="slot-btn slot-btn--primary"
                        onClick={() => startRetakeSlot(activeSlot)}
                      >
                        <RotateCcw size={13} />
                        <span>{t.retakeThisPhoto}</span>
                      </button>
                      <button
                        className="slot-btn"
                        onClick={() =>
                          void downloadSingleCut(photos[activeSlot], activeSlot, selectedFrame)
                        }
                      >
                        <Download size={13} />
                        <span>{lang === 'vi' ? 'Tách riêng ảnh này' : 'Save cut'}</span>
                      </button>
                      <button
                        className="slot-btn slot-btn--icon"
                        onClick={() => setActiveSlot(null)}
                        aria-label="Đóng"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="caption-hint" style={{ margin: '6px 0 2px' }}>
                    {t.tapSlotToRetake}
                  </p>
                )}

                </div>
                <div className="result-editor-column">
                <div className="editor-heading"><span className="section-eyebrow">THE FINISHING TOUCH</span><h2>{lang === 'vi' ? 'Thêm một dấu ấn.' : 'Make it a keepsake.'}</h2></div>
                {/* Segmented Controls in Result */}
                <div className="studio-tabs" role="tablist" style={{ width: '100%', marginTop: 8 }}>
                  <button
                    className={`studio-tab-btn ${activeTab === 'frame' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => {
                      if (soundEnabled) playTapSound()
                      setActiveTab('frame')
                    }}
                  >
                    <Palette size={13} />
                    <span>{t.tabFrame}</span>
                  </button>
                  <button
                    className={`studio-tab-btn ${activeTab === 'template' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => {
                      if (soundEnabled) playTapSound()
                      setActiveTab('template')
                    }}
                  >
                    <Layers size={13} />
                    <span>{t.tabTemplate}</span>
                  </button>
                  <button
                    className={`studio-tab-btn ${activeTab === 'filter' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => {
                      if (soundEnabled) playTapSound()
                      setActiveTab('filter')
                    }}
                  >
                    <SlidersHorizontal size={13} />
                    <span>{t.tabFilter}</span>
                  </button>
                  <button
                    className={`studio-tab-btn ${activeTab === 'stamp' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => {
                      if (soundEnabled) playTapSound()
                      setActiveTab('stamp')
                    }}
                  >
                    <Check size={13} />
                    <span>{t.tabStamp}</span>
                  </button>
                  <button
                    className={`studio-tab-btn ${activeTab === 'paper' ? 'studio-tab-btn--active' : ''}`}
                    onClick={() => {
                      if (soundEnabled) playTapSound()
                      setActiveTab('paper')
                    }}
                  >
                    <ImageIcon size={13} />
                    <span>{t.tabFinish}</span>
                  </button>
                </div>

                {/* Tab content in Result */}
                {activeTab === 'frame' && (
                  <div className="swatches-row" style={{ width: '100%', marginTop: 10 }}>
                    {frames.map((frame) => (
                      <button
                        key={frame.id}
                        className={`swatch-btn ${selectedFrame.id === frame.id ? 'swatch-btn--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedFrame(frame)
                        }}
                        aria-label={lang === 'vi' ? frame.name : frame.nameEn}
                      >
                        <span
                          className="swatch-dot"
                          style={{ backgroundColor: frame.background }}
                        />
                        <span className="swatch-name">
                          {lang === 'vi' ? frame.name : frame.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'template' && (
                  <div className="templates-row" style={{ width: '100%', marginTop: 10 }}>
                    {templateOptions.map((opt) => (
                      <button
                        key={opt.id}
                        className={`template-box ${selectedTemplate === opt.id ? 'template-box--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedTemplate(opt.id)
                        }}
                      >
                        <div className="template-icon">
                          <span className={`layout-diagram layout-diagram--${opt.id}`} aria-hidden="true"><i/><i/><i/><i/></span>
                        </div>
                        <div className="template-info">
                          <h4>{lang === 'vi' ? opt.nameVi : opt.nameEn}</h4>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'filter' && (
                  <div className="filter-bar" style={{ width: '100%', marginTop: 10 }}>
                    {photoFilters.map((filt) => (
                      <button
                        key={filt.id}
                        className={`filter-chip ${selectedFilter.id === filt.id ? 'filter-chip--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedFilter(filt)
                        }}
                      >
                        <img className="filter-thumbnail" src={samplePhotos[0]} alt="" style={{ filter: filt.cssFilter }} />
                        <span>{lang === 'vi' ? filt.nameVi : filt.nameEn}</span>
                      </button>
                    ))}
                  </div>
                )}

                {activeTab === 'stamp' && (
                  <div className="stamp-editor-panel screen-enter" style={{ width: '100%', marginTop: 10 }}>
                    <div className="stamp-options-row">
                      {stampOptions.map((opt) => (
                        <button
                          key={opt.id}
                          className={`stamp-option-btn ${selectedStamp === opt.id ? 'stamp-option-btn--active' : ''}`}
                          onClick={() => {
                            if (soundEnabled) playTapSound()
                            setSelectedStamp(opt.id)
                          }}
                        >
                          <span className="stamp-option-title">
                            {lang === 'vi' ? opt.nameVi : opt.nameEn}
                          </span>
                        </button>
                      ))}
                    </div>

                    {selectedStamp === 'letterpress' && (
                      <div className="signature-input-wrap">
                        <input
                          type="text"
                          className="signature-input"
                          value={customNote}
                          onChange={(e) => setCustomNote(e.target.value)}
                          placeholder={t.signaturePlaceholder}
                          maxLength={28}
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'paper' && (
                  <div className="paper-finishes-row screen-enter" style={{ width: '100%', marginTop: 10 }}>
                    {paperFinishes.map((finish) => (
                      <button
                        key={finish.id}
                        className={`paper-finish-btn ${selectedPaper === finish.id ? 'paper-finish-btn--active' : ''}`}
                        onClick={() => {
                          if (soundEnabled) playTapSound()
                          setSelectedPaper(finish.id)
                        }}
                      >
                        <span className={`paper-sample paper-sample--${finish.id}`} aria-hidden="true" />
                        <span className="paper-finish-name">
                          {lang === 'vi' ? finish.nameVi : finish.nameEn}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
                </div>
              </div>

              {/* Keepsake Export Actions */}
              <div className="studio-actions">
                <button
                  className="btn-primary"
                  onClick={() =>
                    void downloadStrip(selectedFrame, photos, {
                      template: selectedTemplate,
                      filterCss: selectedFilter.cssFilter,
                      customNote,
                      stampStyle: selectedStamp,
                      paperFinish: selectedPaper,
                    })
                  }
                >
                  <Download size={17} />
                  <span>{t.downloadPngBtn}</span>
                </button>

                <div className="export-action-grid">
                  <button className="btn-secondary" onClick={() => void handleCopyStrip()}>
                    <Copy size={15} />
                    <span>{copiedToast ? t.copiedSuccess : t.copyStripBtn}</span>
                  </button>

                  <button className="btn-secondary" onClick={() => void handleDownloadAllCuts()}>
                    <Download size={15} />
                    <span>{t.downloadSingleCuts}</span>
                  </button>
                </div>

                <button className="btn-tertiary" onClick={resetSession}>
                  <RotateCcw size={14} />
                  <span>{t.newSessionBtn}</span>
                </button>

                <p className="caption-hint">{t.resultHint}</p>
              </div>
            </div>
          )}
        </main>
        <footer className="app-footer"><span>moyoo — moments of you.</span><span>{lang === 'vi' ? 'Ảnh của bạn. Trên thiết bị của bạn.' : 'Your photos. On your device.'}</span><span>© {new Date().getFullYear()}</span></footer>
      </div>
    </div>
  )
}
