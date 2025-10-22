// Note: handles HTTP concerns and cookie settings
// What: Validates input with LoginInputSchema, calls the service,
// and manages the session cookie via setSessionCookie and clearSessionCookie. Exposes:
// POST /auth/login → sets cookie and returns a minimal user object.
// POST /auth/logout → clears cookie.
// GET /auth/me → returns identity if req.user is present.
// Why: Separates concerns. Controller knows HTTP (status codes, cookies, payload shape).
// It does not know hashing or JWT details.
import type { Request, Response } from "express";
import { LoginInputSchema } from "@app/shared";
import type { AuthService } from "./service";
import { setSessionCookie, clearSessionCookie } from "../../middleware/auth";

export function createAuthController(auth: AuthService, sessionMaxAgeSec: number) {
  return {
    /** POST /api/v1/auth/login */
    async login(req: Request, res: Response): Promise<void> {
      const parsed = LoginInputSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: "bad_request", message: "Invalid credentials format." });
        return;
      }
      const { email, password } = parsed.data;
      try {
        const { user, token } = await auth.login(email, password);
        setSessionCookie(res, token, sessionMaxAgeSec);
        res.status(200).json({ id: user.id, email: user.email, roles: user.roles, isGuest: user.isGuest });
      } catch (e: any) {
        if (e?.message === "invalid_credentials") {
          res.status(401).json({ error: "unauthorized", message: "Invalid credentials." });
          return;
        }
        res.status(500).json({ error: "server_error", message: "Login failed." });
      }
    },

    /** POST /api/v1/auth/logout */
    async logout(_req: Request, res: Response): Promise<void> {
      clearSessionCookie(res);
      res.status(204).send();
    },

    /** GET /api/v1/auth/me */
    async me(req: Request, res: Response): Promise<void> {
      const u = req.user;
      if (!u) {
        res.status(401).json({ error: "unauthorized", message: "Missing session." });
        return;
      }
      res.status(200).json({ id: u.id, email: u.email, roles: u.roles ?? [], isGuest: u.isGuest });
    },
  } as const;
}
