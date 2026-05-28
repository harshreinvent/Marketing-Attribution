import { z } from 'zod'

export const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export const registerSchema = z.object({
  email:     z.string().email('Invalid email'),
  password:  z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name required'),
  lastName:  z.string().min(1, 'Last name required'),
  role: z
    .enum(['AGENCY_ADMIN', 'AGENCY_MEMBER', 'CLIENT_ADMIN', 'CLIENT_MEMBER'])
    .optional(),
  agencyId: z.string().optional(),
  clientId: z.string().optional(),
})

export const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token required'),
})

export type LoginDto    = z.infer<typeof loginSchema>
export type RegisterDto = z.infer<typeof registerSchema>
