export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const amount = formData.get('amount') as string;
        const parsedAmount = parseInt(amount, 10);

        if (isNaN(parsedAmount) || parsedAmount < 35000) {
            return NextResponse.json({ error: 'Minimum pembayaran adalah Rp 35.000' }, { status: 400 });
        }

        const db = await getDb();

        // Store the order in our local SQLite database
        const info = await db.execute({
            sql: `
            INSERT INTO transactions (name, email, phone, amount)
            VALUES (?, ?, ?, ?)
          `,
            args: [name, email, phone, parsedAmount]
        });

        const newId = info.lastInsertRowid?.toString();

        console.log('Transaction recorded:', { name, email, phone, amount, id: newId });

        // Generate Mayar Payment Link
        const mayarApiKey = process.env.MAYAR_API_KEY;
        if (!mayarApiKey) {
            console.warn('MAYAR_API_KEY is not set. Falling back to simulator.');
            return NextResponse.json({ url: `/simulator/mayar?id=${newId}` });
        }

        // Domain to redirect back to (Use localhost for dev, garasiduaroda/soonislam for prod)
        // Since we are running in Cloudflare, we use the incoming request URL
        const requestUrl = new URL(request.url);
        const baseUrl = `${requestUrl.protocol}//${requestUrl.host}`;

        const mayarResponse = await fetch('https://api.mayar.id/hl/v1/invoice/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${mayarApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                email: email,
                amount: parsedAmount,
                mobile: phone,
                redirectUrl: `${baseUrl}/success?id=${newId}&email=${encodeURIComponent(email)}`,
                description: `Akses Template CuanPro HPP & Analytics`,
                items: [
                    {
                        name: "Template CuanPro",
                        description: "Pembelian Template Excel",
                        quantity: 1,
                        price: parsedAmount,
                        rate: parsedAmount
                    }
                ]
            })
        });

        if (!mayarResponse.ok) {
            const errText = await mayarResponse.text();
            console.error('Failed to create Mayar link:', errText);
            return NextResponse.json({ error: `Mayar Error: ${errText}` }, { status: mayarResponse.status });
        }

        const mayarData = await mayarResponse.json();

        if (mayarData?.statusCode !== 200 || !mayarData?.data?.link) {
            console.error('Invalid response from Mayar:', mayarData);
            return NextResponse.json({ error: `Mayar Invalid Structure: ${JSON.stringify(mayarData)}` }, { status: 500 });
        }

        // Store Mayar Invoice ID for cron-polling
        const invoiceId = mayarData.data.id;
        if (invoiceId) {
            await db.execute({
                sql: `UPDATE transactions SET mayar_id = ? WHERE id = ?`,
                args: [invoiceId, newId]
            });
        }

        // Return the Mayar URL to the client
        return NextResponse.json({ url: mayarData.data.link });

    } catch (error: any) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: `Server Error: ${error.message || 'Unknown'}` }, { status: 500 });
    }
}
