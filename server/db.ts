import { DatabaseSync } from 'node:sqlite'
import { totalScore, type LeaderboardEntry, type Submission } from '../src/lib/leaderboard.ts'

interface Row {
  id: number
  name: string
  game: 'architect' | 'connect'
  game_score: number
  quiz_correct: number
  quiz_total: number
  total: number
  at: number
}

const toEntry = (r: Row): LeaderboardEntry => ({
  id: String(r.id),
  name: r.name,
  game: r.game,
  gameScore: r.game_score,
  quizCorrect: r.quiz_correct,
  quizTotal: r.quiz_total,
  total: r.total,
  at: r.at,
})

export function openScoreDb(path: string) {
  const db = new DatabaseSync(path)
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      game TEXT NOT NULL CHECK (game IN ('architect', 'connect')),
      game_score INTEGER NOT NULL,
      quiz_correct INTEGER NOT NULL,
      quiz_total INTEGER NOT NULL,
      total INTEGER NOT NULL,
      at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS scores_rank ON scores (total DESC, at ASC);
  `)

  const insert = db.prepare(
    'INSERT INTO scores (name, game, game_score, quiz_correct, quiz_total, total, at) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *',
  )
  const list = db.prepare('SELECT * FROM scores ORDER BY total DESC, at ASC, id ASC LIMIT ?')
  const rank = db.prepare('SELECT COUNT(*) AS ahead FROM scores WHERE total > ? OR (total = ? AND at < ?) OR (total = ? AND at = ? AND id < ?)')
  const count = db.prepare('SELECT COUNT(*) AS n FROM scores')

  return {
    add(s: Submission, at = Date.now()): { entry: LeaderboardEntry; rank: number } {
      const total = totalScore(s.gameScore, s.quizCorrect)
      const row = insert.get(s.name, s.game, s.gameScore, s.quizCorrect, s.quizTotal, total, at) as unknown as Row
      const { ahead } = rank.get(row.total, row.total, row.at, row.total, row.at, row.id) as { ahead: number }
      return { entry: toEntry(row), rank: ahead + 1 }
    },
    top(limit = 200): LeaderboardEntry[] {
      return (list.all(limit) as unknown as Row[]).map(toEntry)
    },
    count(): number {
      return (count.get() as { n: number }).n
    },
    clear(): void {
      db.exec('DELETE FROM scores')
    },
    close(): void {
      db.close()
    },
  }
}

export type ScoreDb = ReturnType<typeof openScoreDb>
