import { GAMES } from '../content/games'
import type { GameId, GameOutcome, HarnessResult, RoundScore, Scenario, SessionOutcome } from '../types'

/** Feedback for a single harness round (shown on that round's result panel). */
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

/** Each hint takes this share off whatever the round would otherwise have scored. */
export const HINT_PENALTY_PCT = 10
export const WRONG_PENALTY = 25

/** A score after using `hints` hints: proportional, so a low score loses less than a high one. */
export function applyHints(score: number, hints: number): number {
  return Math.round(Math.max(0, score) * Math.max(0, 1 - (hints * HINT_PENALTY_PCT) / 100))
}

/** Score for one connection round: 100 minus a penalty per wrong guess, then reduced per hint. */
export function connectionScore(wrongGuesses: number, hintsUsed: number): number {
  return applyHints(Math.max(0, 100 - wrongGuesses * WRONG_PENALTY), hintsUsed)
}

/** A round counts as passed at this score or higher (harness approved; a puzzle with no wrong guesses). */
export const PASS_SCORE = 85

export const isPassed = (score: number) => score >= PASS_SCORE

/** Rolls all rounds of a session into the final result: rounds passed, title and message. */
export function sessionOutcome(game: GameId, rounds: readonly RoundScore[]): SessionOutcome {
  const passed = rounds.filter((r) => isPassed(r.score)).length
  const ratio = rounds.length === 0 ? 0 : passed / rounds.length
  const top = game === 'architect' ? 'Harness Approved!' : 'Connection Found!'
  const title = ratio >= 0.8 ? top : ratio >= 0.5 ? 'Evaluation Complete!' : 'One More Iteration?'
  const message =
    passed === rounds.length
      ? `A perfect run: all ${rounds.length} rounds passed.`
      : `${passed} of ${rounds.length} rounds passed.`
  return {
    game,
    title,
    message,
    learned: GAMES.find((g) => g.id === game)?.learned ?? '',
    rounds: [...rounds],
    passed,
  }
}
