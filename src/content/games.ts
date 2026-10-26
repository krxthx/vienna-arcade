import type { Accent, GameId } from '../types'

/** Random questions (puzzles or missions) per play session. */
export const ROUNDS_PER_GAME = 10

export interface GameInfo {
  id: GameId
  number: number
  title: string
  tagline: string
  duration: string
  accent: Accent
  /** One line for the results screen. */
  learned: string
}

export const GAMES: GameInfo[] = [
  {
    id: 'architect',
    number: 1,
    title: 'Architect the Agent',
    tagline: 'Build the right AI harness for the job.',
    duration: '~5 min',
    accent: 'violet',
    learned: 'A harness is everything around the model: tools, memory and checks. Match each part to what the job really needs.',
  },
  {
    id: 'connect',
    number: 2,
    title: 'Find the Connection',
    tagline: 'Discover the hidden connections in Applied AI.',
    duration: '~4 min',
    accent: 'teal',
    learned: 'Applied AI is full of ideas hiding in plain sight, from context windows to model routing. Now you can spot them.',
  },
]
