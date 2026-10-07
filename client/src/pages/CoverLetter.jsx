import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent, resumeToText } from '../lib/resume.js'
import { useToast } from '../components/Toast.jsx'

export default function CoverLetter() {
  const location = useLocation()
  const toast = useToast()
  const [resumes, setResumes] = useState([])
  const [selectedId, setSelectedId] = useState(location.state?.resumeId || '')
  const [form, setForm] = useState({ role: '', company: '', jobDescription: '' })
  const [letter, setLetter] = useState(null)
  const [loading, setLoading] = useState(false)
  const [source, setSource] = useState('')

  useEffect(() => {
    api
      .get('/resumes')
      .then(({ data }) => {
        setResumes(data)
        if (!location.state?.resumeId && data.length) setSelectedId(data[0]._id)
      })
      .catch(() => {})
  }, [location.state])

  const generate = async () => {
    const resume = resumes.find((r) => r._id === selectedId)
    if (!resume) return toast('Pick a resume first', 'error')
    setLoading(true)
    try {
      const content = normalizeContent(resume.content)
      const { data } = await api.post('/ai/cover-letter', {
        fullName: content.basics.fullName,
        role: form.role,
        company: form.company,
        jobDescription: form.jobDescription,
        resumeText: resumeToText(content),
      })
      setLetter(data.text)
      setSource(data.source)
      toast('Cover letter ready', 'success')
    } catch {
      toast('Generation failed — is the server running?', 'error')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(letter)
    toast('Copied to clipboard', 'success')
  }

  const selected = resumes.find((r) => r._id === selectedId)

  return (
    <main className="animate-fade-in">
      <div className="mb-2 flex items-center gap-2">
        <span className="badge badge-green badge-mono">LETTER</span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
          /cover-letter
        </span>
      </div>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
          Cover Letter Studio
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
          Pick a resume, add the job details — get a tailored cover letter you can copy or print to PDF.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <div className="space-y-4">
            <div className="field">
              <label className="field-label">Base resume</label>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="input"
              >
                {resumes.length === 0 && (
                  <option value="">No resumes yet — create one first</option>
                )}
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title || 'Untitled'} {r.share?.enabled ? '(shared)' : ''}
                  </option>
                ))}
              </select>
            </div>
            {selected && (
              <div className="rounded-lg bg-[var(--bg-3)] px-3 py-2 text-xs font-mono" style={{ color: 'var(--text-1)' }}>
                {selected.title || 'Untitled'} · {selected.content?.basics?.fullName || 'no name'} · {selected.content?.basics?.email || 'no email'}
              </div>
            )}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="field">
                <label className="field-label">Role</label>
                <input
                  value={form.role}
                  placeholder="Frontend Developer"
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="input"
                />
              </div>
              <div className="field">
                <label className="field-label">Company</label>
                <input
                  value={form.company}
                  placeholder="Acme Inc"
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Job description (optional but recommended)</label>
              <textarea
                rows={6}
                value={form.jobDescription}
                placeholder="Paste the job posting…"
                onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                className="input"
              />
            </div>
            <button
              onClick={generate}
              disabled={loading || !selectedId}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Writing…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="14" r="2" />
                  </svg>
                  Generate cover letter
                </>
              )}
            </button>
          </div>
        </div>

        <div>
          {letter ? (
            <div className="panel panel-accent" style={{ borderColor: 'rgba(16,185,129,0.30)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
                  {source === 'local' ? 'Built-in generator (no AI key set)' : 'AI generated'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={copy}
                    className="btn btn-primary btn-sm"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                    </svg>
                    Copy
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn btn-ghost btn-sm"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9V2h12v7" />
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                      <path d="M6 14h12v8H6z" />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
              <pre className="max-h-[65vh] overflow-auto whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-0)' }}>
                {letter}
              </pre>
            </div>
          ) : (
            <div className="panel flex h-full min-h-[300px] items-center justify-center border-dashed border-[var(--border-1)]">
              <div className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-[var(--bg-3)] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="14" r="2" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-1)' }}>
                  Your cover letter will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
