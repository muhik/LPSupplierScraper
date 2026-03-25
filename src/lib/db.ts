// ============================================================
// Turso HTTP API client — 100% Edge/Cloudflare compatible
// Uses only fetch(), zero external dependencies
// ============================================================

const TURSO_URL = () => process.env.TURSO_DATABASE_URL || '';
const TURSO_TOKEN = () => process.env.TURSO_AUTH_TOKEN || '';

function getHttpUrl(): string {
  let url = TURSO_URL();
  // Convert libsql:// to https://
  if (url.startsWith('libsql://')) {
    url = url.replace('libsql://', 'https://');
  }
  return url;
}

interface TursoResult {
  columns: string[];
  rows: any[];
}

interface TursoRow {
  [key: string]: any;
}

// Execute a single SQL statement via Turso HTTP API
async function tursoExecute(sql: string, args: any[] = []): Promise<{ rows: TursoRow[]; columns: string[]; lastInsertRowid?: string }> {
  const url = getHttpUrl();
  const token = TURSO_TOKEN();

  const response = await fetch(`${url}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requests: [
        { type: 'execute', stmt: { sql, args: args.map(a => ({ type: inferType(a), value: String(a) })) } },
        { type: 'close' }
      ]
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turso HTTP error ${response.status}: ${text}`);
  }

  const data = await response.json();

  // Extract results from pipeline response
  const result = data?.results?.[0];
  if (result?.type === 'error') {
    throw new Error(`Turso SQL error: ${result.error?.message || JSON.stringify(result.error)}`);
  }

  const resp = result?.response?.result;
  if (!resp) {
    return { rows: [], columns: [], lastInsertRowid: undefined };
  }

  const columns: string[] = (resp.cols || []).map((c: any) => c.name);
  const rows: TursoRow[] = (resp.rows || []).map((row: any[]) => {
    const obj: TursoRow = {};
    columns.forEach((col, i) => {
      obj[col] = row[i]?.value ?? null;
    });
    return obj;
  });

  const lastInsertRowid = resp.last_insert_rowid?.toString() ?? undefined;
  return { rows, columns, lastInsertRowid };
}

// Execute multiple SQL statements (for schema init)
async function tursoExecuteMultiple(statements: string[]): Promise<void> {
  const url = getHttpUrl();
  const token = TURSO_TOKEN();

  const requests = statements
    .filter(s => s.trim().length > 0)
    .map(sql => ({ type: 'execute' as const, stmt: { sql } }));
  requests.push({ type: 'close' as any, stmt: undefined as any });

  const response = await fetch(`${url}/v2/pipeline`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Turso HTTP error ${response.status}: ${text}`);
  }
}

function inferType(value: any): string {
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'integer' || (typeof value === 'number' && Number.isInteger(value))) return 'integer';
  if (typeof value === 'number') return 'float';
  return 'text';
}

// ============================================================
// Database wrapper (same interface as before)
// ============================================================

let isInitialized = false;

// The db object that mimics the old @libsql/client interface
const db = {
  async execute(input: string | { sql: string; args: any[] }): Promise<{ rows: TursoRow[]; lastInsertRowid?: string }> {
    if (typeof input === 'string') {
      return tursoExecute(input);
    }
    return tursoExecute(input.sql, input.args);
  },

  async executeMultiple(sql: string): Promise<void> {
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    return tursoExecuteMultiple(statements);
  }
};

export async function getDb() {
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
        )
      `);

      // Add status column if it doesn't exist (Migration)
      try {
        await db.execute("ALTER TABLE transactions ADD COLUMN status TEXT DEFAULT 'PAID'");
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
