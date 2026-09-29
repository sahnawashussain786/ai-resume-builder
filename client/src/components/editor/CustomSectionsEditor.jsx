import { inputCls, labelCls, RemoveBtn } from './shared.jsx'

export default function CustomSectionsEditor({ sections = [], onChange }) {
  const items = Array.isArray(sections) ? sections : []
  const updateSection = (i, patch) => onChange(items.map((s, j) => (j === i ? { ...s, ...patch } : s)))

  return (
    <div className="space-y-4">
      {items.map((s, i) => (
        <div key={i} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <div className="mb-3 flex items-center gap-2">
            <input
              value={s.heading}
              placeholder="Section heading (e.g. Awards, Volunteering)"
              onChange={(e) => updateSection(i, { heading: e.target.value })}
              className={`${inputCls} font-semibold`}
            />
            <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
          </div>
          <div className="space-y-3">
            {s.items.map((it, j) => {
              const updateItem = (patch) => updateSection(i, { items: s.items.map((x, k) => (k === j ? { ...x, ...patch } : x)) })
              return (
                <div key={j} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <input value={it.title} placeholder="Title" onChange={(e) => updateItem({ title: e.target.value })} className={inputCls} />
                    <input value={it.subtitle} placeholder="Subtitle (issuer, org…)" onChange={(e) => updateItem({ subtitle: e.target.value })} className={inputCls} />
                    <input value={it.start} placeholder="Start (2023)" onChange={(e) => updateItem({ start: e.target.value })} className={inputCls} />
                    <input value={it.end} placeholder="End (2024 / Present)" onChange={(e) => updateItem({ end: e.target.value })} className={inputCls} />
                  </div>
                  <textarea
                    rows={2}
                    value={it.description}
                    placeholder="Short description (optional)"
                    onChange={(e) => updateItem({ description: e.target.value })}
                    className={`${inputCls} mt-2`}
                  />
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => updateItem({ bullets: [...it.bullets, ''] })}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      + bullet
                    </button>
                    <RemoveBtn onClick={() => updateSection(i, { items: s.items.filter((_, k) => k !== j) })} />
                  </div>
                  {it.bullets.map((b, k) => (
                    <div key={k} className="mt-2 flex gap-2">
                      <input
                        value={b}
                        onChange={(e) => updateItem({ bullets: it.bullets.map((x, m) => (m === k ? e.target.value : x)) })}
                        className={inputCls}
                      />
                      <RemoveBtn onClick={() => updateItem({ bullets: it.bullets.filter((_, m) => m !== k) })} />
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
          <button
            onClick={() => updateSection(i, { items: [...s.items, { title: '', subtitle: '', start: '', end: '', description: '', bullets: [] }] })}
            className="mt-3 text-xs font-semibold text-blue-600 hover:underline"
          >
            + Add item to "{s.heading}"
          </button>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { heading: '', items: [] }])}
        className="w-full rounded-xl border-2 border-dashed border-slate-300 py-3 text-sm font-semibold text-slate-500 transition hover:border-blue-400 hover:text-blue-600 dark:border-slate-600"
      >
        + Add custom section
      </button>
    </div>
  )
}
