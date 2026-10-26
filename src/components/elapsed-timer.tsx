import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatDuration } from '../lib/format'

/** Counts up from `startedAt` (ms). It never counts down, so there is nothing to rush against. */
export function ElapsedTimer({ startedAt }: { startedAt: number }) {
  const [now, setNow] = useState(startedAt)
  useEffect(() => {
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])
  return (
    <span
      className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-ink-600 bg-ink-900 px-4 font-mono text-lg font-bold tabular-nums text-slate-100"
      role="timer"
      aria-label="Time taken so far"
    >
      <Timer className="h-5 w-5 text-teal" aria-hidden />
      {formatDuration((now - startedAt) / 1000)}
    </span>
  )
}
