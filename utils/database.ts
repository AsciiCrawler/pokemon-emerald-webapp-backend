import { PrismaClient } from '@prisma/client';

export let db: PrismaClient | null = null;
export const connect = async () => {
    db = await new PrismaClient();
}