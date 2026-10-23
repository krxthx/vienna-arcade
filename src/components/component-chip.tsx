import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { HARNESS_COMPONENTS } from '../content/components'
import type { ComponentId } from '../types'
import { ACCENT } from './accents'
import { ICONS } from './icons'

export type ChipState = 'idle' | 'selected' | 'placed' | 'good' | 'bonus' | 'bad'

const STATE_RING: Record<ChipState, string> = {
  idle: '',
  selected: 'ring-4 ring-white scale-105',
  placed: 'opacity-35',
  good: 'ring-4 ring-teal',
  bonus: 'ring-4 ring-volt',
  bad: 'ring-4 ring-ember',
}

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  id: ComponentId
  state?: ChipState
  /** 'row' = palette (icon, name, what it does). 'tile' = compact, for sockets. */
  variant?: 'row' | 'tile'
}

export const ComponentChip = forwardRef<HTMLButtonElement, ChipProps>(function ComponentChip(
  { id, state = 'idle', variant = 'row', className = '', ...rest },
  ref,
) {
  const c = HARNESS_COMPONENTS[id]
  const a = ACCENT[c.accent]
  const Icon = ICONS[c.icon]
  const layout = variant === 'tile' ? 'h-full w-full flex-col gap-1 px-1' : 'min-h-20 w-full gap-3 px-4 text-left'
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      style={{ touchAction: 'none', ...rest.style }}
      className={`flex items-center justify-center rounded-2xl border-2 ${a.border} ${a.bg} bg-ink-800 font-bold text-white transition active:scale-95 ${layout} ${STATE_RING[state]} ${className}`}
    >
      <Icon className={`${variant === 'tile' ? 'h-7 w-7' : 'h-9 w-9'} shrink-0 ${a.text}`} aria-hidden />
      {variant === 'tile' ? (
        <span className="text-center text-sm leading-tight">{c.name}</span>
      ) : (
        <span className="min-w-0">
          <span className="block text-lg leading-tight">{c.name}</span>
          <span className="block text-sm font-medium leading-tight text-slate-300">{c.blurb}</span>
        </span>
      )}
    </button>
  )
})
