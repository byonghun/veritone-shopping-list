// Implements Items storage using Prisma's generated, type-safe client
// Each method calls high-level operations that Prisma compiles into
// parameterized SQL
// Takeaway: We do this already: Possbily allow DB to manage timestamps via @default(now()) and @updatedAt
// -> to avoid time-zone drift and reduce application code
import type { PrismaClient } from "@prisma/client";
import type { ItemId, ItemFormInput, ItemFormOutput } from "@app/shared";

import type { ItemsRepo } from "./repo";
import { mapPrismaItemToDomain } from "../../utils/prisma";

const nowISO = (): string => new Date().toISOString();

export class PrismaItemsRepo implements ItemsRepo {
  // Inject ready Prisma client instance from repo.instance file
  // Makes the repo testable and avoids tight coupling to the clients lifecycle
  constructor(private readonly prisma: PrismaClient) {}

  async listAll() {
    const rows = await this.prisma.item.findMany({ orderBy: { createdAt: "desc" } });
    return rows.map(mapPrismaItemToDomain);
  }

  async get(id: ItemId) {
    const row = await this.prisma.item.findUnique({ where: { id } });
    return row ? mapPrismaItemToDomain(row) : undefined;
  }

  async create(input: ItemFormOutput) {
    const createdAt = nowISO();
    const row = await this.prisma.item.create({
      data: {
        itemName: input.itemName,
        description: input.description?.trim() || null,
        quantity: input.quantity ?? 1,
        purchased: false,
        createdAt,
        updatedAt: createdAt,
      },
    });
    return mapPrismaItemToDomain(row);
  }

  async update(id: ItemId, patch: ItemFormInput) {
    const exists = await this.prisma.item.findUnique({ where: { id } });
    if (!exists) return undefined;

    const row = await this.prisma.item.update({
      where: { id },
      data: {
        ...patch,
        itemName: patch.itemName?.trim() || undefined,
        description:
          patch.description !== undefined ? patch.description?.trim() || null : undefined,
        quantity: patch.quantity !== undefined ? (patch.quantity ?? exists.quantity) : undefined,
        purchased: patch.purchased ?? undefined,
        updatedAt: nowISO(),
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

  async deleteAll() {
    const { count } = await this.prisma.item.deleteMany();
    return { deletedCount: count };
  }
}
