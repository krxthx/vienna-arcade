import { Check, Clock, Home, Lightbulb, Sparkles, Trophy, X } from 'lucide-react'
import { motion } from 'motion/react'
import { QUIZ_POINTS_LABEL } from '../lib/leaderboard'
import { formatDuration } from '../lib/format'
import { isPassed } from '../lib/outcome'
import type { QuizResult, SessionOutcome } from '../types'
import { useCountUp } from './use-count-up'

interface Props {
  outcome: SessionOutcome
  quiz: QuizResult
  playerName: string
  rank: number | null
  total: number
  seconds: number
  onLeaderboard: () => void
  onHome: () => void
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="px-5 text-center">
      <p className="font-mono text-xs tracking-widest text-slate-300">{label}</p>
      <p className="text-4xl font-black tabular-nums text-white">
        {value}
        {sub && <span className="text-xl font-bold text-slate-400"> {sub}</span>}
      </p>
    </div>
  )
}

export function Results({ outcome, quiz, playerName, rank, total, seconds, onLeaderboard, onHome }: Props) {
  const [shown, skip] = useCountUp(total)
  const maxTotal = 10 + quiz.total
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-5 text-center" onClick={skip}>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
        <Sparkles className="mx-auto h-10 w-10 text-teal" aria-hidden />
        <p className="mt-1 font-mono text-lg font-bold tracking-widest text-slate-300">{playerName.toUpperCase()}</p>
        <h1 className="mt-1 text-5xl font-black tracking-tight text-white sm:text-7xl">{outcome.title}</h1>
      </motion.div>
      <p className="text-xl text-slate-200 sm:text-2xl">{outcome.message}</p>

      <div className="flex flex-wrap items-center justify-center gap-y-3 divide-x divide-ink-600 rounded-3xl border-2 border-ink-600 bg-ink-900 py-4">
        <div className="px-6 text-center">
          <p className="font-mono text-xs tracking-widest text-slate-300">POINTS</p>
          <p className="text-7xl font-black tabular-nums text-teal" aria-live="polite">
            {shown}
            <span className="text-2xl font-bold text-slate-400"> / {maxTotal}</span>
          </p>
        </div>
        <Stat label="ROUNDS PASSED" value={`${outcome.passed}`} sub={`/ ${outcome.rounds.length}`} />
        <Stat label="VIENNA QUIZ" value={`${quiz.correct}`} sub={`/ ${quiz.total}`} />
        <div className="px-5 text-center">
          <p className="flex items-center justify-center gap-1 font-mono text-xs tracking-widest text-slate-300">
            <Clock className="h-3 w-3" aria-hidden /> TIME
          </p>
          <p className="text-4xl font-black tabular-nums text-white">{formatDuration(seconds)}</p>
        </div>
      </div>
      <p className="text-xl font-bold text-ember">
        {rank !== null ? `#${rank} on the leaderboard` : 'Couldn’t reach the score server, so this score wasn’t saved.'}
      </p>
      <p className="-mt-3 text-sm text-slate-400">{QUIZ_POINTS_LABEL}</p>

      <ul className="flex max-w-3xl flex-wrap justify-center gap-2" aria-label="Round results">
        {outcome.rounds.map((r, i) => (
          <li
            key={i}
            className={`inline-flex items-center gap-1 rounded-lg border px-3 py-1 text-sm font-semibold ${
              isPassed(r.score) ? 'border-teal/60 text-teal' : 'border-ember/60 text-ember'
            }`}
          >
            {isPassed(r.score) ? <Check className="h-4 w-4" aria-label="Passed" /> : <X className="h-4 w-4" aria-label="Missed" />}
            {r.label}
          </li>
        ))}
      </ul>

      <div className="flex max-w-2xl items-start gap-3 rounded-2xl bg-ink-900 p-4 text-left">
        <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-ember" aria-hidden />
        <div>
          <p className="font-mono text-sm font-bold tracking-widest text-ember">WHAT YOU LEARNED</p>
          <p className="mt-1 text-lg text-slate-100">{outcome.learned}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-1">
        <button
          type="button"
          autoFocus
          onClick={onHome}
          className="inline-flex min-h-20 items-center gap-3 rounded-2xl bg-teal px-12 text-2xl font-black text-ink-950 hover:brightness-110 active:scale-95"
        >
          <Home className="h-7 w-7" aria-hidden /> Back to Games
        </button>
        <button
          type="button"
          onClick={onLeaderboard}
          className="inline-flex min-h-20 items-center gap-3 rounded-2xl border-2 border-ember/60 px-8 text-xl font-bold text-ember hover:bg-ember/10 active:scale-95"
        >
          <Trophy className="h-6 w-6" aria-hidden /> Leaderboard
        </button>
      </div>
    </div>
  )
}
