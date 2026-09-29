import { resumeCompleteness } from '../lib/resume.js'

export default function CompletenessMeter({ content, onFix }) {
  const { score, checks } = resumeCompleteness(content)
  const color = score >= 80 ? 'bg-emerald-500' : score >= 55 ? 'bg-amber-500' : 'bg-red-500'
  const failed = checks.filter((c) => !c.ok)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Resume strength</h3>
        <span className={`text-lg font-black ${score >= 80 ? 'text-emerald-600' : score >= 55 ? 'text-amber-600' : 'text-red-600'}`}>{score}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${score}%` }} />
      </div>
      {failed.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {failed.slice(0, 4).map((c) => (
            <li key={c.label}>
              <button onClick={() => onFix?.(c.label)} className="flex w-full items-center gap-2 text-left text-xs text-slate-600 hover:text-blue-600 dark:text-slate-400">
                <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-amber-100 text-[9px] text-amber-700">!</span>
                {c.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {failed.length === 0 && <p className="mt-3 text-xs font-medium text-emerald-600">All checks passed — your resume is in great shape! 🎉</p>}
    </div>
  )
}
