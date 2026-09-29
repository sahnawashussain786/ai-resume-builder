import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('rb_token'))
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('rb_user') || 'null')
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (token) {
      localStorage.setItem('rb_token', token)
      localStorage.setItem('rb_user', JSON.stringify(user || null))
    } else {
      localStorage.removeItem('rb_token')
      localStorage.removeItem('rb_user')
    }
  }, [token, user])

  const login = (newToken, newUser) => {
    setToken(newToken)
    setUser(newUser)
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
