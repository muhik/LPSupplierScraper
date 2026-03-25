"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { CheckCircle2, ArrowLeft, Folder, PlayCircle, Youtube, Globe, DownloadCloud, Sparkles, ShieldCheck, Download } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

declare global {
    interface Window {
        fbq: any;
    }
}

const resources = [
    {
        title: "Template Scraper Tokopedia & Shopee",
        desc: "Tautan unduhan utama via Terabox. (Harap segera simpan/bookmark).",
        url: "#LINK_TERABOX_DISINI",
        type: "drive",
        icon: DownloadCloud
    }
];

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const emailStr = searchParams.get('email');
    const idStr = searchParams.get('id');

    const [tx, setTx] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [emailInput, setEmailInput] = useState(emailStr || '');

    // Function to check transaction from our new edge API
    const checkTransaction = async (queryEmail: string, queryId?: string | null) => {
        if (!queryEmail && !queryId) return;

        setLoading(true);
        setErrorMsg('');

        try {
            let url = `/api/transaction/verify?`;
            const params = new URLSearchParams();
            if (queryEmail) params.append('email', queryEmail);
            if (queryId) params.append('id', queryId);
            url += params.toString();

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setTx(data.transaction);
            } else {
                setTx(null);
                const errorData = await res.json().catch(() => ({}));
                if (queryEmail || queryId) {
                    setErrorMsg(errorData.error || 'Transaksi tidak ditemukan atau email salah.');
                }
            }
        } catch (err: any) {
            setTx(null);
            console.error('Check transaction error:', err);
            if (err.name === 'AbortError') {
                setErrorMsg('Koneksi timeout. Server sedang sibuk, silakan coba lagi dalam beberapa saat.');
            } else {
                setErrorMsg('Gagal memeriksa status transaksi. Periksa koneksi internet Anda.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        if (emailStr || idStr) {
            checkTransaction(emailStr || '', idStr);
        }
    }, [emailStr, idStr]);

    // Polling logic when PENDING
    useEffect(() => {
        if (tx && tx.status === 'PENDING') {
            const interval = setInterval(() => {
                // Poll using the exact same parameters that were successful the first time
                checkTransaction(emailStr || tx.email, tx.id.toString());
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tx, emailStr]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`/success?email=${encodeURIComponent(emailInput)}`);
    };

    const isPaid = tx?.status === 'PAID';
    const isMatched = tx && emailStr && tx.email.toLowerCase() === emailStr.toLowerCase();

    // Trigger Facebook Pixel Purchase event when verification succeeds
    useEffect(() => {
        if (isPaid && isMatched && typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
                currency: 'IDR',
                value: Number(tx?.amount || 10000)
            });
        }
    }, [isPaid, isMatched, tx?.amount]);

    if (!tx || !isPaid || !isMatched) {
        return (
            <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-neutral-200 text-center">
                    <ShieldCheck className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Cek Status Akses</h1>

                    {!tx ? (
                        <p className="text-neutral-600 mb-6">
                            Silakan masukkan <strong>Email</strong> yang Anda gunakan saat pembelian untuk melacak status transaksi Anda.
                        </p>
                    ) : !isPaid ? (
                        <>
                            <p className="text-neutral-600 mb-6">
                                Trx <strong>#{tx.id}</strong> berstatus <strong>Pending</strong>. Harap selesaikan pembayaran via transfer BCA atau DANA. Halaman akan otomatis update setelah admin menandai lunas.
                            </p>
                            <div className="flex items-center gap-3 justify-center text-sm font-medium text-amber-600 mb-6 bg-amber-50 p-3 rounded-lg border border-amber-200">
                                <span className="relative flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                                </span>
                                Menunggu Pembayaran...
                            </div>

                            <div className="flex items-center justify-center text-sm text-neutral-500 my-4">
                                <span className="w-16 h-px bg-neutral-200"></span>
                                <span className="px-3 font-medium">Bantuan Admin</span>
                                <span className="w-16 h-px bg-neutral-200"></span>
                            </div>

                            <a
                                href={`https://wa.me/6289666639360?text=Halo%20Kak%20Ikbal,%20saya%20tertarik%20dengan%20CuanPro%20(No.%20Pesanan:%20%23${tx.id}).%20Inginkan%20bantuan%20untuk%20dipandu%20implementasinya%20di%20laptop%20atau%20komputer%20saya%20dong`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 mb-6"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                                </svg>
                                Hubungi Admin via WhatsApp
                            </a>
                        </>
                    ) : (
                        <p className="text-neutral-600 mb-6">
                            Transaksi sudah Lunas! Namun demi keamanan, konfirmasi ulang <strong>Email</strong> Anda untuk membuka brankas file.
                        </p>
                    )}

                    {errorMsg && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    {/* Retry button for errors */}
                    {errorMsg && (
                        <button
                            type="button"
                            onClick={() => checkTransaction(emailInput || '', idStr)}
                            className="w-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold py-2.5 px-4 rounded-xl transition-colors border border-neutral-300"
                        >
                            Coba Lagi
                        </button>
                    )}

                    {(!isPaid || !isMatched || !tx) && (
                        <form className="flex flex-col gap-4 text-left" onSubmit={handleSearch}>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-neutral-700">Email Pembeli</label>
                                <input
                                    type="email"
                                    required
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                    placeholder="contoh@gmail.com"
                                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:outline-none"
                                />
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-premium-600 hover:bg-premium-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl transition-colors">
                                {loading ? "Memeriksa..." : (tx ? "Buka Brankas Mode Aman" : "Cek Status Pembayaran")}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-sm">
                        <Link href="/" className="text-premium-600 hover:underline">
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    // Only Render Premium Content if PAID & Email matches
    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center py-12 px-4">
            <div className="max-w-3xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-100">
                <div className="text-center p-8 bg-premium-50 border-b border-premium-100">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-200">
                        <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <h1 className="text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">Pembayaran Berhasil! 🎉</h1>
                    <p className="text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
                        Terima kasih {tx.name} atas pembelian Anda. Akses utama ke <strong>Template Scraper Tokopedia & Shopee</strong> sudah bisa diunduh langsung melalui tombol di bawah ini.
                    </p>
                </div>

                <div className="p-8">
                    <h2 className="text-xl font-bold text-premium-800 mb-6 flex items-center">
                        <Download className="w-6 h-6 mr-3 text-premium-600" />
                        Daftar Link Akses Materi Anda
                    </h2>

                    <div className="space-y-4">
                        {resources.map((item, idx) => (
                            <div key={idx} className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white rounded-2xl border border-neutral-200 shadow-sm hover:border-premium-300 hover:shadow-md transition-all gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="bg-premium-100 text-premium-600 p-3 rounded-xl shrink-0 mt-0.5 sm:mt-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-neutral-900 text-lg group-hover:text-premium-700 transition-colors">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-neutral-500 mt-1">{item.desc}</p>
                                    </div>
                                </div>
                                <a
                                    href={tx?.terabox_link || item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto shrink-0 bg-neutral-900 hover:bg-premium-600 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Buka Link
                                </a>
                            </div>
                        ))}
                    </div>

                    {/* Panduan Instalasi Singkat */}
                    <div className="mt-8 bg-neutral-100 border border-neutral-200 rounded-2xl p-6 text-left">
                        <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                            <span className="bg-neutral-800 text-white w-6 h-6 rounded-full inline-flex items-center justify-center text-sm mr-3">?</span>
                            Cara Pakai Template Scraper (Panduan Anti-Ribet)
                        </h3>
                        <p className="text-sm text-neutral-600 mb-4">
                            Ikuti langkah mudah di bawah ini untuk memulai scraping data supplier dari Tokopedia & Shopee:
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-sm text-neutral-700 mb-5">
                            <li><span className="font-semibold text-neutral-900">Download & Ekstrak</span> folder ZIP Template Scraper dari tombol (Terabox) di atas.</li>
                            <li><span className="font-semibold text-neutral-900">Install Node.js</span> (cukup 1x seumur hidup di laptop Anda). Link ada di dalam folder.</li>
                            <li>Buka folder Scraper yang sudah diekstrak, lalu <strong className="text-premium-600">ikuti panduan di file README.md</strong> untuk konfigurasi awal.</li>
                            <li>Jalankan scraper dan <strong className="text-premium-600">ikuti training 1 hari</strong> yang sudah dijadwalkan untuk memaksimalkan penggunaan tool ini! 🎉</li>
                        </ol>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6">
                            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm sm:text-base mb-1">Butuh Bantuan Instalasi? (GRATIS)</h4>
                                <p className="text-xs sm:text-sm text-blue-800">
                                    Jika kesulitan mengikuti langkah di atas, kami menyediakan <strong>Layanan Instalasi Remote Online Gratis</strong>. Training 1 hari sudah termasuk dalam paket pembelian Anda. Hubungi admin untuk jadwal training!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* System Requirements Warning */}
                    <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
                        <div className="bg-amber-100 text-amber-600 p-2 rounded-lg shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div className="text-left">
                            <h4 className="font-bold text-amber-900 mb-1">Persyaratan Sistem</h4>
                            <p className="text-sm text-amber-800">
                                ⚠️ <strong>Template Scraper hanya dapat berjalan di Laptop/PC (Windows/Mac/Linux).</strong> Tidak didukung untuk smartphone atau tablet karena membutuhkan Node.js dan konfigurasi sistem yang hanya tersedia di komputer.
                            </p>
                        </div>
                    </div>

                    {/* Upsell Custom Scraper */}
                    <div className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-200 shadow-sm relative overflow-hidden text-center">
                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-xl md:text-2xl font-extrabold text-blue-900 mb-3 tracking-tight">
                                Butuh Custom Scraper untuk Platform Lain? 🛠️
                            </h3>
                            <p className="text-blue-800 mb-6 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                                Selain Tokopedia dan Shopee, kami juga bisa membantu membuat <strong>Custom Scraper</strong> untuk platform lain seperti Bukalapak, Lazada, TikTok Shop, atau website supplier khusus sesuai kebutuhan bisnis Anda.
                            </p>

                            <div className="flex gap-4 justify-center mb-6 w-full max-w-md">
                                <div className="flex-1 bg-white border border-blue-200 rounded-2xl p-4 shadow-sm hover:border-blue-400 transition-colors">
                                    <div className="text-3xl mb-2">🔧</div>
                                    <div className="font-bold text-neutral-800 text-sm">Custom Platform</div>
                                    <div className="text-blue-600 font-extrabold mt-1 text-lg">Mulai Rp 5jt</div>
                                </div>
                                <div className="flex-1 bg-white border border-blue-200 rounded-2xl p-4 shadow-sm hover:border-blue-400 transition-colors">
                                    <div className="text-3xl mb-2">📊</div>
                                    <div className="font-bold text-neutral-800 text-sm">Data Analysis</div>
                                    <div className="text-blue-600 font-extrabold mt-1 text-lg">Mulai Rp 3jt</div>
                                </div>
                            </div>

                            <a
                                href="https://wa.me/6289666639360?text=Halo%20Admin,%20saya%20sudah%20beli%20Template%20Scraper%20dan%20tertarik%20untuk%20custom%20scraper%20platform%20lain.%20Mohon%20info%20lebih%20lanjut"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-1 text-sm md:text-base border border-blue-500"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                                </svg>
                                Konsultasi Custom Scraper
                            </a>
                        </div>
                    </div>

                    <div className="mt-6 mb-4 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-3xl p-6 md:p-8 border border-emerald-200 shadow-sm relative overflow-hidden text-center">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-50 translate-x-8 -translate-y-8"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 -translate-x-8 translate-y-8"></div>

                        <div className="relative z-10 flex flex-col items-center">
                            <h3 className="text-xl md:text-2xl font-extrabold text-emerald-900 mb-3 tracking-tight">
                                Jadwalkan Training 1 Hari Anda! 📅
                            </h3>
                            <p className="text-emerald-800 mb-6 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                                Pembelian Anda sudah termasuk <strong>Training 1 Hari</strong> untuk memastikan Anda bisa mengoperasikan scraper dengan maksimal. Hubungi admin untuk menjadwalkan sesi training Anda!
                            </p>
                            <a
                                href="https://wa.me/6289666639360?text=Halo%20Admin,%20saya%20sudah%20membeli%20Template%20Scraper%20Tokopedia%20%26%20Shopee.%20Saya%20ingin%20menjadwalkan%20training%201%20hari.%0A%0ANama:%20[Nama%20Anda]%0AEmail:%20[Email%20Pembelian]"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-8 rounded-full transition-all shadow-md hover:shadow-xl hover:-translate-y-1 text-sm md:text-base border border-emerald-500"
                            >
                                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                                </svg>
                                Jadwalkan Training via WhatsApp
                            </a>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-neutral-100 text-center">
                        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">
                            Disarankan untuk menyimpan (bookmark) tautan ini jika Anda belum mengunduh semua materi. Link ini dienkripsi dengan Email Anda.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-neutral-200 rounded-full mb-4"></div>
                    <div className="h-6 w-48 bg-neutral-200 rounded mb-2"></div>
                    <div className="h-4 w-32 bg-neutral-200 rounded"></div>
                </div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
