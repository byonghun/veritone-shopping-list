import { useCallback, useEffect, useMemo, useState } from "react";
import type { ItemDTO, ItemFormOutput } from "@app/shared";

import ErrorCard from "../components/ErrorCard";
import LoadingIndicator from "../components/LoadingIndicator";
import { Button } from "../components/ui/button";
import ClearCompletedCard from "../components/ClearCompletedCard";
import ItemsList from "../components/ItemsList";
import { DEFAULT_ITEM } from "../constants/drawer";
import { useDialog } from "../hooks/useDialog";
import { useDrawer } from "../hooks/useDrawer";
import { useItems } from "../hooks/useItems";
import { useItemsSSE } from "../hooks/useItemsSSE";
import { getErrorDescription } from "../utils/errors";

const ItemsContainer = () => {
  const { openDrawer } = useDrawer();
  const { openDialog } = useDialog();
  const { query, create, update, remove, deleteAll } = useItems();

  const [items, setItems] = useState<ItemDTO[]>([]);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  const activeItems = useMemo(() => items.filter((i) => !i.purchased), [items]);
  const completedItems = useMemo(() => items.filter((i) => i.purchased), [items]);

  useEffect(() => {
    if (query.isSuccess) {
      setItems(query.data.items as ItemDTO[]);
      setHasLoadedOnce(true);
    }
  }, [query.isSuccess, query.data]);

  const onSnapshot = useCallback(
    (snap: { items: ItemDTO[] }) => {
      setItems(snap.items);
      if (!hasLoadedOnce) setHasLoadedOnce(true);
    },
    [hasLoadedOnce],
  );
  useItemsSSE(onSnapshot);

  if (query.isPending && !hasLoadedOnce) {
    return (
      <section className="max-w-[1025px] mx-auto">
        <div className="min-h-[160px] flex items-center justify-center">
          <LoadingIndicator />
        </div>
      </section>
    );
  }

  if (query.isError && !hasLoadedOnce) {
    return (
      <section className="max-w-[1025px] mx-auto">
        <div className="min-h-[160px] flex items-center justify-center">
          <ErrorCard
            onClick={() => query.refetch()}
            errorMessage={query.error instanceof Error ? query.error.message : "Unknown error"}
          />
        </div>
      </section>
    );
  }

  const hasEmptyItems = items.length === 0;
  const purchasedCount = items.filter((item) => item.purchased).length;
  const isCompleted = purchasedCount === items.length;
  const checkList = `${purchasedCount}/${items.length} Completed`;

  const onDrawerOpen = () => {
    openDrawer({
      type: "create",
      defaultValues: DEFAULT_ITEM,
      onConfirm: async (item: ItemFormOutput) => {
        const tempId = `temp-${Date.now()}`;

        let snapshot: ItemDTO[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          const tempItem: ItemDTO = {
            id: tempId,
            itemName: item.itemName,
            description: item.description ?? undefined,
            quantity: item.quantity ?? 1,
            purchased: false,
          };
          return [...prevItems, tempItem];
        });
        try {
          const created = await create.mutateAsync(item);
          setItems((prevItems) => prevItems.map((item) => (item.id === tempId ? created : item)));
        } catch (err) {
          const description = await getErrorDescription(err);
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to create item.",
            description,
            btnLabel: "Close",
          });
        }
      },
    });
  };

  const onEdit = (id: ItemDTO["id"]) => {
    const item = items.find((i) => i.id === id);
    openDrawer({
      type: "update",
      defaultValues: item as ItemDTO,
      onConfirm: async (item: ItemFormOutput) => {
        let snapshot: ItemDTO[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          return prevItems.map((prevItem) => {
            if (prevItem.id === id) {
              return { ...item, ...prevItem };
            }

            return prevItem;
          });
        });
        try {
          await update.mutateAsync({ id, data: item });
        } catch (err) {
          const description = await getErrorDescription(err);
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to update selected item.",
            description,
            btnLabel: "Close",
          });
        }
      },
    });
  };

  const onDelete = (id: ItemDTO["id"]) => {
    openDialog({
      type: "delete",
      title: "Delete Item?",
      description: "Are you sure you want to delete this item? This can not be undone.",
      onConfirm: async () => {
        let snapshot: ItemDTO[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          return prevItems.filter((item) => item.id !== id);
        });
        try {
          await remove.mutateAsync(id);
        } catch (err) {
          const description = await getErrorDescription(err);
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to delete item.",
            description,
            btnLabel: "Close",
          });
        }
      },
    });
  };

  const onClear = (startNew?: boolean) => {
    openDialog({
      type: "delete",
      btnLabel: "Clear",
      title: "Clear Shopping List?",
      description: "Are you sure you want to clear the entire list? This can not be undone.",
      onConfirm: async () => {
        let snapshot: ItemDTO[] = [];
        setItems((prevItems) => {
          snapshot = prevItems;
          return [];
        });
        try {
          await deleteAll.mutateAsync();
          startNew && setTimeout(() => onDrawerOpen(), 0);
        } catch (err) {
          const description = await getErrorDescription(err);
          setItems(snapshot);
          openDialog({
            type: "error",
            title: "Failed to delete items.",
            description,
            btnLabel: "Close",
          });
        }
      },
    });
  };

  const onTogglePurchased = async (id: ItemDTO["id"], checked: boolean) => {
    let snapshot: ItemDTO[] = [];
    setItems((prevItems) => {
      snapshot = prevItems;
      return prevItems.map((item) => (item.id === id ? { ...item, purchased: checked } : item));
    });

    const item = items.find((item) => item.id === id) as ItemFormOutput;

    try {
      await update.mutateAsync({
        id,
        data: {
          itemName: item.itemName,
          description: item.description ?? "",
          quantity: item.quantity ?? 1,
          purchased: checked,
        },
      });
    } catch (err) {
      const description = await getErrorDescription(err);
      setItems(snapshot);
      openDialog({
        type: "error",
        title: "Failed to update selected item.",
        description,
        btnLabel: "Close",
      });
    }
  };

  if (hasEmptyItems) {
    return (
      <div className="card-wrapper md:mt-[110px]">
        <div className="card-content">
          <p className="card-text">Your shopping list is empty :(</p>
          <Button variant="default" onClick={onDrawerOpen} className="min-w-[151px] mt-1">
            Add your first item
          </Button>
        </div>
      </div>
    );
  }

  const actionProps = {
    onEdit,
    onTogglePurchased,
    onDelete,
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full flex flex-col gap-4">
        <ItemsList
          items={activeItems}
          itemsHeaderProps={{ metaText: checkList, isCompleted, onDrawerOpen }}
          {...actionProps}
        />
        {activeItems.length === 0 && <ClearCompletedCard onClear={onClear} />}
      </div>
      <ItemsList items={completedItems} itemsHeaderProps={{ type: "completed" }} {...actionProps} />
    </div>
  );
};

export default ItemsContainer;
