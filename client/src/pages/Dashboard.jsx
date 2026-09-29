import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'
import { resumeCompleteness } from '../lib/resume.js'

const CREATE_OPTIONS = [
  { to: '/builder/new', icon: '✍️', title: 'Build manually', desc: 'Guided section-by-section editor', grad: 'from-blue-500 to-indigo-600' },
  { to: '/templates', icon: '🎨', title: 'Start from template', desc: '8 polished layouts, accent colors', grad: 'from-pink-500 to-rose-600' },
  { to: '/ai', icon: '🤖', title: 'Generate with AI', desc: 'Describe yourself, get a full draft', grad: 'from-violet-500 to-purple-600' },
  { to: '/upload', icon: '📄', title: 'Upload existing resume', desc: 'PDF, DOCX or TXT — parsed instantly', grad: 'from-amber-500 to-orange-600' },
  { to: '/cover-letter', icon: '💌', title: 'Cover letter studio', desc: 'AI letters tailored to any job', grad: 'from-emerald-500 to-teal-600' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const toast = useToast()
  const [resumes, setResumes] = useState(null)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/resumes')
      .then(({ data }) => setResumes(data))
      .catch(() => setError('Could not load resumes — is the server running?'))
  }, [])

  const remove = async (rid) => {
    if (!confirm('Delete this resume?')) return
    try {
      await api.delete(`/resumes/${rid}`)
      setResumes((rs) => rs.filter((r) => r._id !== rid))
      toast('Resume deleted', 'success')
    } catch {
      toast('Delete failed', 'error')
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

  const filtered = (resumes || []).filter((r) => r.title.toLowerCase().includes(query.toLowerCase()))
  const avg = resumes?.length
    ? Math.round(resumes.reduce((s, r) => s + resumeCompleteness(r.content).score, 0) / resumes.length)
    : 0

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">Your resumes, all in one place.</p>
        </div>
        {resumes?.length > 0 && (
          <div className="flex gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className="text-2xl font-black text-slate-900 dark:text-white">{resumes.length}</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Resumes</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div className={`text-2xl font-black ${avg >= 80 ? 'text-emerald-600' : avg >= 55 ? 'text-amber-600' : 'text-red-600'}`}>{avg}%</div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Avg strength</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {CREATE_OPTIONS.map((o) => (
          <Link
            key={o.to}
            to={o.to}
            className={`group rounded-2xl bg-gradient-to-br ${o.grad} p-[1.5px] shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg`}
          >
            <div className="flex h-full flex-col rounded-2xl bg-white p-5 dark:bg-slate-900">
              <div className="text-3xl transition group-hover:scale-110">{o.icon}</div>
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">{o.title}</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{o.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Your resumes</h2>
        {resumes?.length > 3 && (
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="🔍 Search resumes…"
            className="w-56 rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
          />
        )}
      </div>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {resumes === null && !error && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
      {resumes?.length === 0 && <p className="mt-4 text-sm text-slate-500">No resumes yet — create your first one above.</p>}
      {resumes?.length > 0 && filtered.length === 0 && <p className="mt-4 text-sm text-slate-500">No resumes match "{query}".</p>}

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => {
          const strength = resumeCompleteness(r.content).score
          return (
            <div
              key={r._id}
              className="group relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              {r.share?.enabled && (
                <span className="absolute right-4 top-4 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                  SHARED
                </span>
              )}
              <Link to={`/builder/${r._id}`} className="font-semibold text-slate-900 hover:text-blue-600 dark:text-white">
                {r.title}
              </Link>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 capitalize dark:bg-slate-700 dark:text-slate-300">{r.template}</span>
                <span>Updated {new Date(r.updatedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Strength</span>
                  <span className={strength >= 80 ? 'text-emerald-600' : strength >= 55 ? 'text-amber-600' : 'text-red-600'}>{strength}%</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                  <div
                    className={`h-full rounded-full ${strength >= 80 ? 'bg-emerald-500' : strength >= 55 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link to={`/builder/${r._id}`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                  Edit
                </Link>
                <button onClick={() => duplicate(r._id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300">
                  Duplicate
                </button>
                <button onClick={() => remove(r._id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:border-slate-600">
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </main>
  )
}
