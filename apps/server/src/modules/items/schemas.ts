import { z } from "zod";

export const ItemIdSchema = z.object({
  id: z.string().min(1),
});

export const ItemCreateSchema = z.object({
  name: z.string().min(1, "name is required").max(120),
  description: z.string().max(500).optional(),
  quantity: z.coerce.number().int().min(1).max(999).optional(),
});

export const ItemUpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z
    .string()
    .max(500)
    .optional()
    .nullable()
    .transform((v) => v ?? undefined),
  quantity: z.coerce.number().int().min(1).max(999).optional(),
  purchased: z.boolean().optional(),
});

export type ItemIdInput = z.infer<typeof ItemIdSchema>;
export type ItemCreateInput = z.infer<typeof ItemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof ItemUpdateSchema>;
