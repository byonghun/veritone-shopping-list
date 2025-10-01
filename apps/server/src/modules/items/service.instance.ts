import { createItemsService } from "./service";
import { itemsRepoInstance } from "./repo.instance";

export const ItemsService = createItemsService(itemsRepoInstance);