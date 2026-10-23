import type { ComponentId, HarnessComponent } from '../types'

export const HARNESS_COMPONENTS: Record<ComponentId, HarnessComponent> = {
  llm: { id: 'llm', name: 'The Model', blurb: 'The AI brain at the center', icon: 'brain', accent: 'violet' },
  'web-search': { id: 'web-search', name: 'Web Search', blurb: 'Looks things up online', icon: 'globe', accent: 'blue' },
  memory: { id: 'memory', name: 'Memory', blurb: 'Remembers earlier conversation', icon: 'memory', accent: 'teal' },
  calculator: { id: 'calculator', name: 'Calculator', blurb: 'Does exact math', icon: 'calculator', accent: 'orange' },
  'research-skill': { id: 'research-skill', name: 'Research Skill', blurb: 'A saved how-to for researching', icon: 'sparkles', accent: 'violet' },
  email: { id: 'email', name: 'Email Tool', blurb: 'Sends emails', icon: 'mail', accent: 'orange' },
  subagent: { id: 'subagent', name: 'Subagent', blurb: 'A helper AI for a side task', icon: 'network', accent: 'teal' },
  database: { id: 'database', name: 'Database', blurb: 'Stores and looks up records', icon: 'database', accent: 'blue' },
  'human-approval': { id: 'human-approval', name: 'Human Approval', blurb: 'A person says yes or no first', icon: 'user-check', accent: 'orange' },
  evaluation: { id: 'evaluation', name: 'Evaluation', blurb: 'Checks answers for quality', icon: 'clipboard-check', accent: 'teal' },
  calendar: { id: 'calendar', name: 'Calendar Tool', blurb: 'Reads and books time slots', icon: 'calendar', accent: 'blue' },
  'file-reader': { id: 'file-reader', name: 'File Reader', blurb: 'Opens PDFs and documents', icon: 'file-text', accent: 'teal' },
  'code-runner': { id: 'code-runner', name: 'Code Runner', blurb: 'Runs code and tests', icon: 'terminal', accent: 'orange' },
  retrieval: { id: 'retrieval', name: 'Doc Search', blurb: 'Searches your own documents', icon: 'library', accent: 'blue' },
}
