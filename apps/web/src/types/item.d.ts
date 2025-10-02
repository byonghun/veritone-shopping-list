export type TItem = {
  id: string;
  itemName: string;
  description?: string;
  quantity: number | undefined;
  purchased: boolean;
};

export type Item = TItem & {
  createdAt: string;
  updatedAt: string;
};

export type TItemPost = {
  itemName: string;
  description?: string;
  quantity: number;
};

export type TItemUpdate = {
  itemName: string;
  description?: string;
  quantity: number;
  purchased: boolean;
};

export type ItemsResponse = {
  items: TItem[];
  count: number;
};

export type ItemsType = "active" | "completed";
