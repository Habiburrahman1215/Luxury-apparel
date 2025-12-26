import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import ProductView from '@/components/shop/ProductView'
import SimilarProducts from '@/components/shop/SimilarProducts'
import { getSimilarProducts } from '@/lib/recommendations'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps) {
  const product = await prisma.product.findUnique({
    where: { slug: params.slug },
  })

  if (!product) return {}

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images[0] }],
    },
  }
}

async function getProduct(slug: string) {
  return await prisma.product.findUnique({
    where: { slug },
    include: { variants: true },
  })
}

async function getAllProducts() {
  return await prisma.product.findMany({
    include: { variants: true },
  })
}

export default async function ProductPage({ params }: PageProps) {
  const [product, allProducts] = await Promise.all([
    getProduct(params.slug),
    getAllProducts(),
  ])

  if (!product) {
    notFound()
  }

  // Get similar products using recommendation algorithm
  const similarProducts = getSimilarProducts(product, allProducts, 4)

  return (
    <div>
      <div className="section-padding">
        <div className="container-luxury max-w-7xl">
          <ProductView product={product} />
        </div>
      </div>

      <SimilarProducts products={similarProducts} />
    </div>
  )
}
