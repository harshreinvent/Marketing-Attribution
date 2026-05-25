import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { env } from './config/env'
import logger from './config/logger'
import { router } from './routes'
import { errorHandler, notFound } from './middleware/errorHandler'
import { globalLimiter } from './middleware/rateLimiter'
import { mountSwagger } from './swagger'

const app = express()

// ── Security headers ──────────────────────────────────────────────────────────
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin:         env.ALLOWED_ORIGINS,
    credentials:    true,
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(compression())

// ── HTTP request logging ──────────────────────────────────────────────────────
app.use(
  morgan('combined', {
    stream: { write: (message) => logger.http(message.trim()) },
    skip:   () => env.NODE_ENV === 'test',
  })
)

// ── Global rate limit ─────────────────────────────────────────────────────────
app.use(globalLimiter)

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', router)

// ── Swagger UI (dev/staging only) ─────────────────────────────────────────────
mountSwagger(app)

// ── 404 + global error handler (always last) ──────────────────────────────────
app.use(notFound)
app.use(errorHandler)

export default app
