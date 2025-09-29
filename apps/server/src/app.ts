import express, {
  type NextFunction,
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import morgan from "morgan";
import { errorHandler } from "./middleware/errorHandler";
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
  "http://localhost:3000",
  "http://localhost:8080",
  "http://127.0.0.1:3000",
]);

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // allow server-to-server (no Origin) and your dev origins
    if (!origin || allowlist.has(origin)) return cb(null, true);
    cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: false, // set true ONLY if you send cookies from the browser
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["ETag"],
  maxAge: 86400,          // cache preflight
  optionsSuccessStatus: 204,
  preflightContinue: false // let cors() terminate OPTIONS itself
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/healthz", (_req: Request, res) => {
  res.json({ ok: true as const, ts: new Date().toISOString() });
});

app.use("/api/v1", setApiVersion(API_VERSION));

// Mount SSE under /api/v1/sse  (→ /api/v1/sse/items)
app.use("/api/v1/sse", sseRouter);

// Mount MVP CRUD at /api/v1/items
app.use("/api/v1/items", itemsRoutes);

app.use((_req: Request, res: Response) =>
  res
    .status(404)
    .json({ error: "NOT_FOUND" as const, message: "Route not found" })
);
app.use(errorHandler);

export { app };
