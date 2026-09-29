import { Router } from 'express'
import crypto from 'crypto'
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
    const allowed = ['title', 'template', 'accent', 'font', 'density', 'layout', 'sectionOrder', 'hiddenSections', 'content']
    const doc = { user: req.user.id }
    for (const key of allowed) if (req.body?.[key] !== undefined) doc[key] = req.body[key]
    const resume = await Resume.create(doc)
    res.status(201).json(resume)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const allowed = ['title', 'template', 'accent', 'font', 'density', 'layout', 'sectionOrder', 'hiddenSections', 'content']
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

// Duplicate a resume
router.post('/:id/duplicate', async (req, res) => {
  try {
    const src = await Resume.findOne({ _id: req.params.id, user: req.user.id })
    if (!src) return res.status(404).json({ message: 'Resume not found' })
    const { _id, createdAt, updatedAt, __v, ...rest } = src.toObject()
    const copy = await Resume.create({ ...rest, title: `${src.title} (copy)` })
    res.status(201).json(copy)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Sharing: enable/disable public link
router.post('/:id/share', async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user.id })
    if (!resume) return res.status(404).json({ message: 'Resume not found' })
    const enable = Boolean(req.body?.enabled)
    if (enable && !resume.share?.id) {
      resume.share = { enabled: true, id: crypto.randomUUID().replace(/-/g, '').slice(0, 12) }
    } else if (resume.share) {
      resume.share.enabled = enable
    } else {
      resume.share = { enabled: enable, id: enable ? crypto.randomUUID().replace(/-/g, '').slice(0, 12) : null }
    }
    await resume.save()
    res.json({ share: resume.share })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
