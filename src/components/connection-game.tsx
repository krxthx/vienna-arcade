import { ArrowRight, Check, Eye, Lightbulb, Send } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { Fragment, useState, type FormEvent } from 'react'
import { answerPattern, isAnswerCorrect } from '../lib/answer-match'
import { connectionScore } from '../lib/outcome'
import type { Puzzle, RoundScore } from '../types'
import { RoundProgress } from './round-progress'

interface Props {
  puzzle: Puzzle
  round: { number: number; total: number }
  onComplete: (round: RoundScore) => void
}

const TILE_COLORS = ['border-teal', 'border-volt', 'border-ember', 'border-violet']

export function ConnectionGame({ puzzle, round, onComplete }: Props) {
  const [text, setText] = useState('')
  const [hints, setHints] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [nudge, setNudge] = useState(0)
  const [state, setState] = useState<'playing' | 'solved' | 'revealed'>('playing')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (state !== 'playing' || text.trim() === '') return
    if (isAnswerCorrect(text, puzzle)) setState('solved')
    else {
      setWrong((w) => w + 1)
      setNudge((n) => n + 1)
    }
  }

  const done = state !== 'playing'
  const score = state === 'revealed' ? 0 : connectionScore(wrong, hints)
  const finish = () => onComplete({ label: puzzle.answer, score })

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-6">
      <div className="flex flex-col items-center text-center">
        <RoundProgress number={round.number} total={round.total} className="mb-2" />
        <p className="font-mono text-sm font-bold tracking-[0.2em] text-teal">PICTURE PUZZLE</p>
        <h1 className="mt-1 text-4xl font-black text-white sm:text-5xl">What AI term do these spell?</h1>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-4">
        {puzzle.tiles.map((tile, i) => (
          <Fragment key={tile.image + i}>
            {i > 0 && (
              <span className="text-4xl font-black text-slate-400" aria-hidden>
                +
              </span>
            )}
            <motion.div
              initial={{ opacity: 0, y: 30, rotate: i % 2 ? 3 : -3 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: state === 'solved' ? 1.03 : 1 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 260, damping: 20 }}
              className={`flex h-44 items-center justify-center rounded-2xl border-2 bg-ink-900 p-2 sm:h-52 ${
                puzzle.tiles.length >= 4 ? 'w-40 sm:w-44' : 'w-48 sm:h-60 sm:w-60'
              } ${state === 'solved' ? `${TILE_COLORS[i % 4]} shadow-[0_0_30px_-8px_currentColor]` : 'border-ink-600'}`}
            >
              <img src={tile.image} alt={tile.label} draggable={false} className="h-full w-full rounded-xl object-contain" />
            </motion.div>
          </Fragment>
        ))}
      </div>

      <div className="min-h-16 text-center text-lg text-slate-200" aria-live="polite">
        <AnimatePresence>
          {hints >= 1 && !done && (
            <motion.div key={hints} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-flex max-w-2xl flex-col gap-1 rounded-xl bg-ember/10 px-4 py-2">
              <span>
                <Lightbulb className="mr-2 inline h-5 w-5 align-text-bottom text-ember" aria-hidden />
                {puzzle.hints[hints - 1]}
              </span>
              {hints >= 2 && (
                <span className="font-mono text-2xl font-bold tracking-[0.25em] text-white" aria-label="Pattern of the answer">
                  {answerPattern(puzzle.answer)}
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {done ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className={`flex flex-col items-center gap-4 rounded-3xl border-2 p-6 text-center ${
            state === 'solved' ? 'border-teal bg-teal/10' : 'border-ember bg-ember/10'
          }`}
        >
          <p className={`flex items-center gap-3 text-3xl font-black sm:text-4xl ${state === 'solved' ? 'text-teal' : 'text-ember'}`}>
            {state === 'solved' ? <Check className="h-9 w-9" aria-hidden /> : <Eye className="h-9 w-9" aria-hidden />}
            {state === 'solved' ? puzzle.answer : `The answer: ${puzzle.answer}`}
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
          <form onSubmit={submit} className="mx-auto flex w-full max-w-3xl flex-wrap justify-center gap-3" noValidate>
            <label htmlFor="answer" className="sr-only">
              Your answer
            </label>
            <motion.input
              key={nudge}
              id="answer"
              autoFocus
              autoComplete="off"
              autoCapitalize="none"
              spellCheck={false}
              enterKeyHint="go"
              maxLength={60}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type the AI term"
              animate={nudge ? { x: [0, -10, 10, -6, 6, 0] } : undefined}
              aria-invalid={wrong > 0}
              className={`min-h-20 min-w-0 flex-1 select-text rounded-2xl border-2 bg-ink-900 px-6 text-center text-3xl font-bold text-white placeholder:text-slate-500 focus:border-teal focus:outline-none ${
                nudge ? 'border-ember' : 'border-ink-600'
              }`}
            />
            <button
              type="submit"
              disabled={text.trim() === ''}
              className="inline-flex min-h-20 items-center gap-2 rounded-2xl bg-teal px-8 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95 disabled:opacity-40"
            >
              Check <Send className="h-5 w-5" aria-hidden />
            </button>
          </form>
          <p className="-mt-3 min-h-6 text-center text-lg text-ember" aria-live="polite">
            {wrong > 0 ? 'Not quite. Say the pictures out loud and try again.' : ''}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              disabled={hints >= 2}
              onClick={() => setHints((h) => Math.min(2, h + 1))}
              className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-ember/60 px-5 font-bold text-ember hover:bg-ember/10 disabled:opacity-40"
            >
              <Lightbulb className="h-5 w-5" aria-hidden /> {hints === 0 ? 'Need a hint?' : hints === 1 ? 'Another hint' : 'No more hints'}
            </button>
            <button
              type="button"
              onClick={() => setState('revealed')}
              className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-ink-600 px-5 font-bold text-slate-300 hover:border-slate-400"
            >
              <Eye className="h-5 w-5" aria-hidden /> Show answer
            </button>
          </div>
        </>
      )}
    </div>
  )
}
