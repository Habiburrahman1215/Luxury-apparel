import { Product, ProductVariant } from '@prisma/client'
import ProductCard from './ProductCard'

interface RelatedProductsProps {
  products: (Product & { variants: ProductVariant[] })[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="section-padding">
      <div className="container-luxury">
        <h2 className="font-serif text-3xl md:text-4xl mb-12 text-center">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}