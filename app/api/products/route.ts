import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET all products (with filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const gender = searchParams.get('gender')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const bestSeller = searchParams.get('bestSeller')
    const ids = searchParams.get('ids')

    const where: any = {}

    if (gender) where.gender = gender
    if (category) where.category = category
    if (featured) where.featured = featured === 'true'
    if (bestSeller) where.bestSeller = bestSeller === 'true'
    if (ids) {
      where.id = { in: ids.split(',') }
    }

    const products = await prisma.product.findMany({
      where,
      include: { variants: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { variants, ...data } = await request.json()
    const product = await prisma.product.create({
      data: {
        ...data,
        variants: {
          create: variants || []
        }
      },
      include: { variants: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}