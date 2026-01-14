import { Client } from 'pg';

const connectionString = 'postgresql://neondb_owner:npg_s0pKbG6yWBlf@ep-wispy-cloud-agphm5rx-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

const client = new Client({
    connectionString,
});

async function inspect() {
    try {
        await client.connect();
        const res = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);
        console.log('Existing tables:', res.rows.map(r => r.table_name));
    } catch (err) {
        console.error('Inspection failed:', err);
    } finally {
        await client.end();
    }
}

inspect();
