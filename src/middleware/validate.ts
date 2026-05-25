import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

// Usage: router.post('/login', validate(loginSchema), handler)
// Usage: router.get('/leads', validate(leadQuerySchema, 'query'), handler)
export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source])

    if (!result.success) {
      return next(result.error)  // passed to errorHandler which handles ZodError
    }

    req[source] = result.data
    return next()
  }
}
