export function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/** Random item, avoiding `lastId` when there is any alternative. */
export function pickRandom<T extends { id: string }>(items: readonly T[], lastId?: string): T {
  const pool = items.length > 1 ? items.filter((item) => item.id !== lastId) : items
  return pool[Math.floor(Math.random() * pool.length)]
}

/** `count` distinct random items. */
export function pickMany<T>(items: readonly T[], count: number): T[] {
  return shuffle(items).slice(0, count)
}
