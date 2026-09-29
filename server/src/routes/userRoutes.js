import { Router } from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

function tokenFor(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'dev-secret-change-me', {
    expiresIn: '7d',
  })
}

export function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email }
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body || {}
    if (!name || !email || !password) return res.status(400).json({ message: 'All fields are required' })
    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) return res.status(409).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password })
    res.status(201).json({ token: tokenFor(user), user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    const user = await User.findOne({ email: (email || '').toLowerCase() })
    if (!user || !(await user.comparePassword(password || ''))) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }
    res.json({ token: tokenFor(user), user: publicUser(user) })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
