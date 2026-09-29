import { EMPTY_BASICS, FONTS } from '../../lib/resume.js'
import {
  Section,
  DateRange,
  bulletsOf,
  ProjectsBlock,
  SkillsBlock,
  CertsBlock,
  CustomBlocks,
  Header,
  Modern,
  Classic,
  Minimal,
  Sidebar,
} from './ResumeTemplates.jsx'

/* --------------------------------- Timeline --------------------------------- */
function Timeline({ c, vis }) {
  const b = c.basics
  return (
    <div className="p-10">
      <Header b={b} />
      {vis.summary && b.summary && (
        <Section title="Summary">
          <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
        </Section>
      )}
      {vis.experience && c.experience.length > 0 && (
        <Section title="Experience">
          <div className="relative ml-2 border-l-2 pl-5" style={{ borderColor: 'color-mix(in srgb, var(--accent) 35%, white)' }}>
            {c.experience.map((e, i) => (
              <div key={i} className="relative mb-4">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--accent)' }} />
                <div className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
                  {e.start}
                  {e.start && e.end ? ' – ' : ''}
                  {e.end || 'Present'}
                </div>
                <div className="text-sm font-bold text-slate-900">{e.role}</div>
                <div className="text-xs text-slate-600">{[e.company, e.location].filter(Boolean).join(' · ')}</div>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                  {bulletsOf(e).map((t, j) => (
                    <li key={j}>· {t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      )}
      {vis.education && c.education.length > 0 && (
        <Section title="Education">
          <div className="relative ml-2 border-l-2 pl-5" style={{ borderColor: 'color-mix(in srgb, var(--accent) 35%, white)' }}>
            {c.education.map((ed, i) => (
              <div key={i} className="relative mb-3">
                <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--accent)' }} />
                <div className="text-[11px] font-semibold" style={{ color: 'var(--accent)' }}>
                  {ed.start}
                  {ed.start && ed.end ? ' – ' : ''}
                  {ed.end}
                </div>
                <div className="text-sm font-bold text-slate-900">{ed.degree}</div>
                <div className="text-xs text-slate-600">{[ed.school, ed.location].filter(Boolean).join(' · ')}</div>
                {ed.notes && <div className="text-xs text-slate-500">{ed.notes}</div>}
              </div>
            ))}
          </div>
        </Section>
      )}
      {vis.projects && <Section title="Projects">{ProjectsBlock({ c })}</Section>}
      {vis.skills && (
        <Section title="Skills">
          <SkillsBlock c={c} />
        </Section>
      )}
      {vis.certifications && c.certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-slate-700">{CertsBlock({ c })}</ul>
        </Section>
      )}
      {CustomBlocks({ c })}
    </div>
  )
}

/* --------------------------------- Compact ---------------------------------- */
function Compact({ c, vis }) {
  const b = c.basics
  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between gap-4 border-b pb-3" style={{ borderColor: 'color-mix(in srgb, var(--accent) 30%, white)' }}>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{b.fullName || 'Your Name'}</h1>
          {b.headline && (
            <p className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
              {b.headline}
            </p>
          )}
        </div>
        <div className="text-right text-[10px] leading-relaxed text-slate-500">
          {b.email && <div>{b.email}</div>}
          {b.phone && <div>{b.phone}</div>}
          {b.location && <div>{b.location}</div>}
          {b.linkedin && <div>{b.linkedin}</div>}
          {b.github && <div>{b.github}</div>}
          {b.portfolio && <div>{b.portfolio}</div>}
        </div>
      </div>
      {vis.summary && b.summary && <p className="mt-3 text-[11px] leading-relaxed text-slate-700">{b.summary}</p>}
      <div className="mt-2 grid grid-cols-[68%_32%] gap-6">
        <div>
          {vis.experience && c.experience.length > 0 && (
            <Section title="Experience" dense>
              {c.experience.map((e, i) => (
                <div key={i} className="mb-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      {e.role}
                      {e.company ? `, ${e.company}` : ''}
                    </span>
                    <DateRange start={e.start} end={e.end} />
                  </div>
                  <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-[11px] leading-snug text-slate-700">
                    {bulletsOf(e).map((t, j) => (
                      <li key={j}>{t}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </Section>
          )}
          {vis.projects && c.projects.length > 0 && (
            <Section title="Projects" dense>
              {c.projects.map((p, i) => (
                <div key={i} className="mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{p.name}</span>
                  {p.link && <span className="text-[10px] text-slate-500"> · {p.link}</span>}
                  <div className="text-[11px] text-slate-700">{p.description}</div>
                </div>
              ))}
            </Section>
          )}
          {CustomBlocks({ c })}
        </div>
        <div>
          {vis.education && c.education.length > 0 && (
            <Section title="Education" dense>
              {c.education.map((ed, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs font-bold text-slate-900">{ed.degree}</div>
                  <div className="text-[11px] text-slate-600">{ed.school}</div>
                  <DateRange start={ed.start} end={ed.end} />
                  {ed.notes && <div className="text-[10px] text-slate-500">{ed.notes}</div>}
                </div>
              ))}
            </Section>
          )}
          {vis.skills && c.skills.length > 0 && (
            <Section title="Skills" dense>
              <div className="space-y-0.5 text-[11px] text-slate-700">
                {c.skills.map((s, i) => (
                  <div key={i}>· {s.name}</div>
                ))}
              </div>
            </Section>
          )}
          {vis.certifications && c.certifications.length > 0 && (
            <Section title="Certs" dense>
              <div className="space-y-1 text-[11px] text-slate-700">
                {c.certifications.map((cert, i) => (
                  <div key={i}>{[cert.name, cert.year].filter(Boolean).join(' · ')}</div>
                ))}
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------- Bold ----------------------------------- */
function Bold({ c, vis }) {
  const b = c.basics
  return (
    <div className="text-white" style={{ backgroundColor: '#111827' }}>
      <div className="px-10 pt-10 pb-6" style={{ background: 'linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 55%, #111827))' }}>
        <h1 className="text-4xl font-black tracking-tight">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] opacity-90">{b.headline}</p>}
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] opacity-90">
          {[b.email, b.phone, b.location, b.linkedin, b.github, b.portfolio].filter(Boolean).map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
      </div>
      <div className="px-10 py-8">
        {vis.summary && b.summary && <p className="text-xs leading-relaxed text-slate-300">{b.summary}</p>}
        {vis.experience && c.experience.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
              Experience
            </h2>
            {c.experience.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold text-white">{e.role}</span>
                  <span className="text-[11px] text-slate-400">
                    {e.start}
                    {e.start && e.end ? ' – ' : ''}
                    {e.end || 'Present'}
                  </span>
                </div>
                <div className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                  {[e.company, e.location].filter(Boolean).join(' · ')}
                </div>
                <ul className="mt-1 space-y-0.5 text-xs text-slate-300">
                  {bulletsOf(e).map((t, j) => (
                    <li key={j}>▸ {t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {vis.projects && c.projects.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
              Projects
            </h2>
            {c.projects.map((p, i) => (
              <div key={i} className="mb-2">
                <span className="text-sm font-bold text-white">{p.name}</span>
                {p.link && <span className="text-[11px] text-slate-400"> · {p.link}</span>}
                <div className="text-xs text-slate-300">{p.description}</div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 grid grid-cols-2 gap-6">
          {vis.education && c.education.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                Education
              </h2>
              {c.education.map((ed, i) => (
                <div key={i} className="mb-2">
                  <div className="text-xs font-bold text-white">{ed.degree}</div>
                  <div className="text-[11px] text-slate-400">{[ed.school, ed.start, ed.end].filter(Boolean).join(' · ')}</div>
                </div>
              ))}
            </div>
          )}
          {vis.skills && c.skills.length > 0 && (
            <div>
              <h2 className="mb-2 text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
                Skills
              </h2>
              <div className="flex flex-wrap gap-1">
                {c.skills.map((s, i) => (
                  <span key={i} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-slate-200">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        {vis.certifications && c.certifications.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2 text-xs font-black uppercase tracking-[0.3em]" style={{ color: 'var(--accent)' }}>
              Certifications
            </h2>
            <div className="text-xs text-slate-300">
              {c.certifications.map((cert, i) => (
                <div key={i}>▸ {[cert.name, cert.issuer, cert.year].filter(Boolean).join(' · ')}</div>
              ))}
            </div>
          </div>
        )}
        {CustomBlocks({ c })}
      </div>
    </div>
  )
}

/* --------------------------------- Elegant ---------------------------------- */
function Elegant({ c, vis }) {
  const b = c.basics
  return (
    <div className="px-12 py-10 text-slate-800">
      <header className="text-center" style={{ color: 'var(--accent)' }}>
        <h1 className="text-4xl font-light tracking-wide">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="mt-1 text-xs uppercase tracking-[0.35em]">{b.headline}</p>}
        <div className="mx-auto mt-3 h-px w-24" style={{ backgroundColor: 'var(--accent)' }} />
        <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] text-slate-600">
          {[b.email, b.phone, b.location, b.linkedin, b.github, b.portfolio].filter(Boolean).map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
      </header>
      {vis.summary && b.summary && (
        <Section title="Profile" className="text-center">
          <p className="mx-auto max-w-lg text-xs italic leading-relaxed text-slate-700">{b.summary}</p>
        </Section>
      )}
      {vis.experience && (
        <Section title="Experience">
          {c.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  {e.role}
                </span>
                <DateRange start={e.start} end={e.end} />
              </div>
              <div className="text-xs text-slate-600">{[e.company, e.location].filter(Boolean).join(' · ')}</div>
              <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                {bulletsOf(e).map((t, j) => (
                  <li key={j}>· {t}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      )}
      {vis.projects && (
        <Section title="Projects">
          {c.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                  {p.name}
                </span>
                {p.link && <span className="text-[11px] text-slate-500">{p.link}</span>}
              </div>
              <div className="text-xs text-slate-700">{p.description}</div>
            </div>
          ))}
        </Section>
      )}
      {vis.education && (
        <Section title="Education">
          {c.education.map((ed, i) => (
            <div key={i} className="flex items-baseline justify-between">
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                {[ed.degree, ed.school].filter(Boolean).join(' — ')}
              </span>
              <DateRange start={ed.start} end={ed.end} />
            </div>
          ))}
        </Section>
      )}
      {vis.skills && (
        <Section title="Skills" className="text-center">
          <p className="text-xs text-slate-700">{c.skills.map((s) => s.name).join('  ·  ')}</p>
        </Section>
      )}
      {vis.certifications && c.certifications.length > 0 && (
        <Section title="Certifications" className="text-center">
          <p className="text-xs text-slate-700">{c.certifications.map((x) => x.name).join('  ·  ')}</p>
        </Section>
      )}
      {CustomBlocks({ c })}
    </div>
  )
}

/* --------------------------------- Registry --------------------------------- */

const VARIANTS = {
  modern: Modern,
  classic: Classic,
  minimal: Minimal,
  sidebar: Sidebar,
  elegant: Elegant,
  timeline: Timeline,
  compact: Compact,
  bold: Bold,
}

export default function ResumePreview({ template = 'modern', accent = '#2563eb', font = 'sans', content, scale = 1, sectionOrder = [], hiddenSections = [] }) {
  const Variant = VARIANTS[template] || Modern
  const c = content || { basics: EMPTY_BASICS, skills: [], experience: [], education: [], projects: [], certifications: [], custom: [] }
  const defaults = ['summary', 'experience', 'projects', 'education', 'skills', 'certifications', 'custom']
  const hidden = new Set(hiddenSections || [])
  const vis = {}
  for (const k of defaults) vis[k] = !hidden.has(k)
  const fontStack = (FONTS.find((f) => f.id === font) || FONTS[0]).stack

  return (
    <div className="resume-page mx-auto bg-white shadow-xl ring-1 ring-slate-200" style={{ width: 794 * scale, height: 1123 * scale, overflow: 'hidden' }}>
      <div
        style={{
          '--accent': accent,
          width: '794px',
          height: '1123px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          fontFamily: fontStack,
        }}
      >
        <Variant c={c} vis={vis} />
      </div>
    </div>
  )
}
