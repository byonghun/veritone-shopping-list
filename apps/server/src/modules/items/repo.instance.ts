// This file is imported and used to bootstrap the data access layer
// with a top-level await.
// repo.instance.ts selects Prisma/PostgreSQL when the database probe(canReachDb) succeeds
// otherwise falls back to an in-memory repository
// this ensures the HTTP listener only starts once persistence is ready
import { PrismaClient } from "@prisma/client";
import type { ItemsRepo } from "./repo";
import { itemsRepo as inMemory } from "./repo.inMemory";

const IS_TEST =
  process.env.NODE_ENV === "test" || typeof process.env.JEST_WORKER_ID !== "undefined";

async function canReachDb(): Promise<boolean> {
  if (!process.env.DATABASE_URL) return false;

  try {
    // Lazy import to defer pulling Prisma into memory unless we actually need it
    // Helps with cold-start time and keeps tests lean
    const { prisma } = await import("../../db/prisma");
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("db-timeout")), 1500),
    );
    // Performs a fast connectivity probe with 1.5 sec timeout
    // Runs a trivial liveness query (SELECT 1) and races
    // against the timeout
    // If query wins -> consider database reachable
    await Promise.race([prisma.$queryRaw`SELECT 1`, timeout]);
    return true;
  } catch (e) {
    console.warn("DB probe failed:", (e as Error).message);
    return false;
  }
}

// Mutable signleton holding the active repository
// Defaults to in-memory so the app can still boot in
// environements that do not have a database
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
