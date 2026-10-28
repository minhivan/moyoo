import { ArrowDown, ArrowRight, Upload } from 'lucide-react'
import { frames, type Frame } from '../data/frames'
import { translations, type Language } from '../lib/i18n'
import { MiniStrip } from './MiniStrip'

type Props = {
  lang: Language
  frame: Frame
  onFrameChange: (frame: Frame) => void
  onEnter: () => void
  onUpload: () => void
}

export function Welcome({ lang, frame, onFrameChange, onEnter, onUpload }: Props) {
  const t = translations[lang]
  const vi = lang === 'vi'
  return <div className="welcome-experience screen-enter">
    <section className="editorial-hero" aria-labelledby="welcome-title">
      <div className="hero-story">
        <div className="section-eyebrow"><span className="edition-line"/> SELF-PORTRAIT, EVERYDAY.</div>
        <h1 id="welcome-title">{vi ? <>Một chút bạn.<br/><span>Một cuộn <br/>kỷ niệm.</span></> : <>A little you.<br/><span>A little <br/>to keep.</span></>}</h1>
        <p className="hero-description">{vi ? 'Bốn khoảnh khắc, không cần hoàn hảo. Một dải ảnh nhỏ để giữ lại bạn của hôm nay.' : 'Four moments, perfectly imperfect. A little photo strip to remember you, just as you are today.'}</p>
        <div className="hero-cta-group">
          <button className="btn-primary hero-enter" onClick={onEnter} aria-label={t.welcomeCta}><span>{vi ? 'Bắt đầu câu chuyện' : 'Make a little memory'}</span><ArrowRight size={19}/></button>
          <button className="hero-upload" onClick={onUpload}><Upload size={15}/><span>{t.welcomeUploadCta}</span></button>
        </div>
        <div className="hero-footnote"><span className="quiet-dot"/>{vi ? 'Không cần tài khoản. Chỉ cần là bạn.' : 'No sign-up. Just show up as you.'}</div>
        <div className="hero-index"><span>01 — THE MOYOO EXPERIENCE</span><ArrowDown size={16}/></div>
      </div>
      <div className="hero-artwork">
        <div className="artwork-label"><span>MOYOO PHOTO CLUB</span><span>VOL. 01</span></div>
        <div className="artwork-oversized" aria-hidden="true">m.</div>
        <div className="print-composition" aria-label={vi ? 'Dải ảnh mẫu moyoo' : 'moyoo sample prints'}>
          <div className="editorial-print editorial-print--back"><MiniStrip frame={frames[1]} filterCss="grayscale(1)" customNote="just as you are"/></div>
          <div className="editorial-print editorial-print--front"><MiniStrip frame={frame} customNote="a day to remember"/></div>
          <div className="print-label"><span>FOUR CUTS.</span><span>ALL YOU.</span></div>
          <div className="print-registration" aria-hidden="true">+</div>
        </div>
        <div className="artwork-bottom"><span>{vi ? 'Những ngày bình thường, đáng để giữ lại.' : 'Ordinary days, worth keeping.'}</span><span>4 CUTS / 1 STORY</span></div>
      </div>
    </section>

    <section className="paper-selector" aria-label={vi ? 'Chọn màu giấy ảnh mẫu' : 'Preview paper colors'}>
      <div className="paper-selector-title"><span className="section-eyebrow">THE PAPER PALETTE</span><p>{vi ? 'Hôm nay bạn mang màu gì?' : 'What color is your day?'}</p></div>
      <div className="paper-palette">{frames.map((item) => <button key={item.id} className={`palette-item ${frame.id === item.id ? 'is-selected' : ''}`} onClick={() => onFrameChange(item)} aria-pressed={frame.id === item.id} aria-label={vi ? item.name : item.nameEn}><span style={{ background: item.background }}/><span>{vi ? item.name : item.nameEn}</span></button>)}</div>
      <span className="palette-counter">0{frames.indexOf(frame) + 1}<span> / 06</span></span>
    </section>

    <section className="experience-notes" aria-label={vi ? 'Cách hoạt động' : 'How it works'}>
      <div className="experience-note"><span className="note-number">01</span><div><h2>{vi ? 'Chọn một cảm hứng.' : 'Find your feeling.'}</h2><p>{vi ? 'Màu giấy, sắc film và một dòng chữ riêng.' : 'Paper tones, film filters, a note of your own.'}</p></div></div>
      <div className="experience-note"><span className="note-number">02</span><div><h2>{vi ? 'Để khoảnh khắc tự nhiên.' : 'Let the moment happen.'}</h2><p>{vi ? 'Chụp bốn tấm. Thích ô nào, giữ ô đó.' : 'Take four shots. Retake just the one you want.'}</p></div></div>
      <div className="experience-note"><span className="note-number">03</span><div><h2>{vi ? 'Mang hôm nay theo bạn.' : 'Take today with you.'}</h2><p>{vi ? 'Lưu dải ảnh về máy. Nhỏ xinh, rất riêng.' : 'Save your photo strip. A little piece of today.'}</p></div></div>
    </section>
  </div>
}
