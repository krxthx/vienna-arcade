import { describe, expect, it } from 'vitest'
import { formatDuration } from './format'
import { sortEntries, toCsv, totalScore, validateSubmission, type LeaderboardEntry } from './leaderboard'

const entry = (name: string, total: number, seconds: number, at = 0): LeaderboardEntry => ({
  id: name, name, game: 'connect', roundsPassed: total, roundsTotal: 10, quizCorrect: 0, quizTotal: 4, total, seconds, at,
})
const ok = { name: ' Ada ', game: 'connect', roundsPassed: 8, roundsTotal: 10, quizCorrect: 3, quizTotal: 4, seconds: 400 }

describe('leaderboard helpers', () => {
  it('totals rounds passed plus quiz answers right', () => {
    expect(totalScore(8, 3)).toBe(11)
    expect(totalScore(0, 0)).toBe(0)
  })

  it('ranks by points, then the faster time, then earlier finish', () => {
    const board = sortEntries([entry('slow', 8, 500), entry('top', 9, 900), entry('fast', 8, 300), entry('tie-a', 5, 100, 1), entry('tie-b', 5, 100, 2)])
    expect(board.map((e) => e.name)).toEqual(['top', 'fast', 'slow', 'tie-a', 'tie-b'])
  })

  it('validates and trims submissions', () => {
    expect(validateSubmission(ok)?.name).toBe('Ada')
    expect(validateSubmission({ ...ok, name: '   ' })).toBeNull()
    expect(validateSubmission({ ...ok, name: 'x'.repeat(25) })).toBeNull()
    expect(validateSubmission({ ...ok, game: 'other' })).toBeNull()
    expect(validateSubmission({ ...ok, roundsPassed: 11 })).toBeNull()
    expect(validateSubmission({ ...ok, quizCorrect: 5 })).toBeNull()
    expect(validateSubmission({ ...ok, seconds: -1 })).toBeNull()
    expect(validateSubmission({ ...ok, seconds: 1.5 })).toBeNull()
    expect(validateSubmission(null)).toBeNull()
  })

  it('exports CSV with escaping and formula protection', () => {
    const csv = toCsv([entry('=HYPERLINK("x"),hi', 10, 60)])
    expect(csv.split('\n')[0]).toBe('rank,name,game,rounds,quiz,total,time_seconds,played_at')
    expect(csv).toContain('"\'=HYPERLINK(""x""),hi"')
  })

  it('formats durations as m:ss', () => {
    expect(formatDuration(402)).toBe('6:42')
    expect(formatDuration(59)).toBe('0:59')
    expect(formatDuration(-3)).toBe('0:00')
  })
})
