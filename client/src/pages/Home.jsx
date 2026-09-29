import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  {
    to: '/dashboard',
    title: 'Build it yourself',
    desc: 'Structured editor with guided sections: basics, experience, education, skills, projects & more.',
    icon: '✍️',
    cta: 'Open the builder',
  },
  {
    to: '/templates',
    title: 'Start from a template',
    desc: 'Pick from modern, classic, minimal, sidebar or elegant layouts — switch anytime.',
    icon: '🎨',
    cta: 'Browse templates',
  },
  {
    to: '/ai',
    title: 'Let AI write it',
    desc: 'Tell the AI your target role, skills and a bit about you. Get a full draft with quantified bullets.',
    icon: '🤖',
    cta: 'Open AI Studio',
  },
  {
    to: '/upload',
    title: 'Upload your resume',
    desc: 'Drop an existing PDF, DOCX or TXT — we parse it into an editable resume instantly.',
    icon: '📄',
    cta: 'Upload a resume',
  },
]

export default function Home() {
  const { user } = useAuth()
  return (
    <main>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
          <span className="inline-block rounded-full border border-blue-200 bg-blue-50 px-4 py-1 text-sm font-medium text-blue-700">
            AI-powered resume builder
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Create a standout resume in <span className="text-blue-600">minutes</span>, not hours
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            Build manually, start from a beautiful template, let AI write it for you, or import your existing resume. Export to PDF when you're done.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              {user ? 'Go to Dashboard' : 'Start building — it\'s free'}
            </Link>
            <Link
              to="/ai"
              className="rounded-xl border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Try AI Studio
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-4xl">{f.icon}</div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{f.desc}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-blue-600 group-hover:underline">{f.cta} →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">Four ways in. One polished result.</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            Every path lands in the same powerful editor with live preview, multiple templates, AI bullet improvement and one-click PDF export.
          </p>
        </div>
      </section>
    </main>
  )
}
