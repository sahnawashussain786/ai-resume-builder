import { inputCls, labelCls, RemoveBtn, AIButton } from './shared.jsx'

export default function ExperienceEditor({ items, onChange }) {
  const update = (i, patch) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  const move = (i, dir) => {
    if (i + dir < 0 || i + dir >= items.length) return
    const next = [...items]
    const [x] = next.splice(i, 1)
    next.splice(i + dir, 0, x)
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {items.map((it, i) => (
        <div
          key={i}
          className="panel"
          style={{ borderColor: 'var(--border-1)' }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label className="field-label">Role / Title</label>
              <input
                value={it.role || ''}
                onChange={(e) => update(i, { role: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Company</label>
              <input
                value={it.company || ''}
                onChange={(e) => update(i, { company: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Location</label>
              <input
                value={it.location || ''}
                onChange={(e) => update(i, { location: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">End</label>
              <input
                value={it.end || ''}
                placeholder="Present"
                onChange={(e) => update(i, { end: e.target.value })}
                className="input"
              />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="field-label">Achievement bullets</span>
              <div className="flex items-center gap-2">
                <AIButton
                  payload={() => ({
                    bullet:
                      it.bullets.at(-1) ||
                      `Worked as ${it.role || 'a professional'}`,
                    tone: 'impactful',
                  })}
                  onResult={(d) =>
                    update(i, { bullets: [...it.bullets, d.text] })
                  }
                  label="AI bullet"
                />
                <button
                  onClick={() => update(i, { bullets: [...it.bullets, ''] })}
                  className="btn btn-ghost btn-sm"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mr-1">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  bullet
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {it.bullets.map((b, j) => (
                <div key={j} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={b}
                    onChange={(e) =>
                      update(i, {
                        bullets: it.bullets.map((x, k) =>
                          k === j ? e.target.value : x
                        ),
                      })
                    }
                    className="input flex-1"
                  />
                  <RemoveBtn
                    onClick={() =>
                      update(i, {
                        bullets: it.bullets.filter((_, k) => k !== j),
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-1">
              <button
                onClick={() => move(i, -1)}
                className="btn btn-ghost btn-sm"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="18 15 12 9 6 15" />
                </svg>
                Up
              </button>
              <button
                onClick={() => move(i, 1)}
                className="btn btn-ghost btn-sm"
              >
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                Down
              </button>
            </div>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="btn btn-danger btn-sm"
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mr-1">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
