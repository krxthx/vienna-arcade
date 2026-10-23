import { Check, Circle } from 'lucide-react'
import type { Scenario } from '../types'

interface Props {
  scenario: Scenario
  status: boolean[]
}

/** Plain-language checklist of what the agent has to be able to do. Ticks as the harness grows. */
export function MissionPanel({ scenario, status }: Props) {
  const done = status.filter(Boolean).length
  return (
    <section className="rounded-3xl border-2 border-ink-600 bg-ink-900 p-5" aria-label="What the agent needs to do">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-mono text-sm font-bold tracking-[0.2em] text-slate-300">THIS AGENT MUST BE ABLE TO…</h2>
        <span className="font-mono text-sm font-bold text-teal">
          {done}/{scenario.needs.length}
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {scenario.needs.map((need, i) => (
          <li
            key={need.text}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-xl font-bold leading-snug transition ${
              status[i] ? 'bg-teal/15 text-white' : 'bg-ink-800 text-slate-200'
            }`}
          >
            {status[i] ? (
              <Check className="h-6 w-6 shrink-0 text-teal" aria-label="Covered" />
            ) : (
              <Circle className="h-6 w-6 shrink-0 text-ink-600" aria-label="Not covered yet" />
            )}
            {need.text}
          </li>
        ))}
      </ul>
    </section>
  )
}
