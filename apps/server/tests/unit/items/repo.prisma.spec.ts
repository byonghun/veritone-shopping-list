import { describe, it, expect, beforeEach, jest } from "@jest/globals";
import { PrismaItemsRepo } from "../../../src/modules/items/repo.prisma";

function iso(d: Date) {
  return d.toISOString();
}

describe("PrismaItemsRepo (unit, mocked prisma)", () => {
  const now = new Date();
  const baseRow = {
    id: "id-1",
    itemName: "Apples",
    description: " Honeycrisp ",
    quantity: 4,
    purchased: false,
    createdAt: now,
    updatedAt: now,
  };

  const prismaMock = {
    item: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn()
    },
  } as any;

  beforeEach(async () => jest.resetAllMocks());

  it("listAll maps rows to domain", async () => {
    prismaMock.item.findMany.mockResolvedValueOnce([baseRow]);
    const repo = new PrismaItemsRepo(prismaMock);
    const items = await repo.listAll();
    expect(items).toEqual([
      {
        id: "id-1",
        itemName: "Apples",
        description: "Honeycrisp",
        quantity: 4,
        purchased: false,
        createdAt: iso(now),
        updatedAt: iso(now),
      },
    ]);
    expect(prismaMock.item.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: "desc" },
    });
  });

  it("create trims description and defaults purchased=false", async () => {
    prismaMock.item.create.mockResolvedValueOnce(baseRow);
    const repo = new PrismaItemsRepo(prismaMock);
    const created = await repo.create({
      itemName: "Apples",
      description: "  Honeycrisp  ",
      quantity: 4,
    });
    expect(prismaMock.item.create).toHaveBeenCalledWith({
      data: {
        itemName: "Apples",
        description: "Honeycrisp",
        quantity: 4,
        purchased: false,
      },
    });
    expect(created.description).toBe("Honeycrisp");
  });

  it("update returns undefined when not found", async () => {
    prismaMock.item.findUnique.mockResolvedValueOnce(null);
    const repo = new PrismaItemsRepo(prismaMock);
    const res = await repo.update("missing", { itemName: "x" });
    expect(res).toBeUndefined();
  });

  it("delete returns true/false based on outcome", async () => {
    prismaMock.item.delete.mockResolvedValueOnce({});
    const repo = new PrismaItemsRepo(prismaMock);
    await expect(repo.delete("id-1")).resolves.toBe(true);

    prismaMock.item.delete.mockRejectedValueOnce(new Error("not found"));
    await expect(repo.delete("id-2")).resolves.toBe(false);
  });

  it("deleteAll calls prisma.deleteMany and returns deletedCount", async () => {
    prismaMock.item.deleteMany.mockResolvedValueOnce({ count: 2 });
    const repo = new PrismaItemsRepo(prismaMock);
    await expect(repo.deleteAll()).resolves.toEqual({ deletedCount: 2 });
    expect(prismaMock.item.deleteMany).toHaveBeenCalledTimes(1);

    prismaMock.item.deleteMany.mockResolvedValueOnce({ count: 0 });
    await expect(repo.deleteAll()).resolves.toEqual({ deletedCount: 0 });
    expect(prismaMock.item.deleteMany).toHaveBeenCalledTimes(2);
  });
});
