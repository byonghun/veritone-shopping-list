import type { Item, ItemCreate, ItemId, ItemUpdate } from "./domain.js";
import type { ItemsRepo } from "./repo.js";

export function createItemsService(repo: ItemsRepo) {
  return {
    listAll: (): Promise<Item[]> => repo.listAll(),
    get: (id: ItemId): Promise<Item | undefined> => repo.get(id),
    create: (input: ItemCreate): Promise<Item> => repo.create(input),
    update: (id: ItemId, patch: ItemUpdate): Promise<Item | undefined> => repo.update(id, patch),
    delete: (id: ItemId): Promise<boolean> => repo.delete(id)
  } as const;
}

export type ItemsService = ReturnType<typeof createItemsService>;