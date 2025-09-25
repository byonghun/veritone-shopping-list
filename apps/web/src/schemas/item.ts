import { z } from "zod";
import { AMOUNT_LIMIT } from "../components/constants/drawer";

export const ItemSchema = z.object({
  itemName: z
    .string()
    .trim()
    .min(1, "Item name is required.")
    .max(120, "Item name must be less than 120 characters."),
  description: z
    .string()
    .max(100, "Item description can not exceed 100 characters.")
    .optional(),
  quantity: z.coerce.number().int().min(1).max(AMOUNT_LIMIT).optional(),
  purchased: z.boolean().optional().default(false),
});

export type ItemFormInput = z.input<typeof ItemSchema>;

export type ItemFormOutput = z.output<typeof ItemSchema>;
