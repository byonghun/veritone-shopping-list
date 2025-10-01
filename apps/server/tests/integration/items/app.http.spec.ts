import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../../../src/app";

describe("App wiring (HTTP integration)", () => {
  it("GET /healthz returns ok and a timestamp", async () => {
    const res = await request(app).get("/healthz").expect(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        ok: true,
        ts: expect.any(String),
      }),
    );
    // ts should be ISO-ish
    expect(new Date(res.body.ts).toString()).not.toBe("Invalid Date");
  });

  it("sets X-API-VERSION header for /api/v1/*", async () => {
    // any v1 route will do; healthz is outside the versioned prefix by design
    const res = await request(app).get("/api/v1/items").expect(200);
    expect(res.headers["x-api-version"]).toBe("v1");
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(typeof res.body.count).toBe("number");
  });

  it("returns 404 JSON for unknown routes", async () => {
    const res = await request(app).get("/veritone/not-found").expect(404);
    expect(res.body).toEqual({
      error: "NOT_FOUND",
      message: "Route not found",
    });
  });
});
