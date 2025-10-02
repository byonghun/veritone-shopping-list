import { describe, it, expect, beforeEach } from "@jest/globals";
import { InMemoryItemsRepo } from "../../../src/modules/items/repo.inMemory";

describe("InMemoryItemsRepo (unit)", () => {
  let repo: InMemoryItemsRepo;

  beforeEach(() => {
    repo = new InMemoryItemsRepo();
  });

  it("creates items and lists them back (newest first)", async () => {
    const milk = await repo.create({
      itemName: "Milk",
      description: "2%",
      quantity: 1,
    });
    const eggs = await repo.create({
      itemName: "Eggs",
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
    const item = await repo.create({ itemName: "Bread", quantity: 1 });

    const fetched = await repo.get(item.id);
    expect(fetched?.itemName).toBe("Bread");
    expect(fetched?.quantity).toBe(1);
    expect(fetched?.purchased).toBe(false);

    const updated = await repo.update(item.id, {
      itemName: "Bread",
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
    const upd = await repo.update(nonexistent, { itemName: "Bread", quantity: 3 });
    expect(got).toBeUndefined();
    expect(upd).toBeUndefined();
  });

  it("deleteAll clears all items and returns deletedCount", async () => {
    await repo.create({ itemName: "Apples", quantity: 3 });
    await repo.create({ itemName: "Bananas", quantity: 6 });

    const before = await repo.listAll();
    expect(before.length).toBe(2);

    const result = await repo.deleteAll();
    expect(result).toEqual({ deletedCount: 2 });

    const after = await repo.listAll();
    expect(after.length).toBe(0);

    const resultAgain = await repo.deleteAll();
    expect(resultAgain).toEqual({ deletedCount: 0 });
  });
});
