import { createItemsService } from "./service.js";
import { itemsRepoInstance } from "./repo.instance.js";

export const ItemsService = createItemsService(itemsRepoInstance);