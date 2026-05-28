import { Response, NextFunction } from 'express'
import { UserRole } from '../generated/prisma'
import { sendError } from '../helpers/response'
import { AuthRequest } from '../types'

// Usage: router.post('/clients', authenticate, authorize('SUPER_ADMIN', 'AGENCY_ADMIN'), handler)
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return sendError(res, 'Unauthorized', 401)
    if (!roles.includes(req.user.role)) {
      return sendError(res, 'You do not have permission to do this', 403)
    }
    return next()
  }
}

// Client-level users can only access their own client's data
// Agency-level and super admin can access any client
export const enforceClientScope = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return sendError(res, 'Unauthorized', 401)

  const { role, clientId } = req.user
  const requestedClientId  = req.params.clientId || (req.query.clientId as string)

  // Agency and super admin have no restriction
  if (role === 'SUPER_ADMIN' || role === 'AGENCY_ADMIN' || role === 'AGENCY_MEMBER') {
    return next()
  }

  // Client users can only see their own client
  if (requestedClientId && requestedClientId !== clientId) {
    return sendError(res, 'Access denied to this client', 403)
  }

  return next()
}
