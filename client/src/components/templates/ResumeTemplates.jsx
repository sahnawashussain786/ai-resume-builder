
function Section({ title, children, className = '', dense = false }) {
  if (!children || (Array.isArray(children) && children.length === 0)) return null
  return (
    <section className={`${dense ? 'mt-2.5' : 'mt-4'} ${className}`}>
      <h2 className="mb-1 text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
        {title}
      </h2>
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

function bulletsOf(item) {
  return (item.bullets && item.bullets.length ? item.bullets : item.description ? [item.description] : []).filter(Boolean)
}

function ExperienceBlock({ c, compact = false }) {
  return c.experience.map((e, i) => (
    <div key={i} className={compact ? 'mb-2' : 'mb-3'}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-slate-900 dark:text-slate-900">{e.role || 'Role'}</span>
        <DateRange start={e.start} end={e.end} />
      </div>
      <div className="text-xs font-semibold text-slate-600">{[e.company, e.location].filter(Boolean).join(' • ')}</div>
      <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
        {bulletsOf(e).map((t, j) => (
          <li key={j}>{t}</li>
        ))}
      </ul>
    </div>
  ))
}

function ProjectsBlock({ c }) {
  return c.projects.map((p, i) => (
    <div key={i} className="mb-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-slate-900">{p.name}</span>
        {p.link && <span className="text-[11px] text-slate-500">{p.link}</span>}
      </div>
      <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
        {bulletsOf(p).map((t, j) => (
          <li key={j}>{t}</li>
        ))}
      </ul>
    </div>
  ))
}

function EducationBlock({ c }) {
  return c.education.map((ed, i) => (
    <div key={i} className="mb-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm font-bold text-slate-900">{ed.degree}</span>
        <DateRange start={ed.start} end={ed.end} />
      </div>
      <div className="text-xs font-semibold text-slate-600">{[ed.school, ed.location].filter(Boolean).join(' • ')}</div>
      {ed.notes && <div className="text-xs text-slate-500">{ed.notes}</div>}
    </div>
  ))
}

function SkillsBlock({ c }) {
  if (!c.skills.length) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {c.skills.map((s, i) => (
        <span
          key={i}
          className="rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{ backgroundColor: 'color-mix(in srgb, var(--accent) 12%, white)', color: 'var(--accent)' }}
        >
          {s.name}
        </span>
      ))}
    </div>
  )
}

function CertsBlock({ c }) {
  return c.certifications.map((cert, i) => <li key={i}>{[cert.name, cert.issuer, cert.year].filter(Boolean).join(' — ')}</li>)
}

function CustomBlocks({ c }) {
  return (c.custom || []).map((s, i) => (
    <Section key={i} title={s.heading}>
      {s.items.map((it, j) => (
        <div key={j} className="mb-2">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm font-bold text-slate-900">{it.title}</span>
            <DateRange start={it.start} end={it.end} />
          </div>
          {it.subtitle && <div className="text-xs font-semibold text-slate-600">{it.subtitle}</div>}
          {it.description && <div className="text-xs text-slate-700">{it.description}</div>}
          {it.bullets.length > 0 && (
            <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
              {it.bullets.map((b, k) => (
                <li key={k}>{b}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </Section>
  ))
}

function Header({ b, center = false, underline = false }) {
  return (
    <header className={`${center ? 'text-center' : ''} ${underline ? 'border-b-2 pb-4' : ''}`} style={underline ? { borderColor: 'var(--accent)' } : {}}>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{b.fullName || 'Your Name'}</h1>
      {b.headline && (
        <p className={`mt-1 text-sm font-medium ${center ? '' : ''}`} style={{ color: 'var(--accent)' }}>
          {b.headline}
        </p>
      )}
      <div className={`mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 ${center ? 'justify-center' : ''}`}>
        {b.email && <span>✉ {b.email}</span>}
        {b.phone && <span>☎ {b.phone}</span>}
        {b.location && <span>📍 {b.location}</span>}
        {b.linkedin && <span>🔗 {b.linkedin}</span>}
        {b.github && <span>💻 {b.github}</span>}
        {b.portfolio && <span>🌐 {b.portfolio}</span>}
      </div>
    </header>
  )
}

/* ---------------------------------- Modern ---------------------------------- */
function Modern({ c, vis }) {
  return (
    <div className="p-10">
      <Header b={c.basics} underline />
      {vis.summary && c.basics.summary && (
        <Section title="Summary">
          <p className="text-xs leading-relaxed text-slate-700">{c.basics.summary}</p>
        </Section>
      )}
      {vis.experience && <Section title="Experience">{ExperienceBlock({ c })}</Section>}
      {vis.projects && <Section title="Projects">{ProjectsBlock({ c })}</Section>}
      {vis.education && <Section title="Education">{EducationBlock({ c })}</Section>}
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

/* ---------------------------------- Classic --------------------------------- */
function Classic({ c, vis }) {
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
        {vis.summary && b.summary && (
          <Section title="Professional Summary">
            <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
          </Section>
        )}
        {vis.experience && (
          <Section title="Experience">
            {c.experience.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-bold">{[e.role, e.company].filter(Boolean).join(', ')}</span>
                  <DateRange start={e.start} end={e.end} />
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                  {bulletsOf(e).map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}
        {vis.education && (
          <Section title="Education">
            {c.education.map((ed, i) => (
              <div key={i} className="flex items-baseline justify-between">
                <span className="text-sm font-bold">{[ed.degree, ed.school].filter(Boolean).join(', ')}</span>
                <DateRange start={ed.start} end={ed.end} />
              </div>
            ))}
          </Section>
        )}
        {vis.skills && (
          <Section title="Skills">
            <p className="text-xs text-slate-700">{c.skills.map((s) => s.name).join(' • ')}</p>
          </Section>
        )}
        {vis.projects && <Section title="Projects">{ProjectsBlock({ c })}</Section>}
        {vis.certifications && c.certifications.length > 0 && (
          <Section title="Certifications">
            <ul className="list-disc space-y-0.5 pl-4 text-xs text-slate-700">{CertsBlock({ c })}</ul>
          </Section>
        )}
        {CustomBlocks({ c })}
      </div>
    </div>
  )
}

/* --------------------------------- Minimal ---------------------------------- */
function Minimal({ c, vis }) {
  const b = c.basics
  return (
    <div className="p-10 text-slate-800">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">{b.fullName || 'Your Name'}</h1>
        {b.headline && <p className="text-xs font-medium text-slate-500">{b.headline}</p>}
        <div className="mt-1 text-xs text-slate-500">{[b.email, b.phone, b.location, b.linkedin].filter(Boolean).join('  ·  ')}</div>
      </header>
      {vis.summary && b.summary && (
        <Section title="About">
          <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
        </Section>
      )}
      {vis.experience && (
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
                  {bulletsOf(e).map((t, j) => (
                    <li key={j}>– {t}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </Section>
      )}
      {vis.education && (
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
      )}
      {vis.skills && (
        <Section title="Skills">
          <p className="text-xs text-slate-700">{c.skills.map((s) => s.name).join(' · ')}</p>
        </Section>
      )}
      {vis.projects && (
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
      {CustomBlocks({ c })}
    </div>
  )
}

/* --------------------------------- Sidebar ---------------------------------- */
function Sidebar({ c, vis }) {
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
        {vis.summary && b.summary && (
          <Section title="Profile">
            <p className="text-xs leading-relaxed text-slate-700">{b.summary}</p>
          </Section>
        )}
        {vis.experience && (
          <Section title="Experience">
            {c.experience.map((e, i) => (
              <div key={i} className="mb-3">
                <div className="text-sm font-bold text-slate-900">{e.role}</div>
                <div className="text-xs font-semibold text-slate-600">
                  {[e.company, e.location].filter(Boolean).join(' · ')}{' '}
                  <span className="font-normal text-slate-400">
                    | {e.start}
                    {e.start && e.end ? ' – ' : ''}
                    {e.end || 'Present'}
                  </span>
                </div>
                <ul className="mt-1 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                  {bulletsOf(e).map((t, j) => (
                    <li key={j}>{t}</li>
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
                <span className="text-sm font-bold text-slate-900">{p.name}</span>
                {p.link && <span className="text-[11px] text-slate-500"> · {p.link}</span>}
                <ul className="mt-0.5 list-disc space-y-0.5 pl-4 text-xs text-slate-700">
                  {bulletsOf(p).map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        )}
        {vis.education && (
          <Section title="Education">
            {c.education.map((ed, i) => (
              <div key={i} className="mb-2">
                <div className="text-sm font-bold text-slate-900">{ed.degree}</div>
                <div className="text-xs text-slate-600">
                  {[ed.school, ed.location].filter(Boolean).join(' · ')}{' '}
                  <span className="text-slate-400">
                    {ed.start}
                    {ed.start && ed.end ? ' – ' : ''}
                    {ed.end}
                  </span>
                </div>
              </div>
            ))}
          </Section>
        )}
        {CustomBlocks({ c })}
      </div>
    </div>
  )
}

export { Section, DateRange, bulletsOf, ExperienceBlock, ProjectsBlock, EducationBlock, SkillsBlock, CertsBlock, CustomBlocks, Header }
export { Modern, Classic, Minimal, Sidebar }
