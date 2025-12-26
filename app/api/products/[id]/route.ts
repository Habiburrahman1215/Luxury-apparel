import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { variants: true },
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { variants, ...productData } = await request.json()

    // Use a transaction to ensure database consistency
    const product = await prisma.$transaction(async (tx) => {
      // 1. Update basic product info
      const updatedProduct = await tx.product.update({
        where: { id: params.id },
        data: productData,
        include: { variants: true }
      })

      if (variants && Array.isArray(variants)) {
        // 2. Identify variants to create, update, and delete
        const existingVariants = updatedProduct.variants
        const payloadVariantIds = variants.map(v => v.id).filter(Boolean)

        // Variants to delete (ones in DB but not in payload)
        const variantsToDelete = existingVariants.filter(
          ev => !payloadVariantIds.includes(ev.id)
        )

        // 3. Delete removed variants (carefully)
        for (const v of variantsToDelete) {
          try {
            await tx.productVariant.delete({
              where: { id: v.id }
            })
          } catch (e) {
            console.warn(`Could not delete variant ${v.id} (likely has orders). Skipping.`, e)
            // We just keep it in the DB to avoid breaking foreign keys
          }
        }

        // 4. Upsert remaining variants
        for (const v of variants) {
          const variantData = {
            color: v.color,
            size: v.size,
            sku: v.sku || `${v.color}-${v.size}`,
            inventory: v.inventory || 0,
            price: v.price,
            images: v.images || []
          }

          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: variantData
            })
          } else {
            await tx.productVariant.create({
              data: {
                ...variantData,
                productId: params.id
              }
            })
          }
        }
      }

      // Re-fetch product with all variants to return complete data
      return await tx.product.findUnique({
        where: { id: params.id },
        include: { variants: true }
      })
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.product.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Product deleted' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}