import type { Request, Response, NextFunction } from "express";

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<any>;

export const asyncHandler =
  (fn: AsyncFn) =>
  (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
