import { Client } from 'pg';

// Correct connection string from .env
const connectionString = 'postgresql://neondb_owner:npg_s0pKbG6yWBlf@ep-wispy-cloud-agphm5rx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
});

async function inspectAuth() {
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'auth' 
      ORDER BY table_name;
    `);
        console.log('Auth tables:', res.rows.map(r => r.table_name));

        // Also check if public.profiles has any data
        const profiles = await client.query('SELECT * FROM public.profiles');
        console.log('Profiles count:', profiles.rowCount);
    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await client.end();
    }
}

inspectAuth();
