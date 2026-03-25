import { createClient, Client } from '@libsql/client/web';


// Connection singleton with globalThis for Next.js HMR
const globalForDb = globalThis as unknown as {
  libsqlClient: Client | undefined;
};

let db = globalForDb.libsqlClient;
let isInitialized = false;

export async function getDb(): Promise<Client> {
  if (!db) {
    // Determine the URL based on environment (local file by default, or Turso URL)
    const url = process.env.TURSO_DATABASE_URL || 'file:data.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;

    db = createClient({
      url,
      authToken,
      fetch: (val: any, init: any) => fetch(val, init)
    });

    if (process.env.NODE_ENV !== 'production') globalForDb.libsqlClient = db;
  }

  // Initialize schema
  if (!isInitialized) {
    try {
      await db.executeMultiple(`
        CREATE TABLE IF NOT EXISTS settings (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS transactions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          phone TEXT NOT NULL,
          amount INTEGER NOT NULL,
          status TEXT DEFAULT 'PENDING',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Add status column if it doesn't exist (Migration)
      try {
        await db.execute("ALTER TABLE transactions ADD COLUMN status TEXT DEFAULT 'PAID';");
      } catch {
        // Column already exists
      }

      // Insert default admin password if not exists
      const adminPassHash = await db.execute({
        sql: 'SELECT value FROM settings WHERE key = ?',
        args: ['admin_password_hash']
      });

      if (adminPassHash.rows.length === 0) {
        const defaultPassword = 'admin'; // VERY SIMPLE password, wait for the actual plan
        // Use Web Crypto API instead of bcryptjs for Edge compatibility
        const encoder = new TextEncoder();
        const data = encoder.encode(defaultPassword);

        // Edge & Node 18+ standard Web Crypto API
        const subtleCrypto = globalThis.crypto.subtle;

        const hashBuffer = await subtleCrypto.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        await db.execute({
          sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
          args: ['admin_password_hash', hashHex]
        });
        console.log('Initialized default admin password: admin');
      }

      isInitialized = true;
    } catch (error) {
      console.error("Database initialization error:", error);
    }
  }

  return db;
}
