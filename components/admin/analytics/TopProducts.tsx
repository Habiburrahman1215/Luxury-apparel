import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'

interface TopProduct {
    id: string
    name: string
    slug: string
    category: string
    totalSold: number
    totalRevenue: number
    image: string
}

interface TopProductsProps {
    products: TopProduct[]
}

export default function TopProducts({ products }: TopProductsProps) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-gold" />
                <h3 className="font-serif text-2xl">Top Selling Products</h3>
            </div>

            <div className="space-y-4">
                {products.map((product, index) => (
                    <Link
                        key={product.id}
                        href={`/admin/products/${product.id}`}
                        className="flex items-center gap-4 p-3 hover:bg-stone/10 rounded transition-colors"
                    >
                        <div className="flex-shrink-0 w-12 h-12 bg-stone/20 rounded flex items-center justify-center font-bold text-lg">
                            #{index + 1}
                        </div>

                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                        />

                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{product.name}</h4>
                            <p className="text-sm text-soft-gray">{product.category}</p>
                        </div>

                        <div className="text-right">
                            <p className="font-medium">{formatPrice(product.totalRevenue)}</p>
                            <p className="text-sm text-soft-gray">{product.totalSold} sold</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
