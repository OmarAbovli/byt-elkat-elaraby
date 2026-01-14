
import { config } from "dotenv";
config();
import { sql } from "drizzle-orm";

async function main() {
    console.log("Dropping public schema...");
    const { db } = await import("./src/lib/db");

    try {
        await db.execute(sql`DROP SCHEMA public CASCADE;`);
        await db.execute(sql`CREATE SCHEMA public;`);
        console.log("Database reset successfully!");
    } catch (e) {
        console.error("Error resetting DB:", e);
    }

    process.exit(0);
}
main();
