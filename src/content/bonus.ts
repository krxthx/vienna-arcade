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
    id: 'pareto-dominated',
    prompt: 'Config A: fast, 60% quality. Config B: slow, 90%. Config C: slow, 70%. Which one is never worth choosing?',
    correct: 'Config C',
    wrong: ['Config A', 'Config B'],
    explanation: 'C is as slow as B but worse in quality, so B beats it on every axis. A trades quality for speed, so it can still be worth choosing.',
  },
  {
    id: 'streaming-wait',
    prompt: 'A chatbot streams text quickly but the first word takes 6 seconds. Which metric is the problem?',
    correct: 'Time to first token',
    wrong: ['Overall throughput', 'Streaming speed'],
    explanation: 'Users feel the wait before anything appears. Time to first token measures exactly that, separate from how fast text streams after.',
  },
  {
    id: 'test-set-reuse',
    prompt: 'You tuned prompts against one test set for weeks and now score 95% on it. What’s the risk?',
    correct: 'Overfitting',
    wrong: ['Model drift', 'Hallucination'],
    explanation: 'After many rounds of tuning, the test set stops being unseen. Keep a fresh held-out set for the final check.',
  },
  {
    id: 'failure-loop',
    prompt: 'The agent keeps failing the same type of request in production. Best next step?',
    correct: 'Add them to the tests, then fix',
    wrong: ['Rewrite the prompt and ship it', 'Switch to a larger model'],
    explanation: 'Real failures are the best test cases. Adding them first lets you prove the fix works and catch it if it breaks again.',
  },
  {
    id: 'easy-set',
    prompt: 'Two models both score 95% on a test set made only of easy questions. What do you know?',
    correct: 'Little about hard cases',
    wrong: ['They’re equally good on real work', 'Both are ready for production'],
    explanation: 'Easy tests hide weak spots. A good evaluation set includes hard and unusual cases from real use.',
  },
  {
    id: 'leaderboard-leak',
    prompt: 'A public benchmark’s questions are all online. Why might a model’s 91% be misleading?',
    correct: 'It may have seen the questions',
    wrong: ['The scoring may be too strict', 'It may have been quantized'],
    explanation: 'If the test appeared in training data, the score reflects memory rather than ability. Private datasets avoid this.',
  },
  {
    id: 'raw-vs-harness',
    prompt: 'Model X tops a public leaderboard that tests the bare model. Your agent adds tools and memory. Before choosing X, you should…',
    correct: 'Test it inside your own agent',
    wrong: ['Trust the rank; it’s already tested', 'Retrain it on the leaderboard questions'],
    explanation: 'Tools, memory and prompts can lift or hurt a model a lot, so a leaderboard rank doesn’t predict how it will perform inside your agent. Test it in your own setup.',
  },
]
