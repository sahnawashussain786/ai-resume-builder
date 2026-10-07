import { createContext, useCallback, useContext, useRef, useState } from 'react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const push = useCallback((message, type = 'info') => {
    const id = ++idRef.current
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }, [])

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex items-center gap-3 rounded-xl bg-[var(--bg-2)] border border-[var(--border-1)] px-4 py-3 text-sm font-medium shadow-xl animate-slide-in-right"
            style={{
              borderColor:
                t.type === 'success'
                  ? 'rgba(34,197,94,0.35)'
                  : t.type === 'error'
                  ? 'rgba(239,68,68,0.35)'
                  : 'var(--border-1)',
            }}
          >
            <span
              className="shrink-0 rounded-full p-0.5"
              style={{
                background:
                  t.type === 'success'
                    ? 'rgba(34,197,94,0.15)'
                    : t.type === 'error'
                    ? 'rgba(239,68,68,0.15)'
                    : 'var(--accent-soft)',
                color:
                  t.type === 'success'
                    ? 'var(--green)'
                    : t.type === 'error'
                    ? 'var(--red)'
                    : 'var(--accent-2)',
              }}
            >
              {t.type === 'success' ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : t.type === 'error' ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
              )}
            </span>
            <span style={{ color: 'var(--text-0)' }}>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
