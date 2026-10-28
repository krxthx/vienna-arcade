import { Eraser, Play } from 'lucide-react'
import { useMemo, useState } from 'react'
import { HARNESS_COMPONENTS } from '../content/components'
import { emptySlots, evaluateHarness, needsStatus, placeComponent, removeFromSlot, scenarioChoices } from '../lib/harness'
import type { Slots } from '../lib/harness'
import { architectOutcome } from '../lib/outcome'
import { RoundProgress } from './round-progress'
import { shuffle } from '../lib/random'
import type { ComponentId, RoundScore, Scenario } from '../types'
import { ComponentChip } from './component-chip'
import { HarnessBoard } from './harness-board'
import { HarnessResultPanel } from './harness-result-panel'
import { MissionPanel } from './mission-panel'
import { useDragDrop, type DragSource } from './use-drag-drop'

interface Props {
  scenario: Scenario
  round: { number: number; total: number }
  onComplete: (round: RoundScore) => void
}

export function ArchitectGame({ scenario, round, onComplete }: Props) {
  const [slots, setSlots] = useState<Slots>(() => emptySlots(scenario.sockets))
  const [selected, setSelected] = useState<ComponentId | null>(null)
  const [peek, setPeek] = useState<ComponentId | null>(null)
  const [evaluated, setEvaluated] = useState<{ slots: Slots; result: ReturnType<typeof evaluateHarness> } | null>(null)
  const choices = useMemo(() => shuffle(scenarioChoices(scenario)), [scenario])

  const place = (id: ComponentId, index: number) => {
    setSlots((s) => placeComponent(s, id, index))
    setSelected(null)
  }

  const { drag, startDrag, wasDragged } = useDragDrop({
    onDropSlot: (source: DragSource, slot) => place(source.id, slot),
    onDropPalette: (source) => {
      if (source.from === 'slot') setSlots((s) => removeFromSlot(s, source.index))
      setSelected(null)
    },
  })

  const detail = peek ?? selected
  const placedIds = slots.filter((s): s is ComponentId => s !== null)
  const canRun = placedIds.length > 0

  const clickSlot = (index: number) => {
    const occupant = slots[index]
    if (selected && selected !== occupant) place(selected, index)
    else if (occupant) setSelected((cur) => (cur === occupant ? null : occupant))
  }

  const paletteClick = (id: ComponentId) => {
    if (wasDragged()) return
    setSelected((cur) => (cur === id ? null : id))
  }

  const run = () => {
    setSelected(null)
    const base = evaluateHarness(scenario, slots)
    setEvaluated({ slots, result: base })
  }

  if (evaluated) {
    const outcome = architectOutcome(scenario, evaluated.result)
    return (
      <HarnessResultPanel
        scenario={scenario}
        slots={evaluated.slots}
        result={evaluated.result}
        outcome={outcome}
        continueLabel={round.number === round.total ? 'Finish' : 'Next round'}
        onContinue={() => onComplete({ label: scenario.title, score: outcome.score })}
      />
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4">
      <section className="rounded-2xl border-2 border-ink-600 bg-ink-900/95 p-4 sm:p-5">
        <RoundProgress number={round.number} total={round.total} compact />
        <h1 className="mt-2 text-lg font-black leading-snug text-white sm:text-xl lg:text-2xl">{scenario.job}</h1>
        <MissionPanel scenario={scenario} status={needsStatus(scenario, slots)} />
      </section>

      <div className="grid flex-1 gap-4 md:grid-cols-[15rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)]">
        <aside aria-label="Parts" data-palette className="flex flex-col rounded-2xl border-2 border-ink-600 bg-ink-900/95 p-3">
          <h2 className="mb-2 px-1 font-mono text-xs font-bold tracking-[0.2em] text-slate-400">PARTS</h2>
          <ul className="grid grid-cols-2 gap-1.5 md:grid-cols-1">
            {choices.map((id) => {
              const isPlaced = placedIds.includes(id)
              return (
                <li key={id} onMouseEnter={() => setPeek(id)} onMouseLeave={() => setPeek(null)}>
                  <ComponentChip
                    id={id}
                    variant="item"
                    state={isPlaced ? 'placed' : selected === id ? 'selected' : 'idle'}
                    disabled={isPlaced}
                    onPointerDown={(e) => startDrag(e, { id, from: 'palette' })}
                    onClick={() => paletteClick(id)}
                  />
                </li>
              )
            })}
          </ul>
          <p className="mt-2 min-h-[4.25rem] rounded-lg bg-ink-800 px-3 py-2 text-[13px] leading-snug text-slate-300">
            {detail ? (
              <>
                <strong className="text-white">{HARNESS_COMPONENTS[detail].name}.</strong> {HARNESS_COMPONENTS[detail].blurb}.
              </>
            ) : (
              'Drag a part onto a "+", or tap it and then a "+".'
            )}
          </p>
        </aside>

        <div className="flex min-w-0 flex-col gap-3">
          <HarnessBoard
            slots={slots}
            selectedId={selected}
            overSlot={drag?.overSlot ?? null}
            draggingId={drag?.id ?? null}
            onSlotClick={clickSlot}
            onRemove={(i) => setSlots((s) => removeFromSlot(s, i))}
            onPointerDown={startDrag}
            wasDragged={wasDragged}
          />
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setSlots(emptySlots(scenario.sockets))
                setSelected(null)
              }}
              disabled={!canRun}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-ink-600 bg-ink-900/90 px-5 font-bold hover:border-ember disabled:opacity-40"
            >
              <Eraser className="h-5 w-5" aria-hidden /> Clear
            </button>
            <button
              type="button"
              onClick={run}
              disabled={!canRun}
              className="inline-flex min-h-14 items-center gap-3 rounded-xl bg-violet px-8 text-lg font-black text-ink-950 shadow-xl transition hover:brightness-110 active:scale-95 disabled:opacity-40"
            >
              <Play className="h-5 w-5 fill-current" aria-hidden /> Run Evaluation
            </button>
          </div>
        </div>
      </div>

      {drag && (
        <div
          className="pointer-events-none fixed z-50 w-64 -translate-x-1/2 -translate-y-1/2 rotate-3 opacity-95 drop-shadow-2xl"
          style={{ left: drag.x, top: drag.y }}
        >
          <ComponentChip id={drag.id} state="selected" tabIndex={-1} />
        </div>
      )}
    </div>
  )
}
