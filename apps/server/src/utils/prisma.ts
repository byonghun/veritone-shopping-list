import { Item } from "../modules/items/domain";

export function mapPrismaItemToDomain(row: {
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
    description: row.description?.trim() ?? undefined,
    quantity: row.quantity,
    purchased: row.purchased,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}
