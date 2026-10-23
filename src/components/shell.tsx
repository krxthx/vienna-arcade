import { Gamepad2, Home, RotateCcw } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

interface ShellProps {
  children: ReactNode
  onHome?: () => void
  onRestart?: () => void
}

const navButton =
  'inline-flex min-h-12 items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 font-semibold text-slate-100 transition hover:border-volt hover:bg-ink-700 active:scale-95'

export function Shell({ children, onHome, onRestart }: ShellProps) {
  return (
    <MotionConfig reducedMotion="user">
        <div className="blueprint relative flex min-h-full flex-col bg-ink-950">
          <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              <Gamepad2 className="h-7 w-7 text-teal" aria-hidden />
              <span className="font-mono text-sm font-bold tracking-[0.25em] text-slate-300">AI ARCADE</span>
            </div>
            <nav className="flex items-center gap-2" aria-label="Game controls">
              {onRestart && (
                <button type="button" className={navButton} onClick={onRestart}>
                  <RotateCcw className="h-5 w-5" aria-hidden /> Restart
                </button>
              )}
              {onHome && (
                <button type="button" className={navButton} onClick={onHome}>
                  <Home className="h-5 w-5" aria-hidden /> Home
                </button>
              )}
            </nav>
          </header>
          <main className="flex flex-1 flex-col px-5 pb-4 sm:px-8">{children}</main>
          <footer className="px-8 py-3 text-center font-mono text-xs tracking-widest text-slate-400">
            POWERED BY PROJECT VIENNA · AI BENCHMARKING &amp; EVALUATION
          </footer>
        </div>
    </MotionConfig>
  )
}
