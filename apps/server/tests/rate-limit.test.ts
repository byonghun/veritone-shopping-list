import request from "supertest";
import { app } from "../src/app";

describe("Rate limits", () => {
  it("GET /api/v1/items should eventually return 429 when exceeding limit", async () => {
    // Shoot beyond the read limit (default 120/min) quickly.
    // For speed in CI, you can temporarily lower the limit in test env.
    const attempts = 130;
    let seen429 = false;

    for (let i = 1; i <= attempts; i++) {
      const res = await request(app).get("/api/v1/items");
      if (res.status === 429) {
        seen429 = true;
        break;
      }
    }

    expect(seen429).toBe(true);
  });

  it("POST /api/v1/items should 429 after write limit", async () => {
    const body = { itemName: "jest", quantity: 1, purchased: false };
    let success = 0;
    let throttled = 0;

    // try 25 posts (limit is 20/min)
    for (let i = 1; i <= 25; i++) {
      const res = await request(app).post("/api/v1/items").send(body);
      if (res.status === 201) success++;
      if (res.status === 429) throttled++;
    }

    expect(success).toBeGreaterThan(0);
    expect(throttled).toBeGreaterThan(0);
  });
});
