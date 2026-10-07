import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './components/Toast.jsx'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Builder from './pages/Builder.jsx'
import Upload from './pages/Upload.jsx'
import AIStudio from './pages/AIStudio.jsx'
import Templates from './pages/Templates.jsx'
import CoverLetter from './pages/CoverLetter.jsx'
import PublicResume from './pages/PublicResume.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

const ANIMATED_ROUTES = new Set(['/', '/dashboard', '/ai', '/upload', '/templates', '/cover-letter'])

export default function App() {
  const location = useLocation()
  const keyRef = useRef(0)

  useEffect(() => {
    keyRef.current += 1
  }, [location.pathname])

  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="min-h-screen bg-[var(--bg-0)] text-[var(--text-0)] font-sans antialiased">
          <Navbar />
          <main className="lg:max-w-7xl lg:mx-auto lg:px-6 xl:px-8 pt-28 pb-20 px-4 sm:px-6">
            <Routes key={keyRef.current}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/r/:shareId" element={<PublicResume />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/builder/:id"
                element={
                  <PrivateRoute>
                    <Builder />
                  </PrivateRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <PrivateRoute>
                    <Upload />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ai"
                element={
                  <PrivateRoute>
                    <AIStudio />
                  </PrivateRoute>
                }
              />
              <Route
                path="/templates"
                element={
                  <PrivateRoute>
                    <Templates />
                  </PrivateRoute>
                }
              />
              <Route
                path="/cover-letter"
                element={
                  <PrivateRoute>
                    <CoverLetter />
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </ToastProvider>
    </ThemeProvider>
  )
}
