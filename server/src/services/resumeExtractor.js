/**
 * Heuristic resume text -> structured JSON extractor.
 * Works reasonably for common formats; users can edit the result in the builder.
 */

const SECTION_ALIASES = {
  experience: ['experience', 'work experience', 'professional experience', 'employment', 'employment history', 'work history'],
  education: ['education', 'academic background', 'academics', 'qualifications'],
  skills: ['skills', 'technical skills', 'core skills', 'skills & tools', 'technologies'],
  projects: ['projects', 'personal projects', 'key projects', 'selected projects'],
  certifications: ['certifications', 'certificates', 'licenses'],
  summary: ['summary', 'professional summary', 'profile', 'about', 'objective', 'about me', 'profile summary'],
}

function normalizeLine(line) {
  return line.replace(/\s+/g, ' ').trim()
}

function isSectionHeader(line) {
  const l = normalizeLine(line).toLowerCase().replace(/[:•\-–—]+$/, '').trim()
  if (l.length > 40) return null
  for (const [key, aliases] of Object.entries(SECTION_ALIASES)) {
    if (aliases.includes(l)) return key
  }
  // e.g. "WORK EXPERIENCE" in caps
  if (/^[A-Z][A-Z &'/-]{2,30}$/.test(l)) {
    for (const [key, aliases] of Object.entries(SECTION_ALIASES)) {
      if (aliases.includes(l.toLowerCase())) return key
    }
  }
  return null
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
const PHONE_RE = /(\+?\d[\d\s().-]{7,}\d)/
const LINKEDIN_RE = /((https?:\/\/)?(www\.)?linkedin\.com\/[^\s,;)]+)/i
const GITHUB_RE = /((https?:\/\/)?(www\.)?github\.com\/[^\s,;)]+)/i

function extractBasics(lines) {
  const text = lines.join('\n')
  const email = (text.match(EMAIL_RE) || [''])[0]
  const phone = (text.match(PHONE_RE) || [''])[0].trim()
  const linkedin = (text.match(LINKEDIN_RE) || [''])[0]
  const github = (text.match(GITHUB_RE) || [''])[0]
  let fullName = ''
  let headline = ''
  for (const line of lines.slice(0, 6)) {
    const l = normalizeLine(line)
    if (!l || l.length > 60) continue
    if (EMAIL_RE.test(l) || PHONE_RE.test(l) || LINKEDIN_RE.test(l) || GITHUB_RE.test(l)) continue
    if (!fullName && /^[A-Za-z][A-Za-z .'-]{1,50}$/.test(l) && l.split(' ').length <= 5) {
      fullName = l
      continue
    }
    if (!headline && l.length > 3 && l.length <= 60 && !isSectionHeader(l)) {
      headline = l
      break
    }
  }
  return { fullName, email, phone, location: '', headline, summary: '', linkedin, github }
}

function parseDateRange(line) {
  const m = line.match(
    /((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{1,2}\/\d{4}|\d{4})\s*(-|–|—|to|until)\s*((jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{1,2}\/\d{4}|\d{4}|present|current|now)/i,
  )
  if (!m) return null
  return { start: m[1].trim(), end: m[4].trim(), matched: m[0] }
}

function looksLikeBullet(line) {
  return /^\s*([•▪‣·●*\-–—]|\d+\.)\s+/.test(line) || /^\s{2,}\S/.test(line)
}

function cleanBullet(line) {
  return normalizeLine(line).replace(/^([•▪‣·●*\-–—]|\d+\.)\s*/, '')
}

function parseExperience(lines) {
  const jobs = []
  let current = null
  for (const raw of lines) {
    const line = normalizeLine(raw)
    if (!line) continue
    const range = parseDateRange(line)
    const bullet = looksLikeBullet(raw)
    if (range && !bullet) {
      if (current) jobs.push(current)
      // e.g. "Software Engineer at Acme Corp    Jan 2020 - Present"
      const titlePart = line.replace(range.matched, '').trim() || line
      const m = titlePart.match(/^(.*?)(?:\s*[|–—]\s*|\s*,\s*|\s+at\s+|\s+@\s*)(.+)$/) || [null, titlePart, '']
      const [rolePart = titlePart, companyPart = ''] = m.slice(1)
      current = {
        role: rolePart.replace(/[-–—|,]\s*$/, '').trim(),
        company: companyPart.replace(/[-–—|,]\s*$/, '').trim(),
        location: '',
        start: range.start,
        end: range.end,
        bullets: [],
      }
    } else if (current && bullet) {
      current.bullets.push(cleanBullet(raw))
    } else if (current && !current.company && line.length < 60) {
      current.company = line
    }
  }
  if (current) jobs.push(current)
  return jobs.filter((j) => j.role || j.company)
}

function parseEducation(lines) {
  const items = []
  let current = null
  const degreeRe = /(b\.?tech|b\.?e\.?|bachelor|master|m\.?tech|m\.?s\.?|m\.?c\.?a\.?|b\.?sc|b\.?ca\.?|ph\.?d|diploma|high school|secondary|intermediate)/i
  for (const raw of lines) {
    const line = normalizeLine(raw)
    if (!line) continue
    const range = parseDateRange(line)
    if (degreeRe.test(line) && !looksLikeBullet(raw)) {
      if (current) items.push(current)
      const m = line.match(/^(.*?)(?:,|\||–|-|—|from)?\s*((?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*\d{4}|\d{4}).*$/i)
      current = {
        degree: (m ? m[1] : line).replace(/[-–—|,]\s*$/, '').trim() || line,
        school: '',
        location: '',
        start: range?.start || '',
        end: range?.end || '',
        notes: '',
      }
    } else if (current && range && !current.end) {
      current.start = range.start
      current.end = range.end
    } else if (current && !current.school && line.length < 80) {
      current.school = line
    }
  }
  if (current) items.push(current)
  return items
}

function parseSkills(lines) {
  const text = lines.map(normalizeLine).join(', ')
  return text
    .split(/[,•|;/\n]+/)
    .map((s) => s.trim())
    .filter((s) => s && s.length < 30 && !/^\d+$/.test(s))
    .slice(0, 25)
    .map((name) => ({ name, level: '' }))
}

function parseSimpleList(lines) {
  return lines
    .map(normalizeLine)
    .filter(Boolean)
    .map((line) => cleanBullet(line))
    .filter(Boolean)
    .map((name) => ({ name, issuer: '', year: '' }))
}

export function textToResumeJson(text) {
  const allLines = (text || '').split(/\r?\n/)
  const sections = { experience: [], education: [], skills: [], projects: [], certifications: [], summary: [] }
  let currentKey = null
  const headerLines = []

  for (const line of allLines) {
    const key = isSectionHeader(line)
    if (key) {
      currentKey = key
      if (key === 'summary') currentKey = 'summary'
      continue
    }
    if (currentKey) sections[currentKey].push(line)
    else headerLines.push(line)
  }

  const basics = extractBasics(headerLines.length ? headerLines : allLines.slice(0, 10))
  if (sections.summary.length) {
    const summaryText = sections.summary.map(normalizeLine).filter(Boolean).join(' ')
    basics.summary = summaryText.slice(0, 600)
  }

  return {
    basics,
    skills: parseSkills(sections.skills),
    experience: parseExperience(sections.experience),
    education: parseEducation(sections.education),
    projects: sections.projects
      .map(normalizeLine)
      .filter(Boolean)
      .map((l) => ({ name: cleanBullet(l).split(/[-–:]/)[0].slice(0, 80), description: cleanBullet(l), link: '' })),
    certifications: parseSimpleList(sections.certifications),
  }
}
