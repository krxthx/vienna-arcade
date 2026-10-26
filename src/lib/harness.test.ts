import { describe, expect, it } from 'vitest'
import { SCENARIOS } from '../content/scenarios'
import { PUZZLES } from '../content/puzzles'
import { BONUS_QUESTIONS } from '../content/bonus'
import { HARNESS_COMPONENTS } from '../content/components'
import { emptySlots, evaluateHarness, needsStatus, placeComponent, removeFromSlot, scenarioChoices } from './harness'
import { connectionScore, isPassed, sessionOutcome } from './outcome'
import { QUIZ_LENGTH } from '../content/bonus'
import { ROUNDS_PER_GAME } from '../content/games'

const news = SCENARIOS.find((s) => s.id === 'news-briefer')!
const refund = SCENARIOS.find((s) => s.id === 'refund-desk')!

describe('evaluateHarness', () => {
  it('gives full marks when every need is covered', () => {
    const r = evaluateHarness(news, ['web-search', 'evaluation', null, null])
    expect(r.score).toBe(100)
    expect(r.verdict).toBe('approved')
  })

  it('accepts any valid alternative for a need', () => {
    expect(evaluateHarness(news, ['web-search', 'human-approval', null, null]).score).toBe(100)
  })

  it('does not care about order or which socket is used', () => {
    expect(evaluateHarness(news, [null, 'evaluation', null, 'web-search']).score).toBe(100)
  })

  it('never penalises optional extras', () => {
    const r = evaluateHarness(news, ['web-search', 'evaluation', 'research-skill', 'memory'])
    expect(r.score).toBe(100)
    expect(r.placed['research-skill']).toBe('optional')
  })

  it('deducts for distractors', () => {
    const r = evaluateHarness(news, ['web-search', 'evaluation', 'email', null])
    expect(r.score).toBe(85)
    expect(r.placed.email).toBe('distractor')
  })

  it('reports each missing capability', () => {
    const r = evaluateHarness(news, ['web-search', null, null, null])
    expect(r.score).toBe(50)
    expect(r.verdict).toBe('partial')
    expect(r.feedback.find((f) => f.kind === 'missing')?.text).toContain('Double-check')
  })

  it('scores an empty harness as zero and never negative', () => {
    expect(evaluateHarness(news, emptySlots(4)).score).toBe(0)
    expect(evaluateHarness(news, ['email', 'calculator', 'database', null]).score).toBe(0)
  })

  it('requires approval for the sensitive scenario', () => {
    expect(evaluateHarness(refund, ['database', 'human-approval', null, null]).score).toBe(100)
    expect(evaluateHarness(refund, ['database', null, null, null]).score).toBe(50)
  })

  it('reports live need coverage', () => {
    expect(needsStatus(news, ['web-search', null, null, null])).toEqual([true, false])
  })

  it('is deterministic', () => {
    const slots = ['evaluation', 'web-search', 'calculator', null] as const
    expect(evaluateHarness(news, [...slots])).toEqual(evaluateHarness(news, [...slots]))
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
    expect(connectionScore(1, 1)).toBe(65)
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
    expect(sessionOutcome('architect', rounds(100, 0, 0, 0)).title).toBe('One More Iteration?')
    const connect = sessionOutcome('connect', rounds(100, 100, 100, 100, 50))
    expect(connect.title).toBe('Connection Found!')
    expect(connect.passed).toBe(4)
    expect(connect.rounds).toHaveLength(5)
    expect(sessionOutcome('connect', rounds(100, 100, 100, 50)).title).toBe('Evaluation Complete!')
  })
})

describe('content integrity', () => {
  it('has enough content for a full session', () => {
    expect(SCENARIOS.length).toBeGreaterThanOrEqual(ROUNDS_PER_GAME)
    expect(PUZZLES.length).toBeGreaterThanOrEqual(ROUNDS_PER_GAME)
    expect(BONUS_QUESTIONS.length).toBeGreaterThanOrEqual(20)
    expect(BONUS_QUESTIONS.length).toBeGreaterThanOrEqual(QUIZ_LENGTH)
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

  it.each(PUZZLES)('puzzle $id has distinct answer and choices', (p) => {
    expect(new Set([p.answer, ...p.distractors]).size).toBe(3)
    expect(p.tiles.length).toBeGreaterThanOrEqual(1)
    expect(p.tiles.length).toBeLessThanOrEqual(4)
  })

  it('Find the Connection is picture-only', () => {
    for (const p of PUZZLES) {
      expect(p.kind, p.id).toBe('rebus')
      expect(p.tiles.every((t) => t.image && !t.icon), p.id).toBe(true)
    }
  })

  it('has unique ids', () => {
    for (const bank of [SCENARIOS, PUZZLES, BONUS_QUESTIONS]) {
      expect(new Set(bank.map((x) => x.id)).size).toBe(bank.length)
    }
  })
})
