import { createClient } from '@libsql/client';

// Use local SQLite file
const url = 'file:data.db';

async function fixDatabaseSchema() {
    try {
        console.log('Connecting to local SQLite database...');
        const db = createClient({ url });

        // Migration 1: Add mayar_id column if it doesn't exist
        console.log('\n=== MIGRATION 1: Adding mayar_id column ===');
        try {
            await db.execute("ALTER TABLE transactions ADD COLUMN mayar_id TEXT;");
            console.log('✅ mayar_id column added successfully');
        } catch (err) {
            if (err.code === 'SQLITE_ERROR' && err.message.includes('already exists')) {
                console.log('⚠️  mayar_id column already exists, skipping...');
            } else {
                throw err;
            }
        }

        // Migration 2: Check if status column exists (already added in init-db.mjs)
        console.log('\n=== MIGRATION 2: Checking status column ===');
        try {
            await db.execute("ALTER TABLE transactions ADD COLUMN status TEXT DEFAULT 'PAID';");
            console.log('✅ status column added successfully with default PAID');
        } catch (err) {
            if (err.code === 'SQLITE_ERROR' && err.message.includes('already exists')) {
                console.log('⚠️  status column already exists, skipping...');
            } else {
                throw err;
            }
        }

        // Migration 3: Set default terabox_link in settings
        console.log('\n=== MIGRATION 3: Setting default terabox_link ===');
        const defaultTeraboxLink = '#LINK_TERABOX_DISINI'; // Ganti dengan link sebenarnya

        await db.execute({
            sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            args: ['terabox_link', defaultTeraboxLink]
        });
        console.log('✅ Terabox link set to:', defaultTeraboxLink);

        // Verify the changes
        console.log('\n=== VERIFICATION ===');
        const settingsResult = await db.execute({
            sql: 'SELECT * FROM settings'
        });
        console.log('Settings:', settingsResult.rows);

        const transactionsResult = await db.execute({
            sql: 'PRAGMA table_info(transactions)'
        });
        console.log('Transaction columns:', transactionsResult.rows.map((row) => row.name));

        console.log('\n✅ Database schema fixed successfully!');
        console.log('\nNext steps:');
        console.log('1. Update the terabox_link in settings table with actual link');
        console.log('2. Test the application');

    } catch (error) {
        console.error('❌ Database migration failed:', error);
        process.exit(1);
    }
}

fixDatabaseSchema();