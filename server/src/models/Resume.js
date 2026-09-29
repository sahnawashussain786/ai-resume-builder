import mongoose from 'mongoose'

const ResumeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, default: 'Untitled Resume' },
    template: { type: String, default: 'modern' },
    accent: { type: String, default: '#2563eb' },
    font: { type: String, default: 'sans' },
    density: { type: String, default: 'normal' },
    layout: { type: String, default: 'one-column' },
    sectionOrder: { type: [String], default: [] },
    hiddenSections: { type: [String], default: [] },
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    share: { type: mongoose.Schema.Types.Mixed, default: { enabled: false, id: null } },
  },
  { timestamps: true },
)

export default mongoose.model('Resume', ResumeSchema)
