import type { BonusQuestion } from '../types'

/** Questions asked in each quiz, drawn at random from the bank below. */
export const QUIZ_LENGTH = 4

/**
 * Vienna quiz bank. Questions follow the ideas on the Project Vienna landing page
 * and the Project Vienna overview deck (model, harness and serving evaluated against real workloads). Each quiz draws
 * QUIZ_LENGTH random questions from here.
 */
export const BONUS_QUESTIONS: BonusQuestion[] = [
  {
    id: 'what-is-harness',
    prompt: 'Two teams use the same model. One agent works well, the other flops. What most likely differs?',
    correct: 'The harness',
    wrong: ['The training data', 'The release date'],
    explanation: 'The harness is everything around the model: prompts, tools and memory. It changes results as much as the model does.',
  },
  {
    id: 'raw-model-score',
    prompt: 'A leaderboard tests models with no tools and no memory. What’s the catch?',
    correct: 'Real agents use both',
    wrong: ['Tools lower accuracy', 'Memory costs extra'],
    explanation: 'Real agents run inside a harness. Scoring the bare model ignores a big part of how they perform.',
  },
  {
    id: 'leakage',
    prompt: 'A model aces a benchmark it already saw in training. What is this called?',
    correct: 'Data leakage',
    wrong: ['Model drift', 'Prompt injection'],
    explanation: 'When test questions leak into training, the model remembers instead of reasoning, so the score is inflated.',
  },
  {
    id: 'real-workloads',
    prompt: 'A model tops a public benchmark, then fails your task. Why?',
    correct: 'Different kind of work',
    wrong: ['Outdated results', 'Random bad luck today'],
    explanation: 'General benchmarks rarely look like your real, multi-step, domain-specific workflow.',
  },
  {
    id: 'three-pillars',
    prompt: 'You’re comparing two models. Which trio do you weigh?',
    correct: 'Quality, cost, speed',
    wrong: ['Quality, size, age', 'Cost, brand, fame'],
    explanation: 'A great answer that is too slow or too expensive still fails, so evaluation weighs all three.',
  },
  {
    id: 'cost-per-task',
    prompt: 'Model A costs half as much per token as model B, but uses 3× the tokens per task. Which costs less per task?',
    correct: 'Model B',
    wrong: ['Model A', 'The same'],
    explanation: 'A pays 0.5 × 3 = 1.5 units per task; B pays 1. Compare cost per completed task, not the sticker price.',
  },
  {
    id: 'latency',
    prompt: 'A model is 95% accurate but takes 20 seconds to answer. What else should you evaluate?',
    correct: 'Latency',
    wrong: ['Temperature', 'Context window'],
    explanation: 'Accuracy isn’t enough. Speed, cost and reliability matter in real products.',
  },
  {
    id: 'throughput',
    prompt: 'One user gets fast answers, but 100 users bring it to a crawl. What do you measure?',
    correct: 'Throughput',
    wrong: ['Temperature', 'Accuracy'],
    explanation: 'Throughput shows how much work a setup handles at once, which matters when many people use it.',
  },
  {
    id: 'consistency',
    prompt: 'The same request gets a great answer once and a poor one next time. What did your test miss?',
    correct: 'Repeat runs',
    wrong: ['A bigger model', 'A longer prompt'],
    explanation: 'AI answers vary. Running a task several times shows how dependable an agent really is.',
  },
  {
    id: 'tradeoff',
    prompt: 'Config A is faster but a little less accurate than config B. Is B simply better?',
    correct: 'Depends on the job',
    wrong: ['Yes, speed wins', 'Yes, accuracy wins'],
    explanation: 'There is rarely one best setup. How much speed, cost and accuracy matter depends on the use case.',
  },
  {
    id: 'hidden-serving',
    prompt: 'Same model, two providers. One is faster and cheaper. Why?',
    correct: 'A different serving setup',
    wrong: ['A smaller training set', 'A different model name'],
    explanation: 'Quantization, batching and GPU choice change speed, cost and sometimes quality, even for the same model.',
  },
  {
    id: 'quantization',
    prompt: 'Quantizing a model mainly makes it…',
    correct: 'Cheaper to run',
    wrong: ['Better at math', 'Less secure'],
    explanation: 'Lower-precision numbers save memory and cost, but quality should be re-checked so it doesn’t drop.',
  },
  {
    id: 'gpu-memory',
    prompt: 'Your model won’t load onto the GPU. What’s the likely cause?',
    correct: 'Not enough memory',
    wrong: ['A slow network link', 'A long prompt'],
    explanation: 'A model has to fit in GPU memory, with room left for context and many users.',
  },
  {
    id: 'golden-set',
    prompt: 'You tweak a prompt. How do you check it actually helped?',
    correct: 'Rerun the same test set',
    wrong: ['Try a few chats by hand', 'Ask colleagues what they think'],
    explanation: 'A fixed set of tasks with verified answers lets you compare every change against the baseline.',
  },
  {
    id: 'telemetry',
    prompt: 'How does a live agent keep getting better?',
    correct: 'Learn from real usage',
    wrong: ['Retrain every week', 'Freeze it after launch'],
    explanation: 'Production traces show recurring failures and waste. Feeding them back into evaluation closes the loop.',
  },
  {
    id: 'routing',
    prompt: 'Easy questions don’t need your biggest model. What saves money?',
    correct: 'Model routing',
    wrong: ['Shorter answers', 'A bigger cache'],
    explanation: 'Routing sends simple tasks to cheaper models and saves the big one for hard cases.',
  },
  {
    id: 'data-residency',
    prompt: 'A customer’s data must stay in one country. What changes?',
    correct: 'Which models you can use',
    wrong: ['Only the bill', 'The prompt wording style'],
    explanation: 'Data location rules can limit which models and providers are allowed, so evaluation starts there.',
  },
  {
    id: 'hybrid',
    prompt: 'Why would a team mix its own hardware with the cloud?',
    correct: 'Control and cost',
    wrong: ['Access to newer models', 'Free GPUs'],
    explanation: 'Hybrid setups balance control, data location, performance and economics. Evaluating both shows which fits.',
  },
  {
    id: 'ground-truth',
    prompt: 'In an evaluation, what is the “ground truth”?',
    correct: 'The known right answer',
    wrong: ['The model’s best guess', 'The average score'],
    explanation: 'Ground truth is the trusted answer that the model’s output is graded against.',
  },
  {
    id: 'sample-size',
    prompt: 'Why test on many examples instead of just one?',
    correct: 'One result can be luck',
    wrong: ['Models learn from tests', 'Tests run faster'],
    explanation: 'A bigger, varied test set gives a more trustworthy picture of performance.',
  },
  {
    id: 'baseline',
    prompt: 'Why compare a new setup against a baseline?',
    correct: 'To see if it improved',
    wrong: ['To lower its cost', 'To shorten the prompts'],
    explanation: 'Without a baseline you can’t tell whether a change made things better, worse or no different.',
  },
  {
    id: 'llm-judge',
    prompt: 'What does an “LLM judge” do?',
    correct: 'Grades answers by rubric',
    wrong: ['Writes the test prompts', 'Speeds up the model'],
    explanation: 'A judge model applies grading criteria at scale, which helps when answers are free text.',
  },
  {
    id: 'pareto-frontier',
    prompt: 'On a speed-versus-quality chart of configs, which ones are worth considering?',
    correct: 'Ones nothing else beats',
    wrong: ['The cheapest ones', 'The newest ones'],
    explanation: 'The Pareto frontier is the set of configs that no other config beats on both speed and quality. Everything else can be dropped.',
  },
  {
    id: 'many-settings',
    prompt: 'A model has 15+ settings that change how it performs. What makes that hard for a customer?',
    correct: 'Too many combinations',
    wrong: ['Too little data', 'Too few models'],
    explanation: 'Model, harness and hardware settings multiply into far more combinations than anyone can test by hand.',
  },
  {
    id: 'black-box-score',
    prompt: 'A leaderboard shows a score but not how it was worked out. What is the risk?',
    correct: 'It may not fit your use',
    wrong: ['It will be too high', 'It is out of date'],
    explanation: 'Without knowing how a score is derived, you can’t tell how it maps to your own use case.',
  },
]
