import { useState } from 'react'
import api from '../lib/api.js'
import { useToast } from './Toast.jsx'

export default function ShareDialog({ open, onClose, resumeId }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState(null)

  if (!open) return null

  const enable = async () => {
    setLoading(true)
    try {
      const { data } = await api.post(`/resumes/${resumeId}/share`, { enabled: true })
      const url = `${window.location.origin}/r/${data.share.id}`
      setLink(url)
      toast('Public link created', 'success')
    } catch {
      toast('Could not create link — is the server running?', 'error')
    } finally {
      setLoading(false)
    }
  }

  const disable = async () => {
    setLoading(true)
    try {
      await api.post(`/resumes/${resumeId}/share`, { enabled: false })
      setLink(null)
      toast('Sharing disabled', 'success')
    } catch {
      toast('Failed to disable sharing', 'error')
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    await navigator.clipboard.writeText(link)
    toast('Link copied to clipboard', 'success')
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">🔗 Share your resume</h2>
          <button onClick={onClose} className="rounded-lg px-2 py-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700">
            ✕
          </button>
        </div>
        {link ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input readOnly value={link} className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200" />
              <button onClick={copy} className="rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700">
                Copy
              </button>
            </div>
            <button onClick={disable} disabled={loading} className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50">
              Disable sharing
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Create a public link anyone can open in a browser — great for sending to recruiters. You can turn it off anytime.
            </p>
            <button
              onClick={enable}
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Working…' : 'Enable public link'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
