import { useState } from 'react'
import api from '../lib/api.js'
import { useToast } from './Toast.jsx'

export default function TailorModal({ open, onClose, content, onApplySuggestions }) {
  const toast = useToast()
  const [jd, setJd] = useState('')
  const apply = async (suggestion) => {
    if (onApplySuggestions) await onApplySuggestions(suggestion)
  }
  const [loading, setLoading] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  if (!open) return null

  const analyze = async () => {
    if (!jd.trim()) return
    setLoading(true)
    try {
      const { data } = await api.post('/ai/tailor', { content, jobDescription: jd })
      setAnalysis(data.analysis)
      toast('Analysis ready', 'success')
    } catch {
      setAnalysis({ keywords: [], missing: [], suggestions: ['Analysis failed — is the server running?'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl animate-scale-in panel overflow-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: '88vh' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold tracking-tight flex items-center gap-2" style={{ color: 'var(--text-0)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="3" />
              <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
              <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
              <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
              <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
            </svg>
            Tailor resume to a job
          </h2>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <p className="text-sm mb-4" style={{ color: 'var(--text-1)' }}>
          Paste the job description. We'll extract key ATS keywords, find what's missing from your resume, and suggest edits.
        </p>

        <textarea
          rows={7}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job posting here…"
          className="input w-full"
        />

        <button
          onClick={analyze}
          disabled={loading || !jd.trim()}
          className="btn btn-primary w-full mt-3"
        >
          {loading ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              Analyze match
            </>
          )}
        </button>

        {analysis && (
          <div className="mt-5 space-y-5">
            {analysis.keywords?.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
                  Top job keywords
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-[var(--bg-3)] border border-[var(--border-1)] px-2.5 py-1 text-xs font-medium"
                      style={{ color: 'var(--text-0)' }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.missing?.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--amber)' }}>
                  Missing from your resume
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.map((k) => (
                    <span
                      key={k}
                      className="rounded-full bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.25)] px-2.5 py-1 text-xs font-semibold"
                      style={{ color: 'var(--amber)' }}
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.suggestions?.length > 0 && (
              <div>
                <div className="mb-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
                  Suggested edits
                </div>
                <ul className="space-y-2">
                  {analysis.suggestions.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 rounded-xl bg-[var(--bg-3)] p-3 text-sm"
                      style={{ color: 'var(--text-1)' }}
                    >
                      <span className="shrink-0 mt-0.5 rounded-full bg-[var(--accent-soft)] p-0.5" style={{ color: 'var(--accent-2)' }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="M12 5l7 7-7 7" />
                        </svg>
                      </span>
                      <span className="flex-1">{s}</span>
                      {onApplySuggestions && (
                        <button
                          type="button"
                          onClick={() => apply(s)}
                          className="btn btn-ghost btn-sm shrink-0"
                        >
                          Apply
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
