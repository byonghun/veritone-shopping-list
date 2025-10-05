import { FC, ReactNode } from "react";
import { ItemDTO } from "@app/shared";

import Item, { ItemProps } from "../Item";
import ItemsHeader, { ItemsHeaderProps } from "../ItemsHeader";
import { cn } from "../../utils";

interface ItemsListProps extends Omit<ItemProps, keyof ItemDTO> {
  items: ItemDTO[];
  headerContent?: ReactNode;
  className?: string;
  itemsHeaderProps?: Omit<ItemsHeaderProps, "itemsLength">;
}

const ItemsList: FC<ItemsListProps> = ({
  items,
  itemsHeaderProps,
  className,
  onEdit,
  onTogglePurchased,
  onDelete,
}) => {
  return (
    <div className={cn("flex flex-col gap-3 font-nunito max-w-[1025px] mx-auto w-full", className)}>
      <ItemsHeader itemsLength={items.length} {...itemsHeaderProps} />
      {items.map((item) => {
        return (
          <Item
            key={item.id}
            {...item}
            onEdit={onEdit}
            onDelete={onDelete}
            onTogglePurchased={onTogglePurchased}
          />
        );
      })}
    </div>
  );
};

export default ItemsList;
