import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent, emptyResume } from '../lib/resume.js'
import PreviewPane from '../components/PreviewPane.jsx'
import CompletenessMeter from '../components/CompletenessMeter.jsx'
import DesignPanel from '../components/DesignPanel.jsx'
import TailorModal from '../components/TailorModal.jsx'
import ShareDialog from '../components/ShareDialog.jsx'
import exportPdf from '../lib/exportPdf.js'
import { inputCls, labelCls, SectionCard, AIButton } from '../components/editor/shared.jsx'
import ExperienceEditor from '../components/editor/ExperienceEditor.jsx'
import { EducationEditor, ProjectsEditor, SkillsEditor, CertsEditor } from '../components/editor/ListEditors.jsx'
import CustomSectionsEditor from '../components/editor/CustomSectionsEditor.jsx'
import { useToast } from '../components/Toast.jsx'

const TABS = [
  { id: 'content', label: '📝 Content' },
  { id: 'design', label: '🎨 Design' },
  { id: 'tools', label: '🤖 AI tools' },
]

export default function Builder() {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  const [resume, setResume] = useState(null)
  const [tab, setTab] = useState('content')
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(null)
  const [error, setError] = useState('')
  const [showTailor, setShowTailor] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [score, setScore] = useState(null)
  const [scoring, setScoring] = useState(false)
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
      setResume({ title: 'Untitled Resume', template: 'modern', accent: '#2563eb', font: 'sans', content: emptyResume() })
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
        dirtyRef.current = false
        navigate(`/builder/${data._id}`, { replace: true })
        toast('Resume created', 'success')
      } else {
        await api.put(`/resumes/${id}`, resume)
        dirtyRef.current = false
        setSavedAt(new Date())
        toast('Saved', 'success')
      }
    } catch {
      setError('Save failed — is the server running?')
      toast('Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const runScore = async () => {
    setScoring(true)
    try {
      const { data } = await api.post('/ai/score', { content: normalizeContent(resume.content) })
      setScore(data)
    } catch {
      toast('AI score failed', 'error')
    } finally {
      setScoring(false)
    }
  }

  if (!resume) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-24 text-center text-slate-500 dark:text-slate-400">
        {error ? <p className="text-red-600">{error}</p> : 'Loading…'}
      </main>
    )
  }

  const content = normalizeContent(resume.content)
  const setContent = (updater) => markDirty({ ...resume, content: updater(normalizeContent(resume.content)) })

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-6">
      {/* Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <input
            value={resume.title}
            onChange={(e) => markDirty({ ...resume, title: e.target.value })}
            className="w-64 rounded-lg border border-transparent bg-transparent px-2 py-1 text-2xl font-bold text-slate-900 hover:border-slate-200 focus:border-blue-400 focus:outline-none dark:text-white"
          />
          <span className="text-xs text-slate-400">{saving ? 'Saving…' : savedAt ? `Saved ${savedAt.toLocaleTimeString()}` : ''}</span>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowTailor(true)}
            className="rounded-lg border border-violet-300 bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 dark:border-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
          >
            🎯 Tailor to job
          </button>
          {id && id !== 'new' && (
            <button
              onClick={() => setShowShare(true)}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              🔗 Share
            </button>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Save
          </button>
          <button onClick={exportPdf} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${
              tab === t.id ? 'bg-white text-slate-900 shadow-sm dark:bg-slate-700 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        <div className="space-y-4">
          {tab === 'content' && (
            <>
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

              <SectionCard
                title="Experience"
                onAdd={() => setContent((c) => ({ ...c, experience: [...c.experience, { role: '', company: '', location: '', start: '', end: '', bullets: [''] }] }))}
              >
                <ExperienceEditor items={content.experience} onChange={(next) => setContent((c) => ({ ...c, experience: next }))} />
              </SectionCard>

              <SectionCard
                title="Education"
                onAdd={() => setContent((c) => ({ ...c, education: [...c.education, { degree: '', school: '', location: '', start: '', end: '', notes: '' }] }))}
              >
                <EducationEditor items={content.education} onChange={(next) => setContent((c) => ({ ...c, education: next }))} />
              </SectionCard>

              <SectionCard title="Projects" onAdd={() => setContent((c) => ({ ...c, projects: [...c.projects, { name: '', description: '', link: '' }] }))}>
                <ProjectsEditor items={content.projects} onChange={(next) => setContent((c) => ({ ...c, projects: next }))} />
              </SectionCard>

              <SectionCard title="Skills" onAdd={() => setContent((c) => ({ ...c, skills: [...c.skills, { name: '', level: '' }] }))}>
                <SkillsEditor items={content.skills} onChange={(next) => setContent((c) => ({ ...c, skills: next }))} />
              </SectionCard>

              <SectionCard
                title="Certifications"
                onAdd={() => setContent((c) => ({ ...c, certifications: [...c.certifications, { name: '', issuer: '', year: '' }] }))}
              >
                <CertsEditor items={content.certifications} onChange={(next) => setContent((c) => ({ ...c, certifications: next }))} />
              </SectionCard>

              <SectionCard title="Custom sections">
                <CustomSectionsEditor sections={content.custom || []} onChange={(next) => setContent((c) => ({ ...c, custom: next }))} />
              </SectionCard>
            </>
          )}

          {tab === 'design' && (
            <SectionCard title="Design">
              <DesignPanel resume={resume} markDirty={markDirty} />
            </SectionCard>
          )}

          {tab === 'tools' && (
            <>
              <CompletenessMeter content={content} onFix={() => setTab('content')} />
              <SectionCard title="AI resume review">
                <button
                  onClick={runScore}
                  disabled={scoring}
                  className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
                >
                  {scoring ? 'Reviewing…' : '✨ Review my resume with AI'}
                </button>
                {score && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-violet-100 text-2xl font-black text-violet-700 dark:bg-violet-900/50 dark:text-violet-300">
                        {score.score}
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{score.summary}</p>
                    </div>
                    {score.tips?.length > 0 && (
                      <ul className="space-y-2">
                        {score.tips.map((tip, i) => (
                          <li key={i} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                            💡 {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </SectionCard>
              <SectionCard title="Cover letter">
                <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">Generate a tailored cover letter from this resume.</p>
                <button
                  onClick={() => navigate('/cover-letter', { state: { resumeId: id } })}
                  className="w-full rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                >
                  Open cover letter studio →
                </button>
              </SectionCard>
            </>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <div className="h-[70vh] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:h-full dark:border-slate-700">
            <PreviewPane
              template={resume.template}
              accent={resume.accent}
              font={resume.font}
              content={content}
              sectionOrder={resume.sectionOrder}
              hiddenSections={resume.hiddenSections}
            />
          </div>
        </div>
      </div>

      <TailorModal open={showTailor} onClose={() => setShowTailor(false)} content={content} />
      <ShareDialog open={showShare} onClose={() => setShowShare(false)} resumeId={id} />
    </main>
  )
}
