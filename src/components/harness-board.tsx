import { Brain, Plus, X } from 'lucide-react'
import { HARNESS_COMPONENTS } from '../content/components'
import type { ComponentId } from '../types'
import type { Slots } from '../lib/harness'
import { ComponentChip } from './component-chip'
import type { DragSource } from './use-drag-drop'

interface BoardProps {
  slots: Slots
  selectedId: ComponentId | null
  overSlot: number | null
  draggingId: ComponentId | null
  onSlotClick?: (index: number) => void
  onRemove?: (index: number) => void
  onPointerDown?: (e: React.PointerEvent, source: DragSource) => void
  wasDragged?: () => boolean
}

/** The build canvas: the model on the left, with a socket per part wired in on the right. Stacks on narrow screens. */
export function HarnessBoard(props: BoardProps) {
  const { slots, selectedId, overSlot, draggingId } = props
  const armed = selectedId !== null || draggingId !== null
  const count = slots.length

  return (
    <div
      className="grid grid-cols-1 items-stretch gap-4 rounded-3xl border-2 border-ink-700 bg-ink-950/70 p-4 sm:grid-cols-[minmax(8rem,11rem)_minmax(2rem,6rem)_minmax(0,1fr)] sm:gap-0 sm:p-6"
      style={{ backgroundImage: 'radial-gradient(#2b3c70 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' }}
      role="group"
      aria-label="Agent canvas. The model is on the left; plug parts in on the right."
    >
      <div className="flex items-center justify-center">
        <div className="relative flex w-full max-w-[12rem] flex-col items-center gap-2 rounded-2xl border-2 border-violet bg-ink-900 px-3 py-5 text-center shadow-[0_0_34px_-10px_#a07bff]">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/25">
            <Brain className="h-7 w-7 text-violet" aria-hidden />
          </span>
          <span className="text-lg font-bold leading-tight text-white">The Model</span>
          <span className="text-xs leading-snug text-slate-400">The AI brain. It needs the right parts.</span>
        </div>
      </div>

      {/* wires: rows are equal height, so each curve ends at the centre of its socket */}
      <svg className="hidden h-full w-full sm:block" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {slots.map((id, index) => {
          const y = ((index + 0.5) / count) * 100
          return (
            <path
              key={index}
              d={`M0,50 C50,50 50,${y} 100,${y}`}
              fill="none"
              vectorEffect="non-scaling-stroke"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={id ? 'flow-dash' : ''}
              stroke={id ? '#2de2c4' : '#2b3c70'}
              strokeDasharray={id ? undefined : '5 6'}
            />
          )
        })}
      </svg>

      <ul className="grid min-w-0 gap-3 sm:gap-0" style={{ gridAutoRows: '5rem' }}>
        {slots.map((id, index) => (
          <li key={index} data-slot={index} className="flex items-center sm:py-1">
            <div className={`relative h-16 w-full rounded-2xl transition ${overSlot === index ? 'scale-[1.03] ring-4 ring-white' : ''}`}>
              {id ? (
                <>
                  <ComponentChip
                    id={id}
                    state={selectedId === id ? 'selected' : 'idle'}
                    className={draggingId === id ? 'opacity-30' : ''}
                    aria-label={`${HARNESS_COMPONENTS[id].name} in slot ${index + 1}. Press to select or move.`}
                    onPointerDown={(e) => props.onPointerDown?.(e, { id, from: 'slot', index })}
                    onClick={() => {
                      if (props.wasDragged?.()) return
                      props.onSlotClick?.(index)
                    }}
                  />
                  <button
                    type="button"
                    aria-label={`Remove ${HARNESS_COMPONENTS[id].name}`}
                    onClick={() => props.onRemove?.(index)}
                    className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-600 bg-ink-950 text-slate-200 hover:border-ember hover:text-ember active:scale-90"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => props.onSlotClick?.(index)}
                  aria-label={`Empty slot ${index + 1}. ${armed ? 'Press to plug the selected part in here.' : 'Press to add a part.'}`}
                  className={`flex h-16 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed bg-ink-900/60 text-sm font-semibold transition hover:border-violet hover:text-violet ${
                    armed ? 'animate-pulse border-white text-white' : 'border-ink-600 text-slate-500'
                  }`}
                >
                  <Plus className="h-6 w-6" aria-hidden /> Add a part
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
