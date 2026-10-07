import { EMPTY_BASICS, FONTS } from '../../lib/resume.js'
import {
  Section,
  DateRange,
  bulletsOf,
  ExperienceBlock,
  ProjectsBlock,
  EducationBlock,
  SkillsBlock,
  CertsBlock,
  CustomBlocks,
  Header,
} from './ResumeTemplates.jsx'

function renderSections(c, vis, order) {
  const groups = [
    { key: 'summary', render: () => vis.summary && c.basics.summary ? <Section title="Summary"><p className="text-xs leading-relaxed text-slate-700">{c.basics.summary}</p></Section> : null },
    { key: 'experience', render: () => vis.experience ? <Section title="Experience">{ExperienceBlock({ c, compact: false })}</Section> : null },
    { key: 'education', render: () => vis.education ? <Section title="Education">{EducationBlock({ c })}</Section> : null },
    { key: 'projects', render: () => vis.projects ? <Section title="Projects">{ProjectsBlock({ c })}</Section> : null },
    { key: 'skills', render: () => vis.skills ? <Section title="Skills"><SkillsBlock c={c} /></Section> : null },
    { key: 'certifications', render: () => vis.certifications && c.certifications.length ? <Section title="Certifications"><ul className="list-disc space-y-0.5 pl-4 text-xs text-slate-700">{CertsBlock({ c })}</ul></Section> : null },
    { key: 'custom', render: () => <>{CustomBlocks({ c })}</> },
  ]
  return (
    <>
      {order.map((key) => {
        const g = groups.find((gg) => gg.key === key)
        return g ? g.render() : null
      })}
    </>
  )
}

/* --------------------------------- Timeline --------------------------------- */
function Timeline({ c, vis, order }) {
  const b = c.basics
  return (
    <div className="p-10">
      <Header b={b} />
      {renderSections(c, vis, order)}
    </div>
  )
}

/* --------------------------------- Compact ---------------------------------- */
function Compact({ c, vis, order }) {
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
          {order.includes('experience') && vis.experience ? (
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
          ) : null}
          {order.includes('projects') && vis.projects && c.projects.length > 0 && (
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
          {order.includes('custom') && <>{CustomBlocks({ c })}</>}
        </div>
        <div>
          {order.includes('education') && vis.education && c.education.length > 0 && (
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
          {order.includes('skills') && vis.skills && c.skills.length > 0 && (
            <Section title="Skills" dense>
              <div className="space-y-0.5 text-[11px] text-slate-700">
                {c.skills.map((s, i) => (
                  <div key={i}>· {s.name}</div>
                ))}
              </div>
            </Section>
          )}
          {order.includes('certifications') && vis.certifications && c.certifications.length > 0 && (
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
function Bold({ c, vis, order }) {
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
        {renderSections(c, vis, order)}
      </div>
    </div>
  )
}

/* --------------------------------- Elegant ---------------------------------- */
function Elegant({ c, vis, order }) {
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
      {renderSections(c, vis, order)}
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

function Modern({ c, vis, order }) {
  const b = c.basics
  return (
    <div className="p-10">
      <Header b={b} underline />
      {renderSections(c, vis, order)}
    </div>
  )
}

function Classic({ c, vis, order }) {
  const b = c.basics
  return (
    <div className="px-12 py-10 text-slate-800">
      <header className="text-center">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-slate-900">{b.fullName || 'Your Name'}</h1>
        <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-slate-600">
          {[b.email, b.phone, b.location, b.linkedin, b.github, b.portfolio].filter(Boolean).map((x, i) => (
            <span key={i}>{x}</span>
          ))}
        </div>
      </header>
      <div className="mt-4 space-y-4">
        {renderSections(c, vis, order)}
      </div>
    </div>
  )
}

function Minimal({ c, vis, order }) {
  const b = c.basics
  return (
    <div className="p-10 text-slate-800">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="text-xs font-medium text-slate-500">{b.headline}</p>}
        <div className="mt-1 text-xs text-slate-500">{[b.email, b.phone, b.location, b.linkedin].filter(Boolean).join('  ·  ')}</div>
      </header>
      {renderSections(c, vis, order)}
    </div>
  )
}

function Sidebar({ c, vis, order }) {
  const b = c.basics
  return (
    <div className="grid grid-cols-[32%_68%] text-slate-800">
      <aside className="p-6 text-white" style={{ backgroundColor: 'var(--accent)' }}>
        <div className="grid h-20 w-20 place-items-center rounded-full bg-white/20 text-2xl font-bold">
          {(b.fullName || 'YN')
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()}
        </div>
        <h1 className="mt-4 text-xl font-bold leading-tight">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="mt-1 text-[11px] leading-snug opacity-90">{b.headline}</p>}
        <div className="mt-5 space-y-1.5 text-[11px] opacity-95">
          {b.email && <p>✉ {b.email}</p>}
          {b.phone && <p>☎ {b.phone}</p>}
          {b.location && <p>📍 {b.location}</p>}
          {b.linkedin && <p>🔗 {b.linkedin}</p>}
          {b.github && <p>💻 {b.github}</p>}
          {b.portfolio && <p>🌐 {b.portfolio}</p>}
        </div>
        {vis.skills && c.skills.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest opacity-90">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-1">
              {c.skills.map((s, i) => (
                <span key={i} className="rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}
        {vis.certifications && c.certifications.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[11px] font-bold uppercase tracking-widest opacity-90">Certificates</h2>
            <ul className="mt-2 space-y-1 text-[11px] opacity-95">
              {c.certifications.map((cert, i) => (
                <li key={i}>{[cert.name, cert.year].filter(Boolean).join(' · ')}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <div className="p-8">
        {renderSections(c, vis, order)}
      </div>
    </div>
  )
}

export default function ResumePreview({ template = 'modern', accent = '#2563eb', font = 'sans', content, scale = 1, sectionOrder = [], hiddenSections = [] }) {
  const Variant = VARIANTS[template] || Modern
  const c = content || { basics: EMPTY_BASICS, skills: [], experience: [], education: [], projects: [], certifications: [], custom: [] }
  const defaults = ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'custom']
  const order = Array.isArray(sectionOrder) && sectionOrder.length ? sectionOrder.filter((k) => defaults.includes(k)) : defaults
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
        <Variant c={c} vis={vis} order={order} />
      </div>
    </div>
  )
}
