import axios from 'axios'
import { useAuth } from '../context/AuthContext.jsx'

export default function useApi() {
  const { token } = useAuth()
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })
}
