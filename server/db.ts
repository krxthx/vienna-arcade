import { DatabaseSync } from 'node:sqlite'
import { totalScore, type AdminEntry, type LeaderboardEntry, type Submission } from '../src/lib/leaderboard.ts'

interface Row {
  id: number
  name: string
  email: string
  game: 'architect' | 'connect'
  rounds_passed: number
  rounds_total: number
  quiz_correct: number
  quiz_total: number
  total: number
  seconds: number
  at: number
}

/** Public shape: deliberately has no email. */
const toEntry = (r: Row): LeaderboardEntry => ({
  id: String(r.id),
  name: r.name,
  game: r.game,
  roundsPassed: r.rounds_passed,
  roundsTotal: r.rounds_total,
  quizCorrect: r.quiz_correct,
  quizTotal: r.quiz_total,
  total: r.total,
  seconds: r.seconds,
  at: r.at,
})

const toAdminEntry = (r: Row): AdminEntry => ({ ...toEntry(r), email: r.email })

export function openScoreDb(path: string) {
  const db = new DatabaseSync(path)
  db.exec('PRAGMA journal_mode = WAL;')

  // An older layout (before rounds and time) is kept aside as scores_old, never deleted.
  const columns = (db.prepare('PRAGMA table_info(scores)').all() as { name: string }[]).map((c) => c.name)
  if (columns.length > 0 && !columns.includes('seconds')) {
    db.exec('DROP TABLE IF EXISTS scores_old; ALTER TABLE scores RENAME TO scores_old; DROP INDEX IF EXISTS scores_rank;')
  }

  // Layout from before emails existed: add the column in place so no scores are lost.
  const current = (db.prepare('PRAGMA table_info(scores)').all() as { name: string }[]).map((c) => c.name)
  if (current.length > 0 && !current.includes('email')) {
    db.exec("ALTER TABLE scores ADD COLUMN email TEXT NOT NULL DEFAULT ''")
  }

  db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL DEFAULT '',
      game TEXT NOT NULL CHECK (game IN ('architect', 'connect')),
      rounds_passed INTEGER NOT NULL,
      rounds_total INTEGER NOT NULL,
      quiz_correct INTEGER NOT NULL,
      quiz_total INTEGER NOT NULL,
      total INTEGER NOT NULL,
      seconds INTEGER NOT NULL,
      at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS scores_rank ON scores (total DESC, seconds ASC, at ASC);
  `)

  const insert = db.prepare(
    'INSERT INTO scores (name, email, game, rounds_passed, rounds_total, quiz_correct, quiz_total, total, seconds, at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *',
  )
  const list = db.prepare('SELECT * FROM scores ORDER BY total DESC, seconds ASC, at ASC, id ASC LIMIT ?')
  const rank = db.prepare(`SELECT COUNT(*) AS ahead FROM scores WHERE
    total > ? OR (total = ? AND seconds < ?) OR (total = ? AND seconds = ? AND at < ?) OR (total = ? AND seconds = ? AND at = ? AND id < ?)`)
  const count = db.prepare('SELECT COUNT(*) AS n FROM scores')

  return {
    add(s: Submission, at = Date.now()): { entry: LeaderboardEntry; rank: number } {
      const total = totalScore(s.roundsPassed, s.quizCorrect)
      const row = insert.get(s.name, s.email, s.game, s.roundsPassed, s.roundsTotal, s.quizCorrect, s.quizTotal, total, s.seconds, at) as unknown as Row
      const { ahead } = rank.get(
        row.total, row.total, row.seconds, row.total, row.seconds, row.at, row.total, row.seconds, row.at, row.id,
      ) as { ahead: number }
      return { entry: toEntry(row), rank: ahead + 1 }
    },
    top(limit = 200): LeaderboardEntry[] {
      return (list.all(limit) as unknown as Row[]).map(toEntry)
    },
    /** Everything including emails. Organizer-only: never expose through a public route. */
    topWithEmail(limit = 100000): AdminEntry[] {
      return (list.all(limit) as unknown as Row[]).map(toAdminEntry)
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
