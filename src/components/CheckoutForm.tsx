'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatNumber, parseRupiah } from '@/lib/format';

declare global {
    interface Window {
        fbq: any;
    }
}

export default function CheckoutForm() {
    const router = useRouter();
    const [rawAmount, setRawAmount] = useState<number>(10000000);
    const [displayAmount, setDisplayAmount] = useState<string>('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // Update display amount when raw amount changes
    useEffect(() => {
        setDisplayAmount(formatNumber(rawAmount));
    }, [rawAmount]);

    const handleSubmit = async (e?: React.FormEvent, isBypass = false) => {
        if (e) e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append('amount', rawAmount.toString());
        payload.append('name', name);
        payload.append('email', email);
        payload.append('phone', phone);

        try {
            // Track AddToCart / InitiateCheckout event for Facebook Pixel
            if (typeof window !== 'undefined' && window.fbq) {
                window.fbq('track', 'InitiateCheckout', {
                    currency: 'IDR',
                    value: Number(rawAmount)
                });
            }

            const response = await fetch('/api/checkout', {
                method: 'POST',
                body: payload,
                redirect: 'follow'
            });

            if (response.redirected) {
                router.push(response.url);
            } else if (response.ok) {
                const data = await response.json();
                console.log("Checkout success, redirecting to:", data.url);
                if (data.url) {
                    router.push(data.url);
                }
            } else {
                let errorMessage = "Terjadi kesalahan saat checkout.";
                try {
                    const data = await response.json();
                    if (data.error) errorMessage = data.error;
                } catch (e) {
                    errorMessage = await response.text();
                }
                console.error("Failed to checkout:", errorMessage);
                alert(`Gagal diproses: ${errorMessage}\n\nSilakan coba lagi dengan nominal yang berbeda.`);
            }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Koneksi bermasalah.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Trust / Value Proposition Banner */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 shadow-sm">
                <p className="flex items-start gap-2">
                    <span className="text-xl">💡</span>
                    <span>
                        <strong>Keputusan Tepat!</strong> Investasi <strong>{formatNumber(10000000)}</strong> untuk <strong>Template Scraper Tokopedia & Shopee</strong> + <strong>WEB Dashboard Lokal</strong> + <strong>Training 1 Hari</strong> eksklusif. Mulai ekstrak data supplier secara otomatis dan tingkatkan margin profit bisnis Anda!
                    </span>
                </p>
            </div>
            {/* Price Input */}
            <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Berapa Nominal Terbaikmu?</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-neutral-500">Rp</span>
                    <input
                        type="text"
                        name="amount"
                        ref={inputRef}
                        value={displayAmount}
                        onChange={(e) => {
                            const value = e.target.value;
                            const parsed = parseRupiah(value);
                            if (parsed >= 10000000 || parsed === 0) {
                                setRawAmount(parsed);
                            }
                        }}
                        onBlur={() => {
                            if (rawAmount < 10000000) {
                                setRawAmount(10000000);
                            }
                        }}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:border-premium-500 text-lg outline-none transition-shadow font-normal text-neutral-700"
                        required
                        placeholder="Rp 10.000.000"
                    />
                </div>
                <p className="text-xs text-neutral-500 mt-2">Minimal Rp 10.000.000</p>
            </div>

            {/* Buyer Info */}
            <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Nama Lengkap <span className="text-red-500">*</span></label>
                <input
                    type="text"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:border-premium-500 outline-none transition-shadow"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Email <span className="font-normal">(Untuk akses Google Drive)</span> <span className="text-red-500">*</span></label>
                <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:border-premium-500 outline-none transition-shadow"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">No. WhatsApp <span className="text-red-500">*</span></label>
                <input
                    type="tel"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-premium-500 focus:border-premium-500 outline-none transition-shadow"
                    required
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-premium-600 hover:bg-premium-700 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    {loading ? "Memproses..." : "Pesan Sekarang & Dapatkan Akses"}
                </button>
            </div>


            <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 mt-4">
                <ShieldCheck className="w-4 h-4 text-premium-600" />
                <span>Pembayaran Aman & Terverifikasi</span>
            </div>
        </form>
    );
}