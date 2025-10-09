import express, { type NextFunction, type Application, type Request, type Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middleware/errorHandler";
import { globalLimiter } from "./middleware/rateLimit";
import { authRoutes } from "./modules/auth/routes";
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

const allowlist = new Set([
  "http://localhost:3000", // local
  "http://localhost:8080", // docker
  "http://localhost:5000", // artifact
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
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["ETag"],
  // cache preflight
  maxAge: 86400,
  optionsSuccessStatus: 204,
  // let cors() terminate OPTIONS itself
  preflightContinue: false,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Note: Used to limit payload
app.use(express.json({ limit: "1mb" }));
// Note: enabled so auth middleware can read the session cookie
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/healthz", (_req: Request, res) => {
  res.json({ ok: true as const, ts: new Date().toISOString() });
});

// Note: Global limiter is applied before routing
// And after /healthz to keep health without limit
app.use(globalLimiter);

app.use(`/api/${API_VERSION}`, setApiVersion(API_VERSION));

// Mount SSE under /api/v1/sse  (/api/v1/sse/items)
app.use(`/api/${API_VERSION}/sse`, sseRouter);

// Auth under /api/v1/auth
app.use(`/api/${API_VERSION}/auth`, authRoutes);

// Mount MVP CRUD at /api/v1/items
app.use(`/api/${API_VERSION}/items`, itemsRoutes);

app.use((_req: Request, res: Response) =>
  res.status(404).json({ error: "NOT_FOUND" as const, message: "Route not found" }),
);
app.use(errorHandler);

export { app };
