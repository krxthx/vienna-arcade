import { Home, RotateCcw } from 'lucide-react'
import { MotionConfig } from 'motion/react'
import { ElapsedTimer } from './elapsed-timer'
import type { ReactNode } from 'react'

interface ShellProps {
  children: ReactNode
  /** When set, a running timer is shown in the header. */
  timerStart?: number
  onHome?: () => void
  onRestart?: () => void
}

const navButton =
  'inline-flex min-h-12 items-center gap-2 rounded-xl border border-ink-600 bg-ink-800 px-4 font-semibold text-slate-100 transition hover:border-volt hover:bg-ink-700 active:scale-95'

export function Shell({ children, timerStart, onHome, onRestart }: ShellProps) {
  return (
    <MotionConfig reducedMotion="user">
        <div className="blueprint relative flex min-h-full flex-col bg-ink-950">
          <header className="flex items-center justify-between gap-3 px-5 py-4 sm:px-8">
            <div className="flex items-center gap-3">
              {/* Light variant of the logo: the original artwork is dark and vanishes on the navy page. */}
              <img src="/brand/vienna-logo-light.svg" alt="Project Vienna" className="h-14 w-auto" draggable={false} />
            </div>
            <nav className="flex items-center gap-2" aria-label="Game controls">
              {timerStart !== undefined && <ElapsedTimer startedAt={timerStart} />}
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
