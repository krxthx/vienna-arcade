import { ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { isValidEmail, MAX_EMAIL_LENGTH, MAX_NAME_LENGTH } from '../lib/leaderboard'

interface Props {
  gameTitle: string
  initialName?: string
  initialEmail?: string
  onSubmit: (name: string, email: string) => void
  onBack: () => void
}

const field =
  'min-h-20 w-full select-text rounded-2xl border-2 border-ink-600 bg-ink-900 px-6 text-center text-3xl font-bold text-white placeholder:text-slate-500 focus:border-teal focus:outline-none'

export function NameEntry({ gameTitle, initialName = '', initialEmail = '', onSubmit, onBack }: Props) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [touched, setTouched] = useState(false)
  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()
  const emailOk = isValidEmail(trimmedEmail)
  const canStart = trimmedName.length > 0 && emailOk

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    if (canStart) onSubmit(trimmedName, trimmedEmail)
  }

  return (
    <motion.form
      onSubmit={submit}
      noValidate
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-5 text-center"
    >
      <p className="font-mono text-sm font-bold tracking-[0.2em] text-teal">{gameTitle.toUpperCase()}</p>
      <h1 className="text-5xl font-black text-white sm:text-6xl">Who’s playing?</h1>
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
        placeholder="Your name"
        className={field}
      />
      <label htmlFor="player-email" className="sr-only">
        Your email
      </label>
      <input
        id="player-email"
        type="email"
        inputMode="email"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        value={email}
        maxLength={MAX_EMAIL_LENGTH}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => email && setTouched(true)}
        placeholder="Your email"
        aria-invalid={touched && !emailOk}
        aria-describedby="email-help"
        className={`${field} ${touched && !emailOk ? 'border-ember' : ''}`}
      />
      <p id="email-help" className={`-mt-2 min-h-6 text-base ${touched && !emailOk ? 'text-ember' : 'text-slate-400'}`} aria-live="polite">
        {touched && !emailOk ? 'Please enter a valid email, like name@company.com' : 'Only your name is shown on the leaderboard.'}
      </p>
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
          disabled={!trimmedName}
          className="inline-flex min-h-16 items-center gap-3 rounded-2xl bg-teal px-10 text-xl font-black text-ink-950 hover:brightness-110 active:scale-95 disabled:opacity-40"
        >
          Start <ArrowRight className="h-6 w-6" aria-hidden />
        </button>
      </div>
    </motion.form>
  )
}
