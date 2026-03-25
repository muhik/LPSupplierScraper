import { config } from 'dotenv';
config({ path: '.env.local' });

const url = process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://');
const token = process.env.TURSO_AUTH_TOKEN;

async function check() {
    const res = await fetch(`${url}/v2/pipeline`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
            requests: [
                { type: 'execute', stmt: { sql: 'SELECT * FROM settings' } },
                { type: 'close' }
            ]
        })
    });
    
    const data = await res.json();
    console.dir(data, { depth: null });
}

check().catch(console.error);
