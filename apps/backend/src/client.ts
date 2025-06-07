import { PrismaClient } from '@prisma/client';

/**
 * Singleton instance of Prisma Client for database access.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client
 */
const prisma: PrismaClient = new PrismaClient();

export default prisma;
