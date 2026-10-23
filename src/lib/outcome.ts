import type { GameOutcome, HarnessResult, Puzzle, Scenario } from '../types'

export function architectOutcome(scenario: Scenario, result: HarnessResult): GameOutcome {
  const byVerdict = {
    approved: { title: 'Harness Approved!', message: 'Every essential piece is in place. Ship it.' },
    partial: { title: 'Evaluation Complete!', message: 'A solid start. A few tweaks would make it great.' },
    retry: { title: 'One More Iteration?', message: 'Close, but the harness needs another pass.' },
  } as const
  return {
    game: 'architect',
    score: result.score,
    learned: scenario.explanation,
    ...byVerdict[result.verdict],
  }
}

export const HINT_PENALTY = 10
export const WRONG_PENALTY = 25

export function connectionScore(wrongGuesses: number, hintsUsed: number): number {
  return Math.max(0, 100 - wrongGuesses * WRONG_PENALTY - hintsUsed * HINT_PENALTY)
}

export function connectionOutcome(puzzle: Puzzle, wrongGuesses: number, hintsUsed: number): GameOutcome {
  const score = connectionScore(wrongGuesses, hintsUsed)
  const flawless = wrongGuesses === 0
  return {
    game: 'connect',
    score,
    title: flawless ? 'Connection Found!' : 'Evaluation Complete!',
    message: flawless
      ? hintsUsed === 0
        ? 'First try, no hints. Sharp eye.'
        : 'Nice work. You got there.'
      : 'You found it in the end. Persistence pays off.',
    learned: puzzle.explanation,
  }
}
