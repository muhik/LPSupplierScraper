import React from 'react';
import { CheckCircle2, Download, Star, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import CheckoutForm from '@/components/CheckoutForm';
import { formatNumber } from '@/lib/format';
import ImageSlider from '@/components/ImageSlider';

export default function Home() {
    return (
        <main className="min-h-screen bg-checkerboard shadow-vignette text-neutral-900 pb-20">
            {/* Navbar / Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
                <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="font-bold text-xl tracking-tight text-premium-600">SupplierScraper Pro</div>
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
                    Cari Ribuan Supplier Tangan Pertama Secara Otomatis dalam Sekali Klik!
                </h1>
                <p className="text-lg md:text-xl text-neutral-600 mb-8 max-w-2xl mx-auto">
                    Temukan supplier terpercaya di berbagai platform e-commerce, filter berdasarkan harga termurah, dan tingkatkan margin keuntungan bisnis Anda tanpa ribet!
                </p>

                {/* DANA Cashback Badge */}
                <div className="bg-gradient-to-r from-[#118EEA] to-[#0ea5e9] text-white p-4 rounded-2xl shadow-xl mb-10 max-w-2xl mx-auto flex items-center justify-center gap-4 border-2 border-[#118EEA]/20 transform hover:-translate-y-1 transition-transform cursor-default relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <span className="text-4xl animate-bounce drop-shadow-md">🚀</span>
                    <div className="text-left z-10">
                        <p className="font-extrabold text-sm md:text-base uppercase tracking-wider text-yellow-300 drop-shadow-sm">
                            🔥 PROMO SPESIAL HARI INI
                        </p>
                        <p className="text-sm md:text-base text-white font-medium mt-0.5 leading-snug">
                            Dapatkan Akses Penuh ke Database Supplier Premium!
                        </p>
                    </div>
                </div>

                {/* Product Images Slider */}
                <ImageSlider />

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left mb-16">
                    {[
                        "Auto-Scrape Data Supplier dari E-commerce Terkemuka",
                        "Filter & Analisa Supplier Berdasarkan Harga & Kualitas",
                        "Export Data Supplier ke Excel/CSV untuk Analisis Lanjut",
                        "Update Data Otomatis & Notifikasi Supplier Baru",
                        "Akses Sekali Bayar, Update Fitur Selamanya"
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
                        🔥 <strong>Kesulitan Menemukan Supplier Tangan Pertama dengan Harga Terbaik?</strong> 🤔
                    </p>
                    <p>
                        Banyak pebisnis dropship dan reseller yang <strong>kesulitan mencari supplier terpercaya</strong> dengan harga kompetitif. Akhirnya margin keuntungan tipis karena harus bersaing dengan kompetitor yang sudah punya supplier langsung dari pabrik.
                    </p>
                    <p>
                        Proses pencarian supplier manual memakan waktu berhari-hari, harus cek satu per satu toko di marketplace, <strong>bandingkan harga, rating, dan kualitas</strong> — belum lagi risiko tertipu supplier abal-abal yang menghilang setelah transfer.
                    </p>
                    <p>
                        Oleh karena itu, kami merancang sistem eksklusif ini. Perlu dicatat: <strong>Tidak hanya template scraper Tokped dan Shopee, namun juga sudah dilengkapi dengan Web Dashboard-nya sebagai pelengkap penyimpanan Big Bank Datanya!</strong> Ini adalah solusi lengkap dan otomatis untuk <strong>mengekstrak data supplier secara massal</strong> dalam hitungan menit lalu menyimpannya dengan rapi dan aman.
                    </p>
                    <p>
                        <em>Apa yang akan Anda dapatkan?</em> Sistem Scraper sekaligus Web Dashboard siap pakai untuk mengelola ribuan data supplier potensial (harga, rating, kontak). <strong>Ditambah training 1 hari</strong> untuk memastikan Anda bisa mengoperasikannya dengan mudah.
                    </p>
                    <p>
                        Investasi <strong>{formatNumber(10000000)}</strong> untuk implementasi penuh dengan training eksklusif. Bayangkan berapa waktu dan uang yang bisa Anda hemat dibanding pencarian manual yang melelahkan! 🚀
                    </p>
                </div>
            </section>

            {/* Checkout Section CTA */}
            <section id="checkout" className="max-w-2xl mx-auto px-4 mt-16">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-neutral-200 sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 text-center">Checkout & Dapatkan Akses</h2>

                    <CheckoutForm />
                </div>
            </section>

        </main>
    );
}