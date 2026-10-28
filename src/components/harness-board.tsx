import { Brain, Plus, X } from 'lucide-react'
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
  /** Leave room on the left for floating panels (the live game); the results view uses the full width. */
  withSidebar?: boolean
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

/** A workflow canvas: the model on the left, with parts wired in on the right. */
export function HarnessBoard(props: BoardProps) {
  const { slots, selectedId, overSlot, draggingId, readOnly, statuses, withSidebar } = props
  const L = withSidebar
    ? { model: 'left-[33%] w-[17%] top-[calc(50%+4.5rem)]', svg: 'left-[50%] w-[13%] top-[11rem]', parts: 'left-[63%] right-[3%] top-[11rem]' }
    : { model: 'left-[4%] w-[28%] top-1/2', svg: 'left-[32%] w-[28%] top-6', parts: 'left-[60%] right-[4%] top-6' }
  const armed = !readOnly && (selectedId !== null || draggingId !== null)
  // On the results screen only the parts that were plugged in are shown.
  const nodes = slots.map((id, index) => ({ id, index })).filter((n) => !readOnly || n.id)
  const count = Math.max(nodes.length, 1)

  return (
    <div
      className="relative h-full min-h-[22rem] w-full overflow-hidden rounded-3xl border-2 border-ink-700 bg-ink-950/70"
      style={{ backgroundImage: 'radial-gradient(#2b3c70 1.2px, transparent 1.2px)', backgroundSize: '22px 22px', minHeight: `${Math.max(22, count * 5 + 3)}rem` }}
      role="group"
      aria-label="Agent canvas. The model is on the left; plug parts in on the right."
    >
      
      {/* the model node */}
      <div className={`absolute -translate-y-1/2 ${L.model}`}>
        <div className="relative flex flex-col items-center gap-2 rounded-2xl border-2 border-violet bg-ink-900 px-3 py-5 text-center shadow-[0_0_34px_-10px_#a07bff]">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/25">
            <Brain className="h-7 w-7 text-violet" aria-hidden />
          </span>
          <span className="text-lg font-bold leading-tight text-white">The Model</span>
          <span className="text-xs leading-snug text-slate-400">The AI brain. It needs the right parts.</span>
          <i className="absolute -right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-violet bg-ink-950" aria-hidden />
        </div>
      </div>

      {/* wires: they share the slot column's vertical extent, so each ends at a node's centre */}
      <svg className={`absolute bottom-6 ${withSidebar ? 'h-[calc(100%-11rem-1.5rem)]' : 'h-[calc(100%-3rem)]'} ${L.svg}`} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {nodes.map(({ id, index }, row) => {
          const y = ((row + 0.5) / count) * 100
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

      {/* part nodes */}
      <ul className={`absolute bottom-6 grid ${L.parts}`} style={{ gridTemplateRows: `repeat(${count}, minmax(0, 1fr))` }}>
        {nodes.map(({ id, index }) => (
          <li key={index} data-slot={index} className="flex items-center">
            <div className={`relative h-16 w-full rounded-2xl transition ${overSlot === index ? 'scale-[1.03] ring-4 ring-white' : ''}`}>
              <i
                className={`absolute -left-2 top-1/2 z-10 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 bg-ink-950 ${id ? 'border-teal' : 'border-ink-600'}`}
                aria-hidden
              />
              {id ? (
                <>
                  <ComponentChip
                    id={id}
                    disabled={readOnly}
                    state={statuses?.[id] ? STATUS_CHIP[statuses[id]!] : selectedId === id ? 'selected' : 'idle'}
                    className={`${draggingId === id ? 'opacity-30' : ''} ${readOnly ? 'cursor-default' : ''}`}
                    aria-label={`${HARNESS_COMPONENTS[id].name} in slot ${index + 1}. Press to select or move.`}
                    onPointerDown={(e) => props.onPointerDown?.(e, { id, from: 'slot', index })}
                    onClick={() => {
                      if (props.wasDragged?.()) return
                      props.onSlotClick?.(index)
                    }}
                  />
                  {!readOnly && (
                    <button
                      type="button"
                      aria-label={`Remove ${HARNESS_COMPONENTS[id].name}`}
                      onClick={() => props.onRemove?.(index)}
                      className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink-600 bg-ink-950 text-slate-200 hover:border-ember hover:text-ember active:scale-90"
                    >
                      <X className="h-5 w-5" aria-hidden />
                    </button>
                  )}
                </>
              ) : (
                <button
                  type="button"
                  disabled={readOnly}
                  onClick={() => props.onSlotClick?.(index)}
                  aria-label={`Empty slot ${index + 1}. ${armed ? 'Press to plug the selected part in here.' : 'Press to add a part.'}`}
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-dashed bg-ink-900/60 transition hover:border-violet hover:text-violet ${
                    armed ? 'animate-pulse border-white text-white' : 'border-ink-600 text-slate-500'
                  }`}
                >
                  <Plus className="h-7 w-7" aria-hidden />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
