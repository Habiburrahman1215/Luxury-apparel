import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json()

        if (!token || !password) {
            return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: {
                    gt: new Date(),
                },
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Token is invalid or has expired' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        })

        return NextResponse.json({ success: true, message: 'Password has been reset successfully.' })
    } catch (error) {
        console.error('Error in reset password:', error)
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }
}
