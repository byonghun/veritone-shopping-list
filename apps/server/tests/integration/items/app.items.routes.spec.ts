import { describe, it, expect } from "@jest/globals";
import request from "supertest";
import { app } from "../../../src/app";

// Helper to create an item for a test
async function createItem(name = "Milk", quantity = 1, description?: string) {
  const res = await request(app)
    .post("/api/v1/items")
    .set("Content-Type", "application/json")
    .send({ name, quantity, description })
    .expect(201);

  expect(typeof res.body.id).toBe("string");
  expect(res.headers["x-api-version"]).toBe("v1");
  return res.body as {
    id: string;
    name: string;
    quantity: number;
    description?: string;
    purchased: boolean;
  };
}

describe("items routes via full app (separated CRUD tests)", () => {
  it("POST /api/v1/items creates an item", async () => {
    const created = await createItem("Bananas", 6);

    expect(created).toEqual(
      expect.objectContaining({
        name: "Bananas",
        quantity: 6,
        purchased: false,
      })
    );
  });

  it("GET /api/v1/items/:id returns a single item", async () => {
    const created = await createItem("Eggs", 12, "Dozen");

    const getRes = await request(app)
      .get(`/api/v1/items/${created.id}`)
      .expect(200);

    expect(getRes.headers["x-api-version"]).toBe("v1");
    expect(getRes.body).toEqual(
      expect.objectContaining({
        id: created.id,
        name: "Eggs",
        description: "Dozen",
        quantity: 12,
        purchased: false,
      })
    );
  });

  it("PATCH /api/v1/items/:id updates an item", async () => {
    const created = await createItem("Milk", 1, "2%");

    const patchRes = await request(app)
      .patch(`/api/v1/items/${created.id}`)
      .set("Content-Type", "application/json")
      .send({ quantity: 3, purchased: true, description: "Whole" })
      .expect(200);

    expect(patchRes.headers["x-api-version"]).toBe("v1");
    expect(patchRes.body).toEqual(
      expect.objectContaining({
        id: created.id,
        name: "Milk",
        description: "Whole",
        quantity: 3,
        purchased: true,
      })
    );
  });

  it("DELETE /api/v1/items/:id removes an item and subsequent GET returns 404", async () => {
    const created = await createItem("Bread", 1);

    const delRes = await request(app)
      .delete(`/api/v1/items/${created.id}`)
      .expect(204);

    expect(delRes.headers["x-api-version"]).toBe("v1");

    await request(app).get(`/api/v1/items/${created.id}`).expect(404);
  });

  it("400 on create when 'name' is missing", async () => {
    const res = await request(app)
      .post("/api/v1/items")
      .set("Content-Type", "application/json")
      .send({ quantity: 1, description: "no name" })
      .expect(400);

    expect(res.body).toEqual(
      expect.objectContaining({
        error: "BAD_REQUEST",
        message: "Validation failed",
        issues: expect.any(Array),
      })
    );
  });

  it("400 on create when 'quantity' has wrong type", async () => {
    const res = await request(app)
      .post("/api/v1/items")
      .set("Content-Type", "application/json")
      .send({ name: "Grapes", quantity: "twelve" })
      .expect(400);

    expect(res.body.error).toBe("BAD_REQUEST");
  });

  it("404 on GET non-existent id (valid-looking id but not found)", async () => {
    const res = await request(app)
      .get("/api/v1/items/not-found-id")
      .expect(404);
    expect(res.body).toEqual({
      error: "NOT_FOUND",
      message: "Item not found",
    });
  });

  it("400 on PATCH when payload fails schema", async () => {
    // create a legit item first
    const created = await request(app)
      .post("/api/v1/items")
      .set("Content-Type", "application/json")
      .send({ name: "Apples", quantity: 4 })
      .expect(201);

    // now send an invalid patch (wrong types)
    const bad = await request(app)
      .patch(`/api/v1/items/${created.body.id}`)
      .set("Content-Type", "application/json")
      .send({ purchased: "yes", quantity: "many" })
      .expect(400);

    expect(bad.body).toEqual(
      expect.objectContaining({
        error: "BAD_REQUEST",
        message: "Validation failed",
      })
    );
  });
});
