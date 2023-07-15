import { Client, Pool } from 'pg';

export let db: Client | null = null;
export const connect = async () => {
    db = await new Client({ connectionString: process.env.DATABASE_URL });
    await db.connect();
}