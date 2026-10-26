export type IconKey =
  | 'brain' | 'globe' | 'database' | 'calculator' | 'sparkles' | 'mail' | 'network'
  | 'user-check' | 'clipboard-check' | 'calendar' | 'file-text' | 'terminal' | 'library'
  | 'memory' | 'cpu' | 'gauge' | 'timer' | 'repeat' | 'eye' | 'scale' | 'route'
  | 'search' | 'wrench' | 'quote' | 'shield' | 'zap' | 'bot' | 'users' | 'scissors'
  | 'layers' | 'target' | 'activity' | 'boxes' | 'split' | 'radio' | 'bar-chart'
  | 'message' | 'hash' | 'package' | 'braces' | 'hand' | 'list-checks' | 'alert'
  | 'trophy' | 'coins' | 'arrow-right-left' | 'file-json' | 'bell'

export type Accent = 'blue' | 'violet' | 'teal' | 'orange'
export type Difficulty = 1 | 2 | 3
export type GameId = 'architect' | 'connect'

/* ---------- Game 1: Architect the Agent ---------- */

export type ComponentId =
  | 'llm' | 'web-search' | 'memory' | 'calculator' | 'research-skill' | 'email'
  | 'subagent' | 'database' | 'human-approval' | 'evaluation'
  | 'calendar' | 'file-reader' | 'code-runner' | 'retrieval'

export interface HarnessComponent {
  id: ComponentId
  name: string
  /** Plain-language "what it does", shown on the palette chip. */
  blurb: string
  icon: IconKey
  accent: Accent
}

/** A capability the agent must have. Any one of the `by` components satisfies it. */
export interface Need {
  text: string
  by: ComponentId[]
}

export interface Scenario {
  id: string
  title: string
  /** The mission, in one plain sentence about what the agent is asked to do. */
  job: string
  difficulty: Difficulty
  /** Sockets around the model (at least needs.length). */
  sockets: number
  needs: Need[]
  /** Reasonable extras: never penalised. */
  optional: ComponentId[]
  distractors: ComponentId[]
  /** One line per choice: what it does here, or why it isn't needed. */
  roles: Partial<Record<ComponentId, string>>
  hint: string
  explanation: string
}

export type FeedbackKind = 'met' | 'missing' | 'optional' | 'distractor'

export interface FeedbackItem {
  kind: FeedbackKind
  componentId?: ComponentId
  text: string
}

export type Verdict = 'approved' | 'partial' | 'retry'

export interface HarnessResult {
  score: number
  verdict: Verdict
  feedback: FeedbackItem[]
  /** Status per placed component, keyed by id. */
  /** How each placed component counted. */
  placed: Partial<Record<ComponentId, 'required' | 'optional' | 'distractor'>>
}

/* ---------- Game 2: Find the Connection ---------- */

export interface ClueTile {
  /** Alt text only. It is never shown on screen, since it would give the answer away. */
  label: string
  /** Image under public/, e.g. '/puzzles/corn.jpeg'. */
  image: string
}

export interface Puzzle {
  id: string
  topic: string
  /** Picture clues: say them aloud, in order, to get the term (corn + text + window). */
  tiles: ClueTile[]
  /** The answer players type. Matching ignores case, spaces and hyphens, and forgives small typos. */
  answer: string
  /** Other wordings to accept, such as abbreviations ("HITL") or spelling variants. */
  accept?: string[]
  /** Near misses that must NOT be accepted even though they are close to the answer. */
  reject?: string[]
  /** Hint 1 names the area; hint 2 comes with a fill-in-the-blanks pattern of the answer. */
  hints: [string, string]
  explanation: string
  difficulty: Difficulty
}

/* ---------- Bonus question ---------- */

export interface BonusQuestion {
  id: string
  prompt: string
  /** Options are shuffled at runtime. */
  correct: string
  wrong: [string, string]
  explanation: string
}

/* ---------- Session outcome ---------- */

export interface GameOutcome {
  game: GameId
  title: string
  message: string
  score: number
  learned: string
}

/** One finished round: what it was and how it scored (0-100). */
export interface RoundScore {
  label: string
  score: number
}

/** The whole play session: every round, and how many were passed. */
export interface SessionOutcome {
  game: GameId
  title: string
  message: string
  learned: string
  rounds: RoundScore[]
  passed: number
}

export interface QuizResult {
  correct: number
  total: number
  skipped: boolean
}
