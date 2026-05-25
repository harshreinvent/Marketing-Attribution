import 'dotenv/config'
import app from './app'
import db from './config/db'
import logger from './config/logger'
import { env } from './config/env'
import { startCronJobs } from './jobs/sync.job'

const start = async () => {
  // Verify DB connection before accepting traffic
  await db.$connect()
  logger.info('Database connected')

  // Start scheduled sync jobs
  if (env.NODE_ENV !== 'test') {
    startCronJobs()
  }

  const server = app.listen(parseInt(env.PORT, 10), () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`)
  })

  // Graceful shutdown — finish in-flight requests before closing
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`)
    server.close(async () => {
      await db.$disconnect()
      logger.info('Server closed')
      process.exit(0)
    })
    // Force exit after 10 s if something hangs
    setTimeout(() => process.exit(1), 10_000)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))

  // Catch unhandled promise rejections — log and exit
  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled rejection:', err)
    process.exit(1)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
