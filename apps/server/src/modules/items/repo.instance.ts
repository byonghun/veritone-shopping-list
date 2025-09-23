import type { ItemsRepo } from "./repo";
import { itemsRepo as inMemory } from "./repo.inMemory";

async function canReachDb(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;

  try {
    const { prisma } = await import("../../db/prisma");
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
  const mod = await import("./repo.prisma");
  chosen = mod.prismaItemsRepo;
  console.log("Using Prisma/Postgres repository");
} else {
  console.log("Using InMemory repository");
}

export const itemsRepoInstance: ItemsRepo = chosen;
