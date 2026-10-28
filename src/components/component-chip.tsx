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
  /** 'row' = node (icon, name, what it does). 'item' = compact drawer entry (icon, name). 'tile' = compact, for sockets. */
  variant?: 'row' | 'tile' | 'item'
}

export const ComponentChip = forwardRef<HTMLButtonElement, ChipProps>(function ComponentChip(
  { id, state = 'idle', variant = 'row', className = '', ...rest },
  ref,
) {
  const c = HARNESS_COMPONENTS[id]
  const a = ACCENT[c.accent]
  const Icon = ICONS[c.icon]
  const tile = variant === 'tile'
  const item = variant === 'item'
  return (
    <button
      ref={ref}
      type="button"
      {...rest}
      style={{ touchAction: 'none', ...rest.style }}
      className={`flex items-center rounded-2xl border-2 border-ink-600 bg-ink-800 font-bold text-white transition hover:border-slate-400 active:scale-95 ${
        tile ? 'h-full w-full flex-col justify-center gap-1 px-1' : item ? 'h-10 w-full gap-2.5 px-2 text-left' : 'h-16 w-full gap-4 px-4 text-left'
      } ${STATE_RING[state]} ${className}`}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl ${a.bg} ${tile ? 'h-9 w-9' : item ? 'h-7 w-7' : 'h-10 w-10'}`}
      >
        <Icon className={`${tile ? 'h-6 w-6' : item ? 'h-4 w-4' : 'h-7 w-7'} ${a.text}`} aria-hidden />
      </span>
      {tile ? (
        <span className="text-center text-sm leading-tight">{c.name}</span>
      ) : item ? (
        <span className="min-w-0 flex-1 truncate text-[15px] leading-tight">{c.name}</span>
      ) : (
        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg leading-tight">{c.name}</span>
          <span className="line-clamp-2 text-[13px] font-medium leading-tight text-slate-400">{c.blurb}</span>
        </span>
      )}
    </button>
  )
})
