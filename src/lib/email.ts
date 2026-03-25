// Email functionality disabled for Cloudflare Pages (Edge Runtime compatibility)
// import nodemailer from 'nodemailer';

export async function verifyEmailConfig() {
    console.log('✅ Email stub: server is running in Edge mode without Node.js mailer');
    return true;
}

interface TransactionData {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    amount: number;
}

export async function sendAdminNotification(transaction: TransactionData): Promise<boolean> {
    console.log('📨 Email stub: notification bypassed for Edge runtime. Transaction ID:', transaction.id);
    return true;
}

export default {}; // Stub export