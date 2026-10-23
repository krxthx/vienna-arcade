import { Eraser, Lightbulb, Play } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { HARNESS_COMPONENTS } from '../content/components'
import { emptySlots, evaluateHarness, needsStatus, placeComponent, removeFromSlot, scenarioChoices } from '../lib/harness'
import type { Slots } from '../lib/harness'
import { architectOutcome } from '../lib/outcome'
import { shuffle } from '../lib/random'
import type { ComponentId, GameOutcome, Scenario } from '../types'
import { ComponentChip } from './component-chip'
import { HarnessBoard } from './harness-board'
import { HarnessResultPanel } from './harness-result-panel'
import { MissionPanel } from './mission-panel'
import { useDragDrop, type DragSource } from './use-drag-drop'

interface Props {
  scenario: Scenario
  onComplete: (outcome: GameOutcome) => void
}

export function ArchitectGame({ scenario, onComplete }: Props) {
  const [slots, setSlots] = useState<Slots>(() => emptySlots(scenario.sockets))
  const [selected, setSelected] = useState<ComponentId | null>(null)
  const [showHint, setShowHint] = useState(false)
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
    setEvaluated({ slots, result: evaluateHarness(scenario, slots) })
  }

  if (evaluated) {
    const outcome = architectOutcome(scenario, evaluated.result)
    return (
      <HarnessResultPanel
        scenario={scenario}
        slots={evaluated.slots}
        result={evaluated.result}
        outcome={outcome}
        onContinue={() => onComplete(outcome)}
        onRetry={() => setEvaluated(null)}
      />
    )
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-4xl">
          <p className="font-mono text-sm font-bold tracking-[0.2em] text-violet">
            ARCHITECT THE AGENT · {scenario.title.toUpperCase()}
          </p>
          <h1 className="mt-1 text-3xl font-black leading-tight text-white sm:text-4xl">“{scenario.job}”</h1>
          <p className="mt-2 text-lg text-slate-300">
            Build the harness: plug the parts it needs into the model.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHint(true)}
          disabled={showHint}
          className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-ember/60 px-4 font-bold text-ember hover:bg-ember/10 disabled:opacity-60"
        >
          <Lightbulb className="h-5 w-5" aria-hidden /> Hint
        </button>
      </div>

      <AnimatePresence>
        {showHint && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="overflow-hidden rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-lg text-orange-100"
          >
            💡 {scenario.hint}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="grid items-start gap-5 lg:grid-cols-2">
        <section aria-label="Parts" data-palette className="rounded-3xl bg-ink-900/70 p-4">
          <p className="mb-3 font-mono text-xs tracking-widest text-slate-300">
            {selected
              ? `TAP A SOCKET TO PLUG IN “${HARNESS_COMPONENTS[selected].name.toUpperCase()}”`
              : 'PARTS · DRAG ONE ONTO THE BOARD, OR TAP IT THEN TAP A SOCKET'}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {choices.map((id, i) => {
              const isPlaced = placedIds.includes(id)
              return (
                <motion.div key={id} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
                  <ComponentChip
                    id={id}
                    state={isPlaced ? 'placed' : selected === id ? 'selected' : 'idle'}
                    disabled={isPlaced}
                    onPointerDown={(e) => startDrag(e, { id, from: 'palette' })}
                    onClick={() => paletteClick(id)}
                  />
                </motion.div>
              )
            })}
          </div>
        </section>

        <div className="flex flex-col gap-4">
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
          <MissionPanel scenario={scenario} status={needsStatus(scenario, slots)} />
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-4 pb-2">
        <button
          type="button"
          onClick={() => {
            setSlots(emptySlots(scenario.sockets))
            setSelected(null)
          }}
          disabled={!canRun}
          className="inline-flex min-h-16 items-center gap-2 rounded-2xl border-2 border-ink-600 px-6 text-lg font-bold hover:border-ember disabled:opacity-40"
        >
          <Eraser className="h-5 w-5" aria-hidden /> Clear
        </button>
        <button
          type="button"
          onClick={run}
          disabled={!canRun}
          className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-violet px-10 text-xl font-black text-ink-950 transition hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          <Play className="h-6 w-6 fill-current" aria-hidden /> Run Evaluation
        </button>
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
