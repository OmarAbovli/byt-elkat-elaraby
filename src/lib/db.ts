import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

// Fallback for Node.js environment (scripts)
const databaseUrl = import.meta.env?.VITE_DATABASE_URL || (typeof process !== "undefined" ? process.env.VITE_DATABASE_URL : undefined);

if (!databaseUrl) {
    throw new Error("Database URL not found");
}

const sql = neon(databaseUrl);
export const db = drizzle(sql);
