import React from 'react';
import { CheckCircle2, Download, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';

export default function Home() {
    return (
        <main className="min-h-screen bg-checkerboard shadow-vignette text-neutral-900 pb-20">
            {/* Navbar / Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tight text-premium-600">CuanPro</div>
                    <div className="flex items-center gap-4">
                        <Link href="/akses" className="text-sm font-semibold text-neutral-600 hover:text-premium-600 transition-colors hidden sm:block">
                            Akses Pembelian
                        </Link>
                        <Link href="#checkout" className="bg-premium-600 hover:bg-premium-700 text-white px-5 py-2 rounded-full font-medium transition-colors shadow-sm text-sm">
                            Beli Sekarang
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
                <div className="inline-block bg-premium-100 text-premium-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                    🌟 Promo Spesial Hari Ini
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">
                    Hitung HPP & Analisa Bisnis Lebih Akurat dengan CuanPro
                </h1>
                <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                    Kalkulator HPP Otomatis, Proyeksi Profit, dan Dashboard Visual untuk keputusan bisnis yang lebih cerdas. <strong>Kelola bisnis tanpa ribet!</strong>
                </p>

                {/* DANA Cashback Badge */}
                <div className="bg-gradient-to-r from-[#118EEA] to-[#0ea5e9] text-white p-4 rounded-2xl shadow-xl mb-10 max-w-2xl mx-auto flex items-center justify-center gap-4 border-2 border-[#118EEA]/20 transform hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <span className="text-4xl animate-bounce drop-shadow-md">💸</span>
                    <div className="text-left z-10">
                        <p className="font-extrabold text-sm md:text-base uppercase tracking-wider text-yellow-300 drop-shadow-sm">
                            🔥 SUPER PROMO HARI INI
                        </p>
                        <p className="text-sm md:text-base text-white font-medium mt-0.5 leading-snug">
                            Khusus 50 Pembeli Pertama Dapat <strong>CASHBACK Saldo DANA!</strong>
                        </p>
                    </div>
                </div>

                {/* Product Images */}
                <div className="relative w-full max-w-4xl mx-auto flex flex-col gap-8 mb-12 items-center justify-center">
                    <img
                        src="/cuanPro2.jpg"
                        alt="Dashboard CuanPro HPP Calculator"
                        className="w-full h-auto rounded-3xl shadow-2xl border border-neutral-200 object-contain hover:scale-[1.02] transition-transform duration-500 cursor-pointer"
                    />
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mb-16">
                    {[
                        "Kalkulator HPP & Manajemen Harga Otomatis",
                        "Dashboard Visual Proyeksi Profit & Pendapatan",
                        "Pencatatan Inventori & Manajemen Stok Fleksibel",
                        "Analisis Kompetitor untuk Strategi Pasar",
                        "Akses Sekali Bayar, Bebas Digunakan Selamanya"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-start bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
                            <CheckCircle2 className="w-5 h-5 text-premium-500 mt-0.5 shrink-0" />
                            <span className="ml-3 font-medium text-neutral-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Description / Story Section */}
            <section className="bg-white py-16 border-y border-neutral-200">
                <div className="max-w-3xl mx-auto px-4 space-y-6 text-lg text-neutral-700 leading-relaxed">
                    <p>
                        🔥 <strong>Apakah Anda Benar-benar Tahu Berapa Profit Bisnis Anda Bulan Ini?</strong> 🤔
                    </p>
                    <p>
                        Banyak pebisnis yang merasa jualannya laris manis, uang selalu berputar setiap hari, <strong>tapi rekening tabungan bisnis kok gitu-gitu aja?</strong> Bahkan kadang nombok saat harus restock barang.
                    </p>
                    <p>
                        Akar masalahnya seringkali ada di <strong>kesalahan menentukan Harga Pokok Penjualan (HPP)</strong>. Kalau dari awal margin sudah tipis atau bahkan salah hitung karena tidak memasukkan biaya-biaya tersembunyi (seperti ongkir bahan, packaging, admin marketplace, dll), maka sampai kapan pun bisnis akan terasa "capeknya doang, untungnya entah ke mana".
                    </p>
                    <p>
                        Itulah alasan kami merancang <strong>CuanPro HPP Calculator & Business Analytics</strong>. Sebuah dashboard simpel, praktis, dan <em>powerful</em> untuk membantu pengusaha menghitung harga modal dengan sangat akurat sekaligus memantau proyeksi pendapatan bulanan mereka.
                    </p>
                    <p>
                        <em>Berapa harga investasi untuk sistem cerdas ini?</em> Berlangganan software akutansi di luar sana bisa memakan biaya ratusan ribu rutin setiap bulannya. Namun dengan CuanPro, Anda tidak perlu membayar biaya bulanan!
                    </p>
                    <p>
                        Miliki dashboard bisnis andalan ini <strong>hanya Rp89.000 saja</strong>. Sekali bayar untuk penggunaan seumur hidup. Selamat mengelola keuangan dengan lebih jernih dan temukan profit sesungguhnya dari bisnis Anda! 🚀
                    </p>
                </div>
            </section>

            {/* Checkout Section CTA */}
            <section id="checkout" className="max-w-2xl mx-auto px-4 mt-16">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-neutral-200 sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 text-center">Checkout &amp; Dapatkan Akses</h2>

                    <CheckoutForm />
                </div>
            </section>

        </main>
    );
}
