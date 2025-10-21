import { Router } from "express";
import type { ItemId } from "@app/shared";
// Controller: Thin orchestration layer
import { ItemsController } from "./controller";
import { readLimiter, writeLimiter } from "../../middleware/rateLimit";
// A utility wrapper that handles/catches rejected promises and forwards
// the error to the centralized errorHandler middleware
// Keeps route code clean and consistent
import { asyncHandler } from "../../utils/asyncHandler";

export const itemsRoutes = Router();

// Middleware Order:
// 1. readLimiter checks the quota
// 2. asyncHandler(...method) runs your controller and auto-propagates errors
// READ
itemsRoutes.get("/", readLimiter, asyncHandler(ItemsController.list));
itemsRoutes.get("/:id", readLimiter, asyncHandler<{ id: ItemId }>(ItemsController.get));

// WRITE
itemsRoutes.post("/", writeLimiter, asyncHandler(ItemsController.create));
itemsRoutes.patch("/:id", writeLimiter, asyncHandler<{ id: ItemId }>(ItemsController.update));
itemsRoutes.delete("/:id", writeLimiter, asyncHandler<{ id: ItemId }>(ItemsController.remove));
itemsRoutes.delete("/", writeLimiter, asyncHandler(ItemsController.deleteAll));
