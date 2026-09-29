import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import resumeRoutes from './routes/resumeRoutes.js'
import userRoutes from './routes/userRoutes.js'
import aiRoutes from './routes/aiRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import publicRoutes from './routes/publicRoutes.js'

dotenv.config()

const app = express()
app.use(express.json({ limit: '10mb' }))
app.use(cors())

app.get('/api/health', (req, res) => res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' }))
app.use('/api/users', userRoutes)
app.use('/api/resumes', resumeRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/public', publicRoutes)

// Central error handler (e.g. multer file-type errors)
app.use((err, req, res, next) => {
  res.status(err.status || 400).json({ message: err.message || 'Request failed' })
})

const PORT = process.env.PORT && process.env.PORT !== '0' ? Number(process.env.PORT) : 5000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/resume-builder'

async function connectMongo(attempt = 1) {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('✅ MongoDB connected')
  } catch (err) {
    console.error(`❌ MongoDB connection failed (attempt ${attempt}): ${err.message}`)
    console.error('   Accounts & resume saving need MongoDB. AI generation and file parsing still work.')
    console.error('   Set MONGO_URI in server/.env (Atlas) or run `docker compose up -d mongo` in the project root.')
    if (attempt < 5) {
      setTimeout(() => connectMongo(attempt + 1), 5000 * attempt)
    }
  }
}

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`AI provider: ${process.env.AI_API_KEY ? `configured (${process.env.AI_MODEL || 'gpt-4o-mini'})` : 'not configured — using built-in local generator'}`)
  connectMongo()
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Another server instance is probably running.`)
    console.error('   Fix: kill the other process (or set PORT=5001 in server/.env), then restart.')
    process.exit(1)
  }
  throw err
})
