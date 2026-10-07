import { RemoveBtn } from './shared.jsx'

export default function CustomSectionsEditor({ sections = [], onChange }) {
  const items = Array.isArray(sections) ? sections : []
  const updateSection = (i, patch) =>
    onChange(items.map((s, j) => (j === i ? { ...s, ...patch } : s)))

  return (
    <div className="space-y-4">
      {items.map((s, i) => (
        <div
          key={i}
          className="panel"
          style={{ borderColor: 'var(--border-1)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <input
              value={s.heading || ''}
              placeholder="Section heading (e.g. Awards, Volunteering)"
              onChange={(e) => updateSection(i, { heading: e.target.value })}
              className={`input flex-1 font-semibold`}
            />
            <RemoveBtn
              onClick={() =>
                onChange(items.filter((_, j) => j !== i))
              }
            />
          </div>

          <div className="space-y-3">
            {s.items.map((it, j) => {
              const updateItem = (patch) =>
                updateSection(i, {
                  items: s.items.map((x, k) =>
                    k === j ? { ...x, ...patch } : x
                  ),
                })
              return (
                <div
                  key={j}
                  className="rounded-lg border border-[var(--border-1)] bg-[var(--bg-2)] p-3"
                >
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={it.title || ''}
                      placeholder="Title"
                      onChange={(e) =>
                        updateItem({ title: e.target.value })
                      }
                      className="input"
                    />
                    <input
                      value={it.subtitle || ''}
                      placeholder="Subtitle (issuer, org…)"
                      onChange={(e) =>
                        updateItem({ subtitle: e.target.value })
                      }
                      className="input"
                    />
                    <input
                      value={it.start || ''}
                      placeholder="Start (2023)"
                      onChange={(e) =>
                        updateItem({ start: e.target.value })
                      }
                      className="input"
                    />
                    <input
                      value={it.end || ''}
                      placeholder="End (2024 / Present)"
                      onChange={(e) =>
                        updateItem({ end: e.target.value })
                      }
                      className="input"
                    />
                  </div>
                  <textarea
                    rows={2}
                    value={it.description || ''}
                    placeholder="Short description (optional)"
                    onChange={(e) =>
                      updateItem({ description: e.target.value })
                    }
                    className="input mt-3"
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() =>
                        updateItem({ bullets: [...it.bullets, ''] })
                      }
                      className="btn btn-ghost btn-sm"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mr-1">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      bullet
                    </button>
                    <RemoveBtn
                      onClick={() =>
                        updateSection(i, {
                          items: s.items.filter((_, k) => k !== j),
                        })
                      }
                    />
                  </div>
                  {it.bullets.map((b, k) => (
                    <div key={k} className="mt-2 flex gap-2">
                      <input
                        value={b}
                        onChange={(e) =>
                          updateItem({
                            bullets: it.bullets.map((x, m) =>
                              m === k ? e.target.value : x
                            ),
                          })
                        }
                        className="input flex-1"
                      />
                      <RemoveBtn
                        onClick={() =>
                          updateItem({
                            bullets: it.bullets.filter((_, m) => m !== k),
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>

          <button
            onClick={() =>
              updateSection(i, {
                items: [
                  ...s.items,
                  {
                    title: '',
                    subtitle: '',
                    start: '',
                    end: '',
                    description: '',
                    bullets: [],
                  },
                ],
              })
            }
            className="mt-3 btn btn-ghost btn-sm w-full"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mr-1">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add item to "{s.heading || 'this section'}"
          </button>
        </div>
      ))}
      <button
        onClick={() =>
          onChange([...items, { heading: '', items: [] }])
        }
        className="w-full rounded-xl border-2 border-dashed border-[var(--border-1)] py-3 text-sm font-medium text-[var(--text-1)] transition hover:border-[var(--accent)] hover:text-[var(--accent-2)]"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1.5 shrink-0">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Add custom section
      </button>
    </div>
  )
}
