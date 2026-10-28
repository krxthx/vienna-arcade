import { describe, expect, it } from 'vitest'
import { SCENARIOS } from '../content/scenarios'
import { PUZZLES } from '../content/puzzles'
import { BONUS_QUESTIONS } from '../content/bonus'
import { HARNESS_COMPONENTS } from '../content/components'
import { emptySlots, evaluateHarness, needsStatus, placeComponent, removeFromSlot, scenarioChoices, withHintPenalty } from './harness'
import { connectionScore, isPassed, sessionOutcome } from './outcome'
import { VIENNA_QUIZ_QUESTIONS } from '../config'
import { roundsFor } from '../content/games'

const cost = SCENARIOS.find((s) => s.id === 'cut-the-cost')!
const tickets = SCENARIOS.find((s) => s.id === 'wrong-tickets')!

describe('evaluateHarness', () => {
  it('gives full marks when every need is covered', () => {
    const r = evaluateHarness(cost, ['cache-checkpoint', 'static-prompt', null, null])
    expect(r.score).toBe(100)
    expect(r.verdict).toBe('approved')
  })

  it('accepts any valid alternative for a need', () => {
    expect(evaluateHarness(tickets, ['classifier', 'injection-guard', 'human-approval', null]).score).toBe(100)
    expect(evaluateHarness(tickets, ['classifier', 'injection-guard', 'confidence-gate', null]).score).toBe(100)
  })

  it('does not care about order or which slot is used', () => {
    expect(evaluateHarness(cost, [null, 'static-prompt', null, 'cache-checkpoint']).score).toBe(100)
  })

  it('never penalises optional extras', () => {
    const r = evaluateHarness(cost, ['cache-checkpoint', 'static-prompt', 'memory', null])
    expect(r.score).toBe(100)
    expect(r.placed.memory).toBe('optional')
  })

  it('deducts for distractors', () => {
    const r = evaluateHarness(cost, ['cache-checkpoint', 'static-prompt', 'email', null])
    expect(r.score).toBe(85)
    expect(r.placed.email).toBe('distractor')
  })

  it('reports each missing capability', () => {
    const r = evaluateHarness(cost, ['cache-checkpoint', null, null, null])
    expect(r.score).toBe(50)
    expect(r.verdict).toBe('partial')
    expect(r.feedback.find((f) => f.kind === 'missing')?.text).toContain('identical, byte for byte')
  })

  it('scores an empty harness as zero and never negative', () => {
    expect(evaluateHarness(cost, emptySlots(4)).score).toBe(0)
    expect(evaluateHarness(cost, ['email', 'web-search', 'frontier-model', null]).score).toBe(0)
  })

  it('reports live need coverage', () => {
    expect(needsStatus(cost, ['cache-checkpoint', null, null, null])).toEqual([true, false])
  })

  it('is deterministic', () => {
    const slots = ['static-prompt', 'cache-checkpoint', 'email', null] as const
    expect(evaluateHarness(cost, [...slots])).toEqual(evaluateHarness(cost, [...slots]))
  })
})

describe('hint penalty', () => {
  it('takes 10% off the score, updates the verdict and says so', () => {
    const perfect = evaluateHarness(cost, ['cache-checkpoint', 'static-prompt', null, null])
    const r = withHintPenalty(perfect)
    expect(r.score).toBe(90)
    expect(r.verdict).toBe('approved')
    expect(r.feedback.at(-1)?.text).toContain('Hint used')
    expect(withHintPenalty(evaluateHarness(cost, emptySlots(4))).score).toBe(0)
    expect(withHintPenalty(evaluateHarness(cost, ['cache-checkpoint', 'static-prompt', 'email', null])).score).toBe(77) // 85 less 10%
    expect(withHintPenalty(evaluateHarness(cost, ['cache-checkpoint', null, null, null])).score).toBe(45) // 50 less 10%
  })
})

describe('slot helpers', () => {
  it('moves and swaps components', () => {
    let s = placeComponent(emptySlots(3), 'llm', 0)
    s = placeComponent(s, 'email', 1)
    s = placeComponent(s, 'llm', 1)
    expect(s).toEqual(['email', 'llm', null])
  })

  it('replaces the occupant when dropping from the palette', () => {
    const s = placeComponent(['llm', null], 'email', 0)
    expect(s).toEqual(['email', null])
  })

  it('never duplicates a component and ignores bad indexes', () => {
    const s = placeComponent(['llm', null], 'llm', 1)
    expect(s).toEqual([null, 'llm'])
    expect(placeComponent(s, 'email', 9)).toEqual(s)
    expect(removeFromSlot(s, 1)).toEqual([null, null])
  })
})

