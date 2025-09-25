import { GlobalDrawerProps } from "../types/drawer";
import { TItem } from "../types/item";

export const AMOUNT_LIMIT = 5;

export const MAX_DESCRIPTION = 100;

export const DEFAULT_ITEM: TItem = {
  id: "",
  itemName: "",
  description: "",
  quantity: undefined,
  purchased: false,
};

export const DEFAULT_GLOBAL_DRAWER_PROPS: GlobalDrawerProps = {
  defaultValues: DEFAULT_ITEM,
  onConfirm: () => {}
}