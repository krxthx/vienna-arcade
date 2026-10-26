import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PUZZLES } from '../src/content/puzzles.ts'

describe('picture puzzles', () => {
  it('every picture clue points at an existing image file', () => {
    const missing = PUZZLES.flatMap((p) => p.tiles)
      .filter((t) => t.image && !existsSync(`public${t.image}`))
      .map((t) => t.image)
    expect(missing).toEqual([])
  })

  it('picture puzzles use images for every tile', () => {
    for (const p of PUZZLES.filter((x) => x.kind === 'rebus')) {
      expect(p.tiles.every((t) => t.image), p.id).toBe(true)
    }
  })
})
