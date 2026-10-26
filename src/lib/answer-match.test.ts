import { describe, expect, it } from 'vitest'
import { PUZZLES } from '../content/puzzles'
import { allowedTypos, answerPattern, editDistance, isAnswerCorrect, normalizeAnswer } from './answer-match'

const find = (id: string) => PUZZLES.find((p) => p.id === id)!

describe('answer matching', () => {
  it('normalizes case, accents, spaces and punctuation', () => {
    expect(normalizeAnswer('  Human-in-the-Loop! ')).toBe('humanintheloop')
    expect(normalizeAnswer('Café & Co')).toBe('cafeandco')
  })

  it('counts a swapped pair of letters as one typo', () => {
    expect(editDistance('window', 'windwo')).toBe(1)
    expect(editDistance('kitten', 'sitting')).toBe(3)
    expect(editDistance('', 'abc')).toBe(3)
  })

  it('forgives more typos in longer answers; short ones are exact', () => {
    expect([3, 4, 8, 9, 14, 15].map(allowedTypos)).toEqual([0, 1, 1, 2, 2, 3])
  })

  it('accepts the answer however it is spaced or capitalized', () => {
    const p = find('rebus-context-window')
    for (const t of ['Context Window', 'context window', 'CONTEXTWINDOW', 'context-window', '  context   window  ']) {
      expect(isAnswerCorrect(t, p), t).toBe(true)
    }
  })

  it('forgives small spelling mistakes', () => {
    expect(isAnswerCorrect('contxt windw', find('rebus-context-window'))).toBe(true)
    expect(isAnswerCorrect('hallucinashun', find('rebus-hallucination'))).toBe(false) // too far
    expect(isAnswerCorrect('halucination', find('rebus-hallucination'))).toBe(true)
    expect(isAnswerCorrect('quantisation', find('rebus-quantization'))).toBe(true)
    expect(isAnswerCorrect('optimization', find('rebus-optimisation'))).toBe(true)
    expect(isAnswerCorrect('olama', find('rebus-ollama'))).toBe(true)
  })

  it('accepts listed aliases', () => {
    expect(isAnswerCorrect('HITL', find('rebus-hitl'))).toBe(true)
    expect(isAnswerCorrect('MoE', find('rebus-mixture-of-experts'))).toBe(true)
    expect(isAnswerCorrect('vector db', find('rebus-vector-database'))).toBe(true)
  })

  it('rejects wrong, empty and near-miss answers', () => {
    expect(isAnswerCorrect('', find('rebus-qwen'))).toBe(false)
    expect(isAnswerCorrect('   ', find('rebus-qwen'))).toBe(false)
    expect(isAnswerCorrect('banana', find('rebus-qwen'))).toBe(false)
    expect(isAnswerCorrect('gwen', find('rebus-qwen'))).toBe(false) // the picture, not the answer
    expect(isAnswerCorrect('qwen', find('rebus-qwen'))).toBe(true)
    expect(isAnswerCorrect('benchmarking', find('rebus-benchmaxing'))).toBe(false)
    expect(isAnswerCorrect('benchmaxing', find('rebus-benchmaxing'))).toBe(true)
  })

  it('every puzzle accepts its own answer, and no puzzle accepts another puzzle’s answer', () => {
    for (const a of PUZZLES) {
      expect(isAnswerCorrect(a.answer, a), a.id).toBe(true)
      for (const alias of a.accept ?? []) expect(isAnswerCorrect(alias, a), `${a.id}:${alias}`).toBe(true)
      for (const b of PUZZLES) {
        if (a.id !== b.id) expect(isAnswerCorrect(a.answer, b), `${a.answer} accepted for ${b.answer}`).toBe(false)
      }
    }
  })

  it('every answer survives dropping one letter from the middle (when typos are allowed)', () => {
    for (const p of PUZZLES) {
      const n = normalizeAnswer(p.answer)
      if (allowedTypos(n.length) < 1) continue
      const typo = n.slice(0, 3) + n.slice(4)
      expect(isAnswerCorrect(typo, p), `${p.answer} -> ${typo}`).toBe(true)
    }
  })

  it('builds a fill-in-the-blanks pattern', () => {
    expect(answerPattern('Context Window')).toBe('C______ W_____')
    expect(answerPattern('Human-in-the-Loop')).toBe('H____-i_-t__-L___')
    expect(answerPattern('Qwen')).toBe('Q___')
  })
})
