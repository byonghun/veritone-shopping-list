export interface Item {
  id: string;
  itemName: string;
  description?: string;
  quantity: number | undefined;
  purchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ItemDTO = Omit<Item, "createdAt" | "updatedAt">;

export type UIItem = ItemDTO & {
  quantity?: number;
};

export type ItemsSnapshot = { items: Item[] };

export type ItemsResponse = {
  items: ItemDTO[];
  count: number;
};