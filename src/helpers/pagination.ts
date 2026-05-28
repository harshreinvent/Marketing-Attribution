import { PAGE_DEFAULT, LIMIT_DEFAULT, LIMIT_MAX } from '../constants'

export const parsePagination = (query: Record<string, string | undefined>) => {
  const page  = Math.max(1, parseInt(query.page  || '') || PAGE_DEFAULT)
  const limit = Math.min(LIMIT_MAX, Math.max(1, parseInt(query.limit || '') || LIMIT_DEFAULT))
  const skip  = (page - 1) * limit
  return { page, limit, skip, take: limit }
}

export const parseDateRange = (query: Record<string, string | undefined>) => {
  const now = new Date()
  const endDate   = query.endDate   ? new Date(query.endDate + 'T23:59:59.999Z') : now
  const startDate = query.startDate ? new Date(query.startDate) : new Date(new Date().setDate(now.getDate() - 30))
  return { startDate, endDate }
}

export const toPercent = (value: number, total: number, decimals = 1): number => {
  if (total === 0) return 0
  return parseFloat(((value / total) * 100).toFixed(decimals))
}

export const toFixed = (value: number, decimals = 2): number => {
  return parseFloat(value.toFixed(decimals))
}
