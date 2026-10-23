import type { Accent, Difficulty, GameId } from '../types'

export interface GameInfo {
  id: GameId
  number: number
  title: string
  tagline: string
  difficulty: Difficulty
  duration: string
  accent: Accent
}

export const GAMES: GameInfo[] = [
  {
    id: 'architect',
    number: 1,
    title: 'Architect the Agent',
    tagline: 'Build the right AI harness for the job.',
    difficulty: 2,
    duration: '~60 sec',
    accent: 'violet',
  },
  {
    id: 'connect',
    number: 2,
    title: 'Find the Connection',
    tagline: 'Discover the hidden connections in Applied AI.',
    difficulty: 1,
    duration: '~30 sec',
    accent: 'teal',
  },
]
