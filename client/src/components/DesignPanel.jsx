import { ACCENT_COLORS, FONTS, SECTION_KEYS, TEMPLATE_IDS } from '../lib/resume.js'

const LABELS = {
  summary: 'Summary',
  experience: 'Experience',
  education: 'Education',
  projects: 'Projects',
  skills: 'Skills',
  certifications: 'Certifications',
  custom: 'Custom sections',
}

function move(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr
  const next = [...arr]
  const [x] = next.splice(from, 1)
  next.splice(to, 0, x)
  return next
}

export default function DesignPanel({ resume, markDirty }) {
  const order = resume.sectionOrder?.length ? resume.sectionOrder : [...SECTION_KEYS]
  const hidden = new Set(resume.hiddenSections || [])

  const setOrder = (next) => markDirty({ ...resume, sectionOrder: next })
  const toggleHidden = (key) => {
    const h = new Set(resume.hiddenSections || [])
    if (h.has(key)) h.delete(key)
    else h.add(key)
    markDirty({ ...resume, hiddenSections: [...h] })
  }

  return (
    <div className="space-y-5">
      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Template</h3>
        <div className="grid grid-cols-2 gap-2">
          {TEMPLATE_IDS.map((t) => (
            <button
              key={t}
              onClick={() => markDirty({ ...resume, template: t })}
              className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                resume.template === t
                  ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Accent color</h3>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => markDirty({ ...resume, accent: c })}
              className={`h-7 w-7 rounded-full transition ${resume.accent === c ? 'ring-2 ring-slate-400 ring-offset-2 dark:ring-offset-slate-800' : ''}`}
              style={{ backgroundColor: c }}
              aria-label={`Accent ${c}`}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Font</h3>
        <select
          value={resume.font || 'sans'}
          onChange={(e) => markDirty({ ...resume, font: e.target.value })}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Sections (drag-free reorder)</h3>
        <div className="space-y-1.5">
          {order.map((key, i) => (
            <div
              key={key}
              className={`flex items-center justify-between rounded-lg border px-3 py-2 ${
                hidden.has(key) ? 'border-slate-100 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900' : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{LABELS[key] || key}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setOrder(move(order, i, i - 1))} className="rounded px-1.5 py-0.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700" title="Move up">
                  ↑
                </button>
                <button onClick={() => setOrder(move(order, i, i + 1))} className="rounded px-1.5 py-0.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-700" title="Move down">
                  ↓
                </button>
                <button
                  onClick={() => toggleHidden(key)}
                  className={`ml-1 rounded px-2 py-0.5 text-[11px] font-semibold ${
                    hidden.has(key) ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  }`}
                >
                  {hidden.has(key) ? 'Show' : 'Hide'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
