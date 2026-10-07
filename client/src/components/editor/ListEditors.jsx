import { inputCls, labelCls, RemoveBtn, AIButton } from './shared.jsx'

export function EducationEditor({ items, onChange }) {
  const update = (i, patch) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="panel"
          style={{ borderColor: 'var(--border-1)' }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label className="field-label">Degree</label>
              <input
                value={it.degree || ''}
                onChange={(e) => update(i, { degree: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">School</label>
              <input
                value={it.school || ''}
                onChange={(e) => update(i, { school: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Start</label>
              <input
                value={it.start || ''}
                onChange={(e) => update(i, { start: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">End</label>
              <input
                value={it.end || ''}
                onChange={(e) => update(i, { end: e.target.value })}
                className="input"
              />
            </div>
            <div className="sm:col-span-2 field">
              <label className="field-label">Notes (GPA, honors…)</label>
              <input
                value={it.notes || ''}
                onChange={(e) => update(i, { notes: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
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

export function ProjectsEditor({ items, onChange }) {
  const update = (i, patch) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div
          key={i}
          className="panel"
          style={{ borderColor: 'var(--border-1)' }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="field">
              <label className="field-label">Name</label>
              <input
                value={it.name || ''}
                onChange={(e) => update(i, { name: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Link</label>
              <input
                value={it.link || ''}
                placeholder="github.com/you/project"
                onChange={(e) => update(i, { link: e.target.value })}
                className="input"
              />
            </div>
            <div className="sm:col-span-2 field">
              <label className="field-label">Description</label>
              <div className="flex items-center justify-between mb-2">
                <span className="field-label">Description</span>
                <AIButton
                  payload={() => ({
                    bullet: it.description || `Project ${it.name}`,
                    tone: 'impactful',
                  })}
                  onResult={(d) => update(i, { description: d.text })}
                  label="AI"
                />
              </div>
              <textarea
                rows={2}
                value={it.description || ''}
                onChange={(e) => update(i, { description: e.target.value })}
                className="input"
              />
            </div>
          </div>
          <div className="mt-3 flex justify-end">
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

export function SkillsEditor({ items, onChange }) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {items.map((s, i) => (
        <div key={i} className="flex gap-2">
          <input
            value={s.name}
            placeholder="Skill name"
            onChange={(e) =>
              onChange(
                items.map((x, j) =>
                  j === i ? { ...x, name: e.target.value } : x
                )
              )
            }
            className="input flex-1"
          />
          <RemoveBtn
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          />
        </div>
      ))}
    </div>
  )
}

export function CertsEditor({ items, onChange }) {
  const update = (i, patch) =>
    onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)))
  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2 flex-wrap">
          <input
            value={it.name}
            placeholder="Certification name"
            onChange={(e) => update(i, { name: e.target.value })}
            className="input flex-1 min-w-[140px]"
          />
          <input
            value={it.issuer}
            placeholder="Issuer"
            onChange={(e) => update(i, { issuer: e.target.value })}
            className="input flex-1 min-w-[100px]"
          />
          <input
            value={it.year}
            placeholder="Year"
            onChange={(e) => update(i, { year: e.target.value })}
            className="input w-[90px]"
          />
          <RemoveBtn
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          />
        </div>
      ))}
    </div>
  )
}
