export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');
        const idParam = searchParams.get('id');

        if (!email && !idParam) {
            return NextResponse.json({ error: 'Missing email or id' }, { status: 400 });
        }

        const db = await getDb();
        let tx: any = null;

        if (idParam) {
            const result = await db.execute({
                sql: 'SELECT id, status, email, name, amount, phone FROM transactions WHERE id = ?',
                args: [parseInt(idParam, 10)]
            });
            tx = result.rows[0];
        } else if (email) {
            const result = await db.execute({
                sql: 'SELECT id, status, email, name, amount, phone FROM transactions WHERE email = ? ORDER BY id DESC LIMIT 1',
                args: [email]
            });
            tx = result.rows[0];
        }

        if (!tx) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        // Validate that the email matches the transaction (Security layer)
        if (email && tx.email.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // --- FETCH TERABOX LINK FROM SETTINGS ---
        let teraboxLink = '';
        try {
            const result = await db.execute({
                sql: 'SELECT value FROM settings WHERE key = ?',
                args: ['terabox_link']
            });
            if (result.rows.length > 0) {
                teraboxLink = result.rows[0].value as string;
            }
        } catch (settingsErr) {
            console.error('Failed to fetch terabox link:', settingsErr);
        }

        // Attach the terabox link to the transaction object
        tx.terabox_link = teraboxLink;

        return NextResponse.json({ transaction: tx });

    } catch (error) {
        console.error('Error fetching transaction status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}