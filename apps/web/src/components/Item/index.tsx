import { FC } from "react";

import EditIcon from "../Icons/EditIcon";
import TrashIcon from "../Icons/TrashIcon";
import { Checkbox } from "../ui/checkbox";
import { TItem } from "../../types/item";
import { cn } from "../../utils";

interface ItemProps extends TItem {
  onTogglePurchased: (id: TItem["id"], checkedState: boolean) => void;
  onEdit: (id: TItem["id"]) => void;
  onDelete: (id: TItem["id"]) => void;
}

const Item: FC<ItemProps> = ({
  onTogglePurchased,
  onEdit,
  onDelete,
  description,
  id,
  purchased,
  itemName,
  quantity
}) => {
  return (
    <div
      className={cn(
        "w-full sm:h-[87px] p-4 px-6 flex justify-between items-center border-[0.5px] border-drawerBorderGray rounded-[4px] min-h-[87px] transition-colors",
        purchased && "bg-drawerBorderGray/[0.17] border-transparent"
      )}
    >
      <div className="flex gap-[18px] items-center">
        <Checkbox
          id="list-item-purchased"
          name="list-item-purchased"
          aria-label={`Mark ${itemName} as purchased`}
          checked={purchased}
          onCheckedChange={(checkedState: boolean) => {
            onTogglePurchased(id, checkedState);
          }}
        />
        <div
          id="item-content"
          className="flex flex-col font-nunito gap-[3px] pr-4 max-w-prose"
        >
          <h3
            className={cn(
              "font-semibold text-base leading-5",
              purchased && "line-through text-brand"
            )}
          >
            {`${(quantity ?? 1) > 1 ? `${quantity}x` : ""} ${itemName}`}
          </h3>
          {description && (
            <p
              className={cn(
                "text-listDescriptionGray text-sm font-semibold line-clamp-3",
                purchased && "line-through"
              )}
            >
              {description}
            </p>
          )}
        </div>
      </div>
      <div id="item-actions" className="flex gap-5">
        <button
          aria-label="Edit button"
          onClick={() => onEdit(id)}
          className="item-btn"
        >
          <EditIcon />
        </button>
        <button
          aria-label="Delete button"
          onClick={() => onDelete(id)}
          className="item-btn"
        >
          <TrashIcon />
        </button>
      </div>
    </div>
  );
};

export default Item;
