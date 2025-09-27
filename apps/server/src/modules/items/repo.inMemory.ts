// NOTE: Provides repository implementation prior to connecting to the Postgres database
import { nanoid } from "nanoid";
import type { Item, ItemCreate, ItemId, ItemUpdate } from "./domain";
import type { ItemsRepo } from "./repo";

const nowISO = (): string => new Date().toISOString();

export class InMemoryItemsRepo implements ItemsRepo {
  private readonly items = new Map<ItemId, Item>();

  async listAll(): Promise<Item[]> {
    // MVP: return everything (creation-desc to keep newest first)
    return Array.from(this.items.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async get(id: ItemId): Promise<Item | undefined> {
    return this.items.get(id);
  }

  async create(input: ItemCreate): Promise<Item> {
    const id = nanoid();
    const createdAt = nowISO();
    const item: Item = {
      id,
      itemName: input.itemName,
      description: input.description?.trim() || undefined,
      quantity: Number(input.quantity ?? 1),
      purchased: false,
      createdAt,
      updatedAt: createdAt,
    };
    this.items.set(id, item);
    return item;
  }

  async update(id: ItemId, patch: ItemUpdate): Promise<Item | undefined> {
    const current = this.items.get(id);
    if (!current) return undefined;

    const next: Item = {
      ...current,
      itemName: patch.itemName?.trim() ?? current.itemName,
      description:
        patch.description !== undefined ? patch.description.trim() || undefined : current.description,
      quantity: patch.quantity !== undefined ? Math.max(1, Number(patch.quantity)) : current.quantity,
      purchased: patch.purchased ?? current.purchased,
      updatedAt: nowISO(),
    };

    this.items.set(id, next);
    return next;
  }

  async delete(id: ItemId): Promise<boolean> {
    return this.items.delete(id);
  }
}

// Singleton (simple for MVP)
export const itemsRepo = new InMemoryItemsRepo();

// Seed a couple for quick manual checks
void itemsRepo.create({ itemName: "Apples", description: "Honey Crisp", quantity: 4 });
void itemsRepo.create({ itemName: "Eggs", description: "Free-range", quantity: 2 });
