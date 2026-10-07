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
    <div className="space-y-6">
      {/* Template */}
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Template
        </div>
        <div className="grid grid-cols-4 gap-2">
          {TEMPLATE_IDS.map((t) => (
            <button
              key={t}
              onClick={() => markDirty({ ...resume, template: t })}
              className={`rounded-lg border py-2 text-sm font-medium capitalize transition ${resume.template === t ? 'border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-2)]' : 'border-[var(--border-1)] text-[var(--text-1)] hover:border-[var(--border-2)] hover:text-[var(--text-0)]'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Accent */}
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Accent color
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCENT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => markDirty({ ...resume, accent: c })}
              className={`h-7 w-7 rounded-full transition ${resume.accent === c ? 'ring-2 ring-[var(--text-0)] ring-offset-2 ring-offset-[var(--bg-2)]' : ''}`}
              style={{ backgroundColor: c }}
              aria-label={`Accent ${c}`}
            />
          ))}
        </div>
      </div>

      {/* Font */}
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Font
        </div>
        <select
          value={resume.font || 'sans'}
          onChange={(e) => markDirty({ ...resume, font: e.target.value })}
          className="input w-full"
        >
          {FONTS.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
      </div>

      {/* Sections */}
      <div>
        <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          Section order
        </div>
        <p className="mb-3 text-xs" style={{ color: 'var(--text-2)' }}>
          Reorder with the arrow buttons. Hidden sections disappear from the preview.
        </p>
        <div className="space-y-1.5">
          {order.map((key, i) => (
            <div
              key={key}
              className={`group flex items-center justify-between rounded-lg border px-3 py-2 transition ${
                hidden.has(key)
                  ? 'border-[var(--border-0)] bg-[var(--bg-1)] opacity-50'
                  : 'border-[var(--border-1)] bg-[var(--bg-2)] hover:border-[var(--border-2)] hover:bg-[var(--bg-3)]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-mono opacity-40" style={{ color: 'var(--text-2)' }}>
                  {i + 1}.
                </span>
                <span
                  className="text-sm font-medium truncate"
                  style={{ color: hidden.has(key) ? 'var(--text-2)' : 'var(--text-0)' }}
                >
                  {LABELS[key] || key}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setOrder(move(order, i, i - 1))}
                  className="btn btn-ghost btn-icon"
                  title="Move up"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
                <button
                  onClick={() => setOrder(move(order, i, i + 1))}
                  className="btn btn-ghost btn-icon"
                  title="Move down"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <button
                  onClick={() => toggleHidden(key)}
                  className={`btn btn-ghost btn-sm btn-icon ml-0.5 ${
                    hidden.has(key)
                      ? 'text-[var(--green)]'
                      : ''
                  }`}
                  title={hidden.has(key) ? 'Show' : 'Hide'}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {hidden.has(key) ? (
                      <>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </>
                    ) : (
                      <>
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
