import { createHash } from 'crypto';
import { config } from 'dotenv';
config({ path: '.env.local' });

const NEW_PASSWORD = 'admin123';
const hash = createHash('sha256').update(NEW_PASSWORD).digest('hex');
const url = process.env.TURSO_DATABASE_URL.replace('libsql://', 'https://');
const token = process.env.TURSO_AUTH_TOKEN;

console.log('DB URL:', url);
console.log('New hash for', NEW_PASSWORD, ':', hash);

const res = await fetch(`${url}/v2/pipeline`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        requests: [
            {
                type: 'execute',
                stmt: {
                    sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
                    args: [
                        { type: 'text', value: 'admin_password_hash' },
                        { type: 'text', value: hash }
                    ]
                }
            },
            { type: 'close' }
        ]
    }),
});

const data = await res.json();
console.log('Response:', JSON.stringify(data, null, 2));

// Verify
const verify = await fetch(`${url}/v2/pipeline`, {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        requests: [
            { type: 'execute', stmt: { sql: 'SELECT * FROM settings WHERE key = \'admin_password_hash\'' } },
            { type: 'close' }
        ]
    }),
});

const verifyData = await verify.json();
const storedHash = verifyData?.results?.[0]?.response?.result?.rows?.[0]?.[1]?.value;
console.log('\nStored hash:', storedHash);
console.log('Expected hash:', hash);
console.log('Match:', storedHash === hash);
console.log('\n✅ Password updated! Use:', NEW_PASSWORD);
