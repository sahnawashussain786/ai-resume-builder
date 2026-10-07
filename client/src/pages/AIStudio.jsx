import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent } from '../lib/resume.js'
import ResumePreview from '../components/templates/index.js'
import { useToast } from '../components/Toast.jsx'

export default function AIStudio() {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ role: '', experienceLevel: 'mid', skills: '', rawText: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [source, setSource] = useState('')

  const generate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/ai/generate', {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      })
      setResult(data.content)
      setSource(data.source)
    } catch (err) {
      setError(err.response?.data?.message || 'Generation failed')
    } finally {
      setLoading(false)
    }
  }

  const saveAndEdit = async () => {
    try {
      const { data } = await api.post('/resumes', {
        title: `${form.role || 'AI'} Resume`,
        template: 'modern',
        accent: '#6c5ce7',
        font: 'sans',
        content: result,
      })
      toast('Resume created — happy editing!', 'success')
      navigate(`/builder/${data._id}`)
    } catch {
      setError('Save failed — is the server running?')
    }
  }

  return (
    <main className="animate-fade-in">
      <div className="mb-2 flex items-center gap-2">
        <span className="badge badge-accent badge-mono">NEW</span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
          /ai
        </span>
      </div>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
          AI Studio
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
          Describe the role, your skills and a bit about you — the AI drafts a complete resume, ready to edit.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <form onSubmit={generate} className="space-y-4">
            <div className="field">
              <label className="field-label">Target role</label>
              <input
                value={form.role}
                placeholder="Frontend Developer"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Experience level</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                className="input"
              >
                <option value="entry">Entry level</option>
                <option value="mid">Mid level</option>
              </select>
            </div>
            <div className="field">
              <label className="field-label">Skills (comma separated)</label>
              <input
                value={form.skills}
                placeholder="React, Node.js, MongoDB, Tailwind"
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Tell the AI about you (optional)</label>
              <textarea
                rows={5}
                value={form.rawText}
                placeholder="Paste your old resume text, achievements, metrics — anything. The more context, the better the draft."
                onChange={(e) => setForm({ ...form, rawText: e.target.value })}
                className="input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 5.5C8 11.5 8 13 9 14l6 7c1 1 2 2 3 2s2-1 3-2l6-7c1-1 1-2.5 0-3.5C18 9.5 16 8 12 8a4 4 0 0 1 4-4z" />
                  </svg>
                  Generate resume
                </>
              )}
            </button>
            {error && (
              <div className="rounded-lg bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] p-3 text-sm" style={{ color: 'var(--red)' }}>
                {error}
              </div>
            )}
          </form>
        </div>

        <div>
          {result ? (
            <div className="panel panel-accent" style={{ borderColor: 'rgba(108,92,231,0.30)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
                  Draft ready
                  {source === 'local' && (
                    <span className="ml-2" style={{ color: 'var(--text-3)' }}>
                      · built-in generator (no AI key set)
                    </span>
                  )}
                </span>
                <button
                  onClick={saveAndEdit}
                  className="btn btn-primary btn-sm"
                >
                  Save & edit
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-xl border border-[var(--border-1)] bg-[var(--bg-1)] p-3">
                <ResumePreview
                  template="modern"
                  accent="#6c5ce7"
                  content={normalizeContent(result)}
                  scale={0.62}
                />
              </div>
              <div className="mt-3 flex justify-end">
                <button
                  onClick={saveAndEdit}
                  className="btn btn-ghost btn-sm"
                >
                  Save & edit in builder
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="panel flex h-full min-h-[300px] items-center justify-center border-dashed border-[var(--border-1)]">
              <div className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-[var(--bg-3)] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 5.5C8 11.5 8 13 9 14l6 7c1 1 2 2 3 2s2-1 3-2l6-7c1-1 1-2.5 0-3.5C18 9.5 16 8 12 8a4 4 0 0 1 4-4z" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-1)' }}>
                  Your AI-generated draft will appear here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
