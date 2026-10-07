import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent } from '../lib/resume.js'
import ResumePreview from '../components/templates/index.js'

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
      const { data } = await api.post('/upload/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
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
        accent: '#6c5ce7',
        content: result.content,
      })
      navigate(`/builder/${data._id}`)
    } catch {
      setError('Save failed — is the server running?')
    }
  }

  return (
    <main className="animate-fade-in">
      <div className="mb-2 flex items-center gap-2">
        <span className="badge badge-accent badge-mono">IMPORT</span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
          /upload
        </span>
      </div>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
          Upload your resume
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
          Drop a PDF, DOCX or TXT file — we extract the structure so you can edit it with any template.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="panel">
          <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[var(--border-1)] bg-[var(--bg-2)] p-10 text-center transition hover:border-[var(--accent)] hover:bg-[var(--accent-soft)] group">
            <div className="text-4xl opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--accent)' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium" style={{ color: 'var(--text-0)' }}>
              {file ? (
                <>
                  <span className="block truncate max-w-[220px]">{file.name}</span>
                  <span className="block text-xs mt-1" style={{ color: 'var(--text-2)' }}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </>
              ) : (
                'Click to choose a file'
              )}
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-2)' }}>
              PDF, DOCX or TXT · max 5 MB · scanned PDFs are not supported
            </p>
            <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={onPick} />
          </label>
          <button
            onClick={upload}
            disabled={!file || loading}
            className="btn btn-primary w-full mt-4"
          >
            {loading ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Parsing…
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Parse resume
              </>
            )}
          </button>
          {error && (
            <div className="rounded-lg bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] p-3 text-sm" style={{ color: 'var(--red)' }}>
              {error}
            </div>
          )}
          <p className="mt-3 text-xs" style={{ color: 'var(--text-2)' }}>
            Parsing is heuristic: check names, dates and bullets after import — everything is editable in the builder.
          </p>
        </div>

        <div>
          {result ? (
            <div className="panel panel-accent" style={{ borderColor: 'rgba(108,92,231,0.30)' }}>
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
                  Parsed from {result.fileName}
                </span>
                <div className="flex gap-2">
                  {['modern', 'classic', 'minimal', 'sidebar', 'elegant'].map((t) => (
                    <button
                      key={t}
                      onClick={() => saveAndEdit(t)}
                      className="btn btn-primary btn-sm"
                    >
                      Use {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="max-h-[70vh] overflow-auto rounded-xl border border-[var(--border-1)] bg-[var(--bg-1)] p-3">
                <ResumePreview
                  template="modern"
                  accent="#6c5ce7"
                  content={normalizeContent(result.content)}
                  scale={0.62}
                />
              </div>
            </div>
          ) : (
            <div className="panel flex h-full min-h-[300px] items-center justify-center border-dashed border-[var(--border-1)]">
              <div className="text-center">
                <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-[var(--bg-3)] flex items-center justify-center">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-1)' }}>
                  Parsed preview appears here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
