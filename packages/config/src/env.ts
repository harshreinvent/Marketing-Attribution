import { z } from 'zod';

const envSchema = z.object({
  // Database — required by all services
  DATABASE_URL: z.string().min(1),
  DIRECT_URL:   z.string().min(1),

  // Supabase — required by all services
  SUPABASE_URL:              z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Supabase anon key — only needed by frontend/auth login
  SUPABASE_ANON_KEY: z.string().optional(),

  // CORS origin — backend only, defaults to localhost
  FRONTEND_URL: z.string().url().default('http://localhost:3000'),

  // Redis (Upstash) — optional; rate limiting fails open if missing
  UPSTASH_REDIS_REST_URL:   z.string().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

  // Google Ads — worker only
  GOOGLE_ADS_CLIENT_ID:       z.string().optional(),
  GOOGLE_ADS_CLIENT_SECRET:   z.string().optional(),
  GOOGLE_ADS_DEVELOPER_TOKEN: z.string().optional(),
  GOOGLE_ADS_REFRESH_TOKEN:   z.string().optional(),

  // Meta Ads — worker only
  META_APP_ID:     z.string().optional(),
  META_APP_SECRET: z.string().optional(),

  // GA4 — worker only
  GA4_SERVICE_ACCOUNT_KEY: z.string().optional(),

  // GMB — worker only
  GMB_SERVICE_ACCOUNT_KEY: z.string().optional(),

  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT:     z.string().default('3001'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Missing or invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
