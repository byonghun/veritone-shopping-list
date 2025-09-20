import express, {
  type NextFunction,
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import morgan from "morgan";

const app: Application = express();

const corsOrigin = process.env.CORS_ORIGIN ?? "*";
const API_VERSION = "v1" as const;
type TApiVersion = typeof API_VERSION;

function setApiVersion(version: TApiVersion) {
  return (_req: Request, res: Response, next: NextFunction): void => {
    res.setHeader("X-API-VERSION", version);
    next();
  };
}

app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/healthz", (_req: Request, res) => {
  res.json({ ok: true as const, ts: new Date().toISOString() });
});

app.use("/api/v1", setApiVersion(API_VERSION));

app.use((_req: Request, res: Response) =>
  res
    .status(404)
    .json({ error: "NOT_FOUND" as const, message: "Route not found" })
);

export { app };
