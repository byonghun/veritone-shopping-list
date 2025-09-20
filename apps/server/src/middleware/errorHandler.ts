import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

type ErrorBody =
  | { error: "BAD_REQUEST"; message: string }
  | { error: "NOT_FOUND"; message: string }
  | { error: "ERROR" | "INTERNAL"; message: string };

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response<ErrorBody>,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    res
      .status(400)
      .json({ error: "BAD_REQUEST", message: "Validation failed" });
    return;
  }

  const status = (err as { status?: number } | undefined)?.status ?? 500;
  const message =
    (err as { message?: string } | undefined)?.message ??
    "Internal Server Error";

  res
    .status(status)
    .json({ error: status === 500 ? "INTERNAL" : "ERROR", message });
};
