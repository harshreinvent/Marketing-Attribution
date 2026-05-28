import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { AppError } from '../helpers/AppError'
import { googleOAuthService } from '../services/googleOAuth.service'

// GET /api/v1/google/connect
// Agency admin navigates to this URL (in browser) to connect the agency Google account.
// Accepts Bearer token via Authorization header OR ?token= query param so it works as a
// direct browser link (browsers can't set headers on redirects).

export const connectGoogle = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401)

    if (req.user.role !== 'AGENCY_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new AppError('Agency admin access required', 403)
    }

    const url = googleOAuthService.getAuthUrl()
    return res.redirect(url)
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/google/callback
// Google redirects here after the admin grants access.
// Exchanges the auth code for tokens and saves the encrypted refresh token.
// No auth middleware — Google calls this URL directly.

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const code = req.query.code as string
    if (!code) {
      return res.status(400).json({ error: 'MISSING_CODE', message: 'No authorization code in query string' })
    }

    await googleOAuthService.handleCallback(code)
    return res.json({ message: 'Google agency account connected successfully. GA4 sync is now ready.' })
  } catch (error) {
    return next(error)
  }
}

// GET /api/v1/google/test
// Verifies the stored refresh token works by fetching a fresh access token.
export const testGoogleAuth = async (_req: AuthRequest, res: Response, _next: NextFunction) => {
  try {
    const client = await googleOAuthService.getAuthenticatedClient()
    const { token } = await (client as any).getAccessToken()
    if (!token) throw new AppError('No access token returned from Google', 500)
    return res.json({ success: true, message: 'Google auth is working', hasAccessToken: true })
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// POST /api/v1/google/save-token
// Manually save a refresh token obtained from OAuth Playground or any other flow.
// Agency admin only.

export const saveRefreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw new AppError('Unauthorized', 401)
    if (req.user.role !== 'AGENCY_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
      throw new AppError('Agency admin access required', 403)
    }

    const { refreshToken, accountEmail } = req.body
    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'refreshToken is required' })
    }

    await googleOAuthService.saveRefreshToken(refreshToken, accountEmail)
    return res.json({ success: true, message: 'Google refresh token saved. GA4 sync is now ready.' })
  } catch (error) {
    return next(error)
  }
}
