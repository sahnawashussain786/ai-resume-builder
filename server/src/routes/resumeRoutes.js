import { Router } from 'express'
import Resume from '../models/Resume.js'
import auth from '../middleware/auth.js'

const router = Router()
router.use(auth)

router.get('/', async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 })
    res.json(resumes)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    res.json(resume)
  } catch {
    res.status(404).json({ message: 'Resume not found' })
  }
})

router.post('/', async (req, res) => {
  try {
    const { title, template, accent, content } = req.body || {}
    const resume = await Resume.create({ user: req.user.id, title, template, accent, content })
    res.status(201).json(resume)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const allowed = ['title', 'template', 'accent', 'content']
    const updates = {}
    for (const key of allowed) if (req.body?.[key] !== undefined) updates[key] = req.body[key]
    const resume = await Resume.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, updates, {
      new: true,
      runValidators: true,
    })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    res.json(resume)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    res.json({ message: 'Deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
