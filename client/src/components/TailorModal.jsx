import { useState } from 'react'
import api from '../lib/api.js'

export default function TailorModal({ open, onClose, content, onApplySuggestions }) {
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
    } catch {
      setAnalysis({ keywords: [], missing: [], suggestions: ['Analysis failed — is the server running?'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">🎯 Tailor resume to a job</h2>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            ✕
          </button>
        </div>
        <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
          Paste the job description. We'll extract key ATS keywords, find what's missing from your resume, and suggest edits.
        </p>
        <textarea
          rows={7}
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          placeholder="Paste the full job posting here…"
          className="w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
        />
        <button
          onClick={analyze}
          disabled={loading || !jd.trim()}
          className="mt-3 w-full rounded-xl bg-violet-600 py-3 font-semibold text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing…' : 'Analyze match'}
        </button>

        {analysis && (
          <div className="mt-5 space-y-4">
            {analysis.keywords?.length > 0 && (
              <div>
                <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Top job keywords</h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.keywords.map((k) => (
                    <span key={k} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.missing?.length > 0 && (
              <div>
                <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-amber-600">Missing from your resume</h3>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.missing.map((k) => (
                    <span key={k} className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {analysis.suggestions?.length > 0 && (
              <div>
                <h3 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Suggested edits</h3>
                <ul className="space-y-2">
                  {analysis.suggestions.map((s, i) => (
                    <li key={i} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-300">
                      {s}
                      {onApplySuggestions && (
                        <button
                          type="button"
                          onClick={() => apply(s)}
                          className="ml-2 shrink-0 rounded-md bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white hover:bg-blue-700"
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
