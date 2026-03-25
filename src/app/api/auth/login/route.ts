if (typeof globalThis !== 'undefined' && !(globalThis as any).XMLHttpRequest) {
    (globalThis as any).XMLHttpRequest = class XMLHttpRequest { open(){} send(){} };
}
export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

import { encrypt } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { password } = await request.json();
        const db = await getDb();

        const row = await db.execute({
            sql: 'SELECT value FROM settings WHERE key = ?',
            args: ['admin_password_hash']
        });

        if (row.rows.length === 0) {
            return NextResponse.json({ error: 'Database settings not initialized' }, { status: 500 });
        }

        const adminPasswordHash = row.rows[0].value as string;

        // Use Web Crypto API instead of bcryptjs for Edge compatibility
        const encoder = new TextEncoder();
        const data = encoder.encode(password);

        // Edge & Node 18+ standard Web Crypto API
        const subtleCrypto = globalThis.crypto.subtle;

        const hashBuffer = await subtleCrypto.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const inputHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

        const isValid = inputHashHex === adminPasswordHash;

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        // Passwords match, create session
        const sessionData = { role: 'admin' };
        const encryptedSessionData = await encrypt(sessionData);

        const cookieStore = await cookies();
        cookieStore.set('admin_session', encryptedSessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ error: `Server Error: ${error?.message || String(error)}` }, { status: 500 });
    }
}
