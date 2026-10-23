/** Small technical illustrations for the home cards. Decorative only. */

export function HarnessIllustration() {
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" aria-hidden>
      <g fill="none" strokeWidth="2.5" strokeLinecap="round">
        <path className="flow-dash" stroke="#a07bff" d="M78 75 H122" />
        <path className="flow-dash" stroke="#a07bff" d="M198 75 H242" />
        <path className="flow-dash" stroke="#2de2c4" d="M160 40 V28 H260 V50" />
      </g>
      <rect x="18" y="48" width="60" height="54" rx="12" fill="#101a38" stroke="#5b8cff" strokeWidth="2.5" />
      <path d="M36 75h24M48 63v24" stroke="#5b8cff" strokeWidth="3" strokeLinecap="round" />
      <rect x="122" y="40" width="76" height="70" rx="14" fill="#a07bff" />
      <circle cx="148" cy="68" r="6" fill="#050814" />
      <circle cx="172" cy="68" r="6" fill="#050814" />
      <path d="M144 88h28" stroke="#050814" strokeWidth="4" strokeLinecap="round" />
      <rect x="242" y="48" width="60" height="54" rx="12" fill="#101a38" stroke="#ff8f45" strokeWidth="2.5" />
      <path d="M258 76l10 10 18-22" fill="none" stroke="#ff8f45" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="236" y="14" width="48" height="24" rx="8" fill="#101a38" stroke="#2de2c4" strokeWidth="2" />
      <circle cx="248" cy="26" r="3" fill="#2de2c4" />
      <path d="M256 26h18" stroke="#2de2c4" strokeWidth="2.5" strokeLinecap="round" />
      <g fill="#101a38" stroke="#2b3c70" strokeWidth="2">
        <rect x="40" y="120" width="52" height="16" rx="8" />
        <rect x="102" y="120" width="52" height="16" rx="8" />
        <rect x="164" y="120" width="52" height="16" rx="8" />
      </g>
    </svg>
  )
}

export function ConnectionIllustration() {
  const tiles = [
    { x: 30, y: 20, c: '#2de2c4' },
    { x: 110, y: 20, c: '#5b8cff' },
    { x: 30, y: 82, c: '#ff8f45' },
    { x: 110, y: 82, c: '#a07bff' },
  ]
  return (
    <svg viewBox="0 0 320 150" className="h-full w-full" aria-hidden>
      {tiles.map((t) => (
        <g key={t.c}>
          <rect x={t.x} y={t.y} width="66" height="50" rx="12" fill="#101a38" stroke={t.c} strokeWidth="2.5" />
          <path d={`M${t.x + 16} ${t.y + 25}h34`} stroke={t.c} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <g fill="none" stroke="#2de2c4" strokeWidth="2.5" strokeLinecap="round">
        <path className="flow-dash" d="M176 45 H214" />
        <path className="flow-dash" d="M176 107 H214 V45" />
      </g>
      <circle cx="262" cy="75" r="40" fill="#2de2c4" />
      <path
        d="M244 78l12 12 22-28"
        fill="none"
        stroke="#050814"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="262" y="142" textAnchor="middle" fontSize="13" fontWeight="700" fill="#2de2c4" fontFamily="ui-monospace,monospace">
        ???
      </text>
    </svg>
  )
}
