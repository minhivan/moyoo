import { DOODLES, HEART_PINK, type DoodleName } from '../lib/materials'

export function Doodle({ name, className, color }: { name: DoodleName; className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d={DOODLES[name]}
        fill="none"
        stroke={color ?? (name === 'heart' ? HEART_PINK : 'currentColor')}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
