// Note: Isolates persistence
// repo -> service -> controller -> routes -> middleware
// What: An interface that exposes only the persistence you need for auth
// - find a user by canonical email and optionally record a successful login
// Why: Keeps the domain logic independent from Prisma or any DB
// - Can swap implementations (Prisma, in-memory for tests) W/O touching business logic
// (eg: items)
import type { User } from "@app/shared";

export interface AuthRepo {
  /** Look up a user by canonical email. Return undefined if not found. */
  findByEmailCanonical(emailCanonical: string): Promise<User | undefined>;
  /** Optional hook for future: record login event, update lastLogin, etc. */
  onSuccessfulLogin?(userId: string): Promise<void>;
}
