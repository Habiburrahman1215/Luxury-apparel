import ProductCard from './ProductCard'
import { Product, ProductVariant } from '@prisma/client'

type ProductWithVariants = Product & { variants: ProductVariant[] }

interface SimilarProductsProps {
    products: ProductWithVariants[]
}

export default function SimilarProducts({ products }: SimilarProductsProps) {
    if (products.length === 0) return null

    return (
        <section className="section-padding">
            <div className="container-luxury">
                <h2 className="font-serif text-3xl md:text-4xl mb-8">You May Also Like</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
