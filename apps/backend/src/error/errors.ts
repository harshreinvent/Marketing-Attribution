import { AppError } from "./AppError";

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "AUTH_ERROR");
  }
}

export class RBACError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403, "RBAC_ERROR");
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, "VALIDATION_ERROR");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(message, 404, "NOT_FOUND");
  }
}

export class SyncError extends AppError {
  constructor(message: string) {
    super(message, 500, "SYNC_ERROR");
  }
}
