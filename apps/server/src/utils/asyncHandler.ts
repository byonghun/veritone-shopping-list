import type { RequestHandler } from "express";

/**
 * Ensures any thrown error or rejected Promise in an async handler
 * is forwarded to Express's error pipeline (next(err)).
 */
export function asyncHandler<
  P = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
>(
  fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
