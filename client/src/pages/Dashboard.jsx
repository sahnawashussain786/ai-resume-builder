import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const CREATE_OPTIONS = [
  { to: '/builder/new', icon: '✍️', title: 'Build manually', desc: 'Guided section-by-section editor' },
  { to: '/templates', icon: '🎨', title: 'Start from template', desc: 'Pick a layout, fill it in' },
  { to: '/ai', icon: '🤖', title: 'Generate with AI', desc: 'Describe yourself, get a draft' },
  { to: '/upload', icon: '📄', title: 'Upload existing resume', desc: 'PDF, DOCX or TXT — parsed instantly' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState(null)
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
    } catch {
      alert('Delete failed')
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Welcome{user?.name ? `, ${user.name}` : ''}</h1>
      <p className="mt-1 text-slate-600">Your resumes, all in one place.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CREATE_OPTIONS.map((o) => (
          <Link key={o.to} to={o.to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="text-3xl">{o.icon}</div>
            <h3 className="mt-3 font-semibold text-slate-900">{o.title}</h3>
            <p className="mt-1 text-xs text-slate-500">{o.desc}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xl font-bold text-slate-900">Your resumes</h2>
      {error && <p className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {resumes === null && !error && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
      {resumes?.length === 0 && <p className="mt-4 text-sm text-slate-500">No resumes yet — create your first one above.</p>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {resumes?.map((r) => (
          <div key={r._id} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
            <div className="flex items-start justify-between">
              <Link to={`/builder/${r._id}`} className="font-semibold text-slate-900 hover:text-blue-600">
                {r.title}
              </Link>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-500">{r.template}</span>
            </div>
            <p className="mt-1 text-xs text-slate-500">Updated {new Date(r.updatedAt).toLocaleDateString()}</p>
            <div className="mt-4 flex gap-2">
              <Link to={`/builder/${r._id}`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">
                Edit
              </Link>
              <button onClick={() => remove(r._id)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
