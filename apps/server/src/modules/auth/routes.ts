// Note: compose controller and middleware
// What: Wires controller actions to routes
// - uses readLimiter/writeLimiter
// - Wraps handlers with asyncHandler
// - Protects /me with requireAuth
// Why: Keeps routing concerns in one factory so you can inject the service instance
import { Router } from "express";

import { createAuthController } from "./controller";
import type { AuthService } from "./service";
import { requireAuth } from "../../middleware/auth";
import { readLimiter, writeLimiter } from "../../middleware/rateLimit";
import { asyncHandler } from "../../utils/asyncHandler";

export const authRoutes = Router();

export function makeAuthRouter(auth: AuthService, opts?: { sessionMaxAgeSec?: number }) {
  const maxAge = opts?.sessionMaxAgeSec ?? 60 * 60 * 8;
  const AuthController = createAuthController(auth, maxAge);

  authRoutes.post("/login", writeLimiter, asyncHandler(AuthController.login));
  authRoutes.post("/logout", writeLimiter, asyncHandler(AuthController.logout));
  authRoutes.get("/me", readLimiter, requireAuth, asyncHandler(AuthController.me));

  return authRoutes;
}

// Best practices included
// Email-only login with canonicalization and a unique index on emailCanonical.
// Timing-safe login by doing a bcrypt compare even when the user is missing.
// JWT with iss, aud, iat, nbf, exp. Short lived session cookie that is HttpOnly and Secure in production.
// Optional hook to record login events.
// Clean separation so you can add refresh tokens later without rewriting handlers.
