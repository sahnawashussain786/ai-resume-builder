import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent } from '../lib/resume.js'
import ResumePreview from '../components/templates/index.js'

export default function PublicResume() {
  const { shareId } = useParams()
  const [resume, setResume] = useState(null)
  const [error, setError] = useState('')
  const [zoom, setZoom] = useState(0.72)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api
      .get(`/public/resumes/shared/${shareId}`)
      .then(({ data }) => {
        setResume(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Resume not found')
        setLoading(false)
      })
  }, [shareId])

  if (error) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--bg-2)]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-2)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
            Resume unavailable
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
            {error}
          </p>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-sm" style={{ color: 'var(--text-1)' }}>
          <span className="h-5 w-5 rounded-full border-2 border-[var(--accent)] border-t-transparent animate-spin" />
          Loading shared resume…
        </div>
      </main>
    )
  }

  if (!resume) {
    return null
  }

  const content = normalizeContent(resume.content)
  const accent = resume.accent || '#6c5ce7'

  return (
    <main className="animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1
              className="truncate text-lg font-bold"
              style={{ color: 'var(--text-0)' }}
            >
              {resume.title || 'Shared resume'}
            </h1>
            {resume.share?.enabled && (
              <span className="badge badge-green badge-mono shrink-0">SHARED</span>
            )}
          </div>
          <p className="mt-1 text-xs" style={{ color: 'var(--text-2)' }}>
            Shared resume · updated {new Date(resume.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-2)' }}>
          <button
            onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))}
            className="btn btn-ghost btn-sm btn-icon"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
          <span className="w-10 text-center font-mono">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2)))}
            className="btn btn-ghost btn-sm btn-icon"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
              <line x1="11" y1="8" x2="11" y2="14" />
              <line x1="8" y1="11" x2="14" y2="11" />
            </svg>
          </button>
        </div>
      </div>

      {/* Preview */}
      <div
        className="overflow-auto rounded-xl border border-[var(--border-1)] bg-[var(--bg-1)] p-6"
        style={{ boxShadow: `0 0 0 1px var(--border-1), 0 20px 60px -20px rgba(0,0,0,0.8)` }}
      >
        <ResumePreview
          template={resume.template}
          accent={accent}
          font={resume.font}
          content={content}
          scale={zoom}
          sectionOrder={resume.sectionOrder}
          hiddenSections={resume.hiddenSections}
        />
      </div>
    </main>
  )
}
