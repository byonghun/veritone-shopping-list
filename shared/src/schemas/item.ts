import { z } from "zod";

export const ITEM_NAME_MAX = 120;
export const DESCRIPTION_MAX = 100;
export const QUANTITY_MIN = 1;
export const QUANTITY_MAX = 12;

// Note: Gives compile-time distinction from plain string.
const ItemId = z.string().min(1, "id is required");
export type ItemId = z.infer<typeof ItemId>;

const itemNameField = z
  .string()
  .trim()
  .min(1, "Item name is required.")
  .max(ITEM_NAME_MAX, `Item name must be less than ${ITEM_NAME_MAX} characters.`);

const descriptionField = (max: number) =>
  z.string().max(max, `Item description can not exceed ${max} characters.`).optional();

const descriptionUpdateField = (max: number) =>
  z
    .string()
    .max(max, `Item description can not exceed ${max} characters.`)
    .optional()
    .nullable()
    // Normalize null → undefined so downstream DTOs don't have nulls
    .transform((v) => v ?? undefined);

const quantityField = (min: number, max: number) =>
  z.coerce.number().int().min(min).max(max).optional();

const purchasedField = z.boolean().optional();

export const ItemIdSchema = z.object({ id: ItemId }).strict();

export const ItemInputSchemaServer = z
  .object({
    itemName: itemNameField,
    description: descriptionUpdateField(DESCRIPTION_MAX),
    quantity: quantityField(QUANTITY_MIN, QUANTITY_MAX),
    purchased: purchasedField,
  })
  .strict();

export const ItemSchema = z.object({
  itemName: itemNameField,
  description: descriptionField(DESCRIPTION_MAX),
  quantity: quantityField(QUANTITY_MIN, QUANTITY_MAX),
  purchased: z.boolean().optional().default(false),
});

export type ItemFormInput = z.input<typeof ItemSchema>;
// Frontend to backend form
export type ItemFormOutput = z.output<typeof ItemSchema>;

export const ItemDTOSchema = z.object({
  id: ItemId,
  itemName: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  purchased: z.boolean(),
});
