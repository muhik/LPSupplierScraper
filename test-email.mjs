import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

console.log('Testing email configuration...\n');

// Check environment variables
console.log('Environment Variables:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST || 'NOT SET');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT || 'NOT SET');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? '***SET***' : 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***SET***' : 'NOT SET');
console.log('ADMIN_EMAIL:', process.env.ADMIN_EMAIL || 'NOT SET');
console.log('');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Test connection
console.log('Testing SMTP connection...');
try {
    await transporter.verify();
    console.log('✅ SMTP Connection successful!\n');
} catch (error) {
    console.error('❌ SMTP Connection failed:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
}

// Send test email
console.log('Sending test email to:', process.env.ADMIN_EMAIL);
try {
    const info = await transporter.sendMail({
        from: `"Test" <${process.env.EMAIL_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: 'Test Email - Template Scraper',
        text: 'This is a test email from the Template Scraper system.\n\nIf you receive this, the email configuration is working correctly!',
        html: `
            <h2>Test Email</h2>
            <p>This is a test email from the <strong>Template Scraper</strong> system.</p>
            <p>If you receive this, the email configuration is working correctly! ✅</p>
            <p>Time: ${new Date().toLocaleString('id-ID')}</p>
        `,
    });

    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', info.messageId);
    console.log('\nPlease check your inbox (and spam folder) at:', process.env.ADMIN_EMAIL);
} catch (error) {
    console.error('❌ Failed to send test email:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
}

process.exit(0);