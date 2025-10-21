// Transport-agnostic auth
// What: Cookie helpers and a route guard:
// setSessionCookie and clearSessionCookie set an HttpOnly, SameSite=Lax cookie; Secure in production
// requireAuth(auth) reads the session cookie or a Bearer token (Oauth 2.0 Authentication) verifies,
// and attaches req.user and req.auth
// Why: Reusable guard and you can place before any protected route.
// Keeps cookie/Bearer transport separate from core auth logic

import type { NextFunction, Request, Response } from "express";
import type { AuthService } from "../modules/auth/service";

const SESSION_COOKIE = "session";
const isProd = process.env.NODE_ENV === "production";

export function setSessionCookie(res: Response, token: string, maxAgeSec: number) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSec};${isProd ? " Secure;" : ""}`,
  );
}

export function clearSessionCookie(res: Response) {
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0;${isProd ? " Secure;" : ""}`,
  );
}

function bearerToken(req: Request): string | undefined {
  const h = req.headers.authorization;
  if (!h) return;
  const [scheme, ...rest] = h.split(" ");
  if (!scheme || scheme.toLowerCase() !== "bearer") return;
  const token = rest.join(" ").trim();
  return token || undefined;
}

export function requireAuth(auth: AuthService) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const fromCookie = (req as any).cookies?.[SESSION_COOKIE];
      const fromBearer = bearerToken(req);
      const token = fromCookie || fromBearer;
      if (!token) {
        res.status(401).json({ error: "unauthorized", message: "Missing session." });
        return;
      }
      const ident = await auth.verify(token);
      req.user = { id: ident.id, email: ident.email, roles: ident.roles };
      req.auth = { sub: ident.id, email: ident.email, roles: ident.roles, payload: ident.payload };
      next();
    } catch {
      res.status(401).json({ error: "unauthorized", message: "Invalid or expired session." });
    }
  };
}
