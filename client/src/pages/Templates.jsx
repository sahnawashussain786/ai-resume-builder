import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { ACCENT_COLORS, TEMPLATE_IDS, FONTS } from '../lib/resume.js'
import ResumePreview from '../components/templates/index.js'
import { useToast } from '../components/Toast.jsx'

const SAMPLE = {
  basics: {
    fullName: 'Alex Morgan',
    headline: 'Full-Stack Developer',
    email: 'alex@example.com',
    phone: '+1 555 010 2030',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    portfolio: 'alexmorgan.dev',
    summary: 'Full-stack developer with 4 years of experience shipping web products end to end. Focused on React, Node.js and clean, maintainable systems.',
  },
  skills: [
    { name: 'React' },
    { name: 'Node.js' },
    { name: 'MongoDB' },
    { name: 'TypeScript' },
    { name: 'Tailwind CSS' },
    { name: 'AWS' },
  ],
  experience: [
    {
      role: 'Senior Frontend Developer',
      company: 'TechNova',
      location: 'Remote',
      start: '2023',
      end: 'Present',
      bullets: [
        'Led the migration of a 200k-user dashboard to React, cutting load time by 38%.',
        'Mentored 3 junior developers and introduced a component testing standard.',
      ],
    },
    {
      role: 'Web Developer',
      company: 'BrightApps',
      location: 'Austin, TX',
      start: '2021',
      end: '2023',
      bullets: [
        'Shipped 12+ client features with a 99.9% on-time record.',
        'Automated the deploy pipeline, saving ~6 engineer-hours weekly.',
      ],
    },
  ],
  education: [
    {
      degree: 'B.S. Computer Science',
      school: 'UT Austin',
      location: '',
      start: '2017',
      end: '2021',
      notes: 'GPA 3.8',
    },
  ],
  projects: [
    {
      name: 'DevBoard',
      description: 'Kanban app with realtime collaboration, used by 2k+ developers.',
      link: 'github.com/alexmorgan/devboard',
    },
  ],
  certifications: [
    { name: 'AWS Solutions Architect – Associate', issuer: 'Amazon', year: '2024' },
  ],
  custom: [],
}

export default function Templates() {
  const navigate = useNavigate()
  const toast = useToast()
  const [busy, setBusy] = useState(false)
  const [template, setTemplate] = useState('modern')
  const [accent, setAccent] = useState('#6c5ce7')
  const [font, setFont] = useState('sans')

  const startWith = async () => {
    setBusy(true)
    try {
      const { data } = await api.post('/resumes', {
        title: 'My New Resume',
        template,
        accent,
        font,
        content: SAMPLE,
      })
      navigate(`/builder/${data._id}`)
    } catch {
      toast('Save failed — is the server running?', 'error')
    } finally {
      setBusy(false)
    }
  }

  const isSelected = (t) =>
    template === t
      ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--accent-2)]'
      : 'border-[var(--border-1)] hover:border-[var(--border-2)]'

  return (
    <main className="animate-fade-in">
      <div className="mb-2 flex items-center gap-2">
        <span className="badge badge-accent badge-mono">DESIGN</span>
        <span className="text-xs font-mono" style={{ color: 'var(--text-2)' }}>
          /templates
        </span>
      </div>
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
          Templates
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
          Pick a layout, accent color and font — you can change all of it later.
        </p>
      </div>

      {/* Controls */}
      <div className="mt-6 panel flex flex-wrap items-center gap-4">
        {/* Accent */}
        <div className="flex-1">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
            Accent color
          </div>
          <div className="flex flex-wrap gap-2">
            {ACCENT_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className={`h-7 w-7 rounded-full transition ${accent === c ? 'ring-2 ring-[var(--text-0)] ring-offset-2 ring-offset-[var(--bg-2)]' : ''}`}
                style={{ backgroundColor: c }}
                aria-label={`Accent ${c}`}
              />
            ))}
          </div>
        </div>
        {/* Font */}
        <div className="flex-1">
          <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
            Font
          </div>
          <select
            value={font}
            onChange={(e) => setFont(e.target.value)}
            className="input w-full max-w-[200px]"
          >
            {FONTS.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_IDS.map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={`rounded-xl border-2 text-left transition ${isSelected(t)}`}
          >
            <div className="overflow-hidden rounded-lg bg-[var(--bg-1)]">
              <ResumePreview
                template={t}
                accent={accent}
                font={font}
                content={SAMPLE}
                scale={0.28}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between px-1">
              <span className="text-sm font-semibold capitalize" style={{ color: 'var(--text-0)' }}>
                {t}
              </span>
              {template === t && (
                <span className="text-[10px] font-mono border border-[var(--accent)] rounded px-1.5 py-0.5" style={{ color: 'var(--accent-2)' }}>
                  selected
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={startWith}
          disabled={busy}
          className="btn btn-primary btn-lg"
        >
          {busy ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Creating…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
              Start with this template
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>
      </div>
    </main>
  )
}
