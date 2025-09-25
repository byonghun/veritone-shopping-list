import { useState } from "react";
import { Button } from "../components/ui/button";
import { useDrawer } from "../hooks/useDrawer";
import LoadingIndicator from "../components/LoadingIndicator";
import Item from "../components/Item";
import { TItem } from "../types/item";
import { DEFAULT_ITEM } from "../constants/drawer";

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
const HomeContainer = () => {
  // TODO: Fetch items from api
  const [items, setItems] = useState(mockData);
  // Use useQuery
  const [isLoading, setIsLoading] = useState(false);
  const emptyItems = items.length === 0;

  const { openDrawer, closeDrawer } = useDrawer();

  const onDrawerOpen = () => {
    openDrawer({
      type: "create",
      defaultValues: DEFAULT_ITEM,
      onConfirm: () => closeDrawer(),
    });
  };

  const onEdit = (id: TItem["id"]) => {
    console.log("edit", id);
    // TODO: Make PATCH request
    const item = items.find((item) => item.id === id)!;

    openDrawer({
      type: "update",
      defaultValues: item,
    });
  };

  const onDelete = (id: TItem["id"]) => {
    // TODO: Make DELETE request
    console.log("delete", id);
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
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
            <Button variant="default" onClick={onDrawerOpen}>
              Add your first item
            </Button>
          </div>
        </div>
      )}
      {!emptyItems && (
        <div className="flex flex-col gap-3 font-nunito max-w-[1025px] mx-auto">
          <div id="home-nav" className="flex justify-between items-end">
            <h2 className="font-semibold text-lg leading-6">Your Items</h2>
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

export default HomeContainer;
