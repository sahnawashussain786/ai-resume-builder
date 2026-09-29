import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent } from '../lib/resume.js'
import ResumePreview from '../components/templates/ResumeTemplates.jsx'

export default function Upload() {
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  const onPick = (e) => {
    setFile(e.target.files?.[0] || null)
    setError('')
  }

  const upload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post('/upload/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(data)
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed — is the server running?')
    } finally {
      setLoading(false)
    }
  }

  const saveAndEdit = async (template = 'modern') => {
    try {
      const { data } = await api.post('/resumes', {
        title: file?.name?.replace(/\.[^.]+$/, '') || 'Imported Resume',
        template,
        accent: '#2563eb',
        content: result.content,
      })
      navigate(`/builder/${data._id}`)
    } catch {
      setError('Save failed — is the server running?')
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Upload your resume</h1>
      <p className="mt-2 text-slate-600">
        Drop a PDF, DOCX or TXT file — we extract the structure so you can edit it with any template.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
            <div className="text-5xl">📄</div>
            <p className="mt-4 font-semibold text-slate-800">{file ? file.name : 'Click to choose a file'}</p>
            <p className="mt-1 text-xs text-slate-500">PDF, DOCX or TXT · max 5 MB · scanned PDFs are not supported</p>
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={onPick} />
          </label>
          <button
            onClick={upload}
            disabled={!file || loading}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Parsing…' : 'Parse resume'}
          </button>
          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <p className="text-xs text-slate-500">
            Parsing is heuristic: check names, dates and bullets after import — everything is editable in the builder.
          </p>
        </div>

        <div>
          {result ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-500">Parsed from {result.fileName}</span>
                <div className="flex gap-2">
                  {['modern', 'classic', 'minimal', 'sidebar', 'elegant'].map((t) => (
                    <button
                      key={t}
                      onClick={() => saveAndEdit(t)}
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Use {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-xl border border-slate-100 bg-slate-50 p-3">
                <ResumePreview template="modern" accent="#2563eb" content={normalizeContent(result.content)} scale={0.62} />
              </div>
            </div>
          ) : (
            <div className="grid h-full min-h-[300px] place-items-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center">
              <div>
                <div className="text-4xl">🔍</div>
                <p className="mt-3 text-sm text-slate-500">Parsed preview appears here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
