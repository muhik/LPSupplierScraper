import { createClient } from '@libsql/client';

// Database configuration
const url = "libsql://lpcuanpro-muhik.aws-ap-northeast-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3NzI4ODk4MjEsImlkIjoiMDE5Y2M4NzctOGQwMS03NjFlLWJjMjUtNTliOTBkZmQ0YjgyIiwicmlkIjoiN2M4ZjRjOTUtMjM3Ni00MDhjLTk5NWItMzU4YjFlNzYzOTZkIn0.k8hldAkZz1XnPc-vK5cM9pBHsqchZ2IJfM7MpmRppnlPbl8ojWcjT6nN_A-bJtJ_I8b7Q-w6LRtQqy3qbynzCw";

// New password - change this to whatever you want
const NEW_PASSWORD = 'admin123'; // Standard password: admin123

async function resetPassword() {
    try {
        console.log('Connecting to database...');
        const db = createClient({ url, authToken });

        // Hash the new password using SHA-256
        const crypto = await import('crypto');
        const hash = crypto.createHash('sha256').update(NEW_PASSWORD).digest('hex');

        console.log(`Setting new password: ${NEW_PASSWORD}`);
        console.log(`SHA-256 hash: ${hash}`);

        // Update the admin password in settings table
        const result = await db.execute({
            sql: 'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
            args: ['admin_password_hash', hash]
        });

        console.log('✅ Password reset successful!');
        console.log(`\nYou can now login with:\nEmail: (any)\nPassword: ${NEW_PASSWORD}\n`);
        console.log('Please change the password after login for security.');

    } catch (error) {
        console.error('❌ Error resetting password:', error);
        process.exit(1);
    }
}

resetPassword();