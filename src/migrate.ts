import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = 'postgresql://neondb_owner:npg_s0pKbG6yWBlf@ep-wispy-cloud-agphm5rx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
});

async function runMigrations() {
    try {
        await client.connect();
        console.log('Connected to Neon DB');

        const migrationsDir = path.join(__dirname, '../supabase/migrations');
        const files = fs.readdirSync(migrationsDir).sort();

        for (const file of files) {
            if (file.endsWith('.sql')) {
                console.log(`Applying migration: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
                await client.query(sql);
                console.log(`Successfully applied: ${file}`);
            }
        }

        console.log('All migrations applied successfully.');
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

runMigrations();
