import type { Accent } from '../types'

/** Static class strings so Tailwind can see them. */
export const ACCENT: Record<
  Accent,
  { text: string; bg: string; border: string; ring: string; solid: string; hex: string }
> = {
  blue: { text: 'text-volt', bg: 'bg-volt/12', border: 'border-volt/50', ring: 'ring-volt', solid: 'bg-volt text-ink-950', hex: '#5b8cff' },
  violet: { text: 'text-violet', bg: 'bg-violet/12', border: 'border-violet/50', ring: 'ring-violet', solid: 'bg-violet text-ink-950', hex: '#a07bff' },
  teal: { text: 'text-teal', bg: 'bg-teal/12', border: 'border-teal/50', ring: 'ring-teal', solid: 'bg-teal text-ink-950', hex: '#2de2c4' },
  orange: { text: 'text-ember', bg: 'bg-ember/12', border: 'border-ember/50', ring: 'ring-ember', solid: 'bg-ember text-ink-950', hex: '#ff8f45' },
}
