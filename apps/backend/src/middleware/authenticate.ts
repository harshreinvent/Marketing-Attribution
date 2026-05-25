import { Response, NextFunction } from 'express'
import { verifyAccessToken } from '../helpers/jwt'
import { sendError } from '../helpers/response'
import { AuthRequest } from '../types'

// Verifies Bearer token and attaches req.user — returns 401 otherwise.
// Also accepts ?token= query param for browser-redirect flows (e.g. Google OAuth connect).
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const queryToken = req.query.token as string | undefined

  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : queryToken

  if (!token) {
    return sendError(res, 'No token provided', 401)
  }

  try {
    req.user = verifyAccessToken(token)
    return next()
  } catch {
    return sendError(res, 'Invalid or expired token', 401)
  }
}
