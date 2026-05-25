import winston from 'winston'
import 'winston-daily-rotate-file'
import { env } from './env'

const { combine, timestamp, printf, colorize, errors } = winston.format

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const msg = message ?? JSON.stringify(meta)
    return stack ? `${ts} ${level}: ${msg}\n${stack}` : `${ts} ${level}: ${msg}`
  })
)

const prodFormat = combine(timestamp(), errors({ stack: true }), winston.format.json())

const logger = winston.createLogger({
  level: env.isDev ? 'debug' : 'info',
  format: env.isProd ? prodFormat : devFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.DailyRotateFile({
      filename:    'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      level:       'error',
      maxFiles:    '14d',
    }),
    new winston.transports.DailyRotateFile({
      filename:    'logs/combined-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles:    '14d',
    }),
  ],
})

export default logger
