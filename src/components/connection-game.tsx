import { ArrowRight, Check, Lightbulb } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useMemo, useState } from 'react'
import { connectionScore } from '../lib/outcome'
import { RoundProgress } from './round-progress'
import { shuffle } from '../lib/random'
import type { Puzzle, RoundScore } from '../types'
import { ICONS } from './icons'

interface Props {
  puzzle: Puzzle
  round: { number: number; total: number }
  onComplete: (round: RoundScore) => void
}

const TILE_COLORS = ['border-teal text-teal', 'border-volt text-volt', 'border-ember text-ember', 'border-violet text-violet']

export function ConnectionGame({ puzzle, round, onComplete }: Props) {
  const choices = useMemo(() => shuffle([puzzle.answer, ...puzzle.distractors]), [puzzle])
  const [hints, setHints] = useState(0)
  const [wrong, setWrong] = useState<string[]>([])
  const [solved, setSolved] = useState(false)

  // Hint 2 also crosses out one wrong answer the player has not tried yet.
  const eliminated = useMemo(() => {
    if (hints < 2) return null
    return choices.find((c) => c !== puzzle.answer) ?? null
  }, [hints, choices, puzzle.answer])

  const pick = (choice: string) => {
    if (solved || wrong.includes(choice) || choice === eliminated) return
    if (choice === puzzle.answer) setSolved(true)
    else setWrong((w) => [...w, choice])
  }

  const rebus = puzzle.kind === 'rebus'
  const wrongCount = wrong.length
  const finish = () => onComplete({ label: puzzle.answer, score: connectionScore(wrongCount, hints) })

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col items-center text-center">
        <RoundProgress number={round.number} total={round.total} className="mb-2" />
        <p className="font-mono text-sm font-bold tracking-[0.2em] text-teal">
          {rebus ? 'PICTURE PUZZLE' : 'FIND THE CONNECTION'}
        </p>
        <h1 className="mt-1 text-4xl font-black text-white sm:text-5xl">{rebus ? 'What AI term do these spell?' : 'What connects these?'}</h1>
      </div>

      <div className="relative">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {puzzle.tiles.map((tile, i) => {
            const Icon = tile.icon ? ICONS[tile.icon] : null
            return (
              <Fragment key={tile.label}>
                {rebus && i > 0 && <span className="text-4xl font-black text-slate-400" aria-hidden>+</span>}
              <motion.div
                initial={{ opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }}
                animate={{ opacity: 1, y: 0, rotate: 0, scale: solved ? 1.03 : 1 }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
                className={`flex items-center justify-center gap-2 rounded-2xl border-2 bg-ink-900 text-center ${rebus ? `h-44 p-2 sm:h-52 ${puzzle.tiles.length >= 4 ? 'w-40 sm:w-44' : 'w-48 sm:h-60 sm:w-60'}` : 'h-36 w-44 flex-col px-3 sm:h-44 sm:w-52'} ${
                  solved ? TILE_COLORS[i] + ' shadow-[0_0_30px_-8px_currentColor]' : 'border-ink-600 text-white'
                }`}
              >
                {rebus && tile.image && (
                  <img src={tile.image} alt={tile.label} draggable={false} className="h-full w-full rounded-xl object-contain" />
                )}
                {rebus && !tile.image && tile.glyph && (
                  <span className="text-6xl leading-none sm:text-7xl" role="img" aria-label={tile.label}>
                    {tile.glyph}
                  </span>
                )}
                {!rebus && Icon && <Icon className="h-10 w-10 sm:h-12 sm:w-12" aria-hidden />}
                {(rebus ? tile.caption : tile.label) && (
                  <span className="text-xl font-black leading-tight text-white sm:text-2xl">{rebus ? tile.caption : tile.label}</span>
                )}
              </motion.div>
              </Fragment>
            )
          })}
        </div>
      </div>

      <div className="min-h-8 text-center text-lg text-slate-200" aria-live="polite">
        <AnimatePresence>
          {hints >= 1 && !solved && (
            <motion.p key={hints} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-xl bg-ember/10 px-4 py-2">
              💡 {puzzle.hints[hints - 1]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {solved ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="flex flex-col items-center gap-4 rounded-3xl border-2 border-teal bg-teal/10 p-6 text-center"
        >
          <p className="flex items-center gap-3 text-3xl font-black text-teal sm:text-4xl">
            <Check className="h-9 w-9" aria-hidden /> {puzzle.answer}
          </p>
          <p className="max-w-2xl text-xl text-slate-100">{puzzle.explanation}</p>
          <button
            type="button"
            autoFocus
            onClick={finish}
            className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-teal px-8 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95"
          >
            {round.number === round.total ? 'Finish' : 'Next round'} <ArrowRight className="h-6 w-6" aria-hidden />
          </button>
        </motion.div>
      ) : (
        <>
          <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="Answer choices">
            {choices.map((choice, i) => {
              const out = wrong.includes(choice) || choice === eliminated
              return (
                <motion.button
                  key={choice}
                  type="button"
                  disabled={out}
                  onClick={() => pick(choice)}
                  animate={wrong.at(-1) === choice ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
                  className={`flex min-h-24 items-center gap-4 rounded-2xl border-2 px-5 text-left text-2xl font-bold transition active:scale-95 ${
                    out
                      ? 'border-ink-700 bg-ink-900 text-slate-500 line-through'
                      : 'border-ink-600 bg-ink-800 text-white hover:border-teal hover:bg-ink-700'
                  }`}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-ink-700 font-mono text-lg text-slate-200">
                    {'ABC'[i]}
                  </span>
                  {choice}
                </motion.button>
              )
            })}
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              disabled={hints >= 2}
              onClick={() => setHints((h) => Math.min(2, h + 1))}
              className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-ember/60 px-5 font-bold text-ember hover:bg-ember/10 disabled:opacity-40"
            >
              <Lightbulb className="h-5 w-5" aria-hidden /> {hints === 0 ? 'Need a hint?' : hints === 1 ? 'Another hint' : 'No more hints'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
