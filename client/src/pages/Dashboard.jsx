import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { resumeCompleteness } from '../lib/resume.js'

const QUICK_START = [
  { to: '/builder/new', label: 'Build manually', desc: 'Section-by-section editor', accent: 'var(--blue)' },
  { to: '/templates', label: 'Start from template', desc: '8 polished layouts', accent: 'var(--accent)' },
  { to: '/ai', label: 'Generate with AI', desc: 'Describe yourself, get a draft', accent: 'var(--accent-2)' },
  { to: '/upload', label: 'Upload a resume', desc: 'PDF, DOCX or TXT', accent: '#f59e0b' },
  { to: '/cover-letter', label: 'Cover letter', desc: 'AI-tailored letters', accent: '#10b981' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [resumes, setResumes] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [removing, setRemoving] = useState(null)

  useEffect(() => {
    api
      .get('/resumes')
      .then(({ data }) => setResumes(data))
      .catch(() => setError('Could not load resumes — is the server running?'))
  }, [])

  const remove = async (rid) => {
    if (!confirm('Delete this resume? This cannot be undone.')) return
    setRemoving(rid)
    try {
      await api.delete(`/resumes/${rid}`)
      setResumes((rs) => rs.filter((r) => r._id !== rid))
      toast('Resume deleted', 'success')
    } catch {
      toast('Delete failed', 'error')
    } finally {
      setRemoving(null)
    }
  }

  const duplicate = async (rid) => {
    try {
      const { data } = await api.post(`/resumes/${rid}/duplicate`)
      setResumes((rs) => [data, ...rs])
      toast('Resume duplicated', 'success')
    } catch {
      toast('Duplicate failed', 'error')
    }
  }

  const resumeList = resumes ?? []
  const filtered = resumeList.filter((r) =>
    r.title?.toLowerCase().includes(query.toLowerCase())
  )
  const avg =
    resumeList.length > 0
      ? Math.round(
          resumeList.reduce((s, r) => s + resumeCompleteness(r.content).score, 0) / resumeList.length
        )
      : 0

  const first = user?.name?.trim()?.split(' ')[0] || null

  return (
    <main className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: 'var(--text-2)' }}
          >
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
          <h1
            className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight"
            style={{ color: 'var(--text-0)' }}
          >
            {first ? `Welcome back, ${first}` : 'Your dashboard'}
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--text-1)' }}
          >
            {resumes?.length === 0
              ? 'No resumes yet. Create your first one below.'
              : `${resumes.length} resume${resumes.length === 1 ? '' : 's'} · all in one place.`}
          </p>
        </div>

        {resumes?.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="panel flex items-center gap-4">
              <div className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: 'var(--text-0)' }}
                >
                  {resumes.length}
                </div>
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-2)' }}
                >
                  Resumes
                </div>
              </div>
              <div className="w-px h-8" style={{ background: 'var(--border-1)' }} />
              <div className="text-center">
                <div
                  className="text-xl font-bold"
                  style={{ color: avg >= 80 ? 'var(--green)' : avg >= 55 ? 'var(--amber)' : 'var(--red)' }}
                >
                  {avg}%
                </div>
                <div
                  className="text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-2)' }}
                >
                  Avg strength
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick start */}
      <div className="mt-8">
        <p
          className="mb-4 text-xs font-mono uppercase tracking-wider"
          style={{ color: 'var(--text-2)' }}
        >
          Quick start
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {QUICK_START.map((o) => (
            <Link
              key={o.to}
              to={o.to}
              className="group panel panel-hover flex items-center gap-4"
            >
              <div
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                style={{ background: `${o.accent}18` }}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ background: o.accent, boxShadow: `0 0 10px ${o.accent}55` }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <div
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text-0)' }}
                >
                  {o.label}
                </div>
                <div
                  className="text-xs"
                  style={{ color: 'var(--text-1)' }}
                >
                  {o.desc}
                </div>
              </div>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="shrink-0 ml-auto text-[var(--text-2)] group-hover:text-[var(--text-0)] transition-colors"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          ))}
        </div>
      </div>

      {/* Resumes */}
      <div className="mt-12 flex items-center justify-between">
        <h2
          className="text-sm font-semibold tracking-tight"
          style={{ color: 'var(--text-0)' }}
        >
          Your resumes
        </h2>
        {resumes?.length > 3 && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter resumes…"
            className="input input-mono w-48"
          />
        )}
      </div>

      {error && (
        <div className="mt-4 rounded-lg bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] px-4 py-3 text-sm" style={{ color: 'var(--red)' }}>
          {error}
        </div>
      )}

      {resumes === null && !error && (
        <div className="mt-4 flex items-center gap-3 text-sm" style={{ color: 'var(--text-1)' }}>
          <span className="h-4 w-4 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          Loading resumes…
        </div>
      )}

      {resumes?.length === 0 && (
        <div className="mt-12 rounded-xl border border-dashed border-[var(--border-1)] bg-[var(--bg-1)]/50 p-10 text-center">
          <div className="mx-auto mb-3 h-10 w-10 rounded-full bg-[var(--bg-3)] flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-2)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--text-1)' }}>
            No resumes yet — create your first one above.
          </p>
        </div>
      )}

      {resumes?.length > 0 && filtered.length === 0 && query && (
        <div className="mt-4 text-sm" style={{ color: 'var(--text-1)' }}>
          No resumes match “{query}”.
        </div>
      )}

      {resumes?.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => {
            const strength = resumeCompleteness(r.content).score
            const shared = Boolean(r.share?.enabled)
            const shortId = r._id && r._id.slice(-6)

            return (
              <div
                key={r._id}
                className="panel panel-hover group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/builder/${r._id}`}
                        className="font-semibold text-sm truncate"
                        style={{ color: 'var(--text-0)' }}
                      >
                        {r.title || 'Untitled'}
                      </Link>
                      {shared && (
                        <span className="badge badge-green badge-mono shrink-0">SHARED</span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs" style={{ color: 'var(--text-2)' }}>
                      <span className="rounded px-1.5 py-0.5 font-mono text-[11px]" style={{ background: 'var(--bg-3)', border: '1px solid var(--border-1)' }}>
                        {r.template}
                      </span>
                      <span>·</span>
                      <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono hidden sm:inline" style={{ color: 'var(--text-3)' }}>
                    {shortId}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-medium"
                      style={{ color: strength >= 80 ? 'var(--green)' : strength >= 55 ? 'var(--amber)' : 'var(--red)' }}
                    >
                      {strength}%
                    </span>
                    <div className="h-1.5 w-20 overflow-hidden rounded-full" style={{ background: 'var(--bg-3)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${strength}%`,
                          background: strength >= 80 ? 'var(--green)' : strength >= 55 ? 'var(--amber)' : 'var(--red)',
                        }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] font-mono" style={{ color: 'var(--text-3)' }}>
                    {r.share?.id ? `Share · ${r.share.id}` : '—'}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Link
                    to={`/builder/${r._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => duplicate(r._id)}
                    className="btn btn-ghost btn-sm"
                    disabled={removing === r._id}
                  >
                    Duplicate
                  </button>
                  <button
                    onClick={() => remove(r._id)}
                    className="btn btn-danger btn-sm"
                    disabled={removing === r._id}
                  >
                    {removing === r._id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </main>
  )
}
