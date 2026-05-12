import type { ErrorHandler } from "hono";
import { AppError } from "./AppError";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof AppError) {
    return c.json(
      { error: err.errorCode, message: err.message },
      err.statusCode as Parameters<typeof c.json>[1]
    );
  }
  // Never expose stack traces in production
  return c.json({ error: "INTERNAL_ERROR", message: "An unexpected error occurred" }, 500);
};
