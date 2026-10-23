import { describe, expect, it } from 'vitest'
import { sortEntries, toCsv, totalScore, validateSubmission, type LeaderboardEntry } from './leaderboard'

const entry = (name: string, total: number, at: number): LeaderboardEntry => ({
  id: name, name, game: 'connect', gameScore: total, quizCorrect: 0, quizTotal: 5, total, at,
})
const ok = { name: ' Ada ', game: 'connect', gameScore: 80, quizCorrect: 4, quizTotal: 5 }

describe('leaderboard helpers', () => {
  it('adds quiz points to the game score', () => {
    expect(totalScore(80, 3)).toBe(140)
  })

  it('sorts by total, breaking ties by earlier finish', () => {
    expect(sortEntries([entry('C', 50, 3), entry('B', 100, 2), entry('A', 100, 1)]).map((e) => e.name)).toEqual(['A', 'B', 'C'])
  })

  it('validates and trims submissions', () => {
    expect(validateSubmission(ok)?.name).toBe('Ada')
    expect(validateSubmission({ ...ok, name: '   ' })).toBeNull()
    expect(validateSubmission({ ...ok, name: 'x'.repeat(25) })).toBeNull()
    expect(validateSubmission({ ...ok, game: 'other' })).toBeNull()
    expect(validateSubmission({ ...ok, gameScore: 101 })).toBeNull()
    expect(validateSubmission({ ...ok, quizCorrect: 6 })).toBeNull()
    expect(validateSubmission({ ...ok, gameScore: 1.5 })).toBeNull()
    expect(validateSubmission(null)).toBeNull()
  })

  it('exports CSV with escaping and formula protection', () => {
    const csv = toCsv([entry('=HYPERLINK("x"),hi', 10, 0)])
    expect(csv.split('\n')[0]).toBe('rank,name,game,game_score,quiz,total,played_at')
    expect(csv).toContain('"\'=HYPERLINK(""x""),hi"')
  })
})
