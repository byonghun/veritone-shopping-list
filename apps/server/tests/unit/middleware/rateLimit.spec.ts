import { describe, it, expect } from "@jest/globals";
import express, { type Request, type Response } from "express";
import rateLimit, { type ValueDeterminingMiddleware, Options } from "express-rate-limit";
import { EventEmitter } from "events";
import request from "supertest";

// Note: Build a test app with tiny limiters and a FIXED keyGenerator so
// every request shares the same counter bucket.
function makeAppWithFixedKey(): express.Application {
  const app = express();
  app.use(express.json());

  type RLHandler = NonNullable<Options["handler"]>;

  const handler: RLHandler = (_req, res) => {
    res.status(429).json({
      error: "RATE_LIMITED" as const,
      message: "Too many requests. Please try again later.",
    });
  };

  const fixedKey: ValueDeterminingMiddleware<string> = () => "test-key";

  const tinyReadLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 2,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: fixedKey,
    handler,
  });

  const tinyWriteLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 1,
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: fixedKey,
    handler,
  });

  app.get("/read", tinyReadLimiter, (_req, res) => res.status(200).json({ ok: true }));
  app.post("/write", tinyWriteLimiter, (_req, res) => res.status(201).json({ created: true }));

  return app;
}

function makeMockRes(): Response & EventEmitter {
  const em = new EventEmitter();
  const res: any = em;
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.on = em.on.bind(em);
  res.emit = em.emit.bind(em);
  return res as Response & EventEmitter;
}

describe("rateLimit middleware (HTTP limiters) with fixed key", () => {
  it("GET /read → 200, 200, then 429 (limit=2)", async () => {
    const app = makeAppWithFixedKey();

    await request(app).get("/read").expect(200);
    await request(app).get("/read").expect(200);
    const limited = await request(app).get("/read").expect(429);

    expect(limited.body).toEqual({
      error: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    });
  });

  it("POST /write → 201, then 429 (limit=1)", async () => {
    const app = makeAppWithFixedKey();

    await request(app)
      .post("/write")
      .set("Content-Type", "application/json")
      .send({ foo: "bar" })
      .expect(201);

    const limited = await request(app)
      .post("/write")
      .set("Content-Type", "application/json")
      .send({ foo: "baz" })
      .expect(429);

    expect(limited.body).toEqual({
      error: "RATE_LIMITED",
      message: "Too many requests. Please try again later.",
    });
  });
});

describe("sseConnectionGuard (concurrency cap)", () => {
  const { sseConnectionGuard } = require("../../../src/middleware/rateLimit") as {
    sseConnectionGuard: (req: Request, res: Response, next: Function) => void;
  };

  it("allows up to 5 concurrent connections per client and returns 429 on the 6th", () => {
    // stable key
    const req = { ip: "203.0.113.5" } as unknown as Request;
    const next = jest.fn();

    const open: (Response & EventEmitter)[] = [];
    for (let i = 0; i < 5; i++) {
      const res = makeMockRes();
      sseConnectionGuard(req, res, next);
      open.push(res);
    }
    expect(next).toHaveBeenCalledTimes(5);

    const sixth = makeMockRes();
    sseConnectionGuard(req, sixth, next);
    expect((sixth.status as jest.Mock).mock.calls[0][0]).toBe(429);
    expect((sixth.json as jest.Mock).mock.calls[0][0]).toEqual({
      error: "RATE_LIMITED",
      message: "Too many SSE connections from this client.",
    });
    expect(next).toHaveBeenCalledTimes(5);

    open[0]!.emit("close");
    const afterClose = makeMockRes();
    sseConnectionGuard(req, afterClose, next);
    expect(next).toHaveBeenCalledTimes(6);
  });
});
