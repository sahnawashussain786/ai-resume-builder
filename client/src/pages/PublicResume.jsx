import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api.js'
import { normalizeContent } from '../lib/resume.js'
import ResumePreview from '../components/templates/index.js'

export default function PublicResume() {
  const { shareId } = useParams()
  const [resume, setResume] = useState(null)
  const [error, setError] = useState('')
  const [zoom, setZoom] = useState(0.7)

  useEffect(() => {
    api
      .get(`/public/resumes/shared/${shareId}`)
      .then(({ data }) => setResume(data))
      .catch((err) => setError(err.response?.data?.message || 'Resume not found'))
  }, [shareId])

  if (error) {
    return (
      <main className="grid min-h-[70vh] place-items-center px-4">
        <div className="text-center">
          <div className="text-5xl">🔒</div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">Resume unavailable</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{error}</p>
        </div>
      </main>
    )
  }

  if (!resume) {
    return <main className="grid min-h-[70vh] place-items-center text-slate-500">Loading…</main>
  }

  const content = normalizeContent(resume.content)

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">{resume.title}</h1>
          <p className="text-xs text-slate-500">Shared resume · updated {new Date(resume.updatedAt).toLocaleDateString()}</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))} className="rounded-md border border-slate-200 px-2 py-1 dark:border-slate-600 dark:text-slate-300">
            −
          </button>
          <span className="w-10 text-center font-medium text-slate-600 dark:text-slate-300">{Math.round(zoom * 100)}%</span>
          <button onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.08).toFixed(2)))} className="rounded-md border border-slate-200 px-2 py-1 dark:border-slate-600 dark:text-slate-300">
            +
          </button>
        </div>
      </div>
      <div className="overflow-auto rounded-2xl bg-slate-100 p-6 dark:bg-slate-900">
        <ResumePreview
          template={resume.template}
          accent={resume.accent}
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
