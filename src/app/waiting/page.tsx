'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { ShieldCheck, Copy, CheckCircle2, Clock, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

// Format rupiah
function formatRupiah(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(amount);
}

function WaitingContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const emailStr = searchParams.get('email');
    const idStr = searchParams.get('id');

    const [tx, setTx] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    // Function to check transaction status
    const checkTransaction = async () => {
        if (!emailStr && !idStr) {
            setLoading(false);
            return;
        }

        try {
            let url = `/api/transaction/verify?`;
            const params = new URLSearchParams();
            if (emailStr) params.append('email', emailStr);
            if (idStr) params.append('id', idStr);
            url += params.toString();

            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                setTx(data.transaction);

                // If paid, redirect to success page
                if (data.transaction?.status === 'PAID') {
                    router.push(`/success?id=${idStr}&email=${encodeURIComponent(emailStr || '')}`);
                    return;
                }
            } else {
                setTx(null);
                const errorData = await res.json().catch(() => ({}));
                setErrorMsg(errorData.error || 'Transaksi tidak ditemukan.');
            }
        } catch (err: any) {
            console.error('Check transaction error:', err);
            setErrorMsg('Gagal memeriksa status transaksi.');
        } finally {
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        checkTransaction();
    }, [emailStr, idStr]);

    // Polling logic - check every 3 seconds
    useEffect(() => {
        if (tx && tx.status === 'PENDING') {
            const interval = setInterval(() => {
                checkTransaction();
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [tx]);

    const handleCopy = (text: string, type: string) => {
        navigator.clipboard.writeText(text);
        setCopied(type);
        setTimeout(() => setCopied(null), 2000);
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-premium-600 mx-auto mb-4"></div>
                    <p className="text-neutral-600">Memuat data transaksi...</p>
                </div>
            </main>
        );
    }

    if (!tx) {
        return (
            <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-neutral-200 text-center">
                    <ShieldCheck className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Transaksi Tidak Ditemukan</h1>
                    <p className="text-neutral-600 mb-6">{errorMsg || 'Silakan coba lagi atau hubungi admin.'}</p>
                    <Link href="/" className="text-premium-600 hover:underline">
                        Kembali ke Halaman Utama
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-neutral-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-8 text-center text-white">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                        <Clock className="w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Menunggu Pembayaran</h1>
                    <p className="text-white/90">
                        Pesanan #{tx.id} sedang diproses
                    </p>
                </div>

                <div className="p-8">
                    {/* Transaction Details */}
                    <div className="bg-neutral-50 rounded-2xl p-6 mb-6 border border-neutral-200">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-800">Detail Pesanan</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Nama</span>
                                <span className="font-medium text-neutral-900">{tx.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Email</span>
                                <span className="font-medium text-neutral-900">{tx.email}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">WhatsApp</span>
                                <span className="font-medium text-neutral-900">{tx.phone}</span>
                            </div>
                            <div className="border-t border-neutral-200 pt-3 flex justify-between">
                                <span className="text-neutral-500">Total Bayar</span>
                                <span className="font-bold text-lg text-premium-600">
                                    {formatRupiah(tx.amount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-800 flex items-center gap-2">
                            💳 Cara Pembayaran
                        </h2>

                        {/* BCA Transfer */}
                        <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-5 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    BCA
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900">Transfer Bank BCA</p>
                                    <p className="text-sm text-neutral-500">a.n. Muhamad Ikbal</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-blue-100">
                                <span className="font-mono text-xl font-bold text-blue-700 tracking-wider">
                                    5015 17 1330
                                </span>
                                <button
                                    onClick={() => handleCopy('5015171330', 'bca')}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {copied === 'bca' ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Tersalin
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Salin
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* DANA */}
                        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-[#118eea] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    DANA
                                </div>
                                <div>
                                    <p className="font-semibold text-neutral-900">DANA</p>
                                    <p className="text-sm text-neutral-500">Scan QR atau kirim ke nomor</p>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-purple-100">
                                <span className="font-mono text-xl font-bold text-[#118eea] tracking-wider">
                                    089666639360
                                </span>
                                <button
                                    onClick={() => handleCopy('089666639360', 'dana')}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors"
                                >
                                    {copied === 'dana' ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Tersalin
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Salin
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6">
                        <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            Langkah Selanjutnya
                        </h3>
                        <ol className="text-sm text-amber-800 space-y-2 list-decimal list-inside">
                            <li>Transfer sesuai nominal <strong>{formatRupiah(tx.amount)}</strong></li>
                            <li>Gunakan salah satu metode pembayaran di atas</li>
                            <li>Screenshot bukti pembayaran (opsional)</li>
                            <li>Tunggu admin menandai pembayaran lunas</li>
                            <li>Halaman ini akan otomatis redirect ke halaman sukses</li>
                        </ol>
                    </div>

                    {/* Auto-refresh indicator */}
                    <div className="flex items-center justify-center gap-3 text-sm text-neutral-500 mb-6">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span>Mengecek status pembayaran secara otomatis...</span>
                    </div>

                    {/* Help */}
                    <div className="border-t border-neutral-200 pt-6">
                        <p className="text-center text-sm text-neutral-600 mb-4">
                            Butuh bantuan? Hubungi admin
                        </p>
                        <a
                            href={`https://wa.me/6289666639360?text=Halo%20Admin,%20saya%20sudah%20melakukan%20pembayaran%20untuk%20pesanan%20%23${tx.id}%0A%0ANama:%20${encodeURIComponent(tx.name)}%0AEmail:%20${encodeURIComponent(tx.email)}%0ANominal:%20${formatRupiah(tx.amount)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <MessageCircle className="w-5 h-5" />
                            Konfirmasi via WhatsApp
                        </a>
                    </div>

                    <div className="mt-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Kembali ke Halaman Utama
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default function WaitingPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-premium-600 mx-auto mb-4"></div>
                    <p className="text-neutral-600">Memuat...</p>
                </div>
            </main>
        }>
            <WaitingContent />
        </Suspense>
    );
}