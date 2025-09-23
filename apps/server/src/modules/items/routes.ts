import { Router } from "express";
import { ItemsController } from "./controller";
import { asyncHandler } from "../../utils/asyncHandler";

export const itemsRoutes = Router();

// MVP CRUD — no query params on list
itemsRoutes.get("/",      asyncHandler(ItemsController.list));
itemsRoutes.post("/",     asyncHandler(ItemsController.create));
itemsRoutes.get("/:id",   asyncHandler(ItemsController.get));
itemsRoutes.patch("/:id", asyncHandler(ItemsController.update));
itemsRoutes.delete("/:id",asyncHandler(ItemsController.remove));
