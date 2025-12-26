import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { Plus } from 'lucide-react'
import ProductsTable from '@/components/admin/ProductsTable'

async function getProducts() {
  return await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminProductsPage() {
  const products = await getProducts()

  return (
    <div className="container-luxury max-w-7xl">
      <div className="flex justify-between items-center mb-12">
        <h1 className="font-serif text-4xl">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}