# ResumeForge AI — Full-Featured MERN AI Resume Builder

A complete AI resume builder with **four ways to create**, **8 templates**, **AI tooling**, and **one-click PDF export**.

## ✨ Features

### Creation flows
- ✍️ **Manual builder** — guided editor: personal details, summary, experience, education, projects, skills, certifications + **custom sections**
- 🎨 **8 templates** — modern, classic, minimal, sidebar, elegant, timeline, compact, bold (switch anytime, content is preserved)
- 🤖 **AI Studio** — describe your role/skills, get a full draft (works with any OpenAI-compatible API, or built-in offline generator)
- 📄 **Upload** — PDF/DOCX/TXT parsed into an editable resume

### Editor
- Live A4 preview with zoom, autosave, toasts
- **Design panel**: 12 accent colors, 4 font stacks, **section reordering + hide/show**
- **Custom sections** (awards, volunteering, languages — anything)
- **Resume strength meter** with actionable checks
- **AI bullet/summary writer** on every text field
- **AI resume review** — score + tips

### Job hunting
- 🎯 **Tailor to job** — paste a job description, get ATS keyword-gap analysis + edit suggestions
- 💌 **Cover Letter Studio** — AI cover letters tailored to any job, from any of your resumes, with print-to-PDF
- 🔗 **Share links** — publish a resume to a public URL (`/r/:id`) for recruiters, toggleable

### Polish
- 🌙 **Dark mode** across the whole app
- Gradient landing page with animations, searchable dashboard with strength scores, duplicate/delete

## Stack

React 19 + Vite + Tailwind v4 + React Router · Express + Mongoose + JWT + Multer · pluggable OpenAI-compatible AI with offline fallback

## Quick start

```bash
# 1. MongoDB
docker compose up -d                      # or use Atlas URI in server/.env

# 2. Server
cd server && cp .env.example .env && npm install && npm run dev   # :5000

# 3. Client
cd client && npm install && npm run dev   # :5173
```

Or on Windows: `npm run dev` from the project root (launches both + opens browser).

## AI keys (optional)

Set in `server/.env` — the app works without one (offline fallback engine):
- **Groq** (free): `AI_BASE_URL=https://api.groq.com/openai/v1`, `AI_MODEL=llama-3.3-70b-versatile`, key from console.groq.com/keys
- **OpenAI**: `AI_BASE_URL=https://api.openai.com/v1`, `AI_MODEL=gpt-4o-mini`, key from platform.openai.com/api-keys
- **OpenRouter / Ollama** also supported — see `.env.example`

## API

| Route | Description |
|---|---|
| `POST /api/users/register·login` | JWT auth |
| `GET/POST /api/resumes`, `GET/PUT/DELETE /api/resumes/:id` | Resume CRUD |
| `POST /api/resumes/:id/duplicate` | Duplicate |
| `POST /api/resumes/:id/share` | Toggle public link |
| `GET /api/public/resumes/shared/:shareId` | Public resume view (no auth) |
| `POST /api/ai/generate·improve-bullet·score·cover-letter·tailor` | AI endpoints |
| `POST /api/upload/resume` | Parse PDF/DOCX/TXT |
