import { Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { sendSuccess, sendCreated } from '../helpers/response'
import * as authService from '../services/auth.service'

export const register = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body)
    return sendCreated(res, user, 'User registered successfully')
  } catch (error) {
    return next(error)
  }
}

export const login = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await authService.loginUser(req.body)
    return sendSuccess(res, result, 'Login successful')
  } catch (error) {
    return next(error)
  }
}

export const refreshToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tokens = await authService.refreshTokens(req.body.refreshToken)
    return sendSuccess(res, tokens, 'Tokens refreshed')
  } catch (error) {
    return next(error)
  }
}

export const logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await authService.logoutUser(req.body.refreshToken)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

export const logoutAll = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await authService.logoutAllDevices(req.user!.userId)
    return res.status(204).send()
  } catch (error) {
    return next(error)
  }
}

export const me = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req.user!.userId)
    return sendSuccess(res, user)
  } catch (error) {
    return next(error)
  }
}
