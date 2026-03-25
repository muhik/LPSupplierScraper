import { config } from 'dotenv';
config({ path: '.env.local' });

if (!globalThis.XMLHttpRequest) {
  globalThis.XMLHttpRequest = class XMLHttpRequest {
    open(){} send(){}
  };
}

import { getDb } from './src/lib/db.ts';

async function test() {
   const db = await getDb();
   const row = await db.execute({
      sql: 'SELECT value FROM settings WHERE key = ?',
      args: ['admin_password_hash']
   });
   console.log("DB RESPONSE:");
   console.dir(row, {depth: null});
   
   console.log("Value:", row.rows[0]?.value);
}

test().catch(console.error);
