import { Home, Lightbulb, RotateCcw, Sparkles, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import type { GameOutcome, QuizResult } from '../types'
import { useCountUp } from './use-count-up'

interface Props {
  outcome: GameOutcome
  quiz: QuizResult
  playerName: string
  rank: number | null
  total: number
  onLeaderboard: () => void
  onPlayAgain: () => void
  onHome: () => void
}

function quizText(quiz: QuizResult): string {
  return quiz.skipped ? 'Vienna quiz: skipped' : `Vienna quiz: ${quiz.correct} / ${quiz.total} correct`
}

export function Results({ outcome, quiz, playerName, rank, total, onLeaderboard, onPlayAgain, onHome }: Props) {
  const [shown, skip] = useCountUp(outcome.score)
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center gap-6 text-center" onClick={skip}>
      <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
        <Sparkles className="mx-auto h-12 w-12 text-teal" aria-hidden />
        <p className="mt-2 font-mono text-lg font-bold tracking-widest text-slate-300">{playerName.toUpperCase()}</p>
        <h1 className="mt-1 text-5xl font-black tracking-tight text-white sm:text-7xl">{outcome.title}</h1>
      </motion.div>
      <p className="text-xl text-slate-200 sm:text-2xl">{outcome.message}</p>

      <div className="flex items-center gap-6 rounded-3xl border-2 border-ink-600 bg-ink-900 px-10 py-5">
        <div>
          <p className="font-mono text-sm tracking-widest text-slate-300">SCORE</p>
          <p className="text-7xl font-black tabular-nums text-teal" aria-live="polite">
            {shown}
          </p>
        </div>
        <p className="max-w-40 text-left font-semibold text-slate-200">{quizText(quiz)}</p>
      </div>

      <p className="text-xl font-bold text-ember">
        Total {total}
        {rank !== null && ` · #${rank} on the leaderboard`}
      </p>
      {rank === null && (
        <p className="text-sm text-slate-400">Couldn’t reach the score server, so this score wasn’t saved.</p>
      )}

      <div className="flex max-w-2xl items-start gap-3 rounded-2xl bg-ink-900 p-5 text-left">
        <Lightbulb className="mt-1 h-6 w-6 shrink-0 text-ember" aria-hidden />
        <div>
          <p className="font-mono text-sm font-bold tracking-widest text-ember">WHAT YOU LEARNED</p>
          <p className="mt-1 text-xl text-slate-100">{outcome.learned}</p>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-4 pt-2">
        <button
          type="button"
          autoFocus
          onClick={onPlayAgain}
          className="inline-flex min-h-20 items-center gap-3 rounded-2xl bg-teal px-12 text-2xl font-black text-ink-950 hover:brightness-110 active:scale-95"
        >
          <RotateCcw className="h-7 w-7" aria-hidden /> Play Again
        </button>
        <button
          type="button"
          onClick={onHome}
          className="inline-flex min-h-20 items-center gap-3 rounded-2xl border-2 border-ink-600 bg-ink-800 px-8 text-xl font-bold hover:border-volt active:scale-95"
        >
          <Home className="h-6 w-6" aria-hidden /> Back to Games
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
