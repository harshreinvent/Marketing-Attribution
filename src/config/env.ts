import dotenv from 'dotenv'
dotenv.config()

// Fail fast on startup if required vars are missing
const required = ['DATABASE_URL', 'JWT_SECRET', 'REFRESH_TOKEN_SECRET']
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Missing required env var: ${key}`)
    process.exit(1)
  }
}

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3001',

  DATABASE_URL:  process.env.DATABASE_URL  as string,
  DIRECT_URL:    process.env.DIRECT_URL    || '',

  // Local JWT auth
  JWT_SECRET:                process.env.JWT_SECRET                as string,
  JWT_EXPIRES_IN:            process.env.JWT_EXPIRES_IN            || '15m',
  REFRESH_TOKEN_SECRET:      process.env.REFRESH_TOKEN_SECRET      as string,
  REFRESH_TOKEN_EXPIRES_IN:  process.env.REFRESH_TOKEN_EXPIRES_IN  || '7d',

  // CORS
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),

  // Google OAuth (agency account for GA4)
  GOOGLE_CLIENT_ID:     process.env.GOOGLE_CLIENT_ID     || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  GOOGLE_REDIRECT_URI:  process.env.GOOGLE_REDIRECT_URI  || 'http://localhost:3001/api/v1/google/callback',

  // AES-256-GCM key for encrypting stored refresh tokens
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || '',

  // Google Ads
  GOOGLE_ADS_DEVELOPER_TOKEN: process.env.GOOGLE_ADS_DEVELOPER_TOKEN || '',
  GOOGLE_ADS_CLIENT_ID:       process.env.GOOGLE_ADS_CLIENT_ID       || '',
  GOOGLE_ADS_CLIENT_SECRET:   process.env.GOOGLE_ADS_CLIENT_SECRET   || '',

  // Meta Ads
  META_APP_ID:     process.env.META_APP_ID     || '',
  META_APP_SECRET: process.env.META_APP_SECRET || '',

  // Exotel (call tracking)
  EXOTEL_API_KEY:      process.env.EXOTEL_API_KEY      || '',
  EXOTEL_API_TOKEN:    process.env.EXOTEL_API_TOKEN     || '',
  EXOTEL_ACCOUNT_SID:  process.env.EXOTEL_ACCOUNT_SID  || '',

  // GoHighLevel CRM
  GHL_API_KEY: process.env.GHL_API_KEY || '',

  // Webhooks
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET || '',

  // Upstash Redis (optional — cache fails open if missing)
  UPSTASH_REDIS_REST_URL:   process.env.UPSTASH_REDIS_REST_URL   || '',
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN || '',

  // Cron schedule
  SYNC_CRON_SCHEDULE: process.env.SYNC_CRON_SCHEDULE || '0 */6 * * *',

  isProd: process.env.NODE_ENV === 'production',
  isDev:  process.env.NODE_ENV !== 'production',
}
