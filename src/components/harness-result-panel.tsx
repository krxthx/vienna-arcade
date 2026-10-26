import { ArrowRight, Check, Minus, Plus, X } from 'lucide-react'
import { motion } from 'motion/react'
import type { FeedbackKind, GameOutcome, HarnessResult, Scenario } from '../types'
import type { Slots } from '../lib/harness'
import { HarnessBoard } from './harness-board'
import { useCountUp } from './use-count-up'

interface Props {
  scenario: Scenario
  slots: Slots
  result: HarnessResult
  outcome: GameOutcome
  continueLabel: string
  onContinue: () => void
  onRetry: () => void
}

const KIND_STYLE: Record<FeedbackKind, { icon: typeof Check; color: string }> = {
  met: { icon: Check, color: 'text-teal' },
  optional: { icon: Plus, color: 'text-volt' },
  distractor: { icon: X, color: 'text-ember' },
  missing: { icon: Minus, color: 'text-ember' },
}

export function HarnessResultPanel({ scenario, slots, result, outcome, continueLabel, onContinue, onRetry }: Props) {
  const [shown, skip] = useCountUp(result.score)
  const ringColor = result.verdict === 'approved' ? 'text-teal' : result.verdict === 'partial' ? 'text-volt' : 'text-ember'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-6xl flex-col gap-5"
      onClick={skip}
    >
      <HarnessBoard
        slots={slots}
        selectedId={null}
        overSlot={null}
        draggingId={null}
        readOnly
        statuses={result.placed}
      />
      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-ink-600 bg-ink-900 p-6 text-center">
          <p className="font-mono text-sm font-bold tracking-widest text-slate-300">{scenario.title.toUpperCase()}</p>
          <p className={`text-8xl font-black tabular-nums ${ringColor}`} aria-live="polite">
            {shown}
          </p>
          <p className="font-mono text-sm text-slate-400">/ 100</p>
          <p className="mt-3 text-2xl font-black text-white">{outcome.title}</p>
        </div>
        <ul className="flex flex-col gap-2 rounded-3xl border-2 border-ink-600 bg-ink-900 p-5" aria-label="Evaluation feedback">
          {result.feedback.map((item, i) => {
            const { icon: Icon, color } = KIND_STYLE[item.kind]
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.08 }}
                className="flex items-start gap-3 text-lg leading-snug text-slate-100"
              >
                <Icon className={`mt-0.5 h-6 w-6 shrink-0 ${color}`} aria-hidden />
                {item.text}
              </motion.li>
            )
          })}
        </ul>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-3xl text-lg text-slate-300">{outcome.message}</p>
        <div className="flex gap-3">
          {result.verdict !== 'approved' && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRetry()
              }}
              className="min-h-16 rounded-2xl border-2 border-ink-600 bg-ink-800 px-6 text-lg font-bold hover:border-volt active:scale-95"
            >
              Tweak it
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onContinue()
            }}
            className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-teal px-8 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95"
          >
            {continueLabel} <ArrowRight className="h-6 w-6" aria-hidden />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
