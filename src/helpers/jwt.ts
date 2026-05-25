import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { JwtPayload } from '../types'

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions)
}

export const signRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN,
  } as jwt.SignOptions)
}

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtPayload
}

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as { userId: string }
}
