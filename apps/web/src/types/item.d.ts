export type TItem = {
  id: string;
  itemName: string;
  description?: string;
  quantity: number | undefined;
  purchased: boolean;
};

export type TItemPost = {
  itemName: string;
  description?: string;
  quantity: number;
  purchased: boolean;
};