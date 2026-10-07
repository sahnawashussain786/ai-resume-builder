import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-[var(--border-1)]">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          {/* Brand */}
          <Link
            to="/"
            className="group inline-flex items-center gap-2.5 text-[var(--text-0)] font-semibold"
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] p-0.5">
              <div className="absolute inset-0 rounded-lg bg-[var(--bg-0)] opacity-40 group-hover:opacity-20 transition-opacity" />
              <span className="relative text-[var(--bg-0)] font-mono text-xs font-bold tracking-tight">RF</span>
            </div>
            <span className="text-sm tracking-tight">
              ResumeForge
              <span className="ml-1.5 inline-block h-4 w-px align-middle bg-[var(--border-1)]" />
              <span className="ml-1.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent text-xs font-medium">AI</span>
            </span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {user && (
              <>
                <Link to="/dashboard" className="tab text-xs">Dashboard</Link>
                <Link to="/ai" className="hidden sm:inline-flex tab text-xs">AI Studio</Link>
                <Link to="/templates" className="hidden sm:inline-flex tab text-xs">Templates</Link>
                <span className="inline-flex items-center gap-1.5 ml-2 pl-3 border-l border-[var(--border-1)] text-[var(--text-2)] text-xs font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--green)]" />
                  <span className="hidden sm:inline truncate max-w-[120px]">{user.name}</span>
                </span>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="btn btn-ghost btn-sm btn-icon"
                  title="Log out"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                </button>
              </>
            )}
            {!user && (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
