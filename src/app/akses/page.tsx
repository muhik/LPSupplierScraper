"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Mail, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';

export default function AksesPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            setErrorMsg('Mohon masukkan alamat email Anda.');
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            // Re-use the existing transaction verify API
            // This API returns 404 or success depending on if the email matches a PAID transaction
            const url = `/api/transaction/verify?email=${encodeURIComponent(email.trim())}`;
            const res = await fetch(url);

            if (res.ok) {
                const data = await res.json();

                // Extra safety: only redirect if status is PAID
                if (data.transaction && data.transaction.status === 'PAID') {
                    // Success! Redirect into the vault
                    router.push(`/success?email=${encodeURIComponent(email.trim())}`);
                } else {
                    setErrorMsg('Email ditemukan, namun status pembayaran belum LUNAS.');
                }
            } else {
                // Email not found or transaction not paid
                setErrorMsg('Akses ditolak. Pastikan email yang Anda masukkan sama dengan saat pembelian dan pembayaran telah LUNAS.');
            }
        } catch (err) {
            setErrorMsg('Terjadi kesalahan sistem. Silakan coba lagi nanti.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md">

                {/* Logo / Header Area */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-sm border border-neutral-200 mb-4">
                        <KeyRound className="w-8 h-8 text-premium-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 mb-2 tracking-tight">Cari Akses Saya</h1>
                    <p className="text-neutral-500">
                        Kehilangan link SupplierScraper Pro Anda?
                        <br />Masukkan email yang digunakan saat pembelian.
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-neutral-200 p-6 sm:p-8">

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-neutral-700 mb-2">
                                Email Pembelian
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-neutral-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3.5 border border-neutral-300 rounded-xl bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-premium-500 focus:border-premium-500 transition-colors text-neutral-900 placeholder:text-neutral-400 outline-none"
                                    placeholder="contoh@gmail.com"
                                    required
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3.5 bg-red-50 text-red-700 text-sm rounded-xl border border-red-200 flex items-start gap-2.5">
                                <ShieldCheck className="w-5 h-5 shrink-0 text-red-500" />
                                <span className="pt-0.5 leading-tight">{errorMsg}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center py-3.5 px-4 rounded-xl text-white font-bold bg-neutral-900 hover:bg-premium-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-premium-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors shadow-sm group"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    <span>Mencari Data...</span>
                                </>
                            ) : (
                                <>
                                    <span>Buka SupplierScraper Pro</span>
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center text-sm">
                    <Link href="/" className="text-neutral-500 hover:text-premium-600 transition-colors flex items-center justify-center gap-1.5 font-medium">
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        Kembali ke Halaman Utama
                    </Link>
                </div>

            </div>
        </main>
    );
}
