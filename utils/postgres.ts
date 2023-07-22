import { Pool } from 'pg';

export let db: Pool | null = null;
export const connect = async () => {
    db = await new Pool({ connectionString: process.env.DATABASE_URL });
    await db.connect();
}

export const disconnect = async () => {
    if (db == null) return;
    await db.end();
    db = null;
}