import { Item } from "@app/shared";

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
