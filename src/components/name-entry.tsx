import { ArrowRight, ArrowLeft } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type FormEvent } from 'react'

import { MAX_NAME_LENGTH } from '../lib/leaderboard'

interface Props {
  gameTitle: string
  initialName?: string
  onSubmit: (name: string) => void
  onBack: () => void
}

export function NameEntry({ gameTitle, initialName = '', onSubmit, onBack }: Props) {
  const [name, setName] = useState(initialName)
  const trimmed = name.trim()

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <motion.form
      onSubmit={submit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-6 text-center"
    >
      <p className="font-mono text-sm font-bold tracking-[0.2em] text-teal">{gameTitle.toUpperCase()}</p>
      <h1 className="text-5xl font-black text-white sm:text-6xl">What’s your name?</h1>
      <label htmlFor="player-name" className="sr-only">
        Your name
      </label>
      <input
        id="player-name"
        autoFocus
        autoComplete="off"
        value={name}
        maxLength={MAX_NAME_LENGTH}
        onChange={(e) => setName(e.target.value)}
        placeholder="Type your name"
        className="min-h-20 w-full select-text rounded-2xl border-2 border-ink-600 bg-ink-900 px-6 text-center text-3xl font-bold text-white placeholder:text-slate-500 focus:border-teal focus:outline-none"
      />
      <div className="flex w-full flex-wrap justify-center gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-16 items-center gap-2 rounded-2xl border-2 border-ink-600 bg-ink-800 px-6 text-lg font-bold hover:border-volt active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden /> Back
        </button>
        <button
          type="submit"
          disabled={!trimmed}
          className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-teal px-10 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          Start <ArrowRight className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </motion.form>
  )
}
