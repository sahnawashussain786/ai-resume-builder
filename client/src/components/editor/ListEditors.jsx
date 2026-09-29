import { inputCls, labelCls, RemoveBtn, AIButton } from './shared.jsx'

export function EducationEditor({ items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-slate-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Degree</label>
              <input value={it.degree} onChange={(e) => update(i, { degree: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>School</label>
              <input value={it.school} onChange={(e) => update(i, { school: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Start</label>
              <input value={it.start} onChange={(e) => update(i, { start: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>End</label>
              <input value={it.end} onChange={(e) => update(i, { end: e.target.value })} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Notes (GPA, honors…)</label>
              <input value={it.notes} onChange={(e) => update(i, { notes: e.target.value })} className={inputCls} />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProjectsEditor({ items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-xl border border-slate-200 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>Name</label>
              <input value={it.name} onChange={(e) => update(i, { name: e.target.value })} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Link</label>
              <input value={it.link} placeholder="github.com/you/project" onChange={(e) => update(i, { link: e.target.value })} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className={labelCls}>Description</label>
                <AIButton
                  payload={() => ({ bullet: it.description || `Project ${it.name}`, tone: 'impactful' })}
                  onResult={(d) => update(i, { description: d.text })}
                  label="✨ AI"
                />
              </div>
              <textarea
                rows={2}
                value={it.description}
                onChange={(e) => update(i, { description: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            <button onClick={() => onChange(items.filter((_, j) => j !== i))} className="rounded-md px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SkillsEditor({ items, onChange }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={s.name}
            placeholder="Skill name"
            onChange={(e) => onChange(items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))}
            className={inputCls}
          />
          <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
    </div>
  )
}

export function CertsEditor({ items, onChange }) {
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input value={it.name} placeholder="Certification name" onChange={(e) => update(i, { name: e.target.value })} className={inputCls} />
          <input value={it.issuer} placeholder="Issuer" onChange={(e) => update(i, { issuer: e.target.value })} className={inputCls} />
          <input value={it.year} placeholder="Year" onChange={(e) => update(i, { year: e.target.value })} className={`${inputCls} max-w-[90px]`} />
          <RemoveBtn onClick={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
    </div>
  )
}
