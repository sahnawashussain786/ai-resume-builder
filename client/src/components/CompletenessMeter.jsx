import { resumeCompleteness } from '../lib/resume.js'
import { useMemo } from 'react'

export default function CompletenessMeter({ content, onFix }) {
  const { score, checks } = useMemo(() => resumeCompleteness(content), [content])
  const failed = useMemo(() => checks.filter((c) => !c.ok), [checks])

  const barColor =
    score >= 80
      ? 'var(--green)'
      : score >= 55
      ? 'var(--amber)'
      : 'var(--red)'

  return (
    <div className="panel">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Resume strength
        </span>
        <span
          className="text-lg font-bold"
          style={{ color: barColor }}
        >
          {score}%
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--bg-3)' }}>
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${barColor}88, ${barColor})`,
            boxShadow: `0 0 12px ${barColor}55`,
          }}
        />
      </div>
      {failed.length > 0 && (
        <ul className="mt-4 space-y-2">
          {failed.slice(0, 4).map((c) => (
            <li key={c.label}>
              <button
                onClick={() => onFix?.(c.label)}
                className="flex w-full items-center gap-2 rounded-lg bg-[var(--bg-3)] px-3 py-2 text-xs transition hover:bg-[var(--bg-hover)]"
                style={{ color: 'var(--text-1)' }}
              >
                <span className="shrink-0 rounded-full bg-[rgba(245,158,11,0.15)] p-0.5" style={{ color: 'var(--amber)' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 9v4" />
                    <path d="M12 17h.01" />
                  </svg>
                </span>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {failed.length === 0 && (
        <p className="mt-3 text-xs font-medium" style={{ color: 'var(--green)' }}>
          All checks passed — your resume is in great shape.
        </p>
      )}
    </div>
  )
}
