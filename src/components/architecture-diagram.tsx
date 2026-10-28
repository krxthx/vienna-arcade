import { ArrowDown, ArrowRight, Brain, MessageSquare, SquareDashed } from 'lucide-react'
import { needsStatus } from '../lib/harness'
import type { Slots } from '../lib/harness'
import type { ComponentId, HarnessResult, Scenario } from '../types'
import { ComponentChip, type ChipState } from './component-chip'

interface Props {
  scenario: Scenario
  slots: Slots
  result: HarnessResult
}

const CHIP: Record<'required' | 'optional' | 'distractor', ChipState> = { required: 'good', optional: 'bonus', distractor: 'bad' }
const TAG: Record<'required' | 'optional' | 'distractor', { label: string; color: string }> = {
  required: { label: 'Needed', color: 'text-teal' },
  optional: { label: 'Nice extra', color: 'text-volt' },
  distractor: { label: 'Not needed here', color: 'text-ember' },
}

const endpoint = 'flex min-w-[7rem] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-ink-600 bg-ink-900 px-4 py-4 text-center text-sm font-bold text-slate-200'

/** The architecture the player built, drawn as it would run: request → agent harness (model + parts) → response. */
export function ArchitectureDiagram({ scenario, slots, result }: Props) {
  const placed = slots.filter((s): s is ComponentId => s !== null)
  const missing = scenario.needs.filter((_, i) => !needsStatus(scenario, slots)[i])
  const Arrow = ({ className = '' }: { className?: string }) => (
    <>
      <ArrowRight className={`hidden h-8 w-8 shrink-0 text-slate-500 lg:block ${className}`} aria-hidden />
      <ArrowDown className={`h-8 w-8 shrink-0 text-slate-500 lg:hidden ${className}`} aria-hidden />
    </>
  )

  return (
    <section
      aria-label="The architecture you built"
      className="rounded-3xl border-2 border-ink-700 bg-ink-950/70 p-4 sm:p-6"
      style={{ backgroundImage: 'radial-gradient(#2b3c70 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' }}
    >
      <h2 className="mb-4 font-mono text-xs font-bold tracking-[0.2em] text-slate-400">YOUR ARCHITECTURE</h2>
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-stretch">
        <div className={endpoint}>
          <MessageSquare className="h-7 w-7 text-volt" aria-hidden />
          Request
        </div>
        <div className="flex items-center"><Arrow /></div>

        <div className="w-full min-w-0 flex-1 rounded-3xl border-2 border-dashed border-violet/60 bg-ink-900/60 p-4">
          <p className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-violet">AGENT HARNESS</p>
          <div className="flex flex-col items-center gap-4 xl:flex-row xl:items-center">
            <div className="flex w-full max-w-[12rem] flex-col items-center gap-2 rounded-2xl border-2 border-violet bg-ink-900 px-3 py-5 text-center shadow-[0_0_34px_-10px_#a07bff]">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/25">
                <Brain className="h-7 w-7 text-violet" aria-hidden />
              </span>
              <span className="text-lg font-bold text-white">The Model</span>
            </div>
            <ul className="grid w-full min-w-0 flex-1 gap-3 sm:grid-cols-2" aria-label="Parts plugged into the model">
              {placed.map((id) => {
                const status = result.placed[id] ?? 'distractor'
                return (
                  <li key={id} className="min-w-0">
                    <ComponentChip id={id} disabled state={CHIP[status]} className="cursor-default" tabIndex={-1} />
                    <p className={`mt-1 px-1 text-xs font-bold uppercase tracking-wider ${TAG[status].color}`}>{TAG[status].label}</p>
                  </li>
                )
              })}
              {missing.map((need) => (
                <li key={need.text} className="min-w-0">
                  <div className="flex h-16 items-center gap-3 rounded-2xl border-2 border-dashed border-ember/70 px-3 text-left text-sm font-semibold leading-tight text-slate-200">
                    <SquareDashed className="h-6 w-6 shrink-0 text-ember" aria-hidden />
                    <span className="line-clamp-2">{need.text}</span>
                  </div>
                  <p className="mt-1 px-1 text-xs font-bold uppercase tracking-wider text-ember">Missing</p>
                </li>
              ))}
              {placed.length === 0 && missing.length === 0 && <li className="text-slate-400">No parts plugged in.</li>}
            </ul>
          </div>
        </div>

        <div className="flex items-center"><Arrow /></div>
        <div className={endpoint}>
          <Brain className="h-7 w-7 text-teal" aria-hidden />
          Response
        </div>
      </div>
    </section>
  )
}
