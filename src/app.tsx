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
import { GAMES } from './content/games'
import { submitScore } from './lib/api'
import { totalScore } from './lib/leaderboard'
import { pickMany, pickRandom } from './lib/random'
import type { BonusQuestion as Bonus, GameId, GameOutcome, Puzzle, QuizResult, Scenario } from './types'

/** Return to the home screen after this long without any input, so the next visitor starts fresh. */
const IDLE_RESET_MS = 3 * 60 * 1000

type Screen =
  | { name: 'home' }
  | { name: 'name'; game: GameId }
  | { name: 'architect'; scenario: Scenario; run: number }
  | { name: 'connect'; puzzle: Puzzle; run: number }
  | { name: 'quiz'; outcome: GameOutcome; questions: Bonus[] }
  | { name: 'results'; outcome: GameOutcome; quiz: QuizResult; total: number; rank: number | null; entryId?: string }
  | { name: 'leaderboard'; highlightId?: string; from: Screen }

function App() {
  const [screen, setScreen] = useState<Screen>({ name: 'home' })
  // Held in memory for the current visitor only; cleared when returning home.
  const [playerName, setPlayerName] = useState('')
  const runs = useRef(0)
  const last = useRef<{ scenario?: string; puzzle?: string }>({})

  const start = useCallback((game: GameId) => {
    const run = ++runs.current
    if (game === 'architect') {
      const scenario = pickRandom(SCENARIOS, last.current.scenario)
      last.current.scenario = scenario.id
      setScreen({ name: 'architect', scenario, run })
    } else {
      const puzzle = pickRandom(PUZZLES, last.current.puzzle)
      last.current.puzzle = puzzle.id
      setScreen({ name: 'connect', puzzle, run })
    }
  }, [])

  const goHome = useCallback(() => {
    setPlayerName('')
    setScreen({ name: 'home' })
  }, [])

  const toQuiz = (outcome: GameOutcome) => {
    setScreen({ name: 'quiz', outcome, questions: pickMany(BONUS_QUESTIONS, QUIZ_LENGTH) })
  }

  const finishSession = async (outcome: GameOutcome, quiz: QuizResult) => {
    const quizCorrect = quiz.skipped ? 0 : quiz.correct
    const total = totalScore(outcome.score, quizCorrect)
    try {
      const saved = await submitScore({
        name: playerName,
        game: outcome.game,
        gameScore: outcome.score,
        quizCorrect,
        quizTotal: quiz.total,
      })
      setScreen({ name: 'results', outcome, quiz, total: saved.entry.total, rank: saved.rank, entryId: saved.entry.id })
    } catch {
      // Never block the visitor on a server hiccup; the results still show.
      setScreen({ name: 'results', outcome, quiz, total, rank: null })
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

  const restartable = screen.name === 'architect' || screen.name === 'connect'

  return (
    <Shell
      onHome={isHome ? undefined : goHome}
      onRestart={restartable ? () => start(screen.name as GameId) : undefined}
    >
      {screen.name === 'home' && <Home onPlay={(game) => setScreen({ name: 'name', game })} onLeaderboard={() => setScreen({ name: 'leaderboard', from: screen })} />}
      {screen.name === 'name' && (
        <NameEntry
          gameTitle={GAMES.find((g) => g.id === screen.game)!.title}
          initialName={playerName}
          onBack={goHome}
          onSubmit={(name) => {
            setPlayerName(name)
            start(screen.game)
          }}
        />
      )}
      {screen.name === 'architect' && <ArchitectGame key={screen.run} scenario={screen.scenario} onComplete={toQuiz} />}
      {screen.name === 'connect' && <ConnectionGame key={screen.run} puzzle={screen.puzzle} onComplete={toQuiz} />}
      {screen.name === 'quiz' && (
        <ViennaQuiz
          questions={screen.questions}
          onDone={(quiz) => finishSession(screen.outcome, quiz)}
        />
      )}
      {screen.name === 'results' && (
        <Results outcome={screen.outcome} quiz={screen.quiz} playerName={playerName}
          rank={screen.rank}
          total={screen.total}
          onLeaderboard={() => setScreen({ name: 'leaderboard', highlightId: screen.entryId, from: screen })} onPlayAgain={() => start(screen.outcome.game)} onHome={goHome} />
      )}
      {screen.name === 'leaderboard' && (
        <Leaderboard highlightId={screen.highlightId} onBack={() => setScreen(screen.from)} />
      )}
    </Shell>
  )
}

export default App
