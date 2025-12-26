'use client'

import { Product, ProductVariant } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ProductWithVariants = Product & { variants: ProductVariant[] }

interface ProductsTableProps {
  products: ProductWithVariants[]
}

export default function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    setDeletingId(id)

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert('Failed to delete product')
      }
    } catch (error) {
      alert('Error deleting product')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-stone/20">
            <tr>
              <th className="text-left py-4 px-6">Product</th>
              <th className="text-left py-4 px-6">Category</th>
              <th className="text-left py-4 px-6">Gender</th>
              <th className="text-left py-4 px-6">Price</th>
              <th className="text-left py-4 px-6">Variants</th>
              <th className="text-left py-4 px-6">Status</th>
              <th className="text-right py-4 px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-charcoal/5">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-16 object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-soft-gray">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">{product.category}</td>
                <td className="py-4 px-6">{product.gender}</td>
                <td className="py-4 px-6">{formatPrice(product.price)}</td>
                <td className="py-4 px-6">{product.variants.length}</td>
                <td className="py-4 px-6">
                  {product.featured && (
                    <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded mr-1">
                      Featured
                    </span>
                  )}
                  {product.bestSeller && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Best Seller
                    </span>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/products/${product.id}`}>
                      <button className="p-2 hover:bg-stone/20 rounded">
                        <Edit className="h-4 w-4" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={deletingId === product.id}
                      className="p-2 hover:bg-red-50 text-red-600 rounded disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}