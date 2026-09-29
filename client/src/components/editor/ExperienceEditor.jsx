import { inputCls, labelCls, RemoveBtn, AIButton } from './shared.jsx'

export default function ExperienceEditor({ items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
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
        <div key={i} className="rounded-xl border border-slate-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Role / Title</label>
              <input value={it.role} onChange={(e) => update(i, { role: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Company</label>
              <input value={it.company} onChange={(e) => update(i, { company: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Location</label>
              <input value={it.location} onChange={(e) => update(i, { location: e.target.value })} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className={labelCls}>Start</label>
                <input value={it.start} placeholder="Jan 2020" onChange={(e) => update(i, { start: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>End</label>
                <input value={it.end} placeholder="Present" onChange={(e) => update(i, { end: e.target.value })} className={inputCls} />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <div className="mb-1 flex items-center justify-between">
              <label className={labelCls}>Achievement bullets</label>
              <div className="flex items-center gap-2">
                <AIButton
                  payload={() => ({ bullet: it.bullets.at(-1) || `Worked as ${it.role || 'a professional'}`, tone: 'impactful' })}
                  onResult={(d) => update(i, { bullets: [...it.bullets, d.text] })}
                  label="✨ AI bullet"
                />
                <button onClick={() => update(i, { bullets: [...it.bullets, ''] })} className="text-xs font-semibold text-blue-600 hover:underline">
                  + bullet
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {it.bullets.map((b, j) => (
                <div key={j} className="flex gap-2">
                  <textarea
                    rows={2}
                    value={b}
                    onChange={(e) => update(i, { bullets: it.bullets.map((x, k) => (k === j ? e.target.value : x)) })}
                    className={inputCls}
                  />
                  <RemoveBtn onClick={() => update(i, { bullets: it.bullets.filter((_, k) => k !== j) })} />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex justify-between">
            <div className="flex gap-1">
              <button onClick={() => move(i, -1)} className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">↑</button>
              <button onClick={() => move(i, 1)} className="rounded-md border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50">↓</button>
            </div>
            <button
              onClick={() => onChange(items.filter((_, j) => j !== i))}
              className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
