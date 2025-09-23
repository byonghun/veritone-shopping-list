import { describe, it, expect, beforeEach } from "@jest/globals";
import { InMemoryItemsRepo } from "../../../src/modules/items/repo.inMemory";

describe("InMemoryItemsRepo (unit)", () => {
  let repo: InMemoryItemsRepo;

  beforeEach(() => {
    repo = new InMemoryItemsRepo();
  });

  it("creates items and lists them back (newest first)", async () => {
    const milk = await repo.create({
      name: "Milk",
      description: "2%",
      quantity: 1,
    });
    const eggs = await repo.create({
      name: "Eggs",
      description: "Dozen",
      quantity: 12,
    });

    const all = await repo.listAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBe(2);

    // Newest first (your repo sorts by createdAt desc)
    expect(all[0]!.id).toBe(milk.id);
    expect(all[1]!.id).toBe(eggs.id);
  });

  it("gets, updates, and deletes an item", async () => {
    const item = await repo.create({ name: "Bread", quantity: 1 });

    const fetched = await repo.get(item.id);
    expect(fetched?.name).toBe("Bread");
    expect(fetched?.quantity).toBe(1);
    expect(fetched?.purchased).toBe(false);

    const updated = await repo.update(item.id, {
      quantity: 2,
      purchased: true,
      description: "Whole wheat",
    });
    expect(updated).toBeDefined();
    expect(updated?.quantity).toBe(2);
    expect(updated?.purchased).toBe(true);
    expect(updated?.description).toBe("Whole wheat");

    const ok = await repo.delete(item.id);
    expect(ok).toBe(true);

    const missing = await repo.get(item.id);
    expect(missing).toBeUndefined();
  });

  it("returns undefined when updating or getting a non-existent id", async () => {
    const nonexistent = "does-not-exist";
    const got = await repo.get(nonexistent);
    const upd = await repo.update(nonexistent, { quantity: 3 });
    expect(got).toBeUndefined();
    expect(upd).toBeUndefined();
  });
});
