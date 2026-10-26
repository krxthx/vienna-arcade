import { Download, Medal, Trash2, Wrench } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { GAMES } from '../content/games'
import { clearScores, fetchCsv, fetchScores } from '../lib/api'
import { formatDuration } from '../lib/format'
import { QUIZ_POINTS_LABEL, sortEntries, type LeaderboardEntry } from '../lib/leaderboard'
import type { GameId } from '../types'

interface Props {
  highlightId?: string
  onBack: () => void
}

const LIMIT = 10
type Filter = 'all' | GameId

export function Leaderboard({ highlightId, onBack }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')
  const [organizer, setOrganizer] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [clearError, setClearError] = useState(false)
  const [exportError, setExportError] = useState(false)

  const load = useCallback(() => {
    fetchScores().then(
      (list) => {
        setError(false)
        setEntries(list)
      },
      () => setError(true),
    )
  }, [])
  useEffect(load, [load])

  const shown = sortEntries(entries ?? []).filter((e) => filter === 'all' || e.game === filter)
  const top = shown.slice(0, LIMIT)
  const highlightRank = highlightId ? shown.findIndex((e) => e.id === highlightId) : -1
  const gameName = (id: GameId) => GAMES.find((g) => g.id === id)?.title ?? id
  const count = entries?.length ?? 0

  const exportCsv = async () => {
    try {
      const csv = await fetchCsv(adminKey)
      const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `vienna-arcade-scores-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      setExportError(false)
    } catch {
      setExportError(true)
    }
  }

  const clearAll = async () => {
    try {
      await clearScores(adminKey)
      setClearError(false)
      setConfirmClear(false)
      setEntries([])
    } catch {
      setClearError(true)
    }
  }

  const tab = (value: Filter, label: string) => (
    <button
      type="button"
      key={value}
      onClick={() => setFilter(value)}
      aria-pressed={filter === value}
      className={`min-h-14 rounded-xl border-2 px-5 text-lg font-bold active:scale-95 ${
        filter === value ? 'border-teal bg-teal text-ink-950' : 'border-ink-600 bg-ink-800 hover:border-teal'
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 py-2">
      <div className="text-center">
        <p className="font-mono text-sm font-bold tracking-[0.2em] text-ember">TOP PLAYERS</p>
        <h1 className="text-5xl font-black text-white sm:text-6xl">Leaderboard</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {tab('all', 'All games')}
        {GAMES.map((g) => tab(g.id, g.title))}
      </div>

      {error ? (
        <div className="rounded-2xl bg-ink-900 p-10 text-center text-xl text-slate-300">
          Couldn’t reach the score server.{' '}
          <button type="button" onClick={load} className="font-bold text-teal underline underline-offset-4">
            Try again
          </button>
        </div>
      ) : entries === null ? (
        <p className="rounded-2xl bg-ink-900 p-10 text-center text-xl text-slate-300">Loading…</p>
      ) : top.length === 0 ? (
        <p className="rounded-2xl bg-ink-900 p-10 text-center text-xl text-slate-300">No scores yet. Be the first!</p>
      ) : (
        <ol className="flex flex-col gap-2" aria-label="Top scores">
          {top.map((e, i) => (
            <li
              key={e.id}
              className={`flex items-center gap-4 rounded-2xl border-2 px-5 py-3 ${
                e.id === highlightId ? 'border-teal bg-teal/10' : 'border-ink-700 bg-ink-900'
              }`}
            >
              <span className="flex w-12 justify-center text-2xl font-black tabular-nums text-slate-200">
                {i < 3 ? <Medal className={['text-ember', 'text-slate-300', 'text-orange-300'][i]} aria-label={`Rank ${i + 1}`} /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-2xl font-black text-white">{e.name}</span>
                <span className="block text-sm text-slate-400">
                  {gameName(e.game)} · rounds {e.roundsPassed}/{e.roundsTotal} · quiz {e.quizCorrect}/{e.quizTotal} · {formatDuration(e.seconds)}
                </span>
              </span>
              <span className="text-3xl font-black tabular-nums text-teal">{e.total}</span>
            </li>
          ))}
        </ol>
      )}

      <p className="text-center text-sm text-slate-400">{QUIZ_POINTS_LABEL}</p>

      {highlightRank >= LIMIT && (
        <p className="text-center text-lg text-slate-200">You’re currently #{highlightRank + 1}. Keep playing to climb!</p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="min-h-16 rounded-2xl bg-teal px-10 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setOrganizer((o) => !o)}
          className="inline-flex min-h-12 items-center gap-2 px-3 font-mono text-sm text-slate-500 hover:text-slate-200"
        >
          <Wrench className="h-4 w-4" aria-hidden /> Organizer
        </button>
      </div>

      {organizer && (
        <div className="flex flex-wrap items-center justify-end gap-3 rounded-2xl border border-ink-700 bg-ink-900 p-4">
          <span className="mr-auto text-sm text-slate-400">{count} scores in the database</span>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-ink-600 px-4 font-bold hover:border-volt"
          >
            <Download className="h-5 w-5" aria-hidden /> Export CSV
          </button>
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Organizer key (if set)"
            aria-label="Organizer key"
            className="min-h-12 select-text rounded-xl border-2 border-ink-600 bg-ink-950 px-3 text-sm"
          />
          {confirmClear ? (
            <>
              <button type="button" onClick={clearAll} className="min-h-12 rounded-xl bg-ember px-4 font-black text-ink-950">
                Yes, delete all scores
              </button>
              <button type="button" onClick={() => setConfirmClear(false)} className="min-h-12 px-3 font-semibold text-slate-300">
                Cancel
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={count === 0}
              onClick={() => setConfirmClear(true)}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border-2 border-ink-600 px-4 font-bold hover:border-ember disabled:opacity-40"
            >
              <Trash2 className="h-5 w-5" aria-hidden /> Clear all
            </button>
          )}
          {exportError && <p className="w-full text-right text-sm text-ember">Export needs the organizer key (or run it on the server machine).</p>}
          {clearError && <p className="w-full text-right text-sm text-ember">Not allowed. Check the organizer key, or clear from the server machine.</p>}
        </div>
      )}
    </div>
  )
}
