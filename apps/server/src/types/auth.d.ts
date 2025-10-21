export type AuthConfig = {
  jwtSecret: string; // long random secret from env
  issuer?: string; // default "your-app"
  audience?: string | string[]; // default "app"
  sessionMaxAgeSec?: number; // default 8h
  // Optional: tune Argon2 costs (these are reasonable defaults)
  argon?: {
    timeCost?: number; // iterations (default 3)
    memoryCost?: number; // KiB (default 2**16 = 65536)
    parallelism?: number; // threads (default 1–4)
  };
};
