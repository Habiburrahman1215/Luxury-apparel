import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ items: [] })
        }

        const items = await prisma.wishlistItem.findMany({
            where: { userId: session.user.id },
            select: { productId: true },
        })

        return NextResponse.json({ items: items.map(i => i.productId) })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { productId } = await request.json()
        if (!productId) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 })

        const item = await prisma.wishlistItem.upsert({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
            update: {},
            create: {
                userId: session.user.id,
                productId,
            },
        })

        return NextResponse.json(item)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const productId = searchParams.get('productId')
        if (!productId) return NextResponse.json({ error: 'Missing product ID' }, { status: 400 })

        await prisma.wishlistItem.delete({
            where: {
                userId_productId: {
                    userId: session.user.id,
                    productId,
                },
            },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 })
    }
}
