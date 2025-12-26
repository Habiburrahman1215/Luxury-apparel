import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
    try {
        const { items } = await request.json()

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ items: [] })
        }

        const updatedItems = []

        for (const item of items) {
            const product = await prisma.product.findUnique({
                where: { id: item.productId },
                include: { variants: true },
            })

            if (!product) {
                // Product no longer exists, signal to remove
                updatedItems.push({
                    variantId: item.variantId,
                    removed: true,
                })
                continue
            }

            const variant = product.variants.find((v) => v.id === item.variantId)

            if (!variant) {
                // Variant no longer exists
                updatedItems.push({
                    variantId: item.variantId,
                    removed: true,
                })
                continue
            }

            const price = variant.price || product.price
            const images =
                variant.images && variant.images.length > 0
                    ? variant.images
                    : product.images

            updatedItems.push({
                productId: product.id,
                variantId: variant.id,
                price,
                name: product.name,
                color: variant.color,
                size: variant.size,
                image: images[0],
                inventory: variant.inventory, // Sending inventory for stock checks
            })
        }

        return NextResponse.json({ items: updatedItems })
    } catch (error) {
        console.error('Cart sync error:', error)
        return NextResponse.json(
            { error: 'Failed to sync cart' },
            { status: 500 }
        )
    }
}
