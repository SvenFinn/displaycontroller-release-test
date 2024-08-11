import { PrismaClient } from "@prisma/client";

export { PrismaClient as LocalClient } from "@prisma/client";

export async function createLocalClient(): Promise<PrismaClient> {
    return new PrismaClient();
}