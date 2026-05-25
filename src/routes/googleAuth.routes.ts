import { Router } from 'express'
import { connectGoogle, googleCallback, saveRefreshToken, testGoogleAuth } from '../controllers/google.controller'
import { authenticate } from '../middleware/authenticate'

export const googleAuthRouter = Router()

// GET /api/v1/google/connect
// Agency admin visits this URL to link their Google account.
// Token can come from Authorization header or ?token= query param.
googleAuthRouter.get('/connect', authenticate, connectGoogle)

// GET /api/v1/google/callback
// Google redirects here — no auth middleware since Google calls it directly.
googleAuthRouter.get('/callback', googleCallback)

// GET /api/v1/google/test — verify stored token works
googleAuthRouter.get('/test', authenticate, testGoogleAuth)

// POST /api/v1/google/save-token
// Manually save a refresh token (e.g. from OAuth Playground).
googleAuthRouter.post('/save-token', authenticate, saveRefreshToken)
