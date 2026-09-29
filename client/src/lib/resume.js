export const EMPTY_BASICS = {
  fullName: '',
  headline: '',
  email: '',
  phone: '',
  location: '',
  linkedin: '',
  github: '',
  portfolio: '',
  summary: '',
}

const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v))

export function emptyResume() {
  return {
    basics: { ...EMPTY_BASICS },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    custom: [],
  }
}

export function normalizeBasics(raw = {}) {
  const b = { ...EMPTY_BASICS }
  for (const key of Object.keys(EMPTY_BASICS)) {
    if (raw[key] != null) b[key] = str(raw[key])
  }
  if (!b.fullName && raw.name) b.fullName = str(raw.name)
  if (!b.headline && raw.title) b.headline = str(raw.title)
  if (!b.summary && raw.objective) b.summary = str(raw.objective)
  if (!b.portfolio && (raw.website || raw.url)) b.portfolio = str(raw.website || raw.url)
  return b
}

function normalizeExperienceItem(it = {}) {
  return {
    role: str(it.role ?? it.title ?? it.position ?? it.jobTitle),
    company: str(it.company ?? it.organization ?? it.employer),
    location: str(it.location),
    start: str(it.start ?? it.startDate ?? it.from),
    end: str(it.end ?? it.endDate ?? it.to),
    bullets: Array.isArray(it.bullets) ? it.bullets.map(str).filter(Boolean) : it.description ? [str(it.description)] : [],
  }
}

function normalizeEducationItem(it = {}) {
  return {
    degree: str(it.degree ?? it.title ?? it.studyType),
    school: str(it.school ?? it.institution ?? it.university),
    location: str(it.location),
    start: str(it.start ?? it.startDate),
    end: str(it.end ?? it.endDate ?? it.graduationDate),
    notes: str(it.notes ?? it.gpa ?? it.details),
  }
}

function normalizeProjectItem(it = {}) {
  const bullets = Array.isArray(it.bullets) ? it.bullets.map(str).filter(Boolean) : []
  return {
    name: str(it.name ?? it.title),
    description: str(it.description),
    link: str(it.link ?? it.url),
    bullets: bullets.length ? bullets : it.description ? [str(it.description)] : [],
  }
}

function normalizeCertItem(it = {}) {
  if (typeof it === 'string') return { name: it, issuer: '', year: '' }
  return { name: str(it.name ?? it.title), issuer: str(it.issuer ?? it.organization), year: str(it.year ?? it.date) }
}

function normalizeCustomSection(s = {}) {
  return {
    heading: str(s.heading ?? s.title ?? s.name) || 'Custom Section',
    items: (Array.isArray(s.items) ? s.items : []).map((it) => ({
      title: str(it?.title),
      subtitle: str(it?.subtitle),
      start: str(it?.start),
      end: str(it?.end),
      description: str(it?.description ?? it?.summary),
      bullets: Array.isArray(it?.bullets) ? it.bullets.map(str).filter(Boolean) : [],
    })),
  }
}

export function normalizeContent(raw = {}) {
  const r = raw && typeof raw === 'object' ? raw : {}
  const arr = (v) => (Array.isArray(v) ? v : [])
  return {
    basics: normalizeBasics(r.basics || {}),
    skills: arr(r.skills).map((s) => (typeof s === 'string' ? { name: s, level: '' } : { name: str(s?.name), level: str(s?.level) })).filter((s) => s.name),
    experience: arr(r.experience).map(normalizeExperienceItem).filter((e) => e.role || e.company || e.bullets.length),
    education: arr(r.education).map(normalizeEducationItem).filter((e) => e.degree || e.school),
    projects: arr(r.projects).map(normalizeProjectItem).filter((p) => p.name || p.description),
    certifications: arr(r.certifications).map(normalizeCertItem).filter((c) => c.name),
    custom: arr(r.custom).map(normalizeCustomSection).filter((s) => s.heading),
  }
}

/* ------------------------------ Design options ----------------------------- */

export const ACCENT_COLORS = [
  '#2563eb', '#0f766e', '#7c3aed', '#b91c1c', '#b45309', '#0e7490', '#be185d', '#374151',
  '#16a34a', '#ea580c', '#4f46e5', '#0d9488',
]

