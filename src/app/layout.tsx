import type { Metadata } from 'next'
import './globals.css'
import Script from 'next/script'
import { Outfit, Plus_Jakarta_Sans } from 'next/font/google'
import { Suspense } from 'react'
import FacebookPixel from '@/components/FacebookPixel'

const outfit = Outfit({
    subsets: ['latin'],
    variable: '--font-outfit',
})

const jakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
})

export const metadata: Metadata = {
    title: 'SupplierScraper Pro - Template Scraper Tokopedia & Shopee',
    description: 'Temukan supplier tangan pertama secara otomatis dari Tokopedia & Shopee. Template scraper siap pakai + training 1 hari untuk tingkatkan margin profit bisnis Anda!',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="id" className={`${outfit.variable} ${jakarta.variable}`}>
            <body className="font-outfit antialiased" suppressHydrationWarning>
                <Suspense fallback={null}>
                    <FacebookPixel />
                </Suspense>
                {children}
            </body>
        </html>
    )
}
