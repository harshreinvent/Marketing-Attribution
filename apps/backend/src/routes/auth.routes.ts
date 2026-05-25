import { Router } from 'express'
import { register, login, refreshToken, logout, logoutAll, me } from '../controllers/auth.controller'
import { authenticate } from '../middleware/authenticate'
import { authorize } from '../middleware/authorize'
import { validate } from '../middleware/validate'
import { authLimiter } from '../middleware/rateLimiter'
import { loginSchema, registerSchema, refreshSchema } from '../validators/auth.validator'

export const authRouter = Router()

// ── Public ────────────────────────────────────────────────────────────────────
authRouter.post('/login',   authLimiter, validate(loginSchema),   login)
authRouter.post('/refresh', validate(refreshSchema), refreshToken)
authRouter.post('/logout',  validate(refreshSchema), logout)

// ── Admin-only user creation ──────────────────────────────────────────────────
authRouter.post('/register',
  authenticate,
  authorize('SUPER_ADMIN', 'AGENCY_ADMIN'),
  validate(registerSchema),
  register
)

// ── Protected ─────────────────────────────────────────────────────────────────
authRouter.get('/me',          authenticate, me)
authRouter.post('/logout-all', authenticate, logoutAll)
