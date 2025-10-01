import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

type ErrorBody =
  | { error: "BAD_REQUEST"; message: string }
  | { error: "NOT_FOUND"; message: string }
  | { error: "ERROR" | "INTERNAL"; message: string }
  | { error: "RATE_LIMITED"; message: string };

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    return res
      .status(400)
      .json({ error: "BAD_REQUEST", message: "Validation failed" });
  }

  if ((err as any)?.status === 429) {
    return res
      .status(429)
      .json({ error: "RATE_LIMITED", message: "Too many requests. Please try again later." });
  }

  const status = (err as { status?: number } | undefined)?.status ?? 500;
  const message =
    (err as { message?: string } | undefined)?.message ??
    "Internal Server Error";

  const body: any = {
    error: status === 500 ? "INTERNAL" : "ERROR",
    message,
  };
  if (process.env.NODE_ENV !== "production" && (err as any)?.stack) {
    body.stack = (err as any).stack;
  }

  res.status(status).json(body as ErrorBody);
};
