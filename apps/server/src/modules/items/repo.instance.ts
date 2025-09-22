import type { ItemsRepo } from "./repo.js";
import { itemsRepo as inMemory } from "./repo.inMemory.js";

async function canReachDb(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;

  try {
    const { prisma } = await import("../../db/prisma.js");
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("db-timeout")), 1500)
    );
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    return true;
  } catch (e) {
    console.warn("[items] DB probe failed:", (e as Error).message);
    return false;
  }
}

let chosen: ItemsRepo = inMemory;
const reachedDb = await canReachDb()

if (reachedDb) {
  const mod = await import("./repo.prisma.js");
  chosen = mod.prismaItemsRepo;
  console.log("Using Prisma/Postgres repository");
} else {
  console.log("Using InMemory repository");
}

export const itemsRepoInstance: ItemsRepo = chosen;
