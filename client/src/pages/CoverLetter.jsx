import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent, resumeToText } from '../lib/resume.js'
import { inputCls, labelCls } from '../components/editor/shared.jsx'
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

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">💌 Cover Letter Studio</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Pick a resume, add the job details — get a tailored cover letter you can copy or print to PDF.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div>
              <label className={labelCls}>Base resume</label>
              <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)} className={inputCls}>
                {resumes.length === 0 && <option value="">No resumes yet — create one first</option>}
                {resumes.map((r) => (
                  <option key={r._id} value={r._id}>
                    {r.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Role</label>
                <input value={form.role} placeholder="Frontend Developer" onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Company</label>
                <input value={form.company} placeholder="Acme Inc" onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Job description (optional but recommended)</label>
              <textarea
                rows={6}
                value={form.jobDescription}
                placeholder="Paste the job posting…"
                onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                className={inputCls}
              />
            </div>
            <button
              onClick={generate}
              disabled={loading || !selectedId}
              className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? 'Writing…' : '✨ Generate cover letter'}
            </button>
          </div>
        </div>

        <div>
          {letter ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">{source === 'local' ? 'Built-in generator (no AI key set)' : 'AI generated'}</span>
                <div className="flex gap-2">
                  <button onClick={copy} className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700">
                    Copy
                  </button>
                  <button onClick={() => window.print()} className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200">
                    Print / PDF
                  </button>
                </div>
              </div>
              <pre className="max-h-[65vh] overflow-auto whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-700 dark:text-slate-200">{letter}</pre>
            </div>
          ) : (
            <div className="grid h-full min-h-[300px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center dark:border-slate-700 dark:bg-slate-900">
              <div>
                <div className="text-4xl">💌</div>
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Your cover letter will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
