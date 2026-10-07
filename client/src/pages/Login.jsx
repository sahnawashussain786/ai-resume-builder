import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/users/login', form)
      login(data.token, data.user)
      toast('Welcome back', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="animate-fade-in">
      <div className="mx-auto max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)] p-0.5">
            <div className="absolute inset-0 rounded-xl bg-[var(--bg-0)] opacity-30" />
            <span className="relative text-[var(--bg-0)] font-mono text-sm font-bold tracking-tight">RF</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-0)' }}>
            Welcome back
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
            Log in to manage your resumes.
          </p>
        </div>

        {/* Form */}
        <div className="panel">
          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-[rgba(239,68,68,0.10)] border border-[rgba(239,68,68,0.20)] p-3 text-sm" style={{ color: 'var(--red)' }}>
                {error}
              </div>
            )}
            <div className="field">
              <label className="field-label">Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="input"
              />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input
                type="password"
                required
                placeholder="Your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <span className="h-3 w-3 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Logging in…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  Log in
                </>
              )}
            </button>
          </form>
          <div className="mt-5 text-center text-xs" style={{ color: 'var(--text-2)' }}>
            No account?{' '}
            <Link
              to="/register"
              className="font-medium text-[var(--accent-2)] hover:underline"
            >
              Create one
            </Link>
          </div>
        </div>

        {/* Footer micro */}
        <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-3)' }}>
          Built for people who ship · free & private
        </p>
      </div>
    </main>
  )
}
