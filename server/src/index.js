import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import resumeRoutes from './routes/resumeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/users', userRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/upload', uploadRoutes)

const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-builder'

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
