export const SESSION_COOKIE = "session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 8; // 8h
export const isProd = process.env.NODE_ENV === "production";
export const JWT_SECRET = (process.env.JWT_SECRET ?? "").trim();
