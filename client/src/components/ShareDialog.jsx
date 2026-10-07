import { useState } from 'react'
import api from '../lib/api.js'
import { useToast } from './Toast.jsx'

export default function ShareDialog({ open, onClose, resumeId }) {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [link, setLink] = useState(null)
  const [copying, setCopying] = useState(false)

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
    setCopying(true)
    try {
      await navigator.clipboard.writeText(link)
      toast('Link copied to clipboard', 'success')
    } catch {
      toast('Failed to copy', 'error')
    } finally {
      setCopying(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md animate-scale-in panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-2)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1.5 align-middle">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Share your resume
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

        {link ? (
          <div className="space-y-3">
            <p className="text-xs" style={{ color: 'var(--text-1)' }}>
              Anyone with this link can view your resume.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={link}
                className="input flex-1 font-mono text-xs"
              />
              <button
                onClick={copy}
                disabled={copying}
                className="btn btn-primary btn-sm"
              >
                {copying ? (
                  <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                  </svg>
                )}
                Copy
              </button>
            </div>
            <button
              onClick={disable}
              disabled={loading}
              className="btn btn-danger w-full mt-1"
            >
              {loading ? 'Working…' : 'Disable sharing'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'var(--text-1)' }}>
              Create a public link anyone can open in a browser — great for sending to recruiters. You can turn it off anytime.
            </p>
            <button
              onClick={enable}
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Working…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                    <polyline points="16 6 12 2 8 6" />
                    <line x1="12" y1="2" x2="12" y2="15" />
                  </svg>
                  Enable public link
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
