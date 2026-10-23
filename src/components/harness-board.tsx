import { Brain, X } from 'lucide-react'
import { HARNESS_COMPONENTS } from '../content/components'
import type { ComponentId } from '../types'
import type { Slots } from '../lib/harness'
import { ComponentChip, type ChipState } from './component-chip'
import type { DragSource } from './use-drag-drop'

interface BoardProps {
  slots: Slots
  selectedId: ComponentId | null
  overSlot: number | null
  draggingId: ComponentId | null
  readOnly?: boolean
  statuses?: Partial<Record<ComponentId, 'required' | 'optional' | 'distractor'>>
  onSlotClick?: (index: number) => void
  onRemove?: (index: number) => void
  onPointerDown?: (e: React.PointerEvent, source: DragSource) => void
  wasDragged?: () => boolean
}

const STATUS_CHIP: Record<'required' | 'optional' | 'distractor', ChipState> = {
  required: 'good',
  optional: 'bonus',
  distractor: 'bad',
}

/** Sockets on an ellipse around the model, starting at the top. Percent of the board. */
function socketPosition(i: number, n: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n
  return { x: 50 + 37 * Math.cos(angle), y: 50 + 35 * Math.sin(angle) }
}

/** The harness: the model in the middle, with parts plugged in around it. */
export function HarnessBoard(props: BoardProps) {
  const { slots, selectedId, overSlot, draggingId, readOnly, statuses } = props
  const armed = !readOnly && (selectedId !== null || draggingId !== null)
  const n = slots.length

  return (
    <div
      className="relative mx-auto aspect-[3/2] w-full max-w-[640px] rounded-3xl border-2 border-dashed border-ink-600 bg-ink-900/70"
      role="group"
      aria-label="Agent harness. The model is in the middle; add parts around it."
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {slots.map((id, i) => {
          const { x, y } = socketPosition(i, n)
          return (
            <line
              key={i}
              x1="50" y1="50" x2={x} y2={y}
              vectorEffect="non-scaling-stroke"
              strokeWidth="3"
              strokeLinecap="round"
              className={id ? 'flow-dash' : ''}
              stroke={id ? '#2de2c4' : '#2b3c70'}
              strokeDasharray={id ? undefined : '4 6'}
            />
          )
        })}
      </svg>

      <div
        className="absolute left-1/2 top-1/2 flex aspect-square w-[21%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border-4 border-violet bg-violet/20 text-center shadow-[0_0_40px_-6px_#a07bff]"
      >
        <Brain className="h-[38%] w-[38%] text-violet" aria-hidden />
        <span className="mt-1 font-mono text-[0.65rem] font-bold leading-tight tracking-widest text-white sm:text-xs">THE MODEL</span>
      </div>

      {slots.map((id, i) => {
        const { x, y } = socketPosition(i, n)
        const frame = {
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
        }
        return (
          <div
            key={i}
            data-slot={i}
            style={frame}
            className={`absolute h-[27%] w-[24%] rounded-2xl transition ${overSlot === i ? 'scale-110 ring-4 ring-white' : ''}`}
          >
            {id ? (
              <>
                <ComponentChip
                  id={id}
                  variant="tile"
                  disabled={readOnly}
                  state={statuses?.[id] ? STATUS_CHIP[statuses[id]!] : selectedId === id ? 'selected' : 'idle'}
                  className={`${draggingId === id ? 'opacity-30' : ''} ${readOnly ? 'cursor-default' : ''}`}
                  aria-label={`${HARNESS_COMPONENTS[id].name} in socket ${i + 1}. Press to select or move.`}
                  onPointerDown={(e) => props.onPointerDown?.(e, { id, from: 'slot', index: i })}
                  onClick={() => {
                    if (props.wasDragged?.()) return
                    props.onSlotClick?.(i)
                  }}
                />
                {!readOnly && (
                  <button
                    type="button"
                    aria-label={`Remove ${HARNESS_COMPONENTS[id].name}`}
                    onClick={() => props.onRemove?.(i)}
                    className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink-600 bg-ink-950 text-slate-200 hover:border-ember hover:text-ember active:scale-90"
                  >
                    <X className="h-5 w-5" aria-hidden />
                  </button>
                )}
              </>
            ) : (
              <button
                type="button"
                disabled={readOnly}
                onClick={() => props.onSlotClick?.(i)}
                aria-label={`Empty socket ${i + 1}. ${armed ? 'Press to plug the selected part in here.' : ''}`}
                className={`flex h-full w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-ink-950/60 font-mono text-xs font-bold tracking-widest transition ${
                  armed ? 'animate-pulse border-white text-white' : 'border-ink-600 text-slate-400'
                }`}
              >
                <span className="text-3xl leading-none">+</span>
                PLUG IN
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
