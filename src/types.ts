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
  /** Connection puzzles: the visible clue. Picture puzzles: alt text only, never shown. */
  label: string
  icon?: IconKey
  /** Picture puzzles: image, e.g. '/puzzles/corn.png' (file in public/puzzles/). Wins over `glyph`. */
  image?: string
  /** Picture puzzles: emoji stand-in used until an image is supplied. */
  glyph?: string
  /** Picture puzzles: optional visible text for a clue a picture can't carry (a quote, say). */
  caption?: string
}

export interface Puzzle {
  id: string
  topic: string
  /** 'rebus': picture clues whose names, said aloud in order, spell an AI term (corn + text + window). */
  kind?: 'connection' | 'rebus'
  tiles: ClueTile[]
  answer: string
  distractors: [string, string]
  /** Hint 1 names the area; hint 2 also removes one wrong answer. */
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

export interface QuizResult {
  correct: number
  total: number
  skipped: boolean
}
