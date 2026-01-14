
import { config } from "dotenv";
config();

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

async function main() {
    console.log("Loading environment variables...");

    // Dynamically import db and schema AFTER config() runs
    const { db } = await import("./src/lib/db");
    const { profiles } = await import("./src/lib/schema");

    console.log("Adding admin user...");

    const username = "mrbayomy";
    const password = "admin123";
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if user exists
        const existingUser = await db.select().from(profiles).where(eq(profiles.username, username));

        if (existingUser.length > 0) {
            console.log("User already exists, updating password...");
            await db.update(profiles).set({
                password: hashedPassword,
                role: "admin",
                fullName: "Admin User",
                email: "admin@example.com"
            }).where(eq(profiles.username, username));
        } else {
            console.log("Creating new admin user...");
            await db.insert(profiles).values({
                username,
                password: hashedPassword,
                role: "admin",
                fullName: "Admin User",
                email: "admin@example.com",
                skillLevel: "expert"
            });
        }

        console.log("Admin user created/updated successfully!");
        console.log("Username: " + username);
        console.log("Password: " + password);
    } catch (error) {
        console.error("Error creating admin user:", error);
        process.exit(1);
    } finally {
        process.exit(0);
    }
}

main();
