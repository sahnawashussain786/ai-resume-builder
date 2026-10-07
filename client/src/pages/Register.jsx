import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../components/Toast.jsx'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/users/register', form)
      login(data.token, data.user)
      toast('Account created — start building!', 'success')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
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
            Create your account
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-1)' }}>
            Start building resumes in minutes.
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
              <label className="field-label">Full name</label>
              <input
                type="text"
                required
                placeholder="Alex Morgan"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="input"
              />
            </div>
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
                minLength={6}
                placeholder="At least 6 characters"
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
                  Creating account…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Create account
                </>
              )}
            </button>
          </form>
          <div className="mt-5 text-center text-xs" style={{ color: 'var(--text-2)' }}>
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-[var(--accent-2)] hover:underline"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Footer micro */}
        <p className="mt-6 text-center text-xs" style={{ color: 'var(--text-3)' }}>
          Free, private, no credit card required.
        </p>
      </div>
    </main>
  )
}
