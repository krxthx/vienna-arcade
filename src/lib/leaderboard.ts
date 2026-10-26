import type { GameId } from '../types.ts'

/** Shared by the browser and the server, so it must stay free of DOM/Node APIs. */
export interface LeaderboardEntry {
  id: string
  name: string
  game: GameId
  roundsPassed: number
  roundsTotal: number
  quizCorrect: number
  quizTotal: number
  /** Points: rounds passed + quiz answers correct. */
  total: number
  /** Time taken in seconds. Breaks ties: faster ranks higher. */
  seconds: number
  at: number
}

/** An entry as the organizer sees it: includes the player's email. Never sent to the public leaderboard. */
export type AdminEntry = LeaderboardEntry & { email: string }

/** What the client sends after a play session. The server computes the total. */
export interface Submission {
  name: string
  email: string
  game: GameId
  roundsPassed: number
  roundsTotal: number
  quizCorrect: number
  quizTotal: number
  seconds: number
}

export const MAX_NAME_LENGTH = 24
export const MAX_EMAIL_LENGTH = 254
/** One-line explanation of how players are ranked, shown on the results and leaderboard screens. */
export const QUIZ_POINTS_LABEL = 'Points = rounds passed + quiz answers right. Ties go to the faster time.'
const MAX_SECONDS = 24 * 60 * 60

export function totalScore(roundsPassed: number, quizCorrect: number): number {
  return roundsPassed + quizCorrect
}

/** Pragmatic check: something@something.tld, no spaces. */
export const isValidEmail = (email: string) =>
  email.length <= MAX_EMAIL_LENGTH && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

const isInt = (v: unknown, min: number, max: number): v is number =>
  typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max

/** Returns a clean submission, or null if the payload is not acceptable. */
export function validateSubmission(body: unknown): Submission | null {
  if (typeof body !== 'object' || body === null) return null
  const b = body as Record<string, unknown>
  const name = typeof b.name === 'string' ? b.name.trim() : ''
  if (name.length < 1 || name.length > MAX_NAME_LENGTH) return null
  const email = typeof b.email === 'string' ? b.email.trim().toLowerCase() : ''
  if (!isValidEmail(email)) return null
  if (b.game !== 'architect' && b.game !== 'connect') return null
  if (!isInt(b.roundsTotal, 1, 50) || !isInt(b.roundsPassed, 0, b.roundsTotal)) return null
  if (!isInt(b.quizTotal, 0, 20) || !isInt(b.quizCorrect, 0, b.quizTotal)) return null
  if (!isInt(b.seconds, 0, MAX_SECONDS)) return null
  return {
    name,
    email,
    game: b.game,
    roundsPassed: b.roundsPassed,
    roundsTotal: b.roundsTotal,
    quizCorrect: b.quizCorrect,
    quizTotal: b.quizTotal,
    seconds: b.seconds,
  }
}

/** Most points first; then the faster time; then whoever finished earlier. */
export function sortEntries<T extends LeaderboardEntry>(entries: readonly T[]): T[] {
  return [...entries].sort((a, b) => b.total - a.total || a.seconds - b.seconds || a.at - b.at)
}

export function toCsv(entries: readonly AdminEntry[]): string {
  const esc = (v: string | number) => {
    // Neutralise spreadsheet formula injection from typed names.
    const s = String(v)
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
  }
  const rows = sortEntries(entries).map((e, i) =>
    [
      i + 1,
      e.name,
      e.email,
      e.game,
      `${e.roundsPassed}/${e.roundsTotal}`,
      `${e.quizCorrect}/${e.quizTotal}`,
      e.total,
      e.seconds,
      new Date(e.at).toISOString(),
    ]
      .map(esc)
      .join(','),
  )
  return ['rank,name,email,game,rounds,quiz,total,time_seconds,played_at', ...rows].join('\n')
}
