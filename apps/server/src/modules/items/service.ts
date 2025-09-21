import type { Item, ItemCreate, ItemId, ItemUpdate } from "./domain.js";
import { itemsRepo } from "./repo.inMemory.js";

export const ItemsService = {
  async listAll(): Promise<Item[]> {
    return itemsRepo.listAll();
  },
  async get(id: ItemId): Promise<Item | undefined> {
    return itemsRepo.get(id);
  },
  async create(input: ItemCreate): Promise<Item> {
    return itemsRepo.create(input);
  },
  async update(id: ItemId, patch: ItemUpdate): Promise<Item | undefined> {
    return itemsRepo.update(id, patch);
  },
  async delete(id: ItemId): Promise<boolean> {
    return itemsRepo.delete(id);
  },
} as const;