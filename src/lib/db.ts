// Polyfill for Cloudflare Pages Edge Runtime
// Must run BEFORE @libsql/client is loaded, so we use dynamic import
if (typeof globalThis !== 'undefined' && !(globalThis as any).XMLHttpRequest) {
  (globalThis as any).XMLHttpRequest = class XMLHttpRequest {
    open() {}
    send() {}
    setRequestHeader() {}
    addEventListener() {}
    removeEventListener() {}
  };
}

// Use dynamic import to ensure polyfill runs first
let _clientModule: typeof import('@libsql/client/web') | null = null;

async function getClientModule() {
  if (!_clientModule) {
    _clientModule = await import('@libsql/client/web');
  }
  return _clientModule;
}

type Client = Awaited<ReturnType<typeof getClientModule>> extends { Client: infer C } ? C : any;

let db: any = null;
let isInitialized = false;

export async function getDb() {
  if (!db) {
    const { createClient } = await getClientModule();

    const url = process.env.TURSO_DATABASE_URL || 'file:data.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;

    db = createClient({
      url,
      authToken,
    });
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
        const defaultPassword = 'admin';
        const encoder = new TextEncoder();
        const data = encoder.encode(defaultPassword);
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
