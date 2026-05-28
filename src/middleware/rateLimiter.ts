import rateLimit from 'express-rate-limit'

// Global — applied to all routes in app.ts
export const globalLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,  // 15 minutes
  max:            300,
  message:        { success: false, message: 'Too many requests, slow down' },
  standardHeaders: true,
  legacyHeaders:  false,
})

// Auth routes — tighter to prevent brute force
export const authLimiter = rateLimit({
  windowMs:       15 * 60 * 1000,
  max:            10,
  message:        { success: false, message: 'Too many login attempts, try after 15 minutes' },
  standardHeaders: true,
  legacyHeaders:  false,
})

// Webhook routes — higher throughput needed for real-time events
export const webhookLimiter = rateLimit({
  windowMs:       1 * 60 * 1000,   // 1 minute
  max:            200,
  standardHeaders: true,
  legacyHeaders:  false,
})
