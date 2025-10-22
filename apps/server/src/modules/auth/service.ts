// Note: Business Logic Holds auth logic, hashing, JWT signing and verification
// Makes it easier to unit test
// repo -> service -> controller -> routes -> middleware
// What: createAuthService holds everything security-critical
// - Argon2 verification: verifies the submitted password against the stored passwordHash.
// - Uses a dummy Argon2 hash when the user does not exist to reduce timing side channels
// JWT minting and verification: signs HS256 JWTs with "iss", "aud", "iat", "nbf", "exp".
// Verifies with "jose" and enforces a strong jwtSecret length
// Configuration checks: enforces a strong jwtSecret length
// Exposes login(emailCanonical, password) and verify(token)
// Why: Security logic belongs in one place that is easy to test. The controller stays tiny and HTTP-only
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import argon2, { argon2id } from "argon2";
import type { User } from "@app/shared";
import type { AuthRepo } from "./repo";
import type { AuthConfig } from "../../types/auth";

export function createAuthService(repo: AuthRepo, config: AuthConfig) {
  const issuer = config.issuer ?? "your-app";
  const audience = config.audience ?? "app";
  const sessionMaxAgeSec = config.sessionMaxAgeSec ?? 60 * 60 * 8;

  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    // HS256 should have a strong secret; 32+ bytes is a good baseline
    throw new Error("jwtSecret must be at least 32 characters for HS256.");
  }
  const key = new TextEncoder().encode(config.jwtSecret);

  // Lazily-initialized dummy hash to equalize timing for "user not found" vs "bad password"
  let DUMMY_PWD_HASH: string | null = null;
  const getDummyHash = async () => {
    if (!DUMMY_PWD_HASH) {
      DUMMY_PWD_HASH = await argon2.hash("not-the-real-password", {
        type: argon2id,
        timeCost: config.argon?.timeCost ?? 3,
        memoryCost: config.argon?.memoryCost ?? 2 ** 16, // ~64MB
        parallelism: config.argon?.parallelism ?? 1,
      });
    }
    return DUMMY_PWD_HASH;
  };

  async function signSessionJWT(u: User): Promise<string> {
    const now = Math.floor(Date.now() / 1000);
    return await new SignJWT({ sub: u.id, email: u.email, roles: u.roles, isGuest: u.isGuest })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt(now)
      .setNotBefore(now)
      .setExpirationTime(now + sessionMaxAgeSec)
      .setAudience(audience)
      .setIssuer(issuer)
      .sign(key);
  }

  async function verifySessionJWT(token: string): Promise<JWTPayload> {
    const { payload } = await jwtVerify(token, key, {
      issuer,
      audience,
      clockTolerance: 30, // seconds
    });
    return payload;
  }

  return {
    /**
     * Email + password login.
     * Returns { user, token } or throws Error("invalid_credentials")
     */
    async login(emailCanonical: string, password: string): Promise<{ user: User; token: string }> {
      const user = await repo.findByEmailCanonical(emailCanonical);
      const hashToVerify = user?.passwordHash ?? (await getDummyHash());

      // NOTE: verify() does NOT accept { type: argon2id }. It infers from the hash.
      const ok = await argon2.verify(hashToVerify, password);
      if (!user || !ok) {
        throw new Error("invalid_credentials");
      }

      const token = await signSessionJWT(user);
      await repo.onSuccessfulLogin?.(user.id).catch(() => {});
      return { user, token };
    },

    /** Verify a session token and return a lightweight identity object */
    async verify(
      token: string,
    ): Promise<{
      id: string;
      email?: string;
      roles?: string[];
      isGuest?: boolean;
      payload: JWTPayload;
    }> {
      const payload = await verifySessionJWT(token);
      return {
        id: String(payload.sub),
        email: typeof payload.email === "string" ? payload.email : undefined,
        roles: Array.isArray((payload as any).roles)
          ? ((payload as any).roles as string[])
          : undefined,
        isGuest:
          typeof (payload as any).isGuest === "boolean" ? (payload as any).isGuest : undefined,
        payload,
      };
    },
  } as const;
}

export type AuthService = ReturnType<typeof createAuthService>;
