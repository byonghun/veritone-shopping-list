import { FC } from "react";
import { Button } from "../ui/button";
import { cn } from "../../utils";
import { ItemsType } from "../../types/item";

export interface ItemsHeaderProps {
  className?: string;
  type?: ItemsType;
  metaText?: string;
  isCompleted?: boolean;
  itemsLength: number;
  onDrawerOpen?: () => void;
}

const ItemsHeader: FC<ItemsHeaderProps> = ({
  className = "",
  type = "active",
  metaText,
  isCompleted = false,
  itemsLength,
  onDrawerOpen,
}) => {
  const isCompletedList = type === "completed";
  const hasEmptyList = itemsLength === 0;

  return (
    <div className={cn("flex justify-between items-end", className)}>
      <h2
        className={cn(
          "font-semibold text-lg leading-6",
          hasEmptyList && isCompletedList && "text-listDescriptionGray",
        )}
      >
        {isCompletedList
          ? `Completed Items ${itemsLength > 0 ? `(${itemsLength})` : ""}`
          : "Your Items"}
        {metaText && !isCompletedList && (
          <span
            className={cn(
              "text-sm ml-2 text-listDescriptionGray min-w-[110px]",
              isCompleted && "text-green-600",
            )}
          >
            {metaText}
          </span>
        )}
      </h2>
      {onDrawerOpen && !isCompletedList && (
        <Button variant="default" onClick={onDrawerOpen} className="w-[90px]">
          Add Item
        </Button>
      )}
    </div>
  );
};

export default ItemsHeader;
