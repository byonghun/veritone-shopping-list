// Chooses the service by calling createItemsService(instance)
// at import time
import { createItemsService } from "./service";
import { itemsRepoInstance } from "./repo.instance";

export const ItemsService = createItemsService(itemsRepoInstance);
