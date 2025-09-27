import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemsClient } from "../api/itemsService";
import type { TItemPost, TItemUpdate } from "../types/item";

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
    mutationFn: (input: TItemPost) => ItemsClient.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: itemsKeys.items });
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: TItemUpdate }) =>
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
