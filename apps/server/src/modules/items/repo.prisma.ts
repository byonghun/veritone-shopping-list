// src/repos/repo.prisma.ts
import type { PrismaClient } from "@prisma/client";
import type { ItemCreate, ItemId, ItemUpdate } from "./domain";
import type { ItemsRepo } from "./repo";
import { mapPrismaItemToDomain } from "../../utils/prisma";

export class PrismaItemsRepo implements ItemsRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async listAll() {
    const rows = await this.prisma.item.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(mapPrismaItemToDomain);
  }

  async get(id: ItemId) {
    const row = await this.prisma.item.findUnique({ where: { id } });
    return row ? mapPrismaItemToDomain(row) : undefined;
  }

  async create(input: ItemCreate) {
    const row = await this.prisma.item.create({
      data: {
        name: input.name,
        description: input.description?.trim() || null,
        quantity: input.quantity ?? 1,
        purchased: false,
      },
    });
    return mapPrismaItemToDomain(row);
  }

  async update(id: ItemId, patch: ItemUpdate) {
    const exists = await this.prisma.item.findUnique({ where: { id } });
    if (!exists) return undefined;

    const row = await this.prisma.item.update({
      where: { id },
      data: {
        name: patch.name?.trim() || undefined,
        description:
          patch.description !== undefined ? (patch.description?.trim() || null) : undefined,
        quantity:
          patch.quantity !== undefined ? (patch.quantity ?? exists.quantity) : undefined,
        purchased: patch.purchased ?? undefined,
      },
    });
    return mapPrismaItemToDomain(row);
  }

  async delete(id: ItemId) {
    try {
      await this.prisma.item.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }
}