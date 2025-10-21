// First layer for web requests (items)
// HTTP edge for the Items domain. Validates inputs with Zod
// Calls ItemsService formats responses and after any write it gets a fresh list
// broadcasts to clients using Server-Sent Events
import type { Request, Response } from "express";
import { ItemIdSchema, ItemInputSchemaServer, type ItemId, type ItemFormInput } from "@app/shared";

import { ItemsService } from "./service.instance";
import { sseBroadcastItems } from "../../sse";

export const ItemsController = {
  /** GET /api/v1/items */
  async list(_req: Request, res: Response): Promise<void> {
    const items = await ItemsService.listAll();
    res.json({ items, count: items.length });
  },

  /** GET /api/v1/items/:id */
  async get(req: Request<{ id: ItemId }>, res: Response): Promise<void> {
    const params = ItemIdSchema.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({
        error: "BAD_REQUEST" as const,
        message: "Invalid id",
        issues: params.error.issues,
      });
      return;
    }
    const item = await ItemsService.get(params.data.id);
    if (!item) {
      res.status(404).json({ error: "NOT_FOUND" as const, message: "Item not found" });
      return;
    }
    res.json(item);
  },

  /** POST /api/v1/items */
  async create(req: Request<unknown, unknown, ItemFormInput>, res: Response): Promise<void> {
    const parsed = ItemInputSchemaServer.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        error: "BAD_REQUEST" as const,
        message: "Validation failed",
        issues: parsed.error.issues,
      });
      return;
    }
    const created = await ItemsService.create(parsed.data);

    // Note: Pushes a fresh snapshot to all SSE subscribers
    const items = await ItemsService.listAll();
    sseBroadcastItems({ items });

    res.status(201).json(created);
  },

  /** PATCH /api/v1/items/:id */
  async update(req: Request<{ id: ItemId }, unknown, ItemFormInput>, res: Response): Promise<void> {
    const params = ItemIdSchema.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({
        error: "BAD_REQUEST" as const,
        message: "Invalid id",
        issues: params.error.issues,
      });
      return;
    }
    const patch = ItemInputSchemaServer.safeParse(req.body);
    if (!patch.success) {
      res.status(400).json({
        error: "BAD_REQUEST" as const,
        message: "Validation failed",
        issues: patch.error.issues,
      });
      return;
    }
    const updated = await ItemsService.update(params.data.id, patch.data);
    if (!updated) {
      res.status(404).json({ error: "NOT_FOUND" as const, message: "Item not found" });
      return;
    }

    const items = await ItemsService.listAll();
    sseBroadcastItems({ items });

    res.json(updated);
  },

  /** DELETE /api/v1/items/:id */
  async remove(req: Request<{ id: ItemId }>, res: Response): Promise<void> {
    const params = ItemIdSchema.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({
        error: "BAD_REQUEST" as const,
        message: "Invalid id",
        issues: params.error.issues,
      });
      return;
    }
    const ok = await ItemsService.delete(params.data.id);
    if (!ok) {
      res.status(404).json({ error: "NOT_FOUND" as const, message: "Item not found" });
      return;
    }

    const items = await ItemsService.listAll();
    sseBroadcastItems({ items });

    res.status(204).send();
  },

  /** DELETE /api/v1/items (bulk) */
  async deleteAll(_req: Request, res: Response): Promise<void> {
    await ItemsService.deleteAll();

    const items = await ItemsService.listAll();
    sseBroadcastItems({ items });

    res.status(204).send();
  },
} as const;
