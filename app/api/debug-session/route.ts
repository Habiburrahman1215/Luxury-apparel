// Debug script to test session and admin access
// Run this while your dev server is running
// Usage: Open http://localhost:3000/api/debug-session in your browser

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        return NextResponse.json({
            authenticated: !!session,
            session: session,
            user: session?.user,
            hasRole: session?.user?.role,
            isAdmin: session?.user?.role === 'ADMIN',
            timestamp: new Date().toISOString(),
        }, { status: 200 })
    } catch (error) {
        return NextResponse.json({
            error: 'Failed to get session',
            details: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 })
    }
}
