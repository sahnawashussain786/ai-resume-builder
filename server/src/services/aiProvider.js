/**
 * AI provider layer.
 * Uses any OpenAI-compatible chat API (OpenAI, Groq, OpenRouter, Ollama, ...)
 * configured via env vars. If no key is configured, falls back to a local
 * rule-based generator so the app remains fully functional offline.
 */

const BASE_URL = process.env.AI_BASE_URL || 'https://api.openai.com/v1'
const API_KEY = process.env.AI_API_KEY || ''
const MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

export const aiConfigured = Boolean(API_KEY)

async function chat(messages, { json = false, temperature = 0.7 } = {}) {
  if (!API_KEY) throw new Error('AI_NOT_CONFIGURED')
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature,
      ...(json ? { response_format: { type: 'json_object' } } : {}),
    }),
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 300)}`)
  }
  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

function extractJson(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : text
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON found in AI response')
  return JSON.parse(raw.slice(start, end + 1))
}

/* ---------------- Local fallback generator (no API key needed) --------------- */

const ACTION_VERBS = ['Built', 'Designed', 'Developed', 'Delivered', 'Improved', 'Led', 'Optimized', 'Automated', 'Launched', 'Owned']

function titleCase(s) {
  return (s || '').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function localGenerateResume({ role, experienceLevel, skills = [], rawText = '' }) {
  const skillList = skills.length ? skills : ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Git']
  const safeRole = role || 'Software Engineer'
  const seniority = experienceLevel || 'mid'
  const years = seniority === 'senior' ? '5+' : seniority === 'junior' ? '1' : '3'
  const summary =
    rawText.trim().slice(0, 240) ||
    `${titleCase(seniority)}-level ${safeRole} with ~${years} years of experience building and shipping web applications. ` +
      `Strong in ${skillList.slice(0, 4).join(', ')} with a track record of delivering reliable, user-focused products.`
  const bullets = (i) =>
    ACTION_VERBS.slice(i * 3, i * 3 + 3).map(
      (v) =>
        `${v} and maintained production features for ${safeRole.toLowerCase()} workflows, improving release quality and reducing manual effort using ${skillList[i % skillList.length]}.`,
    )
  return {
    basics: { fullName: '', email: '', phone: '', location: '', headline: `${titleCase(safeRole)} | ${skillList.slice(0, 3).join(' • ')}`, summary },
    skills: skillList.map((s) => ({ name: s, level: '' })),
    experience:
      seniority === 'entry'
        ? [{ role: safeRole, company: 'Your Company', location: '', start: '2024', end: 'Present', bullets: bullets(0).slice(0, 2) }]
        : [
            { role: safeRole, company: 'Your Current Company', location: '', start: '2022', end: 'Present', bullets: bullets(0) },
            { role: `Junior ${safeRole}`, company: 'Previous Company', location: '', start: '2019', end: '2022', bullets: bullets(1) },
          ],
    education: [{ degree: 'B.Tech in Computer Science', school: 'Your University', location: '', start: '2015', end: '2019', notes: '' }],
    projects: [{ name: 'Featured Project', description: `Describe a project where you used ${skillList.slice(0, 3).join(', ')} to solve a real problem.`, link: '' }],
    certifications: [],
  }
}

/* ------------------------------- Public API -------------------------------- */

export async function generateResumeContent(input) {
  const { role, experienceLevel, skills, rawText } = input || {}
  if (!aiConfigured) return { source: 'local', content: localGenerateResume({ role, experienceLevel, skills, rawText }) }

  const messages = [
    {
      role: 'system',
      content:
        'You are an expert resume writer. Return ONLY valid JSON matching this shape: ' +
        '{"basics":{"fullName":"","email":"","phone":"","location":"","headline":"","summary":""},' +
        '"skills":[{"name":"","level":""}],' +
        '"experience":[{"role":"","company":"","location":"","start":"","end":"","bullets":["",""]}],' +
        '"education":[{"degree":"","school":"","location":"","start":"","end":"","notes":""}],' +
        '"projects":[{"name":"","description":"","link":""}],' +
        '"certifications":[{"name":"","issuer":"","year":""}]}. ' +
        'Use strong action verbs and quantified achievements in bullets. Leave fields you do not know as empty strings.',
    },
    {
      role: 'user',
      content: `Target role: ${role || 'unspecified'}. Experience level: ${experienceLevel || 'mid'}. Skills: ${(skills || []).join(', ') || 'unspecified'}. Additional context: ${rawText || 'none'}. Generate a complete resume content object.`,
    },
  ]

  try {
    const text = await chat(messages, { json: true })
    return { source: 'ai', content: extractJson(text) }
  } catch (err) {
    console.error('AI generation failed, using local fallback:', err.message)
    return { source: 'local', content: localGenerateResume({ role, experienceLevel, skills, rawText }) }
  }
}

export async function improveBullet({ bullet, tone }) {
  if (!aiConfigured) {
    const trimmed = (bullet || '').trim()
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    return { source: 'local', text: capitalized.endsWith('.') ? capitalized : `${capitalized}, improving measurable outcomes and delivery quality.` }
  }
  try {
    const text = await chat(
      [
        { role: 'system', content: 'You rewrite resume bullet points to be concise, high-impact, and metric-driven. Reply with ONLY the rewritten bullet, no quotes.' },
        { role: 'user', content: `Tone: ${tone || 'impactful'}. Bullet: ${bullet}` },
      ],
      { temperature: 0.6 },
    )
    return { source: 'ai', text: text.trim().replace(/^["']|["']$/g, '') }
  } catch (err) {
    console.error('AI bullet rewrite failed:', err.message)
    return { source: 'local', text: bullet }
  }
}

export async function scoreResume(content) {
  if (!aiConfigured) return localScore(content)
  try {
    const text = await chat(
      [
        { role: 'system', content: 'You are a resume reviewer. Return ONLY JSON: {"score":0-100,"summary":"one paragraph","tips":["",""]}. Score honestly.' },
        { role: 'user', content: JSON.stringify(content).slice(0, 8000) },
      ],
      { json: true },
    )
    return { source: 'ai', ...extractJson(text) }
  } catch (err) {
    console.error('AI scoring failed, using local:', err.message)
    return localScore(content)
  }
}

function localScore(content = {}) {
  const tips = []
  let score = 40
  const basics = content.basics || {}
  if (basics.fullName) score += 5
  else tips.push('Add your full name at the top.')
  if (basics.email) score += 5
  else tips.push('Add a professional email address.')
  if (basics.summary && basics.summary.length > 60) score += 10
  else tips.push('Write a 2–3 sentence professional summary.')
  const exp = content.experience || []
  score += Math.min(exp.length * 8, 16)
  const bullety = exp.every((e) => (e.bullets || []).length > 0)
  if (exp.length && bullety) score += 10
  else tips.push('Add 3–5 bullet points under each role, starting with action verbs.')
  if ((content.skills || []).length >= 5) score += 10
  else tips.push('List at least 5 relevant skills.')
  if ((content.projects || []).length > 0) score += 8
  else tips.push('Add 1–2 notable projects with links.')
  if ((content.education || []).length > 0) score += 6
  else tips.push('Add your education history.')
  score = Math.max(10, Math.min(96, score))
  return { source: 'local', score, summary: 'Rule-based review: completeness and structure checks.', tips: tips.slice(0, 5) }
}
