import type { Request, Response } from "express";
import { ItemsService } from "./service";
import {
  ItemCreateSchema,
  ItemUpdateSchema,
  ItemIdSchema,
  type ItemCreateInput,
  type ItemUpdateInput,
  type ItemIdInput,
} from "./schemas.js";

export const ItemsController = {
  /** GET /api/v1/items — list all (MVP) */
  async list(_req: Request, res: Response): Promise<void> {
    const items = await ItemsService.listAll();
    res.json({ items, count: items.length });
  },

  /** GET /api/v1/items/:id */
  async get(req: Request<ItemIdInput>, res: Response): Promise<void> {
    const params = ItemIdSchema.safeParse(req.params);
    if (!params.success) {
      res
        .status(400)
        .json({
          error: "BAD_REQUEST" as const,
          message: "Invalid id",
          issues: params.error.issues,
        });
      return;
    }
    const item = await ItemsService.get(params.data.id);
    if (!item) {
      res
        .status(404)
        .json({ error: "NOT_FOUND" as const, message: "Item not found" });
      return;
    }
    res.json(item);
  },

  /** POST /api/v1/items */
  async create(
    req: Request<unknown, unknown, ItemCreateInput>,
    res: Response
  ): Promise<void> {
    const parsed = ItemCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      res
        .status(400)
        .json({
          error: "BAD_REQUEST" as const,
          message: "Validation failed",
          issues: parsed.error.issues,
        });
      return;
    }
    const created = await ItemsService.create(parsed.data);
    res.status(201).json(created);
  },

  /** PATCH /api/v1/items/:id */
  async update(
    req: Request<ItemIdInput, unknown, ItemUpdateInput>,
    res: Response
  ): Promise<void> {
    const params = ItemIdSchema.safeParse(req.params);
    if (!params.success) {
      res
        .status(400)
        .json({
          error: "BAD_REQUEST" as const,
          message: "Invalid id",
          issues: params.error.issues,
        });
      return;
    }
    const patch = ItemUpdateSchema.safeParse(req.body);
    if (!patch.success) {
      res
        .status(400)
        .json({
          error: "BAD_REQUEST" as const,
          message: "Validation failed",
          issues: patch.error.issues,
        });
      return;
    }
    const updated = await ItemsService.update(params.data.id, patch.data);
    if (!updated) {
      res
        .status(404)
        .json({ error: "NOT_FOUND" as const, message: "Item not found" });
      return;
    }
    res.json(updated);
  },

  /** DELETE /api/v1/items/:id */
  async remove(req: Request<ItemIdInput>, res: Response): Promise<void> {
    const params = ItemIdSchema.safeParse(req.params);
    if (!params.success) {
      res
        .status(400)
        .json({
          error: "BAD_REQUEST" as const,
          message: "Invalid id",
          issues: params.error.issues,
        });
      return;
    }
    const ok = await ItemsService.delete(params.data.id);
    if (!ok) {
      res
        .status(404)
        .json({ error: "NOT_FOUND" as const, message: "Item not found" });
      return;
    }
    res.status(204).send();
  },
} as const;
