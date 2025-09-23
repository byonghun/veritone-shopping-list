import { describe, it, expect } from "@jest/globals";
import express, { NextFunction, Request, Response } from "express";
import request from "supertest";
import { errorHandler } from "../../../src/middleware/errorHandler";

function makeAppThatThrows(): express.Application {
  const app = express();
  app.get("/boom", (_req: Request, _res: Response, next: NextFunction) => {
    next(new Error("kaboom"));
  });
  // 404 not needed here; we want error handler only
  app.use(errorHandler);
  return app;
}

describe("ErrorHandler middleware", () => {
  it("returns JSON with 500 on thrown error", async () => {
    const app = makeAppThatThrows();

    const res = await request(app).get("/boom").expect(500);

    // Adjust these assertions to match your error handler's shape
    expect(res.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),   // ex: "INTERNAL_SERVER_ERROR"
        message: expect.any(String),
      })
    );
  });
});
