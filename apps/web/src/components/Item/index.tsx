import { FC } from "react";
import type { ItemDTO } from "@app/shared";

import EditIcon from "../Icons/EditIcon";
import TrashIcon from "../Icons/TrashIcon";
import { Checkbox } from "../ui/checkbox";
import { cn } from "../../utils";

export interface ItemProps extends ItemDTO {
  onTogglePurchased: (id: ItemDTO["id"], checkedState: boolean) => void;
  onEdit: (id: ItemDTO["id"]) => void;
  onDelete: (id: ItemDTO["id"]) => void;
}

const Item: FC<ItemProps> = ({
  onTogglePurchased,
  onEdit,
  onDelete,
  description,
  id,
  purchased,
  itemName,
  quantity,
}) => {
  return (
    <div
      className={cn(
        "relative w-full min-h-[87px] sm:h-[87px] p-4 px-6",
        "flex items-center justify-between rounded-[4px] border-[0.5px] border-drawerBorderGray",
        "transform transition-all duration-200 ease-out will-change-transform",
        purchased && "bg-drawerBorderGray/20 border-transparent scale-[0.995] animate-pop-in",
      )}
    >
      {purchased && (
        <div className="pointer-events-none absolute inset-0 rounded-[4px] animate-flash-once" />
      )}
      <div className="flex gap-[18px] items-center">
        <Checkbox
          id="list-item-purchased"
          name="list-item-purchased"
          aria-label={`Mark ${itemName} as purchased`}
          checked={purchased}
          onCheckedChange={(checkedState: boolean) => onTogglePurchased(id, checkedState)}
        />
        <div id="item-content" className="flex flex-col font-nunito gap-[3px] pr-4 max-w-prose">
          <h3
            className={cn(
              "font-semibold text-base leading-5",
              purchased && "line-through text-brand",
            )}
          >
            {`${(quantity ?? 1) > 1 ? `${quantity}x` : ""} ${itemName}`}
          </h3>
          {description && (
            <p
              className={cn(
                "text-listDescriptionGray text-sm font-semibold line-clamp-3",
                purchased && "line-through",
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div id="item-actions" className="flex gap-5">
        <button aria-label="Edit button" onClick={() => onEdit(id)} className={"item-btn"}>
          <EditIcon />
        </button>
        <button aria-label="Delete button" onClick={() => onDelete(id)} className={"item-btn"}>
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default Item;
