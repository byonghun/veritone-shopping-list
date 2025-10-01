import { Router } from "express";
import type { ItemId } from "@app/shared";
import { ItemsController } from "./controller";
import { readLimiter, writeLimiter } from "../../middleware/rateLimit";
import { asyncHandler } from "../../utils/asyncHandler";

export const itemsRoutes = Router();

// READ
itemsRoutes.get("/", readLimiter, asyncHandler(ItemsController.list));
itemsRoutes.get("/:id", readLimiter, asyncHandler<{ id: ItemId }>(ItemsController.get));

// WRITE
itemsRoutes.post("/", writeLimiter, asyncHandler(ItemsController.create));
itemsRoutes.patch("/:id", writeLimiter, asyncHandler<{ id: ItemId }>(ItemsController.update));
itemsRoutes.delete("/:id", writeLimiter, asyncHandler<{ id: ItemId }>(ItemsController.remove));