export const FONTS = [
  { id: 'sans', name: 'Inter / System', stack: "'Segoe UI', system-ui, -apple-system, sans-serif" },
  { id: 'serif', name: 'Georgia Serif', stack: "Georgia, 'Times New Roman', serif" },
  { id: 'mono', name: 'Monospace', stack: "ui-monospace, 'Cascadia Code', Consolas, monospace" },
  { id: 'rounded', name: 'Rounded (Verdana)', stack: "'Segoe UI', Verdana, Tahoma, sans-serif" },
]

export const TEMPLATE_IDS = ['modern', 'classic', 'minimal', 'sidebar', 'elegant', 'timeline', 'compact', 'bold']
export const SECTION_KEYS = ['summary', 'experience', 'education', 'projects', 'skills', 'certifications', 'custom']
export const LAYOUTS = [
  { id: 'one-column', name: 'One column' },
  { id: 'two-column', name: 'Two column' },
]

/* ------------------------------ Derived data ------------------------------- */

export function resumeCompleteness(content) {
  const checks = []
  const b = content?.basics || {}
  checks.push({ label: 'Personal details', ok: Boolean(b.fullName && b.email), weight: 15 })
  checks.push({ label: 'Headline', ok: Boolean(b.headline), weight: 5 })
  checks.push({ label: 'Professional summary (40+ chars)', ok: (b.summary || '').length >= 40, weight: 10 })
  checks.push({
    label: 'Experience with bullet points',
    ok: (content?.experience || []).some((e) => (e.bullets || []).length >= 2),
    weight: 20,
  })
  checks.push({ label: 'Education', ok: (content?.education || []).length > 0, weight: 10 })
  checks.push({ label: 'Skills (5+)', ok: (content?.skills || []).length >= 5, weight: 15 })
  checks.push({ label: 'Projects or certifications', ok: (content?.projects || []).length > 0 || (content?.certifications || []).length > 0, weight: 10 })
  checks.push({ label: 'Links (LinkedIn/GitHub/portfolio)', ok: Boolean(b.linkedin || b.github || b.portfolio), weight: 10 })
  const hasWeak = (content?.experience || []).some((e) =>
    (e.bullets || []).some((bl) => bl.length > 0 && !/^\s*(led|built|designed|developed|delivered|improved|managed|created|launched|increased|reduced|automated|optimized|owned|drove|shipped|mentored|implemented|migrated)\b/i.test(bl)),
  )
  if (hasWeak) checks.push({ label: 'Use strong action verbs in bullets', ok: false, weight: 5 })
  const score = checks.filter((c) => c.ok).reduce((s, c) => s + c.weight, 0)
  return { score: Math.min(100, score), checks }
}

export function resumeToText(content) {
  const c = normalizeContent(content)
  const lines = []
  const b = c.basics
  lines.push([b.fullName, b.headline].filter(Boolean).join(' — '))
  lines.push([b.email, b.phone, b.location, b.linkedin, b.github, b.portfolio].filter(Boolean).join(' | '))
  if (b.summary) lines.push('', 'SUMMARY', b.summary)
  if (c.skills.length) lines.push('', 'SKILLS', c.skills.map((s) => s.name).join(', '))
  if (c.experience.length) {
    lines.push('', 'EXPERIENCE')
    for (const e of c.experience) {
      lines.push(`${e.role} at ${e.company} (${e.start} - ${e.end || 'Present'})`)
      for (const bl of e.bullets) lines.push(`- ${bl}`)
    }
  }
  if (c.projects.length) {
    lines.push('', 'PROJECTS')
    for (const p of c.projects) lines.push(`${p.name}${p.link ? ` (${p.link})` : ''}: ${p.description}`)
  }
  if (c.education.length) {
    lines.push('', 'EDUCATION')
    for (const e of c.education) lines.push(`${e.degree}, ${e.school} (${e.start} - ${e.end})`)
  }
  if (c.certifications.length) {
    lines.push('', 'CERTIFICATIONS')
    for (const cert of c.certifications) lines.push(`${cert.name}${cert.issuer ? ` — ${cert.issuer}` : ''}${cert.year ? ` (${cert.year})` : ''}`)
  }
  for (const s of c.custom) {
    lines.push('', s.heading.toUpperCase())
    for (const it of s.items) lines.push(`${it.title}${it.subtitle ? ` — ${it.subtitle}` : ''}${it.start ? ` (${it.start} - ${it.end || ''})` : ''}`)
  }
  return lines.join('\n')
}
