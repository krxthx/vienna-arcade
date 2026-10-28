import type { BonusQuestion } from '../types'

/** How many questions each quiz asks is set in src/config.ts. */

/**
 * Vienna quiz bank. Questions follow the ideas on the Project Vienna landing page
 * and the Project Vienna overview deck (model, harness and serving evaluated against real workloads). Each quiz draws
 * random questions from here.
 */
export const BONUS_QUESTIONS: BonusQuestion[] = [
  {
    id: 'cost-per-task',
    prompt: 'Model A costs $2 per million tokens and uses 3M tokens on a task. Model B costs $5 per million and uses 1M. Which is cheaper per task?',
    correct: 'Model B',
    wrong: ['Model A', 'They tie'],
    explanation: 'A costs $6 per task, B costs $5. The cheaper price per token isn’t always the cheaper task, so compare cost per completed task.',
  },
  {
    id: 'compounding',
    prompt: 'An agent succeeds on 9 of every 10 runs. A workflow needs 5 such runs in a row, all succeeding. Roughly how often does it finish?',
    correct: 'About 59%',
    wrong: ['About 90%', 'About 75%'],
    explanation: 'Each step multiplies: 0.9 × 0.9 × 0.9 × 0.9 × 0.9 ≈ 0.59. Small per-step failures add up in multi-step agents.',
  },
  {
    id: 'batching',
    prompt: 'A team packs many more requests onto each GPU at once. What usually happens?',
    correct: 'Cheaper, but slower',
    wrong: ['Faster and cheaper', 'Slower and costlier'],
    explanation: 'Batching raises throughput and cuts cost per request, but each user can wait longer. It is a classic trade-off.',
  },
  {
    id: 'quantization',
    prompt: 'Cutting a model from 16-bit to 4-bit numbers usually…',
    correct: 'Saves memory, risks quality',
    wrong: ['Saves memory, gains accuracy', 'Costs memory, saves time'],
    explanation: 'Lower precision shrinks the model and speeds it up, but accuracy can drop, so re-test after quantizing.',
  },
  {
    id: 'pareto-dominated',
    prompt: 'Config A: fast, 60% quality. Config B: slow, 90%. Config C: slow, 70%. Which one is never worth choosing?',
    correct: 'Config C',
    wrong: ['Config A', 'Config B'],
    explanation: 'C is as slow as B but worse in quality, so B beats it on every axis. A trades quality for speed, so it can still be worth choosing.',
  },
  {
    id: 'small-sample',
    prompt: 'Model A beats model B on 6 of 10 test questions. What can you say?',
    correct: 'Not enough to tell',
    wrong: ['A is clearly better', 'B is clearly worse'],
    explanation: 'With 10 questions, 6 to 4 can easily be luck. You need many more varied examples before drawing a conclusion.',
  },
  {
    id: 'within-noise',
    prompt: 'After a prompt change, accuracy goes from 70% to 72% on a 50-question test. What’s the fair reading?',
    correct: 'Could be noise',
    wrong: ['A real improvement', 'A real regression'],
    explanation: 'Two points on 50 questions is one or two questions. Without a bigger test set you can’t separate it from chance.',
  },
  {
    id: 'length-bias',
    prompt: 'An LLM judge keeps scoring longer answers higher, even when they’re no better. What is this?',
    correct: 'Length bias',
    wrong: ['Data leakage', 'Model drift'],
    explanation: 'Judges can favor style over substance, so a rubric and spot checks by humans keep scoring honest.',
  },
  {
    id: 'streaming-wait',
    prompt: 'A chatbot streams text quickly but the first word takes 6 seconds. Which metric is the problem?',
    correct: 'Time to first token',
    wrong: ['Overall throughput', 'Answer accuracy'],
    explanation: 'Users feel the wait before anything appears. Time to first token measures exactly that, separate from how fast text streams after.',
  },
  {
    id: 'overnight-batch',
    prompt: 'A job summarizes a million documents overnight. Which metric matters most?',
    correct: 'Throughput',
    wrong: ['Time to first token', 'Streaming speed'],
    explanation: 'Nobody watches the first token of a batch job. What counts is how much work finishes in the time available.',
  },
  {
    id: 'hidden-quant',
    prompt: 'Two providers sell the same-named model. One is 3× cheaper, and its answers are worse. Likely cause?',
    correct: 'Heavier quantization',
    wrong: ['A different prompt', 'More training'],
    explanation: 'Serving choices like quantization, batching and GPUs are often undisclosed, and they change cost, speed and quality.',
  },
  {
    id: 'residency',
    prompt: 'Customer rule: data must stay in the EU. Which candidate model drops out first?',
    correct: 'The US-only hosted one',
    wrong: ['The largest one', 'The cheapest one'],
    explanation: 'Data-location rules limit which models and providers are allowed, so evaluation starts with what is permitted.',
  },
  {
    id: 'gpu-fit',
    prompt: 'A 70B-parameter model needs about 140 GB at 16-bit. Your GPU has 80 GB. What fixes it?',
    correct: 'Quantize or add GPUs',
    wrong: ['Shorten the prompts', 'Add more CPUs'],
    explanation: 'The weights alone must fit in GPU memory, with room left for context. Shrinking them or sharing across GPUs are the options.',
  },
  {
    id: 'temperature',
    prompt: 'The same prompt gives different answers every run. Which setting most affects this?',
    correct: 'Temperature',
    wrong: ['Context window', 'Batch size'],
    explanation: 'Temperature controls how random the sampling is. Lower values give steadier, more repeatable answers.',
  },
  {
    id: 'test-set-reuse',
    prompt: 'You tuned prompts against one test set for weeks and now score 95% on it. What’s the risk?',
    correct: 'Overfitting',
    wrong: ['A stale model', 'Higher latency'],
    explanation: 'After many rounds of tuning, the test set stops being unseen. Keep a fresh held-out set for the final check.',
  },
  {
    id: 'failure-loop',
    prompt: 'The agent keeps failing the same type of request in production. Best next step?',
    correct: 'Add them to the tests',
    wrong: ['Switch to a bigger model', 'Wait for a new model'],
    explanation: 'Real failures are the best test cases. Adding them lets every future change be checked against what actually goes wrong.',
  },
  {
    id: 'vibes',
    prompt: 'A team picks a model after trying three prompts and liking the answers. What’s missing?',
    correct: 'A fixed test set',
    wrong: ['A longer live demo', 'A much bigger model'],
    explanation: 'A handful of impressions can’t be compared or repeated. A fixed set of tasks with known answers can.',
  },
  {
    id: 'new-version',
    prompt: 'A new version of your model is released. Do you need to re-evaluate?',
    correct: 'Yes, on the same tests',
    wrong: ['No, newer is better', 'Only if it costs less'],
    explanation: 'New versions can improve some things and break others. Re-running the same tests shows what changed for your workload.',
  },
  {
    id: 'easy-set',
    prompt: 'Your test set contains only easy questions. What happens to the score?',
    correct: 'It looks inflated',
    wrong: ['It looks deflated', 'It stays accurate'],
    explanation: 'Easy tests hide weak spots. A good evaluation set includes hard and unusual cases from real use.',
  },
  {
    id: 'harness-part',
    prompt: 'Which of these belongs to the harness, not the model?',
    correct: 'Tool and memory setup',
    wrong: ['The model’s weights', 'The training data'],
    explanation: 'The harness is everything around the model: prompts, tools, memory and context handling.',
  },
  {
    id: 'prompt-growth',
    prompt: 'An agent’s prompt grows from 2,000 to 20,000 tokens. What usually happens?',
    correct: 'Both rise',
    wrong: ['Only cost rises', 'Neither changes'],
    explanation: 'Longer inputs mean more tokens to process, which costs more and takes longer.',
  },
  {
    id: 'on-prem',
    prompt: 'Which workload is the best fit for your own hardware?',
    correct: 'Steady and sensitive',
    wrong: ['Rare, bursty, public data', 'One-off experiments'],
    explanation: 'Owning hardware pays off when use is constant and data is sensitive. Spiky or experimental work suits the cloud.',
  },
  {
    id: 'leaderboard-leak',
    prompt: 'A public benchmark’s questions are all online. Why might a model’s 91% be misleading?',
    correct: 'It may have seen them',
    wrong: ['It may be too slow', 'It may be too costly'],
    explanation: 'If the test appeared in training data, the score reflects memory rather than ability. Private datasets avoid this.',
  },
  {
    id: 'raw-vs-harness',
    prompt: 'A leaderboard tests the bare model with no tools or memory. Your product uses both. The gap could be…',
    correct: 'Often large',
    wrong: ['Always small', 'Always zero'],
    explanation: 'Tools, memory and prompts can lift or hurt a model a lot, so raw scores don’t predict how your agent will perform.',
  },
]
