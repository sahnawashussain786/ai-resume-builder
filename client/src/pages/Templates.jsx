import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { ACCENT_COLORS } from '../lib/resume.js'
import ResumePreview from '../components/templates/ResumeTemplates.jsx'

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
    summary:
      'Full-stack developer with 4 years of experience shipping web products end to end. Focused on React, Node.js and clean, maintainable systems.',
  },
  skills: [{ name: 'React' }, { name: 'Node.js' }, { name: 'MongoDB' }, { name: 'TypeScript' }, { name: 'Tailwind CSS' }, { name: 'AWS' }],
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
      bullets: ['Shipped 12+ client features with a 99.9% on-time record.', 'Automated the deploy pipeline, saving ~6 engineer-hours weekly.'],
    },
  ],
  education: [{ degree: 'B.S. Computer Science', school: 'UT Austin', location: '', start: '2017', end: '2021', notes: 'GPA 3.8' }],
  projects: [{ name: 'DevBoard', description: 'Kanban app with realtime collaboration, used by 2k+ developers.', link: 'github.com/alexmorgan/devboard' }],
  certifications: [{ name: 'AWS Solutions Architect – Associate', issuer: 'Amazon', year: '2024' }],
}

export default function Templates() {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [template, setTemplate] = useState('modern')
  const [accent, setAccent] = useState('#2563eb')

  const startWith = async () => {
    setBusy(true)
    try {
      const { data } = await api.post('/resumes', {
        title: 'My New Resume',
        template,
        accent,
        content: SAMPLE,
      })
      navigate(`/builder/${data._id}`)
    } catch {
      alert('Save failed — is the server running?')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-slate-900">Templates</h1>
      <p className="mt-2 text-slate-600">Pick a layout and accent color — you can change both later.</p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {ACCENT_COLORS.map((c) => (
          <button
            key={c}
            onClick={() => setAccent(c)}
            className={`h-7 w-7 rounded-full transition ${accent === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
            style={{ backgroundColor: c }}
            aria-label={`Accent ${c}`}
          />
        ))}
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {['modern', 'classic', 'minimal', 'sidebar', 'elegant'].map((t) => (
          <button
            key={t}
            onClick={() => setTemplate(t)}
            className={`rounded-2xl border-2 p-3 text-left transition ${template === t ? 'border-blue-600 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
          >
            <div className="overflow-hidden rounded-xl bg-slate-100">
              <ResumePreview template={t} accent={accent} content={SAMPLE} scale={0.32} />
            </div>
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="font-semibold capitalize text-slate-900">{t}</span>
              {template === t && <span className="text-xs font-semibold text-blue-600">Selected</span>}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={startWith}
          disabled={busy}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          {busy ? 'Creating…' : 'Start with this template →'}
        </button>
      </div>
    </main>
  )
}
