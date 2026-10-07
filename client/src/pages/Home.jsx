import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const FEATURES = [
  {
    to: '/builder/new',
    title: 'Build it yourself',
    desc: 'Guided editor with every section you need — experience, education, projects, skills, certifications and custom sections.',
    accent: 'var(--blue)',
  },
  {
    to: '/templates',
    title: '8 templates',
    desc: 'Modern, classic, minimal, sidebar, elegant, timeline, compact and bold. Switch anytime, keep your content.',
    accent: 'var(--accent)',
  },
  {
    to: '/ai',
    title: 'AI writes it',
    desc: 'Describe your target role and skills. Get a complete draft with quantified, action-verb bullets in seconds.',
    accent: 'var(--accent-2)',
  },
  {
    to: '/upload',
    title: 'Import a resume',
    desc: 'Upload an existing PDF, DOCX or TXT. We parse it into a fully editable resume with any template.',
    accent: '#f59e0b',
  },
  {
    to: '/cover-letter',
    title: 'Cover letter studio',
    desc: 'Generate tailored cover letters from your resume for any job description, ready to print or copy.',
    accent: '#10b981',
  },
  {
    to: '/dashboard',
    title: 'Beat the ATS',
    desc: 'Paste a job description and get keyword-gap analysis, match score and concrete edit suggestions.',
    accent: '#06b6d4',
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
  const heroRef = useRef(null)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    const timer = setTimeout(() => {
      if (mounted.current && heroRef.current) {
        heroRef.current.style.setProperty('--enter', '1')
      }
    }, 80)
    return () => {
      mounted.current = false
      clearTimeout(timer)
    }
  }, [])

  return (
    <main>
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative overflow-hidden"
        style={{ '--enter': '0' }}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[60vh] w-[80vw] opacity-[0.18] bg-[radial-gradient(ellipse_at_top,_rgba(108,92,231,0.55)_0%,_rgba(108,92,231,0)_70%)] blur-3xl" />
          <div className="absolute right-0 top-1/3 h-[40vh] w-[50vw] opacity-[0.10] bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.5)_0%,_rgba(59,130,246,0)_70%)] blur-3xl" />
        </div>

        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          {/* Eyebrow */}
          <div className="mb-6 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-1)] bg-[var(--bg-2)]/60 px-4 py-1.5 text-[11px] font-mono font-medium text-[var(--text-2)] backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-block h-full w-full rounded-full bg-[var(--accent)] animate-pulse" />
                <span className="absolute inset-0.5 rounded-full border border-[var(--bg-0)]" />
              </span>
              AI-powered resume builder
              <span className="ml-1.5 h-1 w-1 rounded-full bg-[var(--border-2)]" />
            </div>
          </div>

          {/* Headline */}
          <h1
            className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.04] tracking-tight"
            style={{ color: 'var(--text-0)' }}
          >
            Create a resume that
            <br />
            <span
              className="bg-[length:100%_auto,200%_auto] bg-[linear-gradient(135deg,transparent_0%,var(--accent)_28%,var(--accent-2)_55%,#f472b6_80%,transparent_100%)] bg-clip-text text-transparent"
              style={{ color: 'transparent' }}
            >
              gets you hired
            </span>
          </h1>

          {/* Sub */}
          <p
            className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-relaxed"
            style={{ color: 'var(--text-1)' }}
          >
            Build it yourself, start from a beautiful template, let AI write it, or import your existing resume.
            Then tailor it to any job with ATS keyword analysis and export a pixel-perfect PDF.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={user ? '/dashboard' : '/register'}
              className="btn btn-primary btn-lg group overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                {user ? 'Go to Dashboard' : "Start building — it's free"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-hover:translate-x-0.5">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>
            <Link
              to="/ai"
              className="btn btn-surface btn-lg"
            >
              <span className="flex items-center gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 5.5C8 11.5 8 13 9 14l6 7c1 1 2 2 3 2s2-1 3-2l6-7c1-1 1-2.5 0-3.5C18 9.5 16 8 12 8a4 4 0 0 1 4-4z" />
                </svg>
                Try AI Studio
              </span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="text-center"
              >
                <div
                  className="text-2xl font-bold tracking-tight"
                  style={{ color: 'var(--text-0)' }}
                >
                  {s.value}
                </div>
                <div
                  className="mt-1 text-[11px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--text-2)' }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--bg-0)] to-transparent pointer-events-none" />
      </section>

      {/* Features */}
      <section className="mt-24 pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 text-center animate-fade-up-big">
            <h2
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: 'var(--text-0)' }}
            >
              Six tools. One polished result.
            </h2>
            <p
              className="mt-3 max-w-xl text-sm leading-relaxed"
              style={{ color: 'var(--text-1)' }}
            >
              Every path lands in the same powerful editor: live A4 preview, AI bullet writer, resume scoring,
              job tailoring, custom sections, section reordering, sharing links and one-click PDF export.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Link
                key={f.title}
                to={f.to}
                className="panel panel-hover group flex items-start gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {/* Swatch */}
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: `linear-gradient(135deg, ${f.accent}22, ${f.accent}08)` }}
                >
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: f.accent, boxShadow: `0 0 12px ${f.accent}66` }}
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-2">
                    <h3
                      className="text-sm font-semibold tracking-tight"
                      style={{ color: 'var(--text-0)' }}
                    >
                      {f.title}
                    </h3>
                    <span className="ml-auto h-2 w-2 rounded-full bg-[var(--accent)]/40 group-hover:bg-[var(--accent)] transition-colors" />
                  </div>
                  <p
                    className="mt-1 flex-1 text-xs leading-relaxed"
                    style={{ color: 'var(--text-1)' }}
                  >
                    {f.desc}
                  </p>
                  <span
                    className="mt-2 text-[11px] font-medium group-hover:translate-x-0.5 transition-transform"
                    style={{ color: f.accent }}
                  >
                    Open &
bsp;→
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="px-4">
        <div className="max-w-5xl mx-auto divider" />
      </div>

      {/* Footer-ish micro section */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <code
            className="inline-block text-xs font-mono"
            style={{ color: 'var(--text-3)' }}
          >
            resume-forge-ai  ·  built for people who ship
          </code >
        </div>
      </section>
    </main>
  )
}
