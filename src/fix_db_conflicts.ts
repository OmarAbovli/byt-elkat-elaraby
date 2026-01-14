import { sql } from "drizzle-orm";
import { db } from "./lib/db";

async function main() {
    console.log("Cleaning up conflicting tables...");
    try {
        // Drop tables that are causing conflicts or need to be recreated
        // We use CASCADE to remove dependent constraints
        await db.execute(sql`DROP TABLE IF EXISTS "package_courses" CASCADE;`);
        console.log("Dropped package_courses");

        await db.execute(sql`DROP TABLE IF EXISTS "lessons" CASCADE;`);
        console.log("Dropped lessons");

        await db.execute(sql`DROP TABLE IF EXISTS "products" CASCADE;`);
        console.log("Dropped products");

        await db.execute(sql`DROP TABLE IF EXISTS "paths" CASCADE;`);
        console.log("Dropped paths");

        await db.execute(sql`DROP TABLE IF EXISTS "settings" CASCADE;`);
        console.log("Dropped settings");

        console.log("Cleanup complete. Ready for drizzle-kit push.");
    } catch (error) {
        console.error("Error cleaning up:", error);
    }
    process.exit(0);
}

main();
