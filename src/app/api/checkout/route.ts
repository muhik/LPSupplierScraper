import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendAdminNotification } from '@/lib/email';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const amount = formData.get('amount') as string;
        const parsedAmount = parseInt(amount, 10);

        if (isNaN(parsedAmount) || parsedAmount < 10000000) {
            return NextResponse.json({ error: 'Minimum pembayaran adalah Rp 10.000.000' }, { status: 400 });
        }

        const db = await getDb();

        // Store the order in our local SQLite database with PENDING status
        const info = await db.execute({
            sql: `
            INSERT INTO transactions (name, email, phone, amount, status)
            VALUES (?, ?, ?, ?, 'PENDING')
          `,
            args: [name, email, phone, parsedAmount]
        });

        const newId = info.lastInsertRowid?.toString();

        console.log('Transaction recorded:', { name, email, phone, amount, id: newId });

        // Send email notification to admin
        try {
            await sendAdminNotification({
                id: newId || 'unknown',
                name,
                email,
                phone,
                amount: parsedAmount
            });
        } catch (emailError) {
            console.error('Failed to send email notification:', emailError);
            // Continue even if email fails - don't block the transaction
        }

        // Return redirect URL to waiting page
        const requestUrl = new URL(request.url);
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

        return NextResponse.json({
            url: `${baseUrl}/waiting?id=${newId}&email=${encodeURIComponent(email)}`
        });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: `Server Error: ${error.message || 'Unknown'}` }, { status: 500 });
    }
}