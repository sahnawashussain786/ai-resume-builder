import { Router } from 'express'
import auth from '../middleware/auth.js'
import { generateResumeContent, improveBullet, scoreResume, aiConfigured } from '../services/aiProvider.js'

const router = Router()
router.use(auth)

router.get('/status', (req, res) => {
  res.json({ configured: aiConfigured })
})

router.post('/generate', async (req, res) => {
  try {
    const result = await generateResumeContent(req.body || {})
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/improve-bullet', async (req, res) => {
  try {
    const { bullet, tone } = req.body || {}
    if (!bullet) return res.status(400).json({ message: 'bullet is required' })
    res.json(await improveBullet({ bullet, tone }))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/score', async (req, res) => {
  try {
    const { content } = req.body || {}
    if (!content) return res.status(400).json({ message: 'content is required' })
    res.json(await scoreResume(content))
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
