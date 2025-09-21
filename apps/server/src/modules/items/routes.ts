import { Router } from "express";
import { ItemsController } from "./controller.js";

export const itemsRoutes = Router();

// MVP CRUD — no query params on list
itemsRoutes.get("/", ItemsController.list);
itemsRoutes.post("/", ItemsController.create);
itemsRoutes.get("/:id", ItemsController.get);
itemsRoutes.patch("/:id", ItemsController.update);
itemsRoutes.delete("/:id", ItemsController.remove);