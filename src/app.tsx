import { useCallback, useEffect, useRef, useState } from 'react'
import { BONUS_QUESTIONS, QUIZ_LENGTH } from './content/bonus'
import { PUZZLES } from './content/puzzles'
import { SCENARIOS } from './content/scenarios'
import { ArchitectGame } from './components/architect-game'
import { ConnectionGame } from './components/connection-game'
import { Home } from './components/home'
import { Leaderboard } from './components/leaderboard'
import { NameEntry } from './components/name-entry'
import { ViennaQuiz } from './components/vienna-quiz'
import { Results } from './components/results'
import { Shell } from './components/shell'
import { GAMES, ROUNDS_PER_GAME } from './content/games'
import { submitScore } from './lib/api'
import { totalScore } from './lib/leaderboard'
import { sessionOutcome } from './lib/outcome'
import { pickMany } from './lib/random'
import type { BonusQuestion as Bonus, GameId, Puzzle, QuizResult, RoundScore, Scenario, SessionOutcome } from './types'

/** Return to the home screen after this long without any input, so the next visitor starts fresh. */
const IDLE_RESET_MS = 3 * 60 * 1000

type Screen =
  | { name: 'home' }
  | { name: 'name'; game: GameId }
  | { name: 'architect'; rounds: Scenario[]; index: number; scores: RoundScore[]; run: number }
  | { name: 'connect'; rounds: Puzzle[]; index: number; scores: RoundScore[]; run: number }
  | { name: 'quiz'; outcome: SessionOutcome; questions: Bonus[] }
  | { name: 'results'; outcome: SessionOutcome; quiz: QuizResult; seconds: number; total: number; rank: number | null; entryId?: string }
  | { name: 'leaderboard'; highlightId?: string; from: Screen }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  // Held in memory for the current visitor only; cleared when returning home.
  const [playerName, setPlayerName] = useState('')
  const [playerEmail, setPlayerEmail] = useState('')
  const runs = useRef(0)
  const submitting = useRef(false)
  // When the current play session began (after the name screen): drives the visible timer and the tiebreaker.
  const [startedAt, setStartedAt] = useState(0)

  const start = useCallback((game: GameId) => {
    const run = ++runs.current
    setStartedAt(Date.now())
    if (game === 'architect') {
      setScreen({ name: 'architect', rounds: pickMany(SCENARIOS, ROUNDS_PER_GAME), index: 0, scores: [], run })
    } else {
      setScreen({ name: 'connect', rounds: pickMany(PUZZLES, ROUNDS_PER_GAME), index: 0, scores: [], run })
    }
  }, [])

  const goHome = useCallback(() => {
    setPlayerName('')
    setPlayerEmail('')
    setScreen({ name: 'home' })
  }, [])

  const toQuiz = (outcome: SessionOutcome) => {
    setScreen({ name: 'quiz', outcome, questions: pickMany(BONUS_QUESTIONS, QUIZ_LENGTH) })
  }

  /** Records a finished round, then moves to the next round or on to the quiz. */
  const finishRound = (round: RoundScore) => {
    if (screen.name !== 'architect' && screen.name !== 'connect') return
    const scores = [...screen.scores, round]
    if (scores.length >= screen.rounds.length) toQuiz(sessionOutcome(screen.name, scores))
    else setScreen({ ...screen, index: screen.index + 1, scores } as Screen)
  }

  const finishSession = async (outcome: SessionOutcome, quiz: QuizResult) => {
    // A double-tap on the last button must not record the same visit twice.
    if (submitting.current) return
    submitting.current = true
    const quizCorrect = quiz.skipped ? 0 : quiz.correct
    const seconds = Math.min(24 * 60 * 60, Math.round((Date.now() - startedAt) / 1000))
    const base = { outcome, quiz, seconds, total: totalScore(outcome.passed, quizCorrect) }
    try {
      const saved = await submitScore({
        name: playerName,
        email: playerEmail,
        game: outcome.game,
        roundsPassed: outcome.passed,
        roundsTotal: outcome.rounds.length,
        quizCorrect,
        quizTotal: quiz.total,
        seconds,
      })
      setScreen({ name: 'results', ...base, total: saved.entry.total, rank: saved.rank, entryId: saved.entry.id })
    } catch {
      // Never block the visitor on a server hiccup; the results still show.
      setScreen({ name: 'results', ...base, rank: null })
    } finally {
      submitting.current = false
    }
  }

  const isHome = screen.name === 'home'
  useEffect(() => {
    if (isHome) return
    let timer = setTimeout(goHome, IDLE_RESET_MS)
    const reset = () => {
      clearTimeout(timer)
      timer = setTimeout(goHome, IDLE_RESET_MS)
    }
    const events = ['pointerdown', 'keydown'] as const
    events.forEach((e) => window.addEventListener(e, reset))
    return () => {
      clearTimeout(timer)
      events.forEach((e) => window.removeEventListener(e, reset))
    }
  }, [isHome, goHome])

  // The timer runs from the first round until the quiz is finished.
  const timing = screen.name === 'architect' || screen.name === 'connect' || screen.name === 'quiz'
  const restartable = screen.name === 'architect' || screen.name === 'connect'

  return (
    <Shell
      timerStart={timing ? startedAt : undefined}
      onHome={isHome ? undefined : goHome}
      onRestart={restartable ? () => start(screen.name as GameId) : undefined}
    >
      {screen.name === 'home' && (
        <Home
          onPlay={(game) => setScreen({ name: 'name', game })}
          onLeaderboard={() => setScreen({ name: 'leaderboard', from: screen })}
        />
      )}
      {screen.name === 'name' && (
        <NameEntry
          gameTitle={GAMES.find((g) => g.id === screen.game)!.title}
          initialName={playerName}
          initialEmail={playerEmail}
          onBack={goHome}
          onSubmit={(name, email) => {
            setPlayerName(name)
            setPlayerEmail(email)
            start(screen.game)
          }}
        />
      )}
      {screen.name === 'architect' && (
        <ArchitectGame
          key={`${screen.run}-${screen.index}`}
          scenario={screen.rounds[screen.index]}
          round={{ number: screen.index + 1, total: screen.rounds.length }}
          onComplete={finishRound}
        />
      )}
      {screen.name === 'connect' && (
        <ConnectionGame
          key={`${screen.run}-${screen.index}`}
          puzzle={screen.rounds[screen.index]}
          round={{ number: screen.index + 1, total: screen.rounds.length }}
          onComplete={finishRound}
        />
      )}
      {screen.name === 'quiz' && (
        <ViennaQuiz questions={screen.questions} onDone={(quiz) => finishSession(screen.outcome, quiz)} />
      )}
      {screen.name === 'results' && (
        <Results
          outcome={screen.outcome}
          quiz={screen.quiz}
          playerName={playerName}
          rank={screen.rank}
          total={screen.total}
          seconds={screen.seconds}
          onLeaderboard={() => setScreen({ name: 'leaderboard', highlightId: screen.entryId, from: screen })}
          onPlayAgain={() => start(screen.outcome.game)}
          onHome={goHome}
        />
      )}
      {screen.name === 'leaderboard' && (
        <Leaderboard highlightId={screen.highlightId} onBack={() => setScreen(screen.from)} />
      )}
    </Shell>
  )
}

export default App
