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
import { SectionCard, AIButton } from '../components/editor/shared.jsx'
import ExperienceEditor from '../components/editor/ExperienceEditor.jsx'
import { EducationEditor, ProjectsEditor, SkillsEditor, CertsEditor } from '../components/editor/ListEditors.jsx'
import CustomSectionsEditor from '../components/editor/CustomSectionsEditor.jsx'
import { useToast } from '../components/Toast.jsx'

const TABS = [
  { id: 'content', label: 'Content', accent: 'var(--blue)' },
  { id: 'design', label: 'Design', accent: 'var(--accent)' },
  { id: 'tools', label: 'AI tools', accent: 'var(--accent-2)' },
]

const FIELDS = [
  ['fullName', 'Full name'],
  ['headline', 'Headline'],
  ['email', 'Email'],
  ['phone', 'Phone'],
  ['location', 'Location'],
  ['linkedin', 'LinkedIn'],
  ['github', 'GitHub'],
  ['portfolio', 'Portfolio'],
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
  const keyRef = useRef(0)

  useEffect(() => {
    keyRef.current += 1
  }, [id])

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
        accent: '#6c5ce7',
        font: 'sans',
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
      const { data } = await api.post('/ai/score', {
        content: normalizeContent(resume.content),
      })
      setScore(data)
    } catch {
      toast('AI score failed', 'error')
    } finally {
      setScoring(false)
    }
  }

  if (!resume) {
    return (
      <main className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-sm" style={{ color: 'var(--text-1)' }}>
          <span className="h-5 w-5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          Loading editor…
        </div>
      </main>
    )
  }

  const content = normalizeContent(resume.content)
  const setContent = (updater) =>
    markDirty({ ...resume, content: updater(normalizeContent(resume.content)) })

  const accent = resume.accent || '#6c5ce7'

  return (
    <main key={keyRef.current} className="animate-fade-in">
      {/* Toolbar */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <input
            value={resume.title || ''}
            onChange={(e) => markDirty({ ...resume, title: e.target.value })}
            className="input input-mono min-w-0 flex-1 text-sm font-semibold"
            placeholder="Resume title…"
          />
          <span className="shrink-0 text-xs font-mono" style={{ color: 'var(--text-2)' }}>
            {saving ? (
              'saving…'
            ) : savedAt ? (
              `saved ${savedAt.toLocaleTimeString()}`
            ) : 'unsaved'}
          </span>
          {error && (
            <span className="shrink-0 text-xs" style={{ color: 'var(--red)' }}>
              {error}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowTailor(true)}
            className="btn btn-ghost btn-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
              <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
            </svg>
            Tailor to job
          </button>
          {id && id !== 'new' && (
            <button
              onClick={() => setShowShare(true)}
              className="btn btn-ghost btn-sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          )}
          <div className="w-px h-6" style={{ background: 'var(--border-1)' }} />
          <button
            onClick={save}
            disabled={saving}
            className="btn btn-ghost btn-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            onClick={exportPdf}
            className="btn btn-primary btn-sm"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`tab ${tab === t.id ? 'active' : ''}`}
          >
            <span
              className="tab-indicator"
              style={tab === t.id ? { background: t.accent } : {}}
            />
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
        {/* Left: editors */}
        <div className="space-y-5">
          {tab === 'content' && (
            <>
              <SectionCard title="Personal details" accent={accent}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {FIELDS.map(([key, label]) => (
                    <div key={key} className="field">
                      <label className="field-label">{label}</label>
                      <input
                        value={content.basics[key] || ''}
                        onChange={(e) =>
                          setContent((c) => ({
                            ...c,
                            basics: { ...c.basics, [key]: e.target.value },
                          }))
                        }
                        className="input"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 panel">
                  <div className="flex items-center justify-between">
                    <label className="field-label">Professional summary</label>
                    <AIButton
                      payload={() => ({
                        bullet:
                          content.basics.summary ||
                          `${content.basics.fullName} — ${content.basics.headline}`,
                        tone: 'summary',
                      })}
                      onResult={(d) =>
                        setContent((c) => ({
                          ...c,
                          basics: { ...c.basics, summary: d.text },
                        }))
                      }
                      label="AI write"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={content.basics.summary || ''}
                    onChange={(e) =>
                      setContent((c) => ({
                        ...c,
                        basics: { ...c.basics, summary: e.target.value },
                      }))
                    }
                    className="input mt-3"
                    placeholder="A few lines about who you are and what you bring…"
                  />
                </div>
              </SectionCard>

              <SectionCard
                title="Experience"
                accent={accent}
                onAdd={() =>
                  setContent((c) => ({
                    ...c,
                    experience: [
                      ...c.experience,
                      {
                        role: '',
                        company: '',
                        location: '',
                        start: '',
                        end: '',
                        bullets: [''],
                      },
                    ],
                  }))
                }
              >
                <ExperienceEditor
                  items={content.experience}
                  onChange={(next) => setContent((c) => ({ ...c, experience: next }))}
                />
              </SectionCard>

              <SectionCard
                title="Education"
                accent={accent}
                onAdd={() =>
                  setContent((c) => ({
                    ...c,
                    education: [
                      ...c.education,
                      {
                        degree: '',
                        school: '',
                        location: '',
                        start: '',
                        end: '',
                        notes: '',
                      },
                    ],
                  }))
                }
              >
                <EducationEditor
                  items={content.education}
                  onChange={(next) => setContent((c) => ({ ...c, education: next }))}
                />
              </SectionCard>

              <SectionCard
                title="Projects"
                accent={accent}
                onAdd={() =>
                  setContent((c) => ({
                    ...c,
                    projects: [...c.projects, { name: '', description: '', link: '' }],
                  }))
                }
              >
                <ProjectsEditor
                  items={content.projects}
                  onChange={(next) => setContent((c) => ({ ...c, projects: next }))}
                />
              </SectionCard>

              <SectionCard
                title="Skills"
                accent={accent}
                onAdd={() =>
                  setContent((c) => ({
                    ...c,
                    skills: [...c.skills, { name: '', level: '' }],
                  }))
                }
              >
                <SkillsEditor
                  items={content.skills}
                  onChange={(next) => setContent((c) => ({ ...c, skills: next }))}
                />
              </SectionCard>

              <SectionCard
                title="Certifications"
                accent={accent}
                onAdd={() =>
                  setContent((c) => ({
                    ...c,
                    certifications: [
                      ...c.certifications,
                      { name: '', issuer: '', year: '' },
                    ],
                  }))
                }
              >
                <CertsEditor
                  items={content.certifications}
                  onChange={(next) => setContent((c) => ({ ...c, certifications: next }))}
                />
              </SectionCard>

              <SectionCard title="Custom sections" accent={accent}>
                <CustomSectionsEditor
                  sections={content.custom || []}
                  onChange={(next) => setContent((c) => ({ ...c, custom: next }))}
                />
              </SectionCard>
            </>
          )}

          {tab === 'design' && (
            <SectionCard title="Design" accent={accent}>
              <DesignPanel resume={resume} markDirty={markDirty} />
            </SectionCard>
          )}

          {tab === 'tools' && (
            <>
              <CompletenessMeter content={content} onFix={() => setTab('content')} />
              <SectionCard title="AI resume review" accent="var(--accent-2)">
                <button
                  onClick={runScore}
                  disabled={scoring}
                  className="btn btn-primary w-full"
                >
                  {scoring ? (
                    <>
                      <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                      Reviewing…
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 5.5C8 11.5 8 13 9 14l6 7c1 1 2 2 3 2s2-1 3-2l6-7c1-1 1-2.5 0-3.5C18 9.5 16 8 12 8a4 4 0 0 1 4-4z" />
                      </svg>
                      Review my resume with AI
                    </>
                  )}
                </button>
                {score && (
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center gap-4">
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold"
                        style={{
                          background: `linear-gradient(135deg, ${score.score >= 80 ? '#22c55e' : score.score >= 55 ? '#f59e0b' : '#ef4444'}22, ${score.score >= 80 ? '#22c55e' : score.score >= 55 ? '#f59e0b' : '#ef4444'}08)`,
                          color:
                            score.score >= 80
                              ? 'var(--green)'
                              : score.score >= 55
                              ? 'var(--amber)'
                              : 'var(--red)',
                        }}
                      >
                        {score.score}
                      </div>
                      <p className="text-sm" style={{ color: 'var(--text-1)' }}>
                        {score.summary}
                      </p>
                    </div>
                    {score.tips?.length > 0 && (
                      <ul className="space-y-2">
                        {score.tips.map((tip, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 rounded-xl bg-[var(--bg-3)] p-3 text-xs"
                            style={{ color: 'var(--text-1)' }}
                          >
                            <span
                              className="shrink-0 mt-0.5 rounded-full p-0.5"
                              style={{
                                background: 'rgba(245,158,11,0.15)',
                                color: 'var(--amber)',
                              }}
                            >
                              💡
                            </span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </SectionCard>
              <SectionCard title="Cover letter" accent="#10b981">
                <p className="text-xs" style={{ color: 'var(--text-1)' }}>
                  Generate a tailored cover letter from this resume.
                </p>
                <button
                  onClick={() =>
                    navigate('/cover-letter', { state: { resumeId: id } })
                  }
                  className="btn btn-surface mt-3 w-full"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="14" r="2" />
                  </svg>
                  Open cover letter studio
                </button>
              </SectionCard>
            </>
          )}
        </div>

        {/* Right: preview */}
        <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <div
            className="h-[70vh] overflow-hidden rounded-xl border border-[var(--border-1)] bg-[var(--bg-1)] shadow-lg lg:h-full"
            style={{ boxShadow: `0 0 0 1px var(--border-1), 0 20px 60px -20px rgba(0,0,0,0.8)` }}
          >
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

      <TailorModal
        open={showTailor}
        onClose={() => setShowTailor(false)}
        content={content}
      />
      <ShareDialog
        open={showShare}
        onClose={() => setShowShare(false)}
        resumeId={id}
      />
    </main>
  )
}
