import { Response } from 'express'
import { ApiResponse, PaginationMeta } from '../types'

export const sendSuccess = <T>(res: Response, data: T, message = 'Success', statusCode = 200) => {
  const body: ApiResponse<T> = { success: true, message, data }
  return res.status(statusCode).json(body)
}

export const sendCreated = <T>(res: Response, data: T, message = 'Created successfully') => {
  return sendSuccess(res, data, message, 201)
}

export const sendError = (res: Response, message: string, statusCode = 500) => {
  const body: ApiResponse = { success: false, message }
  return res.status(statusCode).json(body)
}

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
) => {
  const totalPages = Math.ceil(total / limit)
  const meta: PaginationMeta = {
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  }
  const body: ApiResponse<T[]> = { success: true, message, data, meta }
  return res.status(200).json(body)
}
