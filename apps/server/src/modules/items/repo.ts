// NOTE: Domain-Driven Design - Repository pattern
// A layer whose job is to talk to the data source (database/API) and give back domain objects
// Repo acts as a boundary between domain (business rules, types) and infrastructure (Postgres, Prisma, REST APIs)
import type { Item, ItemCreate, ItemId, ItemUpdate } from "./domain.js";

export interface ItemsRepo {
  listAll(): Promise<Item[]>;
  get(id: ItemId): Promise<Item | undefined>;
  create(input: ItemCreate): Promise<Item>;
  update(id: ItemId, patch: ItemUpdate): Promise<Item | undefined>;
  delete(id: ItemId): Promise<boolean>;
}