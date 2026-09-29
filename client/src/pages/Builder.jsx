import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent, emptyResume, ACCENT_COLORS } from '../lib/resume.js'
import PreviewPane from '../components/PreviewPane.jsx'
import exportPdf from '../lib/exportPdf.js'
import { inputCls, labelCls, SectionCard, AIButton } from '../components/editor/shared.jsx'
import ExperienceEditor from '../components/editor/ExperienceEditor.jsx'
import { EducationEditor, ProjectsEditor, SkillsEditor, CertsEditor } from '../components/editor/ListEditors.jsx'

const TEMPLATES = ['modern', 'classic', 'minimal', 'sidebar', 'elegant']

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [resume, setResume] = useState(null)
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState('')
  const dirtyRef = useRef(false)

  useEffect(() => {
    let cancelled = false
    if (id && id !== 'new') {
      api
        .get(`/resumes/${id}`)
        .then(({ data }) => {
          if (!cancelled) setResume(data)
        })
        .catch(() => setError('Resume not found'))
    } else {
      setResume({
        title: 'Untitled Resume',
        template: 'modern',
        accent: '#2563eb',
        content: emptyResume(),
      })
    }
    return () => {
      cancelled = true
    }
  }, [id])

  useEffect(() => {
    if (!resume || !dirtyRef.current || !id || id === 'new') return
    const t = setTimeout(() => {
      setSaving(true)
      api
        .put(`/resumes/${id}`, resume)
        .then(() => setSavedAt(new Date()))
        .catch(() => setError('Autosave failed — is the server running?'))
        .finally(() => setSaving(false))
    }, 900)
    return () => clearTimeout(t)
  }, [resume, id])

  const markDirty = (next) => {
    dirtyRef.current = true
    setResume(next)
  }

  const save = async () => {
    setSaving(true)
    try {
      if (!id || id === 'new') {
        const { data } = await api.post('/resumes', resume)
        navigate(`/builder/${data._id}`, { replace: true })
      } else {
        await api.put(`/resumes/${id}`, resume)
        setSavedAt(new Date())
      }
    } catch {
      setError('Save failed — is the server running?')
    } finally {
      setSaving(false)
    }
  }

  if (!resume) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-500">
        {error ? <p className="text-red-600">{error}</p> : 'Loading…'}
      </main>
    )
  }

  const content = normalizeContent(resume.content)
  const setContent = (updater) => markDirty({ ...resume, content: updater(normalizeContent(resume.content)) })

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            value={resume.title}
            onChange={(e) => markDirty({ ...resume, title: e.target.value })}
            className="w-64 rounded-lg border border-transparent bg-transparent px-2 py-1 text-2xl font-bold text-slate-900 hover:border-slate-200 focus:border-blue-400 focus:outline-none"
          />
          <span className="text-xs text-slate-400">{saving ? 'Saving…' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : ''}</span>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={resume.template}
            onChange={(e) => markDirty({ ...resume, template: e.target.value })}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {TEMPLATES.map((t) => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
          <div className="flex items-center gap-1 rounded-lg border border-slate-300 px-2 py-1.5">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => markDirty({ ...resume, accent: c })}
                className={`h-5 w-5 rounded-full transition ${resume.accent === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={`Accent color ${c}`}
              />
            ))}
          </div>
          <button onClick={save} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50">
            Save
          </button>
          <button onClick={exportPdf} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
            Export PDF
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          <SectionCard title="Personal details">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ['fullName', 'Full name'],
                ['headline', 'Headline (e.g. Frontend Developer)'],
                ['email', 'Email'],
                ['phone', 'Phone'],
                ['location', 'Location'],
                ['linkedin', 'LinkedIn'],
                ['github', 'GitHub'],
                ['portfolio', 'Portfolio'],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className={labelCls}>{label}</label>
                  <input
                    value={content.basics[key] || ''}
                    onChange={(e) => setContent((c) => ({ ...c, basics: { ...c.basics, [key]: e.target.value } }))}
                    className={inputCls}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3">
              <div className="mb-1 flex items-center justify-between">
                <label className={labelCls}>Professional summary</label>
                <AIButton
                  payload={() => ({ bullet: content.basics.summary || `${content.basics.fullName} — ${content.basics.headline}`, tone: 'summary' })}
                  onResult={(d) => setContent((c) => ({ ...c, basics: { ...c.basics, summary: d.text } }))}
                  label="✨ AI write"
                />
              </div>
              <textarea
                rows={3}
                value={content.basics.summary}
                onChange={(e) => setContent((c) => ({ ...c, basics: { ...c.basics, summary: e.target.value } }))}
                className={inputCls}
              />
            </div>
          </SectionCard>

          <SectionCard title="Experience" onAdd={() => setContent((c) => ({ ...c, experience: [...c.experience, { role: '', company: '', location: '', start: '', end: '', bullets: [''] }] }))}>
            <ExperienceEditor items={content.experience} onChange={(next) => setContent((c) => ({ ...c, experience: next }))} />
          </SectionCard>

          <SectionCard title="Education" onAdd={() => setContent((c) => ({ ...c, education: [...c.education, { degree: '', school: '', location: '', start: '', end: '', notes: '' }] }))}>
            <EducationEditor items={content.education} onChange={(next) => setContent((c) => ({ ...c, education: next }))} />
          </SectionCard>

          <SectionCard title="Projects" onAdd={() => setContent((c) => ({ ...c, projects: [...c.projects, { name: '', description: '', link: '' }] }))}>
            <ProjectsEditor items={content.projects} onChange={(next) => setContent((c) => ({ ...c, projects: next }))} />
          </SectionCard>

          <SectionCard title="Skills" onAdd={() => setContent((c) => ({ ...c, skills: [...c.skills, { name: '', level: '' }] }))}>
            <SkillsEditor items={content.skills} onChange={(next) => setContent((c) => ({ ...c, skills: next }))} />
          </SectionCard>

          <SectionCard title="Certifications" onAdd={() => setContent((c) => ({ ...c, certifications: [...c.certifications, { name: '', issuer: '', year: '' }] }))}>
            <CertsEditor items={content.certifications} onChange={(next) => setContent((c) => ({ ...c, certifications: next }))} />
          </SectionCard>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <div className="h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-full">
            <PreviewPane template={resume.template} accent={resume.accent} content={content} />
          </div>
        </div>
      </div>
    </main>
  )
}
