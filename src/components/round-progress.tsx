interface Props {
  number: number
  total: number
  className?: string
  compact?: boolean
}

/** "ROUND 3 / 10" with a thin progress bar. */
export function RoundProgress({ number, total, className = '', compact }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`} role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={number} aria-label="Round">
      <span className="whitespace-nowrap font-mono text-sm font-bold tracking-widest text-slate-300">
        ROUND {number} / {total}
      </span>
      <span className={`flex h-2 gap-0.5 ${compact ? 'w-14' : 'w-40'}`} aria-hidden>
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={`h-full flex-1 rounded-full ${i < number ? 'bg-teal' : 'bg-ink-700'}`} />
        ))}
      </span>
    </div>
  )
}
