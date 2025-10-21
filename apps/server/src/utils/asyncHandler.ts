// Wrap all controllers with asyncHandler
// Higher-order function
// Accepts a typed Express handler "fn"
// Returns a new Express middleware that runs "fn" and routes
// any thrown error or rejected promise to next (errorHandler middleware)
import type { Request, Response, NextFunction } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

/**
 * Ensures any thrown error or rejected Promise in an async handler
 * is forwarded to Express's error pipeline (next(err)).
 * Generic P types req.params ex: { id: ItemId }
 * ResBody types res.json(...) payload ex: { ok: true }, { error: string }
 * ReqBody types req.body ex: ItemFormOutput
 * ReqQuery types req.query ex: { limit?: string; cursor?: string }
 * Locals types res.locals ex: { userId: string }
 */
export function asyncHandler<
  P extends ParamsDictionary = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery extends ParsedQs = ParsedQs,
  Locals extends Record<string, any> = Record<string, any>,
>(
  fn: (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => Promise<any> | any,
) {
  return (
    req: Request<P, ResBody, ReqBody, ReqQuery, Locals>,
    res: Response<ResBody, Locals>,
    next: NextFunction,
  ) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
