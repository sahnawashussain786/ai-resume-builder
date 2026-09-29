import { Router } from 'express'
import Resume from '../models/Resume.js'

const router = Router()

// Public shared resume view — no auth, only if sharing enabled
router.get('/resumes/shared/:shareId', async (req, res) => {
  try {
    const resume = await Resume.findOne({ 'share.id': req.params.shareId, 'share.enabled': true })
    if (!resume) return res.status(404).json({ message: 'This resume is not shared (or the link is invalid).' })
    res.json({
      title: resume.title,
      template: resume.template,
      accent: resume.accent,
      font: resume.font,
      density: resume.density,
      layout: resume.layout,
      sectionOrder: resume.sectionOrder,
      hiddenSections: resume.hiddenSections,
      content: resume.content,
      updatedAt: resume.updatedAt,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