describe('connection scoring', () => {
  it('penalises wrong guesses and hints, floors at zero', () => {
    expect(connectionScore(0, 0)).toBe(100)
    expect(connectionScore(1, 1)).toBe(68) // 75, less 10%
    expect(connectionScore(0, 2)).toBe(80)
    expect(connectionScore(3, 1)).toBe(23) // a low score loses less than a high one
    expect(connectionScore(9, 2)).toBe(0)
  })
})

describe('session outcome', () => {
  const rounds = (...scores: number[]) => scores.map((score, i) => ({ label: `r${i}`, score }))

  it('passes a round at 85 or more', () => {
    expect(isPassed(85)).toBe(true)
    expect(isPassed(84)).toBe(false)
    expect(isPassed(connectionScore(0, 1))).toBe(true)
    expect(isPassed(connectionScore(1, 0))).toBe(false)
  })

  it('counts passed rounds and titles by the pass rate', () => {
    const good = sessionOutcome('architect', rounds(100, 90, 85, 100, 100))
    expect(good.passed).toBe(5)
    expect(good.title).toBe('Harness Approved!')
    expect(good.message).toContain('perfect run')
    expect(sessionOutcome('architect', rounds(100, 100, 0, 0)).title).toBe('Evaluation Complete!')
    expect(sessionOutcome('architect', rounds(100, 0, 0, 0)).title).toBe('Evaluation Complete!')
    const connect = sessionOutcome('connect', rounds(100, 100, 100, 100, 50))
    expect(connect.title).toBe('Connection Found!')
    expect(connect.passed).toBe(4)
    expect(connect.rounds).toHaveLength(5)
    expect(sessionOutcome('connect', rounds(100, 100, 100, 50)).title).toBe('Evaluation Complete!')
  })
})

describe('content integrity', () => {
  it('has enough content for a full session', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(roundsFor('architect'))
    expect(PUZZLES.length).toBeGreaterThanOrEqual(roundsFor('connect'))
    expect(BONUS_QUESTIONS.length).toBeGreaterThanOrEqual(20)
    expect(BONUS_QUESTIONS.length).toBeGreaterThanOrEqual(VIENNA_QUIZ_QUESTIONS)
  })

  it.each(SCENARIOS)('scenario $id is consistent and perfectly solvable', (s) => {
    const choices = scenarioChoices(s)
    expect(new Set(choices).size).toBe(choices.length)
    expect(choices).not.toContain('llm')
    expect(s.sockets).toBeGreaterThanOrEqual(s.needs.length)
    expect(s.sockets).toBeLessThanOrEqual(5)
    expect(choices.length).toBeGreaterThan(s.sockets)
    for (const id of choices) {
      expect(HARNESS_COMPONENTS[id]).toBeDefined()
      expect(s.roles[id]).toBeTruthy()
    }
    for (const need of s.needs) expect(need.by.length).toBeGreaterThan(0)
    // One component per need must reach a perfect score.
    const perfect = s.needs.map((n) => n.by[0])
    expect(evaluateHarness(s, [...perfect, ...emptySlots(s.sockets - perfect.length)]).score).toBe(100)
  })

  it.each(PUZZLES)('puzzle $id is well-formed', (p) => {
    expect(p.tiles.length).toBeGreaterThanOrEqual(1)
    expect(p.tiles.length).toBeLessThanOrEqual(4)
    expect(p.hints).toHaveLength(2)
    expect(p.answer.length).toBeGreaterThan(2)
  })

  it('Find the Connection is picture-only', () => {
    for (const p of PUZZLES) expect(p.tiles.every((t) => t.image), p.id).toBe(true)
  })

  it('does not give away the quiz answer by length', () => {
    const longest = BONUS_QUESTIONS.filter((b) => b.correct.length > Math.max(...b.wrong.map((w) => w.length)))
    expect(longest.length / BONUS_QUESTIONS.length).toBeLessThanOrEqual(0.4)
    for (const b of BONUS_QUESTIONS) {
      for (const w of b.wrong) expect(w.length / b.correct.length, b.id).toBeGreaterThan(0.5)
      for (const w of b.wrong) expect(w.length / b.correct.length, b.id).toBeLessThan(2.5)
    }
  })

  it('has unique ids', () => {
    for (const bank of [SCENARIOS, PUZZLES, BONUS_QUESTIONS]) {
      expect(new Set(bank.map((x) => x.id)).size).toBe(bank.length)
    }
  })
})
