import mongoose from 'mongoose'

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled Resume' },
    template: { type: String, default: 'modern' },
    accent: { type: String, default: '#2563eb' },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
)

export default mongoose.model('Resume', ResumeSchema)
