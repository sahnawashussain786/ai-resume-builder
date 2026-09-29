/**
 * AI provider layer.
 * Uses any OpenAI-compatible chat API (OpenAI, Groq, OpenRouter, Ollama, ...)
 * configured via env vars. If no key is configured, falls back to a local
 * rule-based generator so the app remains fully functional offline.
 */

import { normalizeContent } from './normalize.js'

const BASE_URL = () => process.env.AI_BASE_URL || 'https://api.openai.com/v1'
const API_KEY = () => process.env.AI_API_KEY || ''
const MODEL = () => process.env.AI_MODEL || 'gpt-4o-mini'

export const aiConfigured = Boolean(process.env.AI_API_KEY)

async function chat(messages, { json = false, temperature = 0.7 } = {}) {
  if (!API_KEY()) throw new Error('AI_NOT_CONFIGURED')
  const res = await fetch(`${BASE_URL()}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY()}`,
    },
    body: JSON.stringify({
      model: MODEL(),
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
  if (!aiConfigured)
    return { source: 'local', content: normalizeContent(localGenerateResume({ role, experienceLevel, skills, rawText })) }

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
    return { source: 'ai', content: normalizeContent(extractJson(text)) }
  } catch (err) {
    console.error('AI generation failed, using local fallback:', err.message)
    return { source: 'local', content: normalizeContent(localGenerateResume({ role, experienceLevel, skills, rawText })) }
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

export async function generateCoverLetter({ fullName, role, company, jobDescription, resumeText }) {
  const who = fullName || 'the candidate'
  if (!aiConfigured) {
    const skillsLine = (resumeText || '').match(/skills?\s*:?\s*([^\n]+)/i)?.[1] || 'the core requirements of the role'
    return {
      source: 'local',
      text:
        `Dear Hiring Manager,\n\n` +
        `I am excited to apply for the ${role || 'open'} position${company ? ` at ${company}` : ''}. ` +
        `With hands-on experience across ${skillsLine.trim().slice(0, 120)}, my background aligns closely with what your team is building.\n\n` +
        `In my recent work I have delivered measurable results — shipping reliable features, improving performance, and collaborating across teams to move products forward. ` +
        (jobDescription ? `The role's emphasis on ${jobDescription.slice(0, 140)}… matches exactly the challenges I enjoy. ` : '') +
        `I would welcome the chance to bring this experience to ${company || 'your team'} and contribute from day one.\n\n` +
        `Thank you for your time and consideration.\n\nSincerely,\n${who}`,
    }
  }
  try {
    const text = await chat(
      [
        {
          role: 'system',
          content:
            'You are an expert cover letter writer. Write a compelling, specific 250-350 word cover letter in plain text. Structure: greeting, hook tied to the company/role, evidence paragraph with achievements from the resume, closing with call to action, sign-off. No markdown, no placeholder brackets.',
        },
        {
          role: 'user',
          content: `Candidate: ${who}. Role: ${role || 'unspecified'}. Company: ${company || 'unspecified'}. Job description: ${jobDescription || 'not provided'}. Resume content: ${(resumeText || '').slice(0, 6000)}`,
        },
      ],
      { temperature: 0.7 },
    )
    return { source: 'ai', text: text.trim() }
  } catch (err) {
    console.error('Cover letter AI failed:', err.message)
    return { source: 'local', text: `Dear Hiring Manager,\n\nI am excited to apply for the ${role || 'open'} position${company ? ` at ${company}` : ''}.\n\nSincerely,\n${who}` }
  }
}

export async function tailorResume(content, jobDescription) {
  if (!aiConfigured) {
    const jdWords = (jobDescription || '').toLowerCase().match(/[a-z][a-z+#.]{2,}/g) || []
    const stop = new Set(['and', 'the', 'with', 'for', 'you', 'our', 'will', 'are', 'have', 'this', 'that', 'from', 'your', 'role', 'team', 'work', 'who', 'job', 'able', 'must', 'plus', 'all', 'any', 'can', 'not', 'but', 'its', "it's"])
    const freq = {}
    for (const w of jdWords) if (!stop.has(w) && w.length > 2) freq[w] = (freq[w] || 0) + 1
    const keywords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12)
      .map(([w]) => w)
    const mySkills = JSON.stringify(content?.skills || []).toLowerCase() + ' ' + JSON.stringify(content?.experience || []).toLowerCase()
    const missing = keywords.filter((k) => !mySkills.includes(k))
    return {
      source: 'local',
      analysis: {
        keywords,
        missing,
        suggestions: missing.length
          ? missing.slice(0, 5).map((k) => `Consider adding "${k}" to your skills or a bullet if you have relevant experience.`)
          : ['Great overlap with the job description — your resume covers the key terms.'],
      },
    }
  }
  try {
    const text = await chat(
      [
        {
          role: 'system',
          content:
            'You are an ATS optimization expert. Compare the resume against the job description. Return ONLY JSON: {"keywords":["top JD keywords"],"missing":["resume keywords missing"],"suggestions":["3-5 concrete edits, e.g. rewrite X bullet to include Y"]}',
        },
        { role: 'user', content: `Job description: ${(jobDescription || '').slice(0, 4000)}\n\nResume JSON: ${JSON.stringify(content).slice(0, 6000)}` },
      ],
      { json: true, temperature: 0.4 },
    )
    return { source: 'ai', analysis: extractJson(text) }
  } catch (err) {
    console.error('Tailor AI failed:', err.message)
    return { source: 'local', analysis: { keywords: [], missing: [], suggestions: ['AI unavailable — check server logs.'] } }
  }
}
