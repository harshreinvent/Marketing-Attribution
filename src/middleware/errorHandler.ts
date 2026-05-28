import { Request, Response, NextFunction } from 'express'
import { Prisma } from '../generated/prisma'
import { AppError } from '../helpers/AppError'
import logger from '../config/logger'

// Last middleware in app.ts — catches all errors
export const errorHandler = (err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`${req.method} ${req.path} — ${err.message}`)

  // Our own business-logic errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ success: false, message: err.message })
  }

  // Prisma known request errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Record already exists' })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Record not found' })
    }
  }

  // Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors:  (err as any).errors,
    })
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' })
  }

  // Unknown — never leak internals in production
  const message = process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  return res.status(500).json({ success: false, message })
}

// Catches requests to routes that don't exist
export const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  })
}
