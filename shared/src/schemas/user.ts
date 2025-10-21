import { z } from "zod";

/**
 * Password-hash validators for common schemes.
 * - argon2 hashes usually start with $argon2i/$argon2d/$argon2id
 * If you only ever use one hash type, keep just that regex.
 */
export const argon2Regex = /^\$argon2(id|i|d)\$.+$/;

export const UserSchema = z
  .object({
    id: z.string().cuid2(),
    email: z.string().email("Invalid display email"),
    emailCanonical: z.string().trim().toLowerCase().email("Invalid canonical email"),
    passwordHash: z.string().regex(argon2Regex, "Invalid argon2 hash"),
    roles: z.array(z.string()),
  })
  .strict();

export type UserDTO = z.infer<typeof UserSchema>;
