import type { Item, User } from "@app/shared";

export function mapPrismaItemToDomain(row: {
  id: string;
  itemName: string;
  description: string | null;
  quantity: number;
  purchased: boolean;
  createdAt: Date;
  updatedAt: Date;
}): Item {
  return {
    id: row.id,
    itemName: row.itemName,
    description: row.description?.trim() ?? undefined,
    quantity: row.quantity,
    purchased: row.purchased,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// row is any just incase user doesn't have all the required fields
export function mapPrismaUserToDomain(row: any): User {
  return {
    id: row.id,
    email: row.email,
    emailCanonical: row.emailCanonical,
    passwordHash: row.passwordHash,
    roles: row.roles ?? [],
    isGuest: row.isGuest ?? false,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
