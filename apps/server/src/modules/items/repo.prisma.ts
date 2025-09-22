import type { Item, ItemCreate, ItemId, ItemUpdate } from "./domain.js";
import type { ItemsRepo } from "./repo.js";
import { prisma } from "../../db/prisma.js";

function mapPrismaItemToDomain(row: {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  purchased: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Item {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    quantity: row.quantity,
    purchased: row.purchased,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export class PrismaItemsRepo implements ItemsRepo {
  async listAll(): Promise<Item[]> {
    const rows = await prisma.item.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(mapPrismaItemToDomain);
  }

  async get(id: ItemId): Promise<Item | undefined> {
    const row = await prisma.item.findUnique({ where: { id } });
    return row ? mapPrismaItemToDomain(row) : undefined;
  }

  async create(input: ItemCreate): Promise<Item> {
    const row = await prisma.item.create({
      data: {
        name: input.name,
        description: input.description?.trim() || null,
        quantity: input.quantity ?? 1,
        purchased: false,
      },
    });
    return mapPrismaItemToDomain(row);
  }

  async update(id: ItemId, patch: ItemUpdate): Promise<Item | undefined> {
    const exists = await prisma.item.findUnique({ where: { id } });
    if (!exists) return undefined;

    const row = await prisma.item.update({
      where: { id },
      data: {
        name: patch.name?.trim() || undefined,
        description:
          patch.description !== undefined
            ? patch.description?.trim() || null
            : undefined,
        quantity:
          patch.quantity !== undefined
            ? patch.quantity ?? exists.quantity
            : undefined,
        purchased: patch.purchased ?? undefined,
      },
    });
    return mapPrismaItemToDomain(row);
  }

  async delete(id: ItemId): Promise<boolean> {
    try {
      await prisma.item.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}

export const prismaItemsRepo: ItemsRepo = new PrismaItemsRepo();
