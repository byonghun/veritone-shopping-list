import type { JWTPayload } from "jose";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        sub: string;
        email?: string;
        roles?: string[];
        payload: JWTPayload;
      };
      user?: { id: string; email?: string; roles?: string[] };
    }
  }
}
