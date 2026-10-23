import type { GameId } from '../types.ts'

/** Shared by the browser and the server, so it must stay free of DOM/Node APIs. */
export interface LeaderboardEntry {
  id: string
  name: string
  game: GameId
  gameScore: number
  quizCorrect: number
  quizTotal: number
  total: number
  at: number
}

/** What the client sends after a play session. The server computes the total. */
export interface Submission {
  name: string
  game: GameId
  gameScore: number
  quizCorrect: number
  quizTotal: number
}

export const MAX_NAME_LENGTH = 24
/** Each correct quiz answer is worth this many points (5 questions = 100). */
export const QUIZ_POINTS_EACH = 20

export function totalScore(gameScore: number, quizCorrect: number): number {
  return gameScore + quizCorrect * QUIZ_POINTS_EACH
}

const isInt = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max

/** Returns a clean submission, or null if the payload is not acceptable. */
export function validateSubmission(body: unknown): Submission | null {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (name.length < 1 || name.length > MAX_NAME_LENGTH) return null
  if (b.game !== 'architect' && b.game !== 'connect') return null
  if (!isInt(b.gameScore, 0, 100) || !isInt(b.quizTotal, 0, 20)) return null
  if (!isInt(b.quizCorrect, 0, b.quizTotal)) return null
  return { name, game: b.game, gameScore: b.gameScore, quizCorrect: b.quizCorrect, quizTotal: b.quizTotal }
}

/** Highest total first; ties go to whoever finished earlier. */
export function sortEntries(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries].sort((a, b) => b.total - a.total || a.at - b.at)
}

export function toCsv(entries: readonly LeaderboardEntry[]): string {
  const esc = (v: string | number) => {
    // Neutralise spreadsheet formula injection from typed names.
    const s = String(v)
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
  }
  const rows = sortEntries(entries).map((e, i) =>
    [i + 1, e.name, e.game, e.gameScore, `${e.quizCorrect}/${e.quizTotal}`, e.total, new Date(e.at).toISOString()].map(esc).join(','),
  )
  return ['rank,name,game,game_score,quiz,total,played_at', ...rows].join('\n')
}
