import { z } from "zod";

export const LoginInputSchema = z.object({
  email: z
    .string()
    .email()
    .transform((v) => v.trim().toLowerCase()),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof LoginInputSchema>;
