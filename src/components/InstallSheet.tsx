import * as Dialog from '@radix-ui/react-dialog'
import { Share, SquarePlus, WifiOff, Zap, Maximize, Smartphone } from 'lucide-react'
import type { Dictionary } from '../lib/i18n'
import type { InstallRoute } from '../lib/install'

type Props = {
  t: Dictionary
  route: InstallRoute
  open: boolean
  onOpenChange: (open: boolean) => void
  onInstall: () => void
}

export function InstallSheet({ t, route, open, onOpenChange, onInstall }: Props) {
  const perks = [
    { icon: <Smartphone size={18} />, text: t.installPerkIcon },
    { icon: <Maximize size={18} />, text: t.installPerkFull },
    { icon: <WifiOff size={18} />, text: t.installPerkOffline },
    ...(route === 'prompt' ? [{ icon: <Zap size={18} />, text: t.installPerkShortcuts }] : []),
  ]

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content className="sheet install">
          <div className="install__head">
            <img src="/icons/icon-192.png" alt="" width={56} height={56} />
            <div>
              <Dialog.Title className="sheet__title">{t.installTitle}</Dialog.Title>
              <Dialog.Description className="sheet__body">{t.installBody}</Dialog.Description>
            </div>
          </div>

          <ul className="install__perks">
            {perks.map((perk) => (
              <li key={perk.text}>
                <span aria-hidden="true">{perk.icon}</span>
                {perk.text}
              </li>
            ))}
          </ul>

          {route === 'ios' && (
            <ol className="install__steps">
              <li>
                <span className="install__num">1</span>
                <span>
                  {t.installIosStep1} <Share size={16} aria-label={t.installShareIcon} className="install__glyph" />
                </span>
              </li>
              <li>
                <span className="install__num">2</span>
                <span>
                  {t.installIosStep2} <SquarePlus size={16} aria-hidden="true" className="install__glyph" />
                </span>
              </li>
              <li>
                <span className="install__num">3</span>
                <span>{t.installIosStep3}</span>
              </li>
            </ol>
          )}
          {route === 'mac-safari' && <p className="install__note">{t.installMacSafari}</p>}

          <div className="sheet__actions">
            <Dialog.Close asChild>
              <button type="button" className="btn btn--ghost">
                {route === 'prompt' ? t.installLater : t.helpClose}
              </button>
            </Dialog.Close>
            {route === 'prompt' && (
              <button type="button" className="btn btn--primary" onClick={onInstall}>
                {t.installNow}
              </button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
