import { useState } from "react";

import { Button } from "../components/ui/button";
import { useDialog } from "../hooks/useDialog";
import { useDrawer } from "../hooks/useDrawer";
import LoadingIndicator from "../components/LoadingIndicator";
import Item from "../components/Item";
import { TItem, TItemPost } from "../types/item";
import { DEFAULT_ITEM } from "../constants/drawer";
import { cn } from "../utils";

const mockData: TItem[] = [
  {
    id: "1",
    itemName: "Apples",
    description:
      "Noah wants red, yellow, and green apples. It's for a school project.",
    quantity: 3,
    purchased: false,
  },
  {
    id: "2",
    itemName: "Pringles",
    description: "You know what I want.",
    quantity: 1,
    purchased: false,
  },
  {
    id: "3",
    itemName: "Water",
    quantity: 1,
    purchased: true,
  },
];

// TODO: WHen on edit, -> making edits should update in your items list 
// TODO: Move to completed list when items are finished
const ItemsContainer = () => {
  const { openDrawer} = useDrawer();
  const { openDialog } = useDialog();

  // TODO: Fetch items from api
  const [items, setItems] = useState(mockData);
  // Use useQuery
  const [isLoading, setIsLoading] = useState(false);

  const emptyItems = items.length === 0;
  const purchased = items.filter(item => item.purchased)
  const isCompleted = purchased.length === items.length
  const checkList = `${purchased.length}/${items.length} Completed`

  const onDrawerOpen = () => {
    openDrawer({
      type: "create",
      defaultValues: DEFAULT_ITEM,
      onConfirm: (item: TItemPost) => {
        setItems([...items, { id: `temp-id-${++items.length}`, ...item }]);
        // TODO: mkae post request if successful 
        // TODO: if post request fails -> show popup and remove item 
      },
    });
  };

  const onEdit = (id: TItem["id"]) => {
    const item = items.find((i) => i.id === id)
    openDrawer({
      type: "update",
      defaultValues: item as TItem,
      onConfirm: (item) => {
        const mappedItems = items.map(i => {
          if(i.id === id) {
            return item
          }

          return i
        })

        setItems(mappedItems as TItem[])
      }
    })
  }

  const onDelete = (id: TItem["id"]) => {
    console.log("delete", id);
    openDialog({
      type: "delete",
      title: "Delete Item?",
      description: "Are you sure you want to delete this item? This can not be undone.",
      onConfirm: () => {
        // TODO: Make DELETE request
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      },
    });
  };

  const onTogglePurchased = (id: TItem["id"], checked: boolean) => {
    console.log(id, checked);
    // TODO: Make PATCH request
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, purchased: checked } : item
      )
    );
  };

  if (isLoading) {
    return <LoadingIndicator className="mx-auto" />;
  }

  return (
    <>
      {emptyItems && (
        <div className="card-wrapper md:mt-[110px]">
          <div className="card-content">
            <p className="card-text">Your shopping list is empty :(</p>
            <Button
              variant="default"
              onClick={onDrawerOpen}
              className="min-w-[151px]"
            >
              Add your first item
            </Button>
          </div>
        </div>
      )}
      {!emptyItems && (
        <div className="flex flex-col gap-3 font-nunito max-w-[1025px] mx-auto">
          <div id="home-nav" className="flex justify-between items-end">
            <h2 className="font-semibold text-lg leading-6">
              Your Items{" "}
              <span className={cn("text-sm ml-2", isCompleted && "text-green-600")}>
                {checkList}
              </span>
            </h2>
            <Button variant="default" onClick={onDrawerOpen}>
              Add Item
            </Button>
          </div>
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
      )}
    </>
  );
};

export default ItemsContainer;
