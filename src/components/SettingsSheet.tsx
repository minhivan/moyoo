import * as Dialog from '@radix-ui/react-dialog'
import { ChevronRight, Download, Volume2 } from 'lucide-react'
import type { Dictionary, Language } from '../lib/i18n'
import { HelpDialog } from './CameraScreen'

type Props = {
  t: Dictionary
  lang: Language
  open: boolean
  onOpenChange: (open: boolean) => void
  onLanguage: (lang: Language) => void
  soundOn: boolean
  onSound: (on: boolean) => void
  canInstall: boolean
  onInstall: () => void
}

export function SettingsSheet({ t, lang, open, onOpenChange, onLanguage, soundOn, onSound, canInstall, onInstall }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="sheet settings">
          <span className="sheet__grip" aria-hidden="true" />
          <Dialog.Title className="sheet__title">{t.settings}</Dialog.Title>
          <Dialog.Description className="sr-only">{t.privacyNote}</Dialog.Description>

          <div className="settings__row">
            <span>{t.languageGroup}</span>
            <div className="segmented" role="group" aria-label={t.languageGroup}>
              {(['vi', 'en'] as const).map((code) => (
                <button key={code} type="button" className={lang === code ? 'is-selected' : ''} aria-pressed={lang === code} onClick={() => onLanguage(code)}>
                  {code === 'vi' ? 'Tiếng Việt' : 'English'}
                </button>
              ))}
            </div>
          </div>

          <label className="settings__row">
            <span className="settings__label">
              <Volume2 size={18} aria-hidden="true" />
              {t.soundLabel}
            </span>
            <input type="checkbox" role="switch" className="switch" checked={soundOn} onChange={(event) => onSound(event.target.checked)} />
          </label>

          {canInstall && (
            <button type="button" className="settings__row settings__link" onClick={onInstall}>
              <span className="settings__label">
                <Download size={18} aria-hidden="true" />
                {t.install}
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          )}

          <div className="settings__row settings__help">
            <HelpDialog t={t} />
          </div>

          <p className="settings__note">{t.privacyNote}</p>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
