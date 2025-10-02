// NOTE: Domain-Driven Design - Repository pattern
// A layer whose job is to talk to the data source (database/API) and give back domain objects
// Repo acts as a boundary between domain (business rules, types) and infrastructure (Postgres, Prisma, REST APIs)
import type { Item, ItemFormInput, ItemId } from "@app/shared";

export interface ItemsRepo {
  listAll(): Promise<Item[]>;
  get(id: ItemId): Promise<Item | undefined>;
  create(input: ItemFormInput): Promise<Item>;
  update(id: ItemId, patch: ItemFormInput): Promise<Item | undefined>;
  delete(id: ItemId): Promise<boolean>;
  deleteAll(): Promise<{ deletedCount: number }>;
}
