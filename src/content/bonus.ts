import type { BonusQuestion } from '../types'

/** Questions asked in each quiz, drawn at random from the bank below. */
export const QUIZ_LENGTH = 4

/**
 * Vienna quiz bank. Questions follow the ideas on the Project Vienna landing page
 * (model, harness and serving evaluated against real workloads). Each quiz draws
 * QUIZ_LENGTH random questions from here.
 */
export const BONUS_QUESTIONS: BonusQuestion[] = [
  {
    id: 'what-is-harness',
    prompt: 'Two teams use the same model. One agent works, the other flops. What most likely differs?',
    correct: 'The harness: prompts, tools, memory and context',
    wrong: ['The model’s birthday', 'The color of the chat window'],
    explanation: 'A harness is everything around the model. It changes results as much as the model does.',
  },
  {
    id: 'raw-model-score',
    prompt: 'A leaderboard scores a raw model with no tools or memory. Why might that mislead you?',
    correct: 'Your agent will run inside a harness, not raw',
    wrong: ['Raw models can’t be scored', 'Scores only count with a logo'],
    explanation: 'Real agents use prompts, tools and memory. Scoring the model alone ignores a big part of performance.',
  },
  {
    id: 'leakage',
    prompt: 'A model scores 98% on a public benchmark. Its training data included that benchmark. What is this?',
    correct: 'Leakage: the score is inflated',
    wrong: ['A cache hit', 'Quantization'],
    explanation: 'When test questions leak into training, the model remembers instead of reasoning. Private test sets avoid this.',
  },
  {
    id: 'real-workloads',
    prompt: 'Why test on your own real tasks instead of only a generic benchmark?',
    correct: 'Generic tasks may look nothing like your work',
    wrong: ['Real tasks are always easier', 'Benchmarks cost too much to read'],
    explanation: 'A model that wins on trivia can still fail at your multi-step, domain-specific workflow.',
  },
  {
    id: 'three-pillars',
    prompt: 'Quality, cost and speed. Which one is safe to ignore when picking a model?',
    correct: 'None of them',
    wrong: ['Cost, because it’s boring', 'Speed, because users wait'],
    explanation: 'A great answer that is too slow or too expensive still fails. Good evaluation weighs all three.',
  },
  {
    id: 'cost-per-task',
    prompt: 'Model A costs less per token, but needs 5× more tokens to finish a task. Which cost matters?',
    correct: 'Cost per completed task',
    wrong: ['Price per token only', 'Number of letters in the model name'],
    explanation: 'Tokens used times price is what you actually pay. Compare cost per task, not just the sticker price.',
  },
  {
    id: 'ttft',
    prompt: 'A chatbot takes 8 seconds before the first word appears. Which metric shows this?',
    correct: 'Time to first token',
    wrong: ['Temperature', 'Context length'],
    explanation: 'Time to first token is how long a user waits before anything shows up. It shapes how fast an app feels.',
  },
  {
    id: 'throughput',
    prompt: 'A model answers one user quickly, but slows down when 100 users arrive. What should you measure?',
    correct: 'Throughput under load',
    wrong: ['Spelling accuracy', 'Prompt length'],
    explanation: 'Throughput shows how much work a setup handles at once, which matters when many people use it.',
  },
  {
    id: 'consistency',
    prompt: 'The same request gives a great answer once and a bad one the next time. What was missing from the test?',
    correct: 'Consistency across repeated runs',
    wrong: ['A bigger font', 'A longer greeting'],
    explanation: 'AI answers vary. Running a task several times reveals how dependable an agent really is.',
  },
  {
    id: 'pareto',
    prompt: 'Config A is both faster and more accurate than config B. What should you do with B?',
    correct: 'Drop it: A beats it on both',
    wrong: ['Keep it, it’s older', 'Average the two'],
    explanation: 'Only configurations that no other option beats on both speed and quality are worth comparing.',
  },
  {
    id: 'tradeoff',
    prompt: 'The most accurate setup is slow and costly. The next one is a bit less accurate, but twice as fast and half the cost. What now?',
    correct: 'Weigh the trade-off against what the use case needs',
    wrong: ['Always pick the most accurate', 'Always pick the cheapest'],
    explanation: 'There is rarely one best setup. The right one depends on how much speed and cost matter for the job.',
  },
  {
    id: 'hidden-serving',
    prompt: 'Two providers serve the same model, but one answers faster and cheaper. What could explain it?',
    correct: 'Different serving setup, like quantization or GPUs',
    wrong: ['The model is secretly different words', 'Faster servers read less'],
    explanation: 'Quantization, batching and GPU choice change speed, cost and sometimes quality, even for the same model.',
  },
  {
    id: 'quantization',
    prompt: 'What does quantization do to a model?',
    correct: 'Shrinks its numbers to run cheaper and faster',
    wrong: ['Adds more training data', 'Makes it multilingual'],
    explanation: 'Using lower-precision numbers saves memory and cost, but it should be checked so quality doesn’t drop.',
  },
  {
    id: 'gpu-memory',
    prompt: 'A model is too big for your GPU. What is the likely problem?',
    correct: 'Not enough GPU memory',
    wrong: ['The screen is too small', 'The prompt is too polite'],
    explanation: 'Models must fit in GPU memory, with room for context and many users. It’s a key part of hardware choice.',
  },
  {
    id: 'golden-set',
    prompt: 'You tweak the agent and want to know if it got better or worse. What do you compare against?',
    correct: 'A baseline run on the same evaluation pack',
    wrong: ['How it feels', 'The last chat you had'],
    explanation: 'A fixed pack of tasks with verified answers lets you compare each change against the baseline.',
  },
  {
    id: 'telemetry',
    prompt: 'Your agent is live and users’ tasks keep changing. How can it keep improving?',
    correct: 'Learn from real usage traces and re-evaluate',
    wrong: ['Never touch it again', 'Ask users to type less'],
    explanation: 'Production traces show recurring failures and waste. Feeding them back into evaluation closes the loop.',
  },
  {
    id: 'routing',
    prompt: 'Easy questions don’t need your biggest model. What helps?',
    correct: 'Routing each request to a suitable model',
    wrong: ['Using the biggest model for all', 'Deleting easy questions'],
    explanation: 'Multi-model routing sends simple tasks to cheaper models and saves the big one for hard cases.',
  },
  {
    id: 'data-residency',
    prompt: 'A customer’s data must stay in one country. How does this change model choice?',
    correct: 'Only models allowed in that region are candidates',
    wrong: ['It doesn’t', 'Any model works if it’s fast'],
    explanation: 'Data location rules can limit which models and providers you may use, so evaluation starts there.',
  },
  {
    id: 'hybrid',
    prompt: 'When might running AI partly on your own hardware beat running it all in the cloud?',
    correct: 'When control, data location or cost favor it',
    wrong: ['Never', 'Only when the cloud is down'],
    explanation: 'Hybrid setups balance control, performance and economics. Evaluating both shows which fits.',
  },
  {
    id: 'ground-truth',
    prompt: 'What makes an evaluation answer key trustworthy?',
    correct: 'Verified answers and clear graders',
    wrong: ['The longest answer wins', 'Whatever the model said first'],
    explanation: 'A good evaluation checks results against known-correct answers using clear, repeatable grading.',
  },
  {
    id: 'sample-size',
    prompt: 'Why test on many examples instead of just one?',
    correct: 'One result can be luck; many show the pattern',
    wrong: ['It makes the model smarter', 'It reduces latency'],
    explanation: 'A bigger, varied test set gives a more trustworthy picture of performance.',
  },
]
