# 📧 Setup Email Notification - Template Scraper

Dokumentasi ini menjelaskan cara mengkonfigurasi sistem email notifikasi untuk Template Scraper.

---

## 🎯 Overview

Sistem ini menggunakan **Gmail SMTP** untuk mengirim notifikasi email ke admin (muhikmu@gmail.com) setiap kali ada pesanan baru.

---

## ⚙️ Konfigurasi Environment Variables

Tambahkan variabel berikut ke file `.env.local` di root project:

```env
# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=muhikmu@gmail.com
EMAIL_PASS=sjwo fumn ylod xjeo
ADMIN_EMAIL=muhikmu@gmail.com

# Optional: App URL untuk link di email
NEXT_PUBLIC_APP_URL=http://localhost:3050
```

---

## 🔐 Cara Mendapatkan Gmail App Password

Karena Google tidak mengizinkan login SMTP dengan password biasa, Anda perlu menggunakan **App Password**:

### Langkah 1: Aktifkan 2-Step Verification
1. Buka https://myaccount.google.com
2. Login dengan email muhikmu@gmail.com
3. Pilih menu **"Keamanan"** (Security)
4. Aktifkan **"Verifikasi 2 langkah"** (2-Step Verification)
5. Ikuti proses verifikasi dengan nomor HP

### Langkah 2: Generate App Password
1. Di halaman **Keamanan**, cari bagian **"Cara Anda login ke Google"**
2. Klik **"Kata sandi aplikasi"** (App passwords)
3. Pilih **"Pilih aplikasi"** → **"Lainnya (Nama khusus)"**
4. Ketik nama: `Template Scraper`
5. Klik **"Buat"** (Generate)
6. Copy password 16 karakter yang muncul (contoh: `abcd efgh ijkl mnop`)

### Langkah 3: Simpan App Password
- Password ini hanya ditampilkan sekali
- Simpan di tempat aman
- Masukkan ke variabel `EMAIL_PASS` di `.env.local`

---

## 🧪 Testing Email

Untuk memastikan email berfungsi, jalankan perintah:

```bash
npm run dev
```

Kemudian lakukan test checkout dan periksa:
1. ✅ Email notifikasi masuk ke muhikmu@gmail.com
2. ✅ Data transaksi tersimpan di database
3. ✅ User diarahkan ke halaman waiting

---

## 📋 Format Email Notifikasi

Email yang dikirim ke admin berisi:

```
Subject: [Pesanan Baru #123] Template Scraper - Rp 10.000.000

Detail Pembeli:
- ID Transaksi: #123
- Nama: Nama Customer
- Email: customer@email.com
- WhatsApp: 08xxxxxxxxxx
- Nominal: Rp 10.000.000
- Status: ⏳ MENUNGGU PEMBAYARAN

Informasi Pembayaran:
Transfer BCA: 5015 17 1330 (a.n. Muhamad Ikbal)
DANA: 089666639360

[Tombol: Buka Dashboard Admin]
```

---

## 🚨 Troubleshooting

### Email Tidak Terkirim

**Masalah:** `Error: Invalid login`
- **Solusi:** Pastikan App Password benar, bukan password Gmail biasa

**Masalah:** `Error: Application-specific password required`
- **Solusi:** Aktifkan 2-Step Verification terlebih dahulu

**Masalah:** Email masuk ke folder Spam
- **Solusi:** Tandai email sebagai "Not Spam" di Gmail

**Masalah:** `Error: Connection timeout`
- **Solusi:** Periksa koneksi internet dan firewall

### Verifikasi Koneksi SMTP

Untuk test koneksi SMTP, buat file `test-email.mjs`:

```javascript
import { verifyEmailConfig, sendAdminNotification } from './src/lib/email.js';

async function test() {
    console.log('Testing email configuration...');
    
    // Test connection
    const isConnected = await verifyEmailConfig();
    if (!isConnected) {
        console.error('Failed to connect to email server');
        return;
    }
    
    // Test send email
    const result = await sendAdminNotification({
        id: 'TEST-001',
        name: 'Test User',
        email: 'test@example.com',
        phone: '08123456789',
        amount: 10000000
    });
    
    if (result) {
        console.log('✅ Test email sent successfully!');
    } else {
        console.error('❌ Failed to send test email');
    }
}

test();
```

Jalankan dengan:
```bash
node test-email.mjs
```

---

## 📊 Alur Sistem Pembayaran

```
┌─────────────────┐
│  User Checkout  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│ Save to DB (PENDING)    │
│ Send Email to Admin     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Redirect to /waiting   │
│  Show BCA & DANA info   │
└────────┬────────────────┘
         │
    [Polling every 3s]
         │
         ▼
┌─────────────────────────┐     ┌──────────────────┐
│  Admin Dashboard        │────▶│  Click "Paid"    │
│  Status: PENDING        │     │  Status: PAID    │
└─────────────────────────┘     └────────┬─────────┘
                                         │
         ◄───────────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Auto-redirect to       │
│  /success page          │
│  Access granted!        │
└─────────────────────────┘
```

---

## 🔒 Keamanan

- ✅ App Password terpisah dari password Gmail
- ✅ Batas 100 email/hari untuk Gmail free tier
- ✅ Email hanya dikirim ke admin (muhikmu@gmail.com)
- ✅ Tidak menyimpan password di kode, hanya di environment variable

---

## 📞 Dukungan

Jika ada masalah dengan email:
1. Periksa console log untuk error detail
2. Verifikasi App Password masih aktif
3. Cek folder Spam di Gmail
4. Hubungi developer jika masalah berlanjut

---

**Terakhir diupdate:** 23 Maret 2025
**Versi:** 1.0.0