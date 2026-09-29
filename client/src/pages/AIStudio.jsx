import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent } from '../lib/resume.js'
import ResumePreview from '../components/templates/index.js'
import { inputCls, labelCls } from '../components/editor/shared.jsx'
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
        accent: '#2563eb',
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
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">AI Studio</h1>
      <p className="mt-2 text-slate-600">
        Describe the role, your skills and a bit about you — the AI drafts a complete resume, ready to edit.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <form onSubmit={generate} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
              <label className={labelCls}>Target role</label>
              <input
                value={form.role}
                placeholder="Frontend Developer"
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Experience level</label>
              <select
                value={form.experienceLevel}
                onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
                className={inputCls}
              >
                <option value="entry">Entry level</option>
                <option value="mid">Mid level</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Skills (comma separated)</label>
              <input
                value={form.skills}
                placeholder="React, Node.js, MongoDB, Tailwind"
                onChange={(e) => setForm({ ...form, skills: e.target.value })}
              />
            </div>
            <div>
              <label className={labelCls}>Tell the AI about you (optional)</label>
              <textarea
                rows={5}
                value={form.rawText}
                placeholder="Paste your old resume text, achievements, metrics — anything. The more context, the better the draft."
                onChange={(e) => setForm({ ...form, rawText: e.target.value })}
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? 'Generating…' : '✨ Generate resume'}
            </button>
            {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          </form>
        </div>

        <div>
          {result ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">
                  Draft ready {source === 'local' && '· built-in generator (no AI key set)'}
                </span>
                <button
                  onClick={saveAndEdit}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save & edit →
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
                <ResumePreview template="modern" accent="#2563eb" content={normalizeContent(result)} scale={0.62} />
              </div>
              <div className="mt-3 flex justify-end">
                <button onClick={saveAndEdit} className="text-sm font-semibold text-blue-600 hover:underline">
                  Save & edit in builder →
                </button>
                </div>
            </div>
          ) : (
            <div className="grid h-full min-h-[300px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div>
                <div className="text-4xl">🤖</div>
                <p className="mt-3 text-sm text-slate-500">Your AI-generated draft will appear here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
