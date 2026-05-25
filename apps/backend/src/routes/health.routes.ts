import { Router } from 'express'
import db from '../config/db'
import { redis } from '../config/redis'

export const healthRouter = Router()

healthRouter.get('/', async (_req, res) => {
  const [dbResult, cacheResult] = await Promise.allSettled([
    db.$queryRaw`SELECT 1`,
    (redis as any).ping?.(),
  ])
  res.json({
    status: 'ok',
    db:    dbResult.status    === 'fulfilled' ? 'ok' : 'error',
    cache: cacheResult.status === 'fulfilled' ? 'ok' : 'unavailable',
    ts:    new Date().toISOString(),
  })
})
