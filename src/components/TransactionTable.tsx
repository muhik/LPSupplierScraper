'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Transaction {
    id: number;
    name: string;
    email: string;
    phone: string;
    amount: number;
    status: string;
    created_at: string;
}

const ROWS_PER_PAGE = 10;

export default function TransactionTable({ transactions }: { transactions: Transaction[] }) {
    const [page, setPage] = useState(1);

    const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);
    const start = (page - 1) * ROWS_PER_PAGE;
    const visible = transactions.slice(start, start + ROWS_PER_PAGE);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Riwayat Transaksi</h2>
                <span className="text-sm text-neutral-500">
                    Halaman {page} dari {totalPages}
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-600 border-b border-neutral-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Tanggal</th>
                            <th className="px-6 py-4 font-semibold">Nama</th>
                            <th className="px-6 py-4 font-semibold">Kontak</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Nominal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                        {visible.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                                    Belum ada transaksi
                                </td>
                            </tr>
                        ) : (
                            visible.map((tx) => (
                                <tr key={tx.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 text-neutral-500" suppressHydrationWarning>
                                        {new Date(tx.created_at).toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-neutral-900">
                                        {tx.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-neutral-900">{tx.email}</div>
                                        <div className="text-neutral-500 text-xs mt-0.5">{tx.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {tx.status}
                                            </span>
                                            {tx.status === 'PENDING' && (
                                                <button
                                                    onClick={async () => {
                                                        if (confirm('Tandai transaksi ini sebagai LUNAS secara manual?')) {
                                                            try {
                                                                const res = await fetch(`/api/admin/transactions/\${tx.id}/pay`, { method: 'POST' });
                                                                if (res.ok) window.location.reload();
                                                                else alert('Gagal mengubah status');
                                                            } catch (e) {
                                                                alert('Terjadi kesalahan');
                                                            }
                                                        }
                                                    }}
                                                    className="text-xs px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md border border-neutral-200 transition-colors"
                                                >
                                                    Tandai Lunas
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-right text-premium-600">
                                        Rp {tx.amount.toLocaleString('id-ID')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                    <p className="text-sm text-neutral-500">
                        Menampilkan {start + 1}–{Math.min(start + ROWS_PER_PAGE, transactions.length)} dari {transactions.length} transaksi
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`w-9 h-9 text-sm font-semibold rounded-lg transition-colors ${n === page
                                        ? 'bg-premium-600 text-white shadow'
                                        : 'hover:bg-neutral-100 text-neutral-600'
                                    }`}
                            >
                                {n}
                            </button>
                        ))}

                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-neutral-300 hover:bg-neutral-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
