import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import type { Item, ItemFormInput, ItemId } from "@app/shared";

import type { ItemsRepo } from "../../../src/modules/items/repo";
import { createItemsService } from "../../../src/modules/items/service";

function makeItem(overrides: Partial<Item> = {}): Item {
  return {
    id: "test-id-1",
    itemName: "Milk",
    quantity: 1,
    purchased: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Items Service file test", () => {
  let repo: jest.Mocked<ItemsRepo>;

  beforeEach(() => {
    repo = {
      listAll: jest.fn(),
      get: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteAll: jest.fn(),
    };
  });

  it("listAll delegates to repo and returns items", async () => {
    const items = [makeItem({ id: "a" }), makeItem({ id: "b" })];
    repo.listAll.mockResolvedValueOnce(items);

    const S = createItemsService(repo);
    const out = await S.listAll();

    expect(repo.listAll).toHaveBeenCalledTimes(1);
    expect(out).toBe(items);
  });

  it("get delegates to repo with id", async () => {
    const item = makeItem({ id: "abc" });
    repo.get.mockResolvedValueOnce(item);

    const S = createItemsService(repo);
    const out = await S.get("abc" as ItemId);

    expect(repo.get).toHaveBeenCalledWith("abc");
    expect(out).toBe(item);
  });

  it("create passes input through to repo", async () => {
    const input: ItemFormInput = {
      itemName: "Eggs",
      quantity: 12,
      description: "Dozen",
    };
    const created = makeItem({
      id: "new",
      itemName: "Eggs",
      quantity: 12,
      description: "Dozen",
    });
    repo.create.mockResolvedValueOnce(created);

    const S = createItemsService(repo);
    const out = await S.create(input);

    expect(repo.create).toHaveBeenCalledWith(input);
    expect(out).toBe(created);
  });

  it("update delegates id + patch", async () => {
    const patch: ItemFormInput = {
      itemName: "Eggs",
      quantity: 3,
      purchased: true,
    };
    const updated = makeItem({ id: "x", quantity: 3, purchased: true });
    repo.update.mockResolvedValueOnce(updated);

    const S = createItemsService(repo);
    const out = await S.update("x" as ItemId, patch);

    expect(repo.update).toHaveBeenCalledWith("x", patch);
    expect(out).toBe(updated);
  });

  it("delete returns boolean result", async () => {
    repo.delete.mockResolvedValueOnce(true);

    const S = createItemsService(repo);
    const ok = await S.delete("gone" as ItemId);

    expect(repo.delete).toHaveBeenCalledWith("gone");
    expect(ok).toBe(true);
  });

  it("deleteAll delegates to repo and returns deletedCount", async () => {
    repo.deleteAll.mockResolvedValueOnce({ deletedCount: 3 });

    const S = createItemsService(repo);
    const result = await S.deleteAll();

    expect(repo.deleteAll).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ deletedCount: 3 });

    // second call with zero, to cover both paths
    repo.deleteAll.mockResolvedValueOnce({ deletedCount: 0 });
    const result2 = await S.deleteAll();
    expect(repo.deleteAll).toHaveBeenCalledTimes(2);
    expect(result2).toEqual({ deletedCount: 0 });
  });
});
