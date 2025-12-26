import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { code } = await request.json()

        if (!code) {
            return NextResponse.json({ error: 'Coupon code is required' }, { status: 400 })
        }

        const coupon = await prisma.coupon.findUnique({
            where: { code: code.toUpperCase() },
        })

        if (!coupon) {
            return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
        }

        if (!coupon.isActive) {
            return NextResponse.json({ error: 'This coupon is no longer active' }, { status: 400 })
        }

        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
            return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
        }

        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
        }

        return NextResponse.json({
            code: coupon.code,
            discountType: coupon.discountType,
            value: coupon.value,
        })
    } catch (error) {
        console.error('Error validating coupon:', error)
        return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 })
    }
}
