import ProductCard from './ProductCard'
import { Product, ProductVariant } from '@prisma/client'

type ProductWithVariants = Product & { variants: ProductVariant[] }

interface RecommendedProductsProps {
    products: ProductWithVariants[]
    title?: string
}

export default function RecommendedProducts({ products, title = 'Recommended for You' }: RecommendedProductsProps) {
    if (products.length === 0) return null

    return (
        <section className="section-padding bg-stone/10">
            <div className="container-luxury">
                <h2 className="font-serif text-3xl md:text-4xl mb-8 text-center">{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
