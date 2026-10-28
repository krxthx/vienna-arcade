import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { PUZZLES } from '../src/content/puzzles.ts'

describe('picture puzzles', () => {
  it('every picture clue points at an existing image file', () => {
    const missing = PUZZLES.flatMap((p) => p.tiles)
      .filter((t) => t.image && !existsSync(`public${t.image}`))
      .map((t) => t.image)
    expect(missing).toEqual([])
  })

  it('has unique challenges with complete clues and hints', () => {
    expect(PUZZLES.length).toBeGreaterThanOrEqual(15)
    expect(new Set(PUZZLES.map((p) => p.id)).size).toBe(PUZZLES.length)
    for (const puzzle of PUZZLES) {
      expect(puzzle.tiles.length, puzzle.id).toBeGreaterThanOrEqual(1)
      expect(puzzle.tiles.length, puzzle.id).toBeLessThanOrEqual(4)
      expect(puzzle.hints.every((hint) => hint.trim().length > 0), puzzle.id).toBe(true)
      expect(puzzle.tiles.every((tile) => tile.label.trim().length > 0), puzzle.id).toBe(true)
    }
  })

  it('joins the pictures as they are, with no letter edits or subtraction', () => {
    for (const puzzle of PUZZLES) {
      for (const tile of puzzle.tiles) expect(Object.keys(tile).sort(), puzzle.id).toEqual(['image', 'label'])
    }
  })

  it('records sources and licenses for every downloaded web image', () => {
    const sources = JSON.parse(readFileSync('public/puzzles/web/sources.json', 'utf8')) as {
      file: string; source: string; license: string; author: string
    }[]
    const images = new Set(PUZZLES.flatMap((p) => p.tiles).map((t) => t.image).filter((path) => path.startsWith('/puzzles/web/')))
    expect(new Set(sources.map((s) => s.file))).toEqual(images)
    for (const source of sources) {
      expect(source.source).toMatch(/^https:\/\//)
      expect(source.license.length).toBeGreaterThan(0)
      expect(source.author.length).toBeGreaterThan(0)
    }
  })
})
