import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            // For security, don't reveal if user exists
            return NextResponse.json({ success: true, message: 'If an account exists, a reset link will be sent.' })
        }

        const token = crypto.randomBytes(32).toString('hex')
        const expires = new Date(Date.now() + 3600000) // 1 hour from now

        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires,
            },
        })

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

        // Setup email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        })

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Password Reset Request',
            html: `
        <div style="font-family: serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
          <h1 style="text-align: center; color: #1a1a1a;">Luxury Apparel</h1>
          <p>Hello,</p>
          <p>You requested a password reset for your account. Please click the button below to set a new password. This link will expire in 1 hour.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #1a1a1a; color: #f5f5f0; padding: 12px 24px; text-decoration: none; display: inline-block;">Reset Password</a>
          </div>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} Luxury Apparel. All rights reserved.</p>
        </div>
      `,
        })

        return NextResponse.json({ success: true, message: 'Checkout your email for a reset link.' })
    } catch (error) {
        console.error('Error in forgot password:', error)
        return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
    }
}
