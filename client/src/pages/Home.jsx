import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  {
    to: '/builder/new',
    title: 'Build it yourself',
    desc: 'Guided editor with every section you need — experience, education, projects, skills, certifications and custom sections.',
    icon: '✍️',
    grad: 'from-blue-500 to-indigo-600',
  },
  {
    to: '/templates',
    title: '8 stunning templates',
    desc: 'Modern, classic, minimal, sidebar, elegant, timeline, compact and bold. Switch anytime, keep your content.',
    icon: '🎨',
    grad: 'from-pink-500 to-rose-600',
  },
  {
    to: '/ai',
    title: 'Let AI write it',
    desc: 'Describe your target role and skills. Get a complete draft with quantified, action-verb bullets in seconds.',
    icon: '🤖',
    grad: 'from-violet-500 to-purple-600',
  },
  {
    to: '/upload',
    title: 'Import your resume',
    desc: 'Upload an existing PDF, DOCX or TXT. We parse it into a fully editable resume with any template.',
    icon: '📄',
    grad: 'from-amber-500 to-orange-600',
  },
  {
    to: '/cover-letter',
    title: 'Cover letter studio',
    desc: 'Generate tailored cover letters from your resume for any job description, ready to print or copy.',
    icon: '💌',
    grad: 'from-emerald-500 to-teal-600',
  },
  {
    to: '/dashboard',
    title: 'Beat the ATS',
    desc: 'Paste a job description and get keyword-gap analysis, match score and concrete edit suggestions.',
    icon: '🎯',
    grad: 'from-cyan-500 to-sky-600',
  },
]

const STATS = [
  { value: '8', label: 'Templates' },
  { value: '12+', label: 'Accent colors' },
  { value: '100%', label: 'Free & private' },
  { value: '1-click', label: 'PDF export' },
]

export default function Home() {
  const { user } = useAuth()
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-violet-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute -left-24 top-10 -z-10 h-96 w-96 animate-blob bg-blue-200/40 dark:bg-blue-900/30" />
        <div className="absolute -right-24 top-40 -z-10 h-96 w-96 animate-blob bg-violet-200/40 dark:bg-violet-900/30" style={{ animationDelay: '-6s' }} />
        <div className="mx-auto max-w-7xl px-4 py-28 text-center sm:px-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur dark:border-blue-800 dark:bg-slate-800/70 dark:text-blue-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />
            AI-powered resume builder
          </span>
          <h1 className="mx-auto mt-8 max-w-4xl text-5xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-7xl dark:text-white">
            Create a resume that <span className="bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 bg-clip-text text-transparent">gets you hired</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
            Build it yourself, start from a beautiful template, let AI write it, or import your existing resume.
            Then tailor it to any job with ATS keyword analysis and export a pixel-perfect PDF.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-9 py-4 text-lg font-bold text-white shadow-xl shadow-blue-600/25 transition hover:scale-[1.02]"
            >
              <span className="relative z-10">{user ? 'Go to Dashboard →' : "Start building — it's free →"}</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-violet-600 to-pink-600 transition-transform duration-300 group-hover:translate-x-0" />
            </Link>
            <Link
              to="/ai"
              className="rounded-2xl border border-slate-300 bg-white/80 px-9 py-4 text-lg font-semibold text-slate-700 shadow-sm backdrop-blur transition hover:bg-white dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-200"
            >
              ✨ Try AI Studio
            </Link>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur dark:border-slate-700 dark:bg-slate-800/70">
                <div className="text-2xl font-black text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Link
              key={f.title}
              to={f.to}
              className={`group rounded-3xl bg-gradient-to-br ${f.grad} p-[1.5px] shadow-sm transition hover:-translate-y-1 hover:shadow-xl animate-fade-up`}
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex h-full flex-col rounded-3xl bg-white p-6 dark:bg-slate-900">
                <div className="text-4xl transition group-hover:scale-110">{f.icon}</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="mt-2 flex-1 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
                <span className="mt-4 inline-block text-sm font-bold text-blue-600 group-hover:underline dark:text-blue-400">Explore →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-slate-200 bg-white py-20 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Four ways in. One polished result.</h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600 dark:text-slate-400">
            Every path lands in the same powerful editor: live A4 preview, AI bullet writer, resume scoring,
            job tailoring, custom sections, section reordering, sharing links and one-click PDF export.
          </p>
        </div>
      </section>
    </main>
  )
}
