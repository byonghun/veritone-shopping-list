// repo -> service -> controller -> routes -> middleware
// Repo Implementation
// What: PrismaAuthRepo implements AuthRepo using Prisma
// - findByEmailCanonical hits a unique index
// - onSuccesfulLogin updated "lastLoginAt" (optional) and is intentionally fire-and-forget
// Why: Thing adapter from DB rows to your domain User via mapPrismaUserToDomain
// - All DB specifics stay here, not in the service
import type { PrismaClient } from "@prisma/client";
import type { AuthRepo } from "./repo";
import type { User } from "@app/shared";
import { mapPrismaUserToDomain } from "../../utils/prisma";

export class PrismaAuthRepo implements AuthRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmailCanonical(emailCanonical: string): Promise<User | undefined> {
    const row = await this.prisma.user.findUnique({ where: { emailCanonical } });
    return row ? mapPrismaUserToDomain(row) : undefined;
  }

  /**
   * NOTE: Schema note: ensure your User table has
   * emailCanonical TEXT UNIQUE NOT NULL
   * passwordHash TEXT NOT NULL
   * roles TEXT[] DEFAULT '{}'
   * optionally lastLoginAt TIMESTAMP.
   */
  async onSuccessfulLogin(userId: string): Promise<void> {
    await this.prisma.user
      .update({
        where: { id: userId },
        data: { lastLoginAt: new Date() },
      })
      .catch(() => {});
  }
}
