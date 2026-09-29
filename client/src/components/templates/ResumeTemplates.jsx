import { EMPTY_BASICS } from '../../lib/resume.js'

function Section({ title, children, className = '' }) {
  if (!children) return null
  return (
    <section className={`mt-4 ${className}`}>
      <h2 className="mb-1 text-[11px] font-bold uppercase tracking-widest">{title}</h2>
      {children}
    </section>
  )
}

function DateRange({ start, end }) {
  if (!start && !end) return null
  return (
    <span className="text-[11px] opacity-70">
      {start}
      {start && end ? ' – ' : ''}
      {end || 'Present'}
    </span>
  )
}

function useBulletsOf(item) {
  return (item.bullets && item.bullets.length ? item.bullets : item.description ? [item.description] : []).filter(Boolean)
}

/* ---------------------------------- Modern --------------------------------- */
function Modern({ c }) {
  const b = c.basics || EMPTY_BASICS
  return (
    <div className="p-10" style={{ color: '#1f2937' }}>
      <header className="border-b-2 pb-4" style={{ borderColor: 'var(--accent)' }}>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="mt-1 text-sm font-medium" style={{ color: 'var(--accent)' }}>{b.headline}</p>}
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
          {b.email && <span>✉ {b.email}</span>}
          {b.phone && <span>☎ {b.phone}</span>}
          {b.location && <span>📍 {b.location}</span>}
          {b.linkedin && <span>🔗 {b.linkedin}</span>}
          {b.github && <span>💻 {b.github}</span>}
          {b.portfolio && <span>🌐 {b.portfolio}</span>}
        </div>
      </header>
      {b.summary && (
        <Section title="Summary">
          <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
        </Section>
      )}
      <Section title="Experience">
        {c.experience.map((e, i) => (
          <div key={i} className="mb-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">{e.role || 'Role'}</span>
              <DateRange start={e.start} end={e.end} />
            </div>
            <div className="text-xs font-semibold text-slate-600">{[e.company, e.location].filter(Boolean).join(' • ')}</div>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
              {useBulletsOf(e).map((t, j) => (
                <li key={j}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
      <Section title="Projects">
        {c.projects.map((p, i) => (
          <div key={i} className="mb-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">{p.name}</span>
              {p.link && <span className="text-[11px] text-slate-500">{p.link}</span>}
            </div>
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
              {useBulletsOf(p).map((t, j) => (
                <li key={j}>{t}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
      <Section title="Education">
        {c.education.map((ed, i) => (
          <div key={i} className="mb-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-bold text-slate-900">{ed.degree}</span>
              <DateRange start={ed.start} end={ed.end} />
            </div>
            <div className="text-xs font-semibold text-slate-600">{[ed.school, ed.location].filter(Boolean).join(' • ')}</div>
            {ed.notes && <div className="text-xs text-slate-500">{ed.notes}</div>}
          </div>
        ))}
      </Section>
      <Section title="Skills">
        <div className="flex flex-wrap gap-1.5">
          {c.skills.map((s, i) => (
            <span key={i} className="rounded-full px-2 py-0.5 text-[11px] font-medium" style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 12%, white)', color: 'var(--accent)' }}>
              {s.name}
            </span>
          ))}
        </div>
      </Section>
      {c.certifications.length > 0 && (
        <Section title="Certifications">
          <ul className="list-disc space-y-0.5 pl-4 text-xs text-slate-700">
            {c.certifications.map((cert, i) => (
              <li key={i}>{[cert.name, cert.issuer, cert.year].filter(Boolean).join(' — ')}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  )
}

/* ---------------------------------- Classic --------------------------------- */
function Classic({ c }) {
  const b = c.basics || EMPTY_BASICS
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
        {b.summary && (
          <Section title="Professional Summary">
            <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
          </Section>
        )}
        <Section title="Experience">
          {c.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold">{[e.role, e.company].filter(Boolean).join(', ')}</span>
                <DateRange start={e.start} end={e.end} />
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                {useBulletsOf(e).map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
        <Section title="Education">
          {c.education.map((ed, i) => (
            <div key={i} className="flex items-baseline justify-between">
              <span className="text-sm font-bold">{[ed.degree, ed.school].filter(Boolean).join(', ')}</span>
              <DateRange start={ed.start} end={ed.end} />
            </div>
          ))}
        </Section>
        <Section title="Skills">
          <p className="text-xs text-slate-700">{c.skills.map((s) => s.name).join(' • ')}</p>
        </Section>
        {c.projects.length > 0 && (
          <Section title="Projects">
            {c.projects.map((p, i) => (
              <div key={i} className="mb-2">
                <span className="text-sm font-bold">{p.name}</span>
                {p.link && <span className="text-[11px] text-slate-500"> — {p.link}</span>}
                <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                  {useBulletsOf(p).map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}
      </div>
    </div>
  )
}

/* --------------------------------- Minimal --------------------------------- */
function Minimal({ c }) {
  const b = c.basics || EMPTY_BASICS
  return (
    <div className="p-10 text-slate-800">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="text-xs font-medium text-slate-500">{b.headline}</p>}
        <div className="mt-1 text-xs text-slate-500">{[b.email, b.phone, b.location, b.linkedin].filter(Boolean).join('  ·  ')}</div>
      </header>
      {b.summary && (
        <Section title="About">
          <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
        </Section>
      )}
      <Section title="Experience">
        {c.experience.map((e, i) => (
          <div key={i} className="mb-3 grid grid-cols-[110px_1fr] gap-3">
            <div className="text-[11px] text-slate-500">
              {e.start}
              {e.start && e.end ? ' – ' : ''}
              {e.end || 'Present'}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{e.role}</div>
              <div className="text-xs text-slate-600">{[e.company, e.location].filter(Boolean).join(' · ')}</div>
              <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
                {useBulletsOf(e).map((t, j) => (
                  <li key={j}>– {t}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </Section>
      <Section title="Education">
        {c.education.map((ed, i) => (
          <div key={i} className="mb-2 grid grid-cols-[110px_1fr] gap-3">
            <div className="text-[11px] text-slate-500">
              {ed.start}
              {ed.start && ed.end ? ' – ' : ''}
              {ed.end || ''}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">{ed.degree}</div>
              <div className="text-xs text-slate-600">{[ed.school, ed.location].filter(Boolean).join(' · ')}</div>
              {ed.notes && <div className="text-xs text-slate-500">{ed.notes}</div>}
            </div>
          </div>
        ))}
      </Section>
      <Section title="Skills">
        <p className="text-xs text-slate-700">{c.skills.map((s) => s.name).join(' · ')}</p>
      </Section>
      {c.projects.length > 0 && (
        <Section title="Projects">
          {c.projects.map((p, i) => (
            <div key={i} className="mb-2 text-xs">
              <span className="font-bold text-slate-900">{p.name}</span>
              {p.link ? <span className="text-slate-500"> · {p.link}</span> : null}
              <div className="text-slate-700">{p.description}</div>
            </div>
          ))}
        </Section>
      )}
    </div>
  )
}

/* --------------------------------- Sidebar --------------------------------- */
function Sidebar({ c }) {
  const b = c.basics || EMPTY_BASICS
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
        </div>
        {c.skills.length > 0 && (
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
        {c.certifications.length > 0 && (
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
        {b.summary && (
          <Section title="Profile">
            <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
          </Section>
        )}
        <Section title="Experience">
          {c.experience.map((e, i) => (
            <div key={i} className="mb-3">
              <div className="text-sm font-bold text-slate-900">{e.role}</div>
              <div className="text-xs font-semibold text-slate-600">
                {[e.company, e.location].filter(Boolean).join(' · ')} <span className="font-normal text-slate-400">| {e.start}{e.start && e.end ? ' – ' : ''}{e.end || 'Present'}</span>
              </div>
              <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                {useBulletsOf(e).map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
        <Section title="Projects">
          {c.projects.map((p, i) => (
            <div key={i} className="mb-2">
              <span className="text-sm font-bold text-slate-900">{p.name}</span>
              {p.link && <span className="text-[11px] text-slate-500"> · {p.link}</span>}
              <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                {useBulletsOf(p).map((t, j) => (
                  <li key={j}>{t}</li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
        <Section title="Education">
          {c.education.map((ed, i) => (
            <div key={i} className="mb-2">
              <div className="text-sm font-bold text-slate-900">{ed.degree}</div>
              <div className="text-xs text-slate-600">
                {[ed.school, ed.location].filter(Boolean).join(' · ')} <span className="text-slate-400">{ed.start}{ed.start && ed.end ? ' – ' : ''}{ed.end}</span>
              </div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  )
}

/* --------------------------------- Elegant --------------------------------- */
function Elegant({ c }) {
  const b = c.basics || EMPTY_BASICS
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
      {b.summary && (
        <Section title="Profile" className="text-center">
          <p className="mx-auto max-w-lg text-xs italic leading-relaxed text-slate-700">{b.summary}</p>
          </Section>
      )}
      <Section title="Experience">
        {c.experience.map((e, i) => (
          <div key={i} className="mb-3 text-center sm:text-left">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{e.role}</span>
              <DateRange start={e.start} end={e.end} />
            </div>
            <div className="text-xs text-slate-600">{[e.company, e.location].filter(Boolean).join(' · ')}</div>
            <ul className="mt-1 space-y-0.5 text-xs text-slate-700">
              {useBulletsOf(e).map((t, j) => (
                <li key={j}>· {t}</li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
      <Section title="Projects">
        {c.projects.map((p, i) => (
          <div key={i} className="mb-2">
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{p.name}</span>
              {p.link && <span className="text-[11px] text-slate-500">{p.link}</span>}
            </div>
            <div className="text-xs text-slate-700">{p.description}</div>
          </div>
        ))}
      </Section>
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
      <Section title="Skills" className="text-center">
        <p className="text-xs text-slate-700">{c.skills.map((s) => s.name).join('  ·  ')}</p>
      </Section>
    </div>
  )
}

/* --------------------------------- Registry -------------------------------- */
export const TEMPLATE_IDS = ['modern', 'classic', 'minimal', 'sidebar', 'elegant']

const VARIANTS = { modern: Modern, classic: Classic, minimal: Minimal, sidebar: Sidebar, elegant: Elegant }

export default function ResumePreview({ template = 'modern', accent = '#2563eb', content, scale = 1 }) {
  const Variant = VARIANTS[template] || Modern
  return (
    <div
      className="resume-page mx-auto bg-white shadow-xl ring-1 ring-slate-200"
      style={{ width: 794 * scale, height: 1123 * scale, overflow: 'hidden' }}
    >
      <div
        style={{
          ['--accent']: accent,
          width: '794px',
          height: '1123px',
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        <Variant c={content} />
      </div>
    </div>
  )
}
