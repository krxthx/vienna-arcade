import { useState } from 'react'
import type { BonusQuestion as Bonus, QuizResult } from '../types'
import { BonusQuestion } from './bonus-question'

interface Props {
  questions: Bonus[]
  onDone: (result: QuizResult) => void
}

/** Runs the end-of-game quiz: one question at a time, tallying correct answers. */
export function ViennaQuiz({ questions, onDone }: Props) {
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const total = questions.length

  return (
    <BonusQuestion
      key={questions[index].id}
      question={questions[index]}
      number={index + 1}
      total={total}
      onDone={(right) => {
        const nextCorrect = correct + (right ? 1 : 0)
        if (index + 1 >= total) onDone({ correct: nextCorrect, total })
        else {
          setCorrect(nextCorrect)
          setIndex(index + 1)
        }
      }}
    />
  )
}
