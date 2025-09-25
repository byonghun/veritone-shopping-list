// NOTE: Separating makes it explicit that this string is an "identifier" for an item, not just any string 
export type ItemId = string;

export interface Item {
  id: ItemId;
  itemName: string;
  description?: string;
  quantity: number;
  purchased: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
}

export type ItemCreate = {
  itemName: string;
  description?: string;
  quantity?: number;
};

export type ItemUpdate = Partial<Pick<Item, "itemName" | "description" | "quantity" | "purchased">>;