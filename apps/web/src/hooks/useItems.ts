import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { ItemFormOutput } from "@app/shared";
import { ItemsClient } from "../api/itemsService";

const itemsKeys = {
  items: ["items"] as const,
};

export function useItems() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: itemsKeys.items,
    queryFn: () => ItemsClient.listAll(),
  });

  const create = useMutation({
    mutationFn: (input: ItemFormOutput) => ItemsClient.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.items });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: ItemFormOutput }) =>
      ItemsClient.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.items });
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => ItemsClient.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.items });
    },
  });

  return { query, create, update, remove, keys: itemsKeys };
}
