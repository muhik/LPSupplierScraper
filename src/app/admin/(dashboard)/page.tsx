export const runtime = 'edge';
import React from 'react';
import { getDb } from '@/lib/db';
import TransactionTable from '@/components/TransactionTable';

// Force dynamic rendering so it doesn't cache the DB queries at build time
export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const db = await getDb();

    const result = await db.execute('SELECT * FROM transactions ORDER BY created_at DESC');

    const transactions = result.rows.map((row: any) => ({
        id: row.id as number,
        name: row.name as string,
        email: row.email as string,
        phone: row.phone as string,
        amount: row.amount as number,
        status: row.status as string,
        created_at: row.created_at as string,
    }));

    // Calculate total revenue
    const totalRevenue = transactions.reduce((sum: number, tx: any) => sum + tx.amount, 0);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                    <h3 className="text-neutral-500 font-medium mb-2">Total Transaksi</h3>
                    <p className="text-3xl font-bold text-neutral-900">{transactions.length}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200">
                    <h3 className="text-neutral-500 font-medium mb-2">Total Pendapatan (Omzet)</h3>
                    <p className="text-3xl font-bold text-premium-600">
                        Rp {totalRevenue.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>

            {/* Paginated Transactions Table */}
            <TransactionTable transactions={transactions} />
        </div>
    );
}

