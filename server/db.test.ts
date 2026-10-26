import { afterEach, describe, expect, it } from 'vitest'
import { DatabaseSync } from 'node:sqlite'
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { openScoreDb } from './db.ts'

const sub = (name: string, roundsPassed: number, quizCorrect: number, seconds = 300) => ({
  name, game: 'architect' as const, roundsPassed, roundsTotal: 10, quizCorrect, quizTotal: 4, seconds,
})

describe('score database', () => {
  const db = openScoreDb(':memory:')
  afterEach(() => db.clear())

  it('stores scores, computing the total server-side', () => {
    const { entry, rank } = db.add(sub('Ada', 8, 3), 1)
    expect(entry.total).toBe(11)
    expect(entry.seconds).toBe(300)
    expect(rank).toBe(1)
    expect(db.count()).toBe(1)
  })

  it('ranks by points; equal points go to the faster time, then earlier finish', () => {
    db.add(sub('A', 8, 2, 400), 1) // 10 pts, 400s
    const fast = db.add(sub('B', 7, 3, 200), 2) // 10 pts, 200s -> ahead of A
    const c = db.add(sub('C', 10, 4, 900), 3) // 14 pts -> first
    const d = db.add(sub('D', 8, 2, 400), 4) // ties A exactly, finished later
    expect(fast.rank).toBe(1)
    expect(c.rank).toBe(1)
    expect(d.rank).toBe(4)
    expect(db.top().map((e) => e.name)).toEqual(['C', 'B', 'A', 'D'])
    expect(db.top(2)).toHaveLength(2)
  })

  it('clears everything', () => {
    db.add(sub('A', 1, 0))
    db.clear()
    expect(db.top()).toEqual([])
  })

  it('keeps an old-layout table aside instead of deleting it', () => {
    const file = join(mkdtempSync(join(tmpdir(), 'arcade-')), 'old.db')
    const old = new DatabaseSync(file)
    old.exec("CREATE TABLE scores (id INTEGER PRIMARY KEY, name TEXT, game_score INTEGER); INSERT INTO scores (name, game_score) VALUES ('legacy', 50);")
    old.close()
    const migrated = openScoreDb(file)
    expect(migrated.count()).toBe(0)
    migrated.add(sub('New', 5, 1))
    expect(migrated.count()).toBe(1)
    migrated.close()
    const check = new DatabaseSync(file)
    expect((check.prepare('SELECT COUNT(*) AS n FROM scores_old').get() as { n: number }).n).toBe(1)
    check.close()
  })
})
