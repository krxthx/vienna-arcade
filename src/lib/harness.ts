import type { ComponentId, FeedbackItem, HarnessResult, Scenario, Verdict } from '../types'
import { applyHints, HINT_PENALTY_PCT } from './outcome'
import { HARNESS_COMPONENTS } from '../content/components'

export type Slots = (ComponentId | null)[]

export const SCORING = {
  distractorEach: 15,
  approved: 85,
  partial: 50,
} as const

export function emptySlots(count: number): Slots {
  return Array.from({ length: count }, () => null)
}

/** Every component the player can pick from, without the always-present model. */
export function scenarioChoices(scenario: Scenario): ComponentId[] {
  return [...scenario.needs.flatMap((n) => n.by), ...scenario.optional, ...scenario.distractors]
}

/** Whether each need is currently covered. Used for the live checklist. */
export function needsStatus(scenario: Scenario, slots: Slots): boolean[] {
  return scenario.needs.map((need) => need.by.some((id) => slots.includes(id)))
}

/**
 * Put `id` into `target`. If it was already in another socket it moves (swapping
 * with the occupant of `target`); a component from the palette replaces the occupant,
 * which simply returns to the palette.
 */
export function placeComponent(slots: Slots, id: ComponentId, target: number): Slots {
  if (target < 0 || target >= slots.length) return slots
  const next = [...slots]
  const from = next.indexOf(id)
  const displaced = next[target]
  if (from === target) return next
  if (from !== -1) next[from] = displaced
  next[target] = id
  return next
}

export function removeFromSlot(slots: Slots, index: number): Slots {
  const next = [...slots]
  next[index] = null
  return next
}

/**
 * Deterministic: the same scenario + sockets always give the same result.
 * Score = share of needs covered (0-100), minus a penalty per distractor.
 * Optional parts are never penalised. Order does not matter.
 */
export function evaluateHarness(scenario: Scenario, slots: Slots): HarnessResult {
  const placed = new Set(slots.filter((s): s is ComponentId => s !== null))
  const name = (id: ComponentId) => HARNESS_COMPONENTS[id].name
  const role = (id: ComponentId) => scenario.roles[id] ?? `${name(id)} was part of the harness.`

  const feedback: FeedbackItem[] = []
  const status: HarnessResult['placed'] = {}

  let met = 0
  for (const need of scenario.needs) {
    const used = need.by.filter((id) => placed.has(id))
    if (used.length > 0) {
      met++
      for (const id of used) status[id] = 'required'
      feedback.push({ kind: 'met', componentId: used[0], text: `${need.text}: ${role(used[0])}` })
    } else {
      const options = need.by.map(name).join(' or ')
      feedback.push({ kind: 'missing', text: `Missing: ${need.text}. Try ${options}.` })
    }
  }
  for (const id of scenario.optional) {
    if (!placed.has(id)) continue
    status[id] = 'optional'
    feedback.push({ kind: 'optional', componentId: id, text: `Nice extra. ${role(id)}` })
  }
  const distractorHit = scenario.distractors.filter((id) => placed.has(id))
  for (const id of distractorHit) {
    status[id] = 'distractor'
    feedback.push({ kind: 'distractor', componentId: id, text: role(id) })
  }

  const raw = (100 * met) / scenario.needs.length - distractorHit.length * SCORING.distractorEach
  const score = Math.max(0, Math.min(100, Math.round(raw)))
  const verdict: Verdict = score >= SCORING.approved ? 'approved' : score >= SCORING.partial ? 'partial' : 'retry'

  return { score, verdict, feedback, placed: status }
}

const verdictFor = (score: number): Verdict => (score >= SCORING.approved ? 'approved' : score >= SCORING.partial ? 'partial' : 'retry')

/** Using the hint takes a share off the score, as in Find the Connection. */
export function withHintPenalty(result: HarnessResult): HarnessResult {
  const score = applyHints(result.score, 1)
  return {
    ...result,
    score,
    verdict: verdictFor(score),
    feedback: [...result.feedback, { kind: 'missing', text: `Hint used: −${HINT_PENALTY_PCT}% of the score.` }],
  }
}
