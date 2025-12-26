import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import { Gender } from '@prisma/client'

interface PageProps {
    searchParams: {
        category?: string
        sort?: string
        minPrice?: string
        maxPrice?: string
        gender?: string
    }
}

export const metadata = {
    title: 'Shop All - Luxury Apparel',
    description: 'Browse our complete collection of premium apparel and accessories.',
}

async function getProducts(searchParams: PageProps['searchParams']) {
    const where: any = {}

    if (searchParams.gender) {
        const gender = searchParams.gender.toUpperCase() as Gender
        if (Object.values(Gender).includes(gender)) {
            where.gender = gender
        }
    }

    if (searchParams.category) {
        where.category = searchParams.category
    }

    if (searchParams.minPrice || searchParams.maxPrice) {
        where.price = {}
        if (searchParams.minPrice) {
            where.price.gte = parseInt(searchParams.minPrice) * 100
        }
        if (searchParams.maxPrice) {
            where.price.lte = parseInt(searchParams.maxPrice) * 100
        }
    }

    let orderBy: any = { createdAt: 'desc' }
    if (searchParams.sort === 'price-asc') {
        orderBy = { price: 'asc' }
    } else if (searchParams.sort === 'price-desc') {
        orderBy = { price: 'desc' }
    } else if (searchParams.sort === 'name') {
        orderBy = { name: 'asc' }
    }

    return await prisma.product.findMany({
        where,
        include: { variants: true },
        orderBy,
    })
}

async function getCategories() {
    const products = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category'],
    })
    return products.map(p => p.category)
}

export default async function ShopAllPage({ searchParams }: PageProps) {
    const [products, categories] = await Promise.all([
        getProducts(searchParams),
        getCategories(),
    ])

    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-serif text-4xl md:text-6xl mb-4">
                        Shop All
                    </h1>
                    <p className="text-soft-gray max-w-2xl">
                        Explore our entire collection of meticulously crafted garments and accessories,
                        blending timeless aesthetics with modern functionality.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Filters */}
                    <aside className="md:w-64 flex-shrink-0">
                        <ShopFilters categories={categories} />
                    </aside>

                    {/* Products */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-sm text-soft-gray">
                                {products.length} {products.length === 1 ? 'product' : 'products'}
                            </p>
                        </div>

                        {products.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-soft-gray">No products found matching your criteria.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
