import { Play } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { GameInfo } from '../content/games'
import { ACCENT } from './accents'

interface GameCardProps {
  game: GameInfo
  illustration: ReactNode
  onPlay: () => void
  index: number
}

export function GameCard({ game, illustration, onPlay, index }: GameCardProps) {
  const a = ACCENT[game.accent]
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, type: 'spring', stiffness: 220, damping: 22 }}
      whileHover={{ y: -6 }}
      className={`group flex flex-1 flex-col overflow-hidden rounded-3xl border-2 ${a.border} bg-ink-900 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]`}
    >
      <div className={`h-44 ${a.bg} p-4 sm:h-52`}>{illustration}</div>
      <div className="flex flex-1 flex-col gap-4 p-6 sm:p-7">
        <p className={`font-mono text-sm font-bold tracking-[0.2em] ${a.text}`}>GAME {game.number}</p>
        <h2 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl">{game.title}</h2>
        <p className="text-lg text-slate-300">{game.tagline}</p>
        <button
          type="button"
          onClick={onPlay}
          className={`mt-auto inline-flex min-h-16 items-center justify-center gap-3 rounded-2xl text-xl font-black tracking-wide transition active:scale-95 ${a.solid} hover:brightness-110`}
        >
          <Play className="h-6 w-6 fill-current" aria-hidden /> PLAY
        </button>
      </div>
    </motion.article>
  )
}
