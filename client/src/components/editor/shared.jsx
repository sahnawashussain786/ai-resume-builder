import { useState } from 'react'
import api from '../../lib/api.js'

export const inputCls = 'input'
export const labelCls = 'field-label'

export function SectionCard({ title, onAdd, addLabel = 'Add', accent, children }) {
  return (
    <section className="panel" style={accent ? { borderColor: `${accent}40`, background: `linear-gradient(180deg, ${accent}08, ${accent}01)` } : {}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-2)' }}>
          {title}
        </h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="btn btn-ghost btn-sm"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mr-1">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {addLabel}
          </button>
        )}
      </div>
      {children}
    </section>
  )
}

export function RemoveBtn({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-danger btn-icon"
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  )
}

export function AIButton({ onResult, payload, label = 'AI' }) {
  const [busy, setBusy] = useState(false)
  const call = async () => {
    setBusy(true)
    try {
      const { data } = await api.post('/ai/improve-bullet', payload())
      onResult(data)
    } catch {
      // keep quiet; parent handles errors
    } finally {
      setBusy(false)
    }
  }
  return (
    <button
      type="button"
      onClick={call}
      disabled={busy}
      className="btn btn-ghost btn-sm"
    >
      {busy ? (
        <span className="h-2 w-2 rounded-full border-2 border-current/40 border-t-current animate-spin" />
      ) : (
        <span className="flex items-center gap-1">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4c0 2-2 3.5-4 5.5C8 11.5 8 13 9 14l6 7c1 1 2 2 3 2s2-1 3-2l6-7c1-1 1-2.5 0-3.5C18 9.5 16 8 12 8a4 4 0 0 1 4-4z" />
          </svg>
          {label}
        </span>
      )}
    </button>
  )
}
