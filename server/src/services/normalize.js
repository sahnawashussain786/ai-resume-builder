/**
 * Normalize any resume-content object (from AI, file parsing, or user edits)
 * into the canonical shape shared by client templates and the editor.
 *
 * Canonical shape:
 * {
 *   basics: { fullName, headline, email, phone, location, linkedin, github, portfolio, summary },
 *   skills: [{ name, level }],
 *   experience: [{ role, company, location, start, end, bullets: [] }],
 *   education: [{ degree, school, location, start, end, notes }],
 *   projects: [{ name, description, link, bullets }],
 *   certifications: [{ name, issuer, year }],
 * }
 */

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

export function normalizeBasics(raw = {}) {
  const b = { ...EMPTY_BASICS }
  for (const key of Object.keys(EMPTY_BASICS)) {
    if (raw[key] != null) b[key] = str(raw[key])
  }
  // common AI/extractor variants
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
  }
}
