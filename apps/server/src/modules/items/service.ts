// a factory that builds a thin service around an ItemsRepo implementation
// The service methods simply forward to the repository for now
// The seam where you would add domain rules, validation, metrics, caching,
// or optimistic concurrency later.
import type { Item, ItemFormInput, ItemId } from "@app/shared";
import type { ItemsRepo } from "./repo";

export function createItemsService(repo: ItemsRepo) {
  return {
    listAll: (): Promise<Item[]> => repo.listAll(),
    get: (id: ItemId): Promise<Item | undefined> => repo.get(id),
    create: (input: ItemFormInput): Promise<Item> => repo.create(input),
    update: (id: ItemId, patch: ItemFormInput): Promise<Item | undefined> => repo.update(id, patch),
    delete: (id: ItemId): Promise<boolean> => repo.delete(id),
    deleteAll: (): Promise<{ deletedCount: number }> => repo.deleteAll(),
  } as const;
}

export type ItemsService = ReturnType<typeof createItemsService>;
