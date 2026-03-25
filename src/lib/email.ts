import nodemailer from 'nodemailer';

// Konfigurasi SMTP Gmail - menggunakan port 465 (SSL) untuk koneksi lebih stabil
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: 465,
    secure: true, // true untuk port 465 (SSL)
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false // untuk development
    }
});

// Verifikasi koneksi SMTP
export async function verifyEmailConfig() {
    try {
        await transporter.verify();
        console.log('✅ Email server is ready to send messages');
        return true;
    } catch (error) {
        console.error('❌ Email server connection failed:', error);
        return false;
    }
}

// Interface untuk data transaksi
interface TransactionData {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    amount: number;
}

// Format rupiah
function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

// Kirim email notifikasi ke admin saat ada pesanan baru
export async function sendAdminNotification(transaction: TransactionData): Promise<boolean> {
    const adminEmail = process.env.ADMIN_EMAIL || 'muhikmu@gmail.com';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3050';

    const subject = `[Pesanan Baru #${transaction.id}] Template Scraper - ${formatRupiah(transaction.amount)}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Pesanan Baru Template Scraper</title>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #059669; }
            .payment-box { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 15px 0; border: 2px solid #f59e0b; }
            .button { display: inline-block; background: #059669; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
            .highlight { color: #059669; font-weight: bold; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🛒 Pesanan Baru Masuk!</h1>
            </div>
            
            <div class="content">
                <h2>Detail Pembeli</h2>
                <div class="info-box">
                    <p><strong>ID Transaksi:</strong> <span class="highlight">#${transaction.id}</span></p>
                    <p><strong>Nama:</strong> ${transaction.name}</p>
                    <p><strong>Email:</strong> ${transaction.email}</p>
                    <p><strong>WhatsApp:</strong> ${transaction.phone}</p>
                    <p><strong>Nominal:</strong> <span class="highlight">${formatRupiah(transaction.amount)}</span></p>
                    <p><strong>Status:</strong> ⏳ MENUNGGU PEMBAYARAN</p>
                </div>

                <div class="payment-box">
                    <h3>💳 Informasi Pembayaran untuk Customer</h3>
                    <p><strong>Transfer BCA:</strong></p>
                    <p style="font-size: 18px; font-weight: bold; color: #1e40af;">5015 17 1330</p>
                    <p>a.n. <strong>Muhamad Ikbal</strong></p>
                    
                    <hr style="margin: 15px 0; border: none; border-top: 1px solid #f59e0b;">
                    
                    <p><strong>DANA:</strong></p>
                    <p style="font-size: 18px; font-weight: bold; color: #118eea;">089666639360</p>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <p>Setelah pembayaran diterima, tandai transaksi sebagai lunas:</p>
                    <a href="${appUrl}/admin" class="button">Buka Dashboard Admin</a>
                </div>

                <div style="background: #dbeafe; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <p style="margin: 0; font-size: 14px;">
                        <strong>💡 Tips:</strong> Customer akan melihat halaman pending sampai Anda menandai pembayaran lunas di dashboard.
                    </p>
                </div>
            </div>

            <div class="footer">
                <p>Email ini dikirim otomatis dari sistem Template Scraper</p>
                <p>${new Date().toLocaleString('id-ID')}</p>
            </div>
        </div>
    </body>
    </html>
    `;

    const textContent = `
PESANAN BARU TEMPLATE SCRAPER

ID Transaksi: #${transaction.id}
Nama: ${transaction.name}
Email: ${transaction.email}
WhatsApp: ${transaction.phone}
Nominal: ${formatRupiah(transaction.amount)}
Status: MENUNGGU PEMBAYARAN

INFORMASI PEMBAYARAN:
Transfer BCA: 5015 17 1330 (a.n. Muhamad Ikbal)
DANA: 089666639360

Setelah pembayaran diterima, tandai transaksi sebagai lunas di:
${appUrl}/admin

---
Email ini dikirim otomatis dari sistem Template Scraper
${new Date().toLocaleString('id-ID')}
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Template Scraper" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: subject,
            text: textContent,
            html: htmlContent,
        });

        console.log('✅ Email notification sent to admin:', info.messageId);
        return true;
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        return false;
    }
}

export default transporter;