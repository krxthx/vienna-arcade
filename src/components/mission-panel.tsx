import { Check, Circle } from 'lucide-react'
import type { Scenario } from '../types'

interface Props {
  scenario: Scenario
  status: boolean[]
}

/** Plain-language checklist of what the agent has to be able to do. Ticks as the harness grows. */
export function MissionPanel({ scenario, status }: Props) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="What the agent needs to do">
      {scenario.needs.map((need, i) => (
        <li
          key={need.text}
          className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold leading-snug transition ${
            status[i] ? 'border-teal/60 bg-teal/15 text-white' : 'border-ink-600 bg-ink-800 text-slate-200'
          }`}
        >
          {status[i] ? (
            <Check className="h-4 w-4 shrink-0 text-teal" aria-label="Covered" />
          ) : (
            <Circle className="h-4 w-4 shrink-0 text-slate-500" aria-label="Not covered yet" />
          )}
          {need.text}
        </li>
      ))}
    </ul>
  )
}
