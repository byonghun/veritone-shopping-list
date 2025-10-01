import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from "@jest/globals";
import { itemsRepoInstance } from "../../../src/modules/items/repo.instance";
import { InMemoryItemsRepo } from "../../../src/modules/items/repo.inMemory";

// we’ll re-import the module fresh per scenario
function resetModules() {
  jest.resetModules();
}

const saveEnv = { ...process.env };

afterEach(() => {
  // restore env and module cache after each test
  process.env = { ...saveEnv };
  resetModules();
});

describe("Confirms test environment never uses Prisma and uses in-memory repo", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("uses in-memory repo (does not hit Prisma)", async () => {
    // instance check (best-effort; relies on class export)
    expect(itemsRepoInstance).toBeInstanceOf(InMemoryItemsRepo);

    // functional check (works even if instanceof ever changes)
    const created = await itemsRepoInstance.create({
      itemName: "Test",
      quantity: 1,
    });
    const got = await itemsRepoInstance.get(created.id);
    expect(got?.itemName).toBe("Test");
  });

  it("in Jest/test env: stays in-memory and does not import prisma repo", async () => {
    // Ensure test markers are present
    process.env.NODE_ENV = "test";
    process.env.JEST_WORKER_ID = process.env.JEST_WORKER_ID || "1";
    delete process.env.DATABASE_URL; // even if set, tests should short-circuit

    // Spy to detect accidental import of prisma repo
    const repoPrismaImport = jest.fn();
    await jest.unstable_mockModule(
      "../../../src/modules/items/repo.prisma",
      () => {
        repoPrismaImport();
        return { __esModule: true, prismaItemsRepo: {} };
      }
    );

    const { itemsRepoInstance, initItemsRepo } = await import(
      "../../../src/modules/items/repo.instance"
    );
    const { InMemoryItemsRepo } = await import(
      "../../../src/modules/items/repo.inMemory"
    );

    await initItemsRepo(); // should no-op in test env

    // stays in-memory
    expect(itemsRepoInstance).toBeInstanceOf(InMemoryItemsRepo);
    // and prismarepo not imported
    expect(repoPrismaImport).not.toHaveBeenCalled();
  });

  it("non-test env + DB unreachable: remains in-memory", async () => {
    delete process.env.JEST_WORKER_ID;
    process.env.NODE_ENV = "development";
    process.env.DATABASE_URL = "postgresql://user:pass@localhost:5432/db";

    // Mock prisma probe to fail (e.g., timeout or throw)
    await jest.unstable_mockModule("../../../src/db/prisma", () => ({
      __esModule: true,
      prisma: {
        $queryRaw: jest.fn(async () => {
          throw new Error("ECONNREFUSED");
        }),
      },
    }));

    // Set a spy on repo.prisma import to ensure it’s NOT loaded
    const repoPrismaImport = jest.fn();
    await jest.unstable_mockModule(
      "../../../src/modules/items/repo.prisma",
      () => {
        repoPrismaImport();
        return { __esModule: true, prismaItemsRepo: {} };
      }
    );

    const { itemsRepoInstance, initItemsRepo } = await import(
      "../../../src/modules/items/repo.instance"
    );
    const { InMemoryItemsRepo } = await import(
      "../../../src/modules/items/repo.inMemory"
    );

    await initItemsRepo();

    // Still in-memory, and we never imported the prisma repo
    expect(itemsRepoInstance).toBeInstanceOf(InMemoryItemsRepo);
    expect(repoPrismaImport).not.toHaveBeenCalled();
  });
});
