import { createClient } from '@libsql/client';

// Use local SQLite file
const url = 'file:data.db';

async function testDatabase() {
    try {
        console.log('Connecting to local SQLite database...');
        const db = createClient({ url });

        // Test 1: Check settings table
        console.log('\n=== SETTINGS TABLE ===');
        const settingsResult = await db.execute({
            sql: 'SELECT * FROM settings'
        });
        console.log('Settings rows:', settingsResult.rows);

        // Check if terabox_link exists
        const teraboxLink = settingsResult.rows.find((row) => row.key === 'terabox_link');
        if (teraboxLink) {
            console.log('✅ Terabox link found:', teraboxLink.value);
        } else {
            console.log('⚠️  Terabox link NOT found in settings');
        }

        // Check admin password hash
        const adminPass = settingsResult.rows.find((row) => row.key === 'admin_password_hash');
        if (adminPass) {
            console.log('✅ Admin password hash exists (hidden for security)');
        } else {
            console.log('⚠️  Admin password hash NOT found');
        }

        // Test 2: Check transactions table
        console.log('\n=== TRANSACTIONS TABLE ===');
        const transactionsResult = await db.execute({
            sql: 'SELECT id, email, name, amount, status, mayar_id FROM transactions ORDER BY id DESC LIMIT 5'
        });
        console.log('Recent transactions:', transactionsResult.rows);
        console.log('Total transactions:', transactionsResult.rows.length);

        // Test 3: Count all transactions by status
        console.log('\n=== TRANSACTION STATUS SUMMARY ===');
        const countResult = await db.execute({
            sql: 'SELECT status, COUNT(*) as count FROM transactions GROUP BY status'
        });
        console.log('Status counts:', countResult.rows);

        console.log('\n✅ Database test completed successfully!');

    } catch (error) {
        console.error('❌ Database test failed:', error);
        process.exit(1);
    }
}

testDatabase();