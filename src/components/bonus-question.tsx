import { ArrowRight, Check, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { shuffle } from '../lib/random'
import type { BonusQuestion as Bonus } from '../types'

interface Props {
  question: Bonus
  /** 1-based position in the quiz. */
  number: number
  total: number
  onDone: (correct: boolean) => void
}

export function BonusQuestion({ question, number, total, onDone }: Props) {
  const options = useMemo(() => shuffle([question.correct, ...question.wrong]), [question])
  const [picked, setPicked] = useState<string | null>(null)
  const answered = picked !== null
  const isCorrect = picked === question.correct

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-6">
      <div className="text-center">
        <p className="font-mono text-sm font-bold tracking-[0.2em] text-ember">
          VIENNA QUIZ · {number} / {total}
        </p>
        <div className="mx-auto mt-3 flex max-w-xs gap-2" aria-hidden>
          {Array.from({ length: total }, (_, i) => (
            <span key={i} className={`h-2 flex-1 rounded-full ${i < number ? 'bg-ember' : 'bg-ink-700'}`} />
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-black leading-tight text-white sm:text-4xl">{question.prompt}</h1>
      </div>

      <div className="grid gap-3" role="group" aria-label="Answer choices">
        {options.map((opt, i) => {
          const right = answered && opt === question.correct
          const bad = answered && opt === picked && !isCorrect
          return (
            <motion.button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => setPicked(opt)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex min-h-20 items-center gap-4 rounded-2xl border-2 px-5 text-left text-xl font-bold transition active:scale-[0.98] sm:text-2xl ${
                right
                  ? 'border-teal bg-teal/15 text-white'
                  : bad
                    ? 'border-ember bg-ember/15 text-white'
                    : answered
                      ? 'border-ink-700 bg-ink-900 text-slate-400'
                      : 'border-ink-600 bg-ink-800 text-white hover:border-ember hover:bg-ink-700'
              }`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-700 font-mono text-lg">
                {right ? <Check className="h-6 w-6 text-teal" aria-hidden /> : bad ? <X className="h-6 w-6 text-ember" aria-hidden /> : 'ABC'[i]}
              </span>
              {opt}
            </motion.button>
          )
        })}
      </div>

      {answered ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-2xl text-xl text-slate-100" aria-live="polite">
            <strong className={isCorrect ? 'text-teal' : 'text-ember'}>{isCorrect ? 'Correct! ' : 'Not quite. '}</strong>
            {question.explanation}
          </p>
          <button
            type="button"
            autoFocus
            onClick={() => onDone(isCorrect)}
            className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-ember px-8 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95"
          >
            {number === total ? 'See results' : 'Next'} <ArrowRight className="h-6 w-6" aria-hidden />
          </button>
        </motion.div>
      ) : null}
    </div>
  )
}
