import type { LeaderboardEntry, Submission } from './leaderboard'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...init, headers: { 'content-type': 'application/json', ...init?.headers } })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.json() as Promise<T>
}

export const fetchScores = () => request<LeaderboardEntry[]>('/api/scores')

export const submitScore = (s: Submission) =>
  request<{ entry: LeaderboardEntry; rank: number }>('/api/scores', { method: 'POST', body: JSON.stringify(s) })

export const clearScores = (adminKey: string) =>
  request<{ ok: true }>('/api/scores', { method: 'DELETE', headers: adminKey ? { 'x-admin-key': adminKey } : {} })

/** Organizer-only: fetches the CSV (includes emails) and returns it as text. */
export async function fetchCsv(adminKey: string): Promise<string> {
  const res = await fetch('/api/scores.csv', { headers: adminKey ? { 'x-admin-key': adminKey } : {} })
  if (!res.ok) throw new Error(`${res.status}`)
  return res.text()
}
