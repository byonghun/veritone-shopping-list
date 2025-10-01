import { PrismaClient } from "@prisma/client";
import type { ItemsRepo } from "./repo";
import { itemsRepo as inMemory } from "./repo.inMemory";

const IS_TEST =
  process.env.NODE_ENV === "test" || typeof process.env.JEST_WORKER_ID !== "undefined";

async function canReachDb(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;

  try {
    const { prisma } = await import("../../db/prisma");
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("db-timeout")), 1500),
    );
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    return true;
  } catch (e) {
    console.warn("DB probe failed:", (e as Error).message);
    return false;
  }
}

export let itemsRepoInstance: ItemsRepo = inMemory;

export async function initItemsRepo(): Promise<void> {
  if (IS_TEST) return; // tests always use in-memory

  if (await canReachDb()) {
    const { PrismaItemsRepo } = await import("./repo.prisma");
    itemsRepoInstance = new PrismaItemsRepo(new PrismaClient());
    console.log("Using Prisma/Postgres repository");
  } else {
    console.log("Using InMemory repository (DB not reachable)");
  }
}
