import { PrismaClient } from "@/lib/generated/prisma";

// Reuse Prisma client in dev to avoid exhausting connection limits
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

