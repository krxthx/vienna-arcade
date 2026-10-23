import type { BonusQuestion } from '../types'

/** Number of questions asked at the end of each game. */
export const QUIZ_LENGTH = 5

/**
 * Vienna quiz bank: general AI-evaluation concepts only, until product-specific
 * questions are supplied. Each quiz draws QUIZ_LENGTH random questions from here.
 */
export const BONUS_QUESTIONS: BonusQuestion[] = [
  {
    id: 'latency',
    prompt: 'A model has 95% accuracy but takes 20 seconds to respond. What else should we evaluate?',
    correct: 'Latency',
    wrong: ['Temperature', 'Context window'],
    explanation: 'Accuracy alone is not enough. Speed, cost and reliability matter in real products.',
  },
  {
    id: 'same-dataset',
    prompt: 'Why benchmark two AI models on the same dataset?',
    correct: 'To compare their performance consistently',
    wrong: ['To increase their context windows', 'To train both models'],
    explanation: 'Identical tests make results comparable. Different tests would make the comparison unfair.',
  },
  {
    id: 'regression',
    prompt: 'You update a prompt and want to be sure nothing got worse. What do you run?',
    correct: 'The same evaluation set as before',
    wrong: ['A brand-new random question', 'A longer prompt'],
    explanation: 'Re-running a fixed evaluation set catches regressions: things that used to work and now don’t.',
  },
  {
    id: 'ground-truth',
    prompt: 'What is a “ground truth” label in an evaluation dataset?',
    correct: 'The known correct answer',
    wrong: ['The model’s best guess', 'The prompt’s length'],
    explanation: 'Ground truth is the trusted answer you grade the model against.',
  },
  {
    id: 'llm-judge',
    prompt: 'What does an “LLM-as-judge” do?',
    correct: 'Scores another model’s answers against a rubric',
    wrong: ['Trains the other model', 'Makes the other model faster'],
    explanation: 'A judge model applies grading criteria at scale, which is useful when answers are free text.',
  },
  {
    id: 'cost',
    prompt: 'Two models score the same, but one costs 10× more per request. Which metric breaks the tie?',
    correct: 'Cost per request',
    wrong: ['Number of layers', 'Prompt font size'],
    explanation: 'Quality, cost and speed are usually evaluated together to choose the right model.',
  },
  {
    id: 'sample-size',
    prompt: 'Why test on many examples instead of just one?',
    correct: 'One result can be luck; many show the pattern',
    wrong: ['It makes the model smarter', 'It reduces latency'],
    explanation: 'A bigger, varied test set gives a more trustworthy picture of performance.',
  },
  {
    id: 'edge-cases',
    prompt: 'What should a good evaluation set include besides typical questions?',
    correct: 'Tricky edge cases',
    wrong: ['Only the easiest questions', 'Only questions the model has seen in training'],
    explanation: 'Edge cases reveal weaknesses that easy examples hide.',
  },
  {
    id: 'hallucination',
    prompt: 'Which evaluation checks whether an answer is supported by its source documents?',
    correct: 'Groundedness',
    wrong: ['Tokenization', 'Quantization'],
    explanation: 'Groundedness checks catch hallucinations, where a model sounds sure but is not supported by facts.',
  },
  {
    id: 'human-eval',
    prompt: 'Why keep some human review in an automated evaluation process?',
    correct: 'People catch nuance automated scores can miss',
    wrong: ['Humans are always faster', 'Automated scores are always wrong'],
    explanation: 'Automated scoring scales, humans calibrate it. The mix is the strongest.',
  },
  {
    id: 'overfit',
    prompt: 'A model aces your test set because it saw those exact questions in training. What’s the problem?',
    correct: 'Data leakage makes the score misleading',
    wrong: ['The test is too short', 'The model is too fast'],
    explanation: 'If a model has seen the test answers, its score no longer says how it handles new problems.',
  },
  {
    id: 'multi-metric',
    prompt: 'Why report several metrics instead of one overall score?',
    correct: 'Different use cases care about different strengths',
    wrong: ['One metric is always enough', 'It makes charts bigger'],
    explanation: 'A single number hides trade-offs such as accuracy versus speed versus safety.',
  },
]
