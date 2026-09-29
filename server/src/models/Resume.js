import mongoose from 'mongoose'

const resumeSection = new mongoose.Schema({}, { _id: false, strict: false })

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled Resume' },
    template: { type: String, default: 'modern' },
    accent: { type: String, default: '#2563eb' },
    content: {
      basics: { type: Map, of: String, default: {} },
      skills: [resumeSection],
      experience: [resumeSection],
      education: [resumeSection],
      projects: [resumeSection],
      certifications: [resumeSection],
    },
  },
  { timestamps: true },
)

export default mongoose.model('Resume', ResumeSchema)
