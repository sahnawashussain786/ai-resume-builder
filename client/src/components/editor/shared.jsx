import { useState } from 'react'
import api from '../../lib/api.js'

export const inputCls =
  'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
export const labelCls = 'mb-1 block text-xs font-semibold text-slate-600'

export function SectionCard({ title, onAdd, addLabel = 'Add', children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">{title}</h2>
        {onAdd && (
          <button onClick={onAdd} className="rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100">
            + {addLabel}
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
      className="shrink-0 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-red-50 hover:text-red-600"
    >
      ✕
    </button>
  )
}

export function AIButton({ onResult, payload, label = '✨ AI' }) {
  const [busy, setBusy] = useState(false)
  const call = async () => {
    setBusy(true)
    try {
      const { data } = await api.post('/ai/improve-bullet', payload())
      onResult(data)
    } catch {
      alert('AI request failed — is the server running?')
    } finally {
      setBusy(false)
    }
  }
  return (
    <button
      type="button"
      onClick={call}
      disabled={busy}
      className="shrink-0 rounded-md bg-violet-50 px-2 py-1 text-[11px] font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-50"
    >
      {busy ? '…' : label}
    </button>
  )
}
