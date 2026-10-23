import { Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import { GAMES } from '../content/games'
import type { GameId } from '../types'
import { GameCard } from './game-card'
import { ConnectionIllustration, HarnessIllustration } from './illustrations'

const ILLUSTRATIONS: Record<GameId, React.ReactNode> = {
  architect: <HarnessIllustration />,
  connect: <ConnectionIllustration />,
}

export function Home({ onPlay, onLeaderboard }: { onPlay: (game: GameId) => void; onLeaderboard: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 py-4">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
          THE APPLIED <span className="text-teal">AI</span> ARCADE
        </h1>
        <p className="mt-3 font-mono text-lg tracking-[0.35em] text-slate-300 sm:text-xl">
          THINK. <span className="text-violet">BUILD.</span> <span className="text-ember">CONNECT.</span>
        </p>
      </motion.div>
      <div className="grid gap-6 md:grid-cols-2">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} illustration={ILLUSTRATIONS[game.id]} onPlay={() => onPlay(game.id)} />
        ))}
      </div>
      <button
        type="button"
        onClick={onLeaderboard}
        className="mx-auto inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-ember/60 px-6 text-lg font-bold text-ember hover:bg-ember/10 active:scale-95"
      >
        <Trophy className="h-5 w-5" aria-hidden /> Leaderboard
      </button>
    </div>
  )
}
