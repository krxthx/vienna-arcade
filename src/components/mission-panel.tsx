import { Circle } from 'lucide-react'
import type { Scenario } from '../types'

interface Props {
  scenario: Scenario
}

/** Plain-language list of what the agent has to be able to do. It never ticks, so the answer can't be found by trial and error. */
export function MissionPanel({ scenario }: Props) {
  return (
    <ul className="mt-3 flex flex-wrap gap-2" aria-label="Requirements">
      {scenario.needs.map((need) => (
        <li
          key={need.text}
          className="flex items-center gap-2 rounded-full border border-ink-600 bg-ink-800 px-3 py-1.5 text-sm font-semibold leading-snug text-slate-200"
        >
          <Circle className="h-4 w-4 shrink-0 text-slate-500" aria-hidden />
          {need.text}
        </li>
      ))}
    </ul>
  )
}
