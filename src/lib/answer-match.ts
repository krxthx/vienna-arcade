import type { Puzzle } from '../types.ts'

/** "Human-in-the-Loop" -> "humanintheloop": ignores case, accents, spaces, hyphens and punctuation. */
export function normalizeAnswer(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]/g, '')
}

/** Edit distance counting insert, delete, replace and swapping two neighbouring letters as one step. */
export function editDistance(a: string, b: string): number {
  const rows = a.length + 1
  const cols = b.length + 1
  const d: number[][] = Array.from({ length: rows }, (_, i) => [i, ...Array<number>(cols - 1).fill(0)])
  for (let j = 0; j < cols; j++) d[0][j] = j
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1)
      }
    }
  }
  return d[a.length][b.length]
}

/** How many typos we forgive grows with the length of the answer. Very short ones must be exact. */
export function allowedTypos(length: number): number {
  if (length <= 3) return 0
  if (length <= 8) return 1
  if (length <= 14) return 2
  return 3
}

/** Is `input` an acceptable answer to this puzzle, allowing for small spelling mistakes? */
export function isAnswerCorrect(input: string, puzzle: Pick<Puzzle, 'answer' | 'accept' | 'reject'>): boolean {
  const typed = normalizeAnswer(input)
  if (typed.length === 0) return false
  if ((puzzle.reject ?? []).some((r) => normalizeAnswer(r) === typed)) return false
  return [puzzle.answer, ...(puzzle.accept ?? [])].some((candidate) => {
    const target = normalizeAnswer(candidate)
    return editDistance(typed, target) <= allowedTypos(target.length)
  })
}

/** "Human-in-the-Loop" -> "H____ __ ___ L___": first letter of each word, blanks for the rest. */
export function answerPattern(answer: string): string {
  return answer
    .split(/(\s+|-)/)
    .map((part) => (/^[\s-]+$/.test(part) ? part : part[0] + '_'.repeat(Math.max(0, part.length - 1))))
    .join('')
}
