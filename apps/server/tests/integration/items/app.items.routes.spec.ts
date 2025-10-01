import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../../../src/app";

// Note: Per-test unique IP (avoid cross-test rate limit collisions)
let ipCounter = 10;
function nextTestIp(): string {
  ipCounter = (ipCounter % 250) + 1; // 11..250 loop
  return `10.0.0.${ipCounter}`;
}

// Note: Apply IP headers to a supertest request
function withIp<T extends request.Test>(req: T, ip: string): T {
  return req.set("X-Forwarded-For", ip).set("X-Real-IP", ip);
}

async function createItem(ip: string, itemName = "Milk", quantity = 1, description?: string) {
  const res = await withIp(
    request(app).post("/api/v1/items").set("Content-Type", "application/json"),
    ip,
  )
    .send({ itemName, quantity, description })
    .expect(201);

  expect(typeof res.body.id).toBe("string");
  expect(res.headers["x-api-version"]).toBe("v1");

  return res.body as {
    id: string;
    itemName: string;
    quantity: number;
    description?: string;
    purchased: boolean;
  };
}

describe("Items routes CRUD tests", () => {
  it("POST /api/v1/items creates an item", async () => {
    const ip = nextTestIp();
    const created = await createItem(ip, "Bananas", 6);

    expect(created).toEqual(
      expect.objectContaining({
        itemName: "Bananas",
        quantity: 6,
        purchased: false,
      }),
    );
  });

  it("GET /api/v1/items/:id returns a single item", async () => {
    const ip = nextTestIp();
    const created = await createItem(ip, "Eggs", 12, "Dozen");

    const getRes = await withIp(request(app).get(`/api/v1/items/${created.id}`), ip).expect(200);

    expect(getRes.headers["x-api-version"]).toBe("v1");
    expect(getRes.body).toEqual(
      expect.objectContaining({
        id: created.id,
        itemName: "Eggs",
        description: "Dozen",
        quantity: 12,
        purchased: false,
      }),
    );
  });

  it("PATCH /api/v1/items/:id updates an item", async () => {
    const ip = nextTestIp();
    const created = await createItem(ip, "Milk", 1, "2%");

    const patchRes = await withIp(
      request(app).patch(`/api/v1/items/${created.id}`).set("Content-Type", "application/json"),
      ip,
    )
      .send({
        itemName: "Milk",
        quantity: 3,
        purchased: true,
        description: "Whole",
      })
      .expect(200);

    expect(patchRes.headers["x-api-version"]).toBe("v1");
    expect(patchRes.body).toEqual(
      expect.objectContaining({
        id: created.id,
        itemName: "Milk",
        description: "Whole",
        quantity: 3,
        purchased: true,
      }),
    );
  });

  it("DELETE /api/v1/items/:id removes an item and subsequent GET returns 404", async () => {
    const ip = nextTestIp();
    const created = await createItem(ip, "Bread", 1);

    const delRes = await withIp(request(app).delete(`/api/v1/items/${created.id}`), ip).expect(204);
    expect(delRes.headers["x-api-version"]).toBe("v1");

    await withIp(request(app).get(`/api/v1/items/${created.id}`), ip).expect(404);
  });

  it("400 on create when 'itemName' is missing", async () => {
    const ip = nextTestIp();

    const res = await withIp(
      request(app).post("/api/v1/items").set("Content-Type", "application/json"),
      ip,
    )
      .send({ quantity: 1, description: "no itemName" })
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: "BAD_REQUEST",
        message: "Validation failed",
        issues: expect.any(Array),
      }),
    );
  });

  it("400 on create when 'quantity' has wrong type", async () => {
    const ip = nextTestIp();

    const res = await withIp(
      request(app).post("/api/v1/items").set("Content-Type", "application/json"),
      ip,
    )
      .send({ itemName: "Grapes", quantity: "twelve" })
      .expect(400);

    expect(res.body.error).toBe("BAD_REQUEST");
  });

  it("404 on GET non-existent id (valid-looking id but not found)", async () => {
    const ip = nextTestIp();

    const res = await withIp(request(app).get("/api/v1/items/not-found-id"), ip).expect(404);
    expect(res.body).toEqual({
      error: "NOT_FOUND",
      message: "Item not found",
    });
  });

  it("400 on PATCH when payload fails schema", async () => {
    const ip = nextTestIp();

    const created = await withIp(
      request(app).post("/api/v1/items").set("Content-Type", "application/json"),
      ip,
    )
      .send({ itemName: "Apples", quantity: 4 })
      .expect(201);

    const bad = await withIp(
      request(app)
        .patch(`/api/v1/items/${created.body.id}`)
        .set("Content-Type", "application/json"),
      ip,
    )
      .send({ purchased: "yes", quantity: "many" })
      .expect(400);

    expect(bad.body).toEqual(
      expect.objectContaining({
        error: "BAD_REQUEST",
        message: "Validation failed",
      }),
    );
  });
});
