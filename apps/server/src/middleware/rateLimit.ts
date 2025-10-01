import type { Request, Response, NextFunction } from "express";
import rateLimit, { ipKeyGenerator, Options, type ValueDeterminingMiddleware } from "express-rate-limit";

const READ_LIMIT = Number(process.env.RL_READ || 120);
const WRITE_LIMIT = Number(process.env.RL_WRITE || 20);

// Note: Always returns a string and is IPv6-safe per express-rate-limit validation
export const keyGenerator: ValueDeterminingMiddleware<string> = (
  req: Request,
  res: Response
  // @ts-ignore
) => ipKeyGenerator(req, res);

// Note: Helper so non-Express-Rate-Limit code can reuse the same key logic
export function getClientKey(req: Request, res?: Response): string {
  // @ts-ignore
  return keyGenerator(req, res);
}

const handleRateLimit: Options["handler"] = (_req, res) => {
  res.status(429).json({
    error: "RATE_LIMITED" as const,
    message: "Too many requests. Please try again later.",
  });
};

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: handleRateLimit,
});

export const readLimiter = rateLimit({
  windowMs: 60 * 1000,
  // per window
  limit: READ_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: handleRateLimit,
});

export const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: WRITE_LIMIT,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator,
  handler: handleRateLimit,
});

/**
 * SSE concurrent connection guard
 * - Uses the same getClientKey() as HTTP limiters
 * - Caps concurrent open SSE connections per client
 * - For multi-instance deployments, replace the Map with a shared store (e.g., Redis)
 */
const sseConnectionsPerKey = new Map<string, number>();
const SSE_MAX_PER_KEY = 5;

export function sseConnectionGuard(req: Request, res: Response, next: NextFunction) {
  const key = getClientKey(req, res);
  const current = sseConnectionsPerKey.get(key) ?? 0;

  if (current >= SSE_MAX_PER_KEY) {
    res.status(429).json({
      error: "RATE_LIMITED" as const,
      message: "Too many SSE connections from this client.",
    });
    return;
  }

  sseConnectionsPerKey.set(key, current + 1);

  // Note: When the client disconnects, decrement
  res.on("close", () => {
    const now = sseConnectionsPerKey.get(key) ?? 1;
    const nextVal = Math.max(0, now - 1);
    if (nextVal === 0) sseConnectionsPerKey.delete(key);
    else sseConnectionsPerKey.set(key, nextVal);
  });

  next();
}
