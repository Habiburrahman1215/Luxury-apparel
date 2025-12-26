import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { Gender } from '@prisma/client'
import ProductCard from '@/components/shop/ProductCard'
import ShopFilters from '@/components/shop/ShopFilters'
import { notFound } from 'next/navigation'

interface PageProps {
  params: { gender: string }
  searchParams: {
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
  }
}

export async function generateMetadata({ params }: PageProps) {
  const gender = params.gender.toUpperCase()
  return {
    title: `${params.gender.charAt(0).toUpperCase() + params.gender.slice(1)}'s Collection`,
    description: `Shop premium ${params.gender}'s clothing and accessories`,
  }
}

async function getProducts(params: PageProps['params'], searchParams: PageProps['searchParams']) {
  const genderMap: Record<string, Gender> = {
    'women': 'WOMEN',
    'men': 'MEN',
  }

  const gender = genderMap[params.gender.toLowerCase()]
  if (!gender) return null

  const where: any = { gender }

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

async function getCategories(gender: Gender) {
  const products = await prisma.product.findMany({
    where: { gender },
    select: { category: true },
    distinct: ['category'],
  })
  return products.map(p => p.category)
}

export default async function ShopPage({ params, searchParams }: PageProps) {
  const genderMap: Record<string, Gender> = {
    'women': 'WOMEN',
    'men': 'MEN',
  }

  const gender = genderMap[params.gender.toLowerCase()]
  if (!gender) notFound()

  const [products, categories] = await Promise.all([
    getProducts(params, searchParams),
    getCategories(gender),
  ])

  if (!products) notFound()

  return (
    <div className="min-h-screen section-padding">
      <div className="container-luxury">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-6xl mb-4">
            {params.gender.charAt(0).toUpperCase() + params.gender.slice(1)}'s Collection
          </h1>
          <p className="text-soft-gray max-w-2xl">
            Discover our curated selection of premium {params.gender}'s apparel, 
            designed for the modern individual who values quality and timeless style.
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
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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