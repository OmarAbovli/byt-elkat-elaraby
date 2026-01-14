import { db } from "./lib/db";
import { profiles } from "./lib/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

async function main() {
    console.log("Setting up custom authentication...");

    try {
        const hashedPassword = await bcrypt.hash("admin123", 10);

        // 2. Insert or Update admin user
        console.log("Creating/Updating admin user...");
        const existingUser = await db.select().from(profiles).where(eq(profiles.username, "bayomy"));

        if (existingUser.length > 0) {
            await db.update(profiles).set({
                password: hashedPassword,
                role: "admin",
                fullName: "Admin Bayomy"
            }).where(eq(profiles.username, "bayomy"));
            console.log("Admin user updated.");
        } else {
            await db.insert(profiles).values({
                username: "bayomy",
                password: hashedPassword,
                fullName: "Admin Bayomy",
                role: "admin",
                skillLevel: "expert"
            });
            console.log("Admin user created.");
        }

    } catch (error) {
        console.error("Error setting up auth:", error);
    }
}

main();
