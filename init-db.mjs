import { createClient } from '@libsql/client';

const url = "libsql://lpcuanpro-muhik.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzI4ODk4MjEsImlkIjoiMDE5Y2M4NzctOGQwMS03NjFlLWJjMjUtNTliOTBkZmQ0YjgyIiwicmlkIjoiN2M4ZjRjOTUtMjM3Ni00MDhjLTk5NWItMzU4YjFlNzYzOTZkIn0.k8hldAkZz1XnPc-vK5cM9pBHsqchZ2IJfM7MpmRppnlPbl8ojWcjT6nN_A-bJtJ_I8b7Q-w6LRtQqy3qbynzCw";

async function run() {
    console.log("Connecting to Turso...");
    const db = createClient({ url, authToken });

    console.log("Creating tables...");
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
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            mayar_id TEXT
        );
    `);

    // Add status column if it doesn't exist (Migration)
    try {
        await db.execute("ALTER TABLE transactions ADD COLUMN status TEXT DEFAULT 'PAID';");
    } catch {
        // Column already exists
    }

    try {
        await db.execute("ALTER TABLE transactions ADD COLUMN mayar_id TEXT;");
    } catch {
        // Column already exists
    }

    // Insert default admin password
    console.log("Setting default password...");
    // Using simple crypto for Node
    const crypto = await import('crypto');
    const defaultPassword = 'admin';
    const hash = crypto.createHash('sha256').update(defaultPassword).digest('hex');

    await db.execute({
        sql: 'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
        args: ['admin_password_hash', hash]
    });

    console.log("Database initialized successfully!");
}

run().catch(console.error);
