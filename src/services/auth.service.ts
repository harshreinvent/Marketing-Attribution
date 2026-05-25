import db from '../config/db'
import { hashPassword, verifyPassword } from '../helpers/hash'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../helpers/jwt'
import { AppError } from '../helpers/AppError'
import { RegisterDto, LoginDto } from '../validators/auth.validator'

const refreshTokenExpiry = () => {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d
}

export const registerUser = async (dto: RegisterDto) => {
  const existing = await db.user.findUnique({ where: { email: dto.email } })
  if (existing) throw new AppError('Email already registered', 409)

  const hashed = await hashPassword(dto.password)

  const user = await db.user.create({
    data: {
      email:     dto.email,
      password:  hashed,
      firstName: dto.firstName,
      lastName:  dto.lastName,
      role:      (dto.role as any) || 'AGENCY_MEMBER',
      agencyId:  dto.agencyId,
      clientId:  dto.clientId,
    },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, agencyId: true, clientId: true,
    },
  })

  return user
}

export const loginUser = async (dto: LoginDto) => {
  const user = await db.user.findUnique({ where: { email: dto.email } })
  if (!user || !user.isActive) throw new AppError('Invalid email or password', 401)

  const valid = await verifyPassword(dto.password, user.password)
  if (!valid) throw new AppError('Invalid email or password', 401)

  await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })

  const payload = {
    userId:   user.id,
    email:    user.email,
    role:     user.role,
    agencyId: user.agencyId ?? undefined,
    clientId: user.clientId ?? undefined,
  }

  const accessToken  = signAccessToken(payload)
  const refreshToken = signRefreshToken(user.id)

  await db.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt: refreshTokenExpiry() },
  })

  return {
    accessToken,
    refreshToken,
    user: {
      id:        user.id,
      email:     user.email,
      firstName: user.firstName,
      lastName:  user.lastName,
      role:      user.role,
      agencyId:  user.agencyId ?? undefined,
      clientId:  user.clientId ?? undefined,
    },
  }
}

export const refreshTokens = async (token: string) => {
  const payload = verifyRefreshToken(token)

  const stored = await db.refreshToken.findUnique({ where: { token } })
  if (!stored || stored.expiresAt < new Date()) {
    throw new AppError('Invalid or expired refresh token', 401)
  }

  const user = await db.user.findUnique({ where: { id: payload.userId } })
  if (!user || !user.isActive) throw new AppError('User not found', 401)

  // Token rotation — invalidate old, issue new
  await db.refreshToken.delete({ where: { id: stored.id } })

  const newAccessToken  = signAccessToken({
    userId: user.id, email: user.email, role: user.role,
    agencyId: user.agencyId ?? undefined, clientId: user.clientId ?? undefined,
  })
  const newRefreshToken = signRefreshToken(user.id)

  await db.refreshToken.create({
    data: { token: newRefreshToken, userId: user.id, expiresAt: refreshTokenExpiry() },
  })

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

export const logoutUser = async (token: string) => {
  await db.refreshToken.deleteMany({ where: { token } })
}

export const logoutAllDevices = async (userId: string) => {
  await db.refreshToken.deleteMany({ where: { userId } })
}

export const getMe = async (userId: string) => {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true, email: true, firstName: true, lastName: true,
      role: true, lastLoginAt: true,
      agency: { select: { id: true, name: true, slug: true } },
      client: { select: { id: true, name: true, slug: true } },
    },
  })

  if (!user) throw new AppError('User not found', 404)
  return user
}
