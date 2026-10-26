import type { BonusQuestion } from '../types'

/** Questions asked in each quiz, drawn at random from the bank below. */
export const QUIZ_LENGTH = 4

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
  {
    id: 'precision',
    prompt: 'A spam filter marks many real emails as spam. Which metric suffers most?',
    correct: 'Precision',
    wrong: ['Latency', 'Context window'],
    explanation: 'Precision asks: of everything flagged, how much was truly spam? Flagging real mail lowers it.',
  },
  {
    id: 'rubric',
    prompt: 'What is a rubric in model evaluation?',
    correct: 'A checklist of criteria used to score answers',
    wrong: ['A kind of GPU', 'A prompt that makes the model faster'],
    explanation: 'Rubrics make grading consistent, whether a person or an LLM judge applies them.',
  },
  {
    id: 'tail-latency',
    prompt: 'Why track slow outliers (like p95 latency) and not just the average?',
    correct: 'A few very slow responses can ruin the user experience',
    wrong: ['Averages are not allowed in reports', 'Outliers make models more accurate'],
    explanation: 'Averages hide the worst cases. Tail latency shows what your unluckiest users feel.',
  },
  {
    id: 'baseline',
    prompt: 'Why compare a new model against a baseline?',
    correct: 'To see whether it is actually an improvement',
    wrong: ['To make it train faster', 'To lower its cost automatically'],
    explanation: 'A score only means something relative to something else, such as your current model.',
  },
  {
    id: 'ab-prompts',
    prompt: 'What does comparing two prompts on the same inputs tell you?',
    correct: 'Which version performs better',
    wrong: ['Which prompt is longer', 'How many GPUs you need'],
    explanation: 'Changing one thing and holding the rest fixed is how you learn what really helped.',
  },
  {
    id: 'safety',
    prompt: 'Besides accuracy, what should you check before launching a chatbot?',
    correct: 'Safety and harmful-output behavior',
    wrong: ['The color of the UI', 'The length of the company name'],
    explanation: 'Good evaluation covers quality, cost, speed and safety, not just correctness.',
  },
  {
    id: 'repeatable',
    prompt: 'Why should an evaluation be repeatable?',
    correct: 'So results can be trusted and compared over time',
    wrong: ['So models memorize the answers', 'So it uses more tokens'],
    explanation: 'If you can’t rerun it and get the same setup, you can’t tell whether things improved.',
  },
  {
    id: 'held-out',
    prompt: 'Why keep a test set separate from the data a model learned from?',
    correct: 'To measure performance on examples it hasn’t seen',
    wrong: ['To make training faster', 'To enlarge the context window'],
    explanation: 'Testing on unseen examples shows how the model handles new situations.',
  },
]
