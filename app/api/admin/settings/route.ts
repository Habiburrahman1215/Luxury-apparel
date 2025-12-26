import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { z } from 'zod'

const settingsSchema = z.object({
    storeName: z.string().min(1, 'Store name is required'),
    storeEmail: z.string().email('Invalid email address'),
    supportEmail: z.string().email('Invalid email address'),
    shippingStandard: z.number().min(0),
    shippingExpress: z.number().min(0),
    freeShippingThreshold: z.number().min(0),
    taxRate: z.number().min(0).max(100),
    orderEmails: z.boolean(),
    shippingEmails: z.boolean(),
    marketingEmails: z.boolean(),
})

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        let settings = await prisma.storeSettings.findFirst()

        if (!settings) {
            settings = await prisma.storeSettings.create({
                data: {
                    storeName: 'Luxury Apparel',
                    storeEmail: 'hello@luxuryapparel.com',
                    supportEmail: 'support@luxuryapparel.com',
                },
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user?.role || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const result = settingsSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Validation failed', details: result.error.flatten() },
                { status: 400 }
            )
        }

        const { data } = result

        // We assumme there is only one settings record, or we create one if missing
        // Ideally, pass the ID, but for a single store, finding the first one is acceptable
        const firstSettings = await prisma.storeSettings.findFirst()

        let settings
        if (firstSettings) {
            settings = await prisma.storeSettings.update({
                where: { id: firstSettings.id },
                data,
            })
        } else {
            settings = await prisma.storeSettings.create({
                data,
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        )
    }
}
