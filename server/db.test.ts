import { afterEach, describe, expect, it } from 'vitest'
import { openScoreDb } from './db.ts'

const sub = (name: string, gameScore: number, quizCorrect: number) => ({
  name, game: 'architect' as const, gameScore, quizCorrect, quizTotal: 5,
})

describe('score database', () => {
  const db = openScoreDb(':memory:')
  afterEach(() => db.clear())

  it('stores scores, computing the total server-side', () => {
    const { entry, rank } = db.add(sub('Ada', 80, 3), 1)
    expect(entry.total).toBe(140)
    expect(rank).toBe(1)
    expect(db.count()).toBe(1)
  })

  it('ranks by total with earlier finish winning ties', () => {
    db.add(sub('A', 100, 5), 1)
    const b = db.add(sub('B', 100, 5), 2)
    const c = db.add(sub('C', 10, 0), 3)
    expect(b.rank).toBe(2)
    expect(c.rank).toBe(3)
    expect(db.top().map((e) => e.name)).toEqual(['A', 'B', 'C'])
    expect(db.top(2)).toHaveLength(2)
  })

  it('clears everything', () => {
    db.add(sub('A', 1, 0))
    db.clear()
    expect(db.top()).toEqual([])
  })
})
