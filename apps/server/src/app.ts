import express, { type NextFunction, type Application, type Request, type Response } from "express";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler";
import { globalLimiter } from "./middleware/rateLimit";
import { itemsRoutes } from "./modules/items/routes";
import { sseRouter } from "./sse";

const API_VERSION = "v1" as const;

function setApiVersion(version: typeof API_VERSION) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("X-API-VERSION", version);
    next();
  };
}

const app: Application = express();

// Trust the first reverse proxy hop (Nginx)
// Must be placed before any middleware that uses IP address or protocol
app.set("trust proxy", 1);

// Big O notatation - Set is O(1)
const allowlist = new Set([
  "http://localhost:3000", // local
  "http://localhost:8080", // docker
  "http://localhost:5000", // web artifact
  "http://127.0.0.1:3000",
]);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // allow server-to-server (no Origin) and your dev origins
    if (!origin || allowlist.has(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  // set true ONLY if you send cookies from the browser
  credentials: false,
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  // Add: Authorization if we use Oauth 2.0 Authorization
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["ETag", "X-API-VERSION"],
  // cache preflight
  maxAge: 86400,
  optionsSuccessStatus: 204,
  // let cors() terminate OPTIONS itself
  preflightContinue: false,
};

// Applies CORS to all routes
app.use(cors(corsOptions));
// Explicitly handles OPTIONS /* preflights
// Preflight: CORS preflight request that sends before actual request
// asking the server for permission to call to the
// methods/headers/credentials from this origin
app.options("*", cors(corsOptions));

// Parses application/json bodies into req.body
// And caps it at one megabyte to prevent abuse
app.use(express.json({ limit: "1mb" }));
// Access logs
// dev in development shows concise and colorized logs
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Liveness endpoint that always return a small JSON payload and a timestamp
// Intentionally before the rate limiter so health checks never get throttled
app.get("/healthz", (_req: Request, res) => {
  res.json({ ok: true as const, ts: new Date().toISOString() });
});

// Note: Global limiter is applied before routing
// And after /healthz to keep health without limit
// This only limits the initial "handshake" request so for SSE
// the stream itself is not throttled
app.use(globalLimiter);

app.use(`/api/${API_VERSION}`, setApiVersion(API_VERSION));

// Mount SSE under /api/v1/sse  (/api/v1/sse/items)
// Response header
// Content-Type: text/event-stream
// Cache-Control: no-cache, no transform
// Connection: keep-alive
app.use(`/api/${API_VERSION}/sse`, sseRouter);

// Mount MVP CRUD at /api/v1/items
app.use(`/api/${API_VERSION}/items`, itemsRoutes);

// Catch-all for any unmatched route: consistent JSON 404 status
app.use((_req: Request, res: Response) =>
  res.status(404).json({ error: "NOT_FOUND" as const, message: "Route not found" }),
);

// Final error middleware that converts or forwarded errors
app.use(errorHandler);

export { app };
