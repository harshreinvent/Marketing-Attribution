// Throw anywhere in services/controllers to return a proper HTTP error
// Example: throw new AppError('User not found', 404)
export class AppError extends Error {
  statusCode: number

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.name = 'AppError'
  }
}
