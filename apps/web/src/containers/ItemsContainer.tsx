import { useEffect, useState } from "react";

import ErrorCard from "../components/ErrorCard";
import Item from "../components/Item";
import LoadingIndicator from "../components/LoadingIndicator";
import { Button } from "../components/ui/button";
import { DEFAULT_ITEM } from "../constants/drawer";
import { useDrawer } from "../hooks/useDrawer";
import { useDialog } from "../hooks/useDialog";
import { useItems } from "../hooks/useItems";
import type { TItem, TItemUpdate } from "../types/item";
import { cn } from "../utils";

const ItemsContainer = () => {
  const { openDrawer } = useDrawer();
  const { openDialog } = useDialog();
  const { query, create, update, remove } = useItems();

  const [items, setItems] = useState<TItem[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  useEffect(() => {
    if (query.isSuccess) {
      setItems(query.data.items);
      setHasLoadedOnce(true);
    }
  }, [query.isSuccess, query.data]);

  if (query.isPending && !hasLoadedOnce) {
    return <LoadingIndicator className="mx-auto" />;
  }

  if (query.isError && !hasLoadedOnce) {
    return (
      <ErrorCard
        onClick={() => query.refetch()}
        errorMessage={
          query.error instanceof Error ? query.error.message : "Unknown error"
        }
      />
    );
  }

  const emptyItems = items.length === 0;
  const purchased = items.filter((item) => item.purchased);
  const isCompleted = purchased.length === items.length;
  const checkList = `${purchased.length}/${items.length} Completed`;

  const onDrawerOpen = () => {
    openDrawer({
      type: "create",
      defaultValues: DEFAULT_ITEM,
      onConfirm: async (item: TItemUpdate) => {
        const tempId = `temp-${Date.now()}`;

        let snapshot: TItem[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          const tempItem: TItem = {
            id: tempId,
            itemName: item.itemName,
            description: item.description ?? undefined,
            quantity: item.quantity,
            purchased: false,
          };
          return [...prevItems, tempItem];
        });
        try {
          const created = await create.mutateAsync(item);
          setItems((prev) => prev.map((i) => (i.id === tempId ? created : i)));
        } catch (err) {
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to create item.",
            description: "Please check your inputs. Title is required.",
          });
        }
      },
    });
  };

  const onEdit = (id: TItem["id"]) => {
    const item = items.find((i) => i.id === id);
    openDrawer({
      type: "update",
      defaultValues: item as TItem,
      onConfirm: async (item: TItemUpdate) => {
        let snapshot: TItem[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          return prevItems.map((prevItem) => {
            if (prevItem.id === id) {
              return { ...item, ...prevItem } as TItem;
            }

            return prevItem;
          });
        });
        try {
          await update.mutateAsync({ id, data: item });
        } catch (err) {
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to update selected item.",
            description: "Please check your inputs. Title is required.",
          });
        }
      },
    });
  };

  const onDelete = (id: TItem["id"]) => {
    openDialog({
      type: "delete",
      title: "Delete Item?",
      description:
        "Are you sure you want to delete this item? This can not be undone.",
      onConfirm: async () => {
        let snapshot: TItem[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          return prevItems.filter((item) => item.id !== id);
        });
        try {
          await remove.mutateAsync(id);
        } catch (err) {
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to delete item.",
            description: "Please try again.",
          });
        }
      },
    });
  };

  const onTogglePurchased = async (id: TItem["id"], checked: boolean) => {
    let snapshot: TItem[] = [];
    setItems((prevItems) => {
      snapshot = prevItems;
      return prevItems.map((item) =>
        item.id === id ? { ...item, purchased: checked } : item
      );
    });

    const item = snapshot.find((item) => item.id === id) as TItemUpdate;

    try {
      await update.mutateAsync({
        id,
        data: { ...item, purchased: checked },
      });
    } catch (err) {
      setItems(snapshot);
      openDialog({
        type: "error",
        title: "Failed to update selected item.",
        description: "Please check your inputs. Title is required.",
      });
    }
  };

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
              <span
                className={cn(
                  "text-sm ml-2 text-listDescriptionGray",
                  isCompleted && "text-green-600"
                )}
              >
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
