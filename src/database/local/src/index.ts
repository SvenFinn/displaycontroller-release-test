import { PrismaClient } from "../generated/client";

export { PrismaClient as LocalClient } from "../generated/client";

export async function createLocalClient(): Promise<PrismaClient> {
    return new PrismaClient();
}