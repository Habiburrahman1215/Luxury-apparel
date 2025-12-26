'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Product, ProductVariant } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product & { variants: ProductVariant[] }
}

export default function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, addItem, removeItem } = useWishlistStore()
  const inWishlist = isInWishlist(product.id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inWishlist) {
      removeItem(product.id)
    } else {
      addItem(product.id)
    }
  }

  const primaryImage = product.images[0]
  const hoverImage = product.images[1] || primaryImage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="group block relative">
        <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-stone/20">
          <Link href={`/product/${product.slug}`}>
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <Image
              src={hoverImage}
              alt={product.name}
              fill
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </Link>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 p-2 bg-ivory/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Heart
              className={`h-5 w-5 ${inWishlist ? 'fill-charcoal text-charcoal' : 'text-charcoal'
                }`}
            />
          </button>

          {/* Badges */}
          {product.bestSeller && (
            <div className="absolute top-4 left-4 bg-charcoal text-ivory px-3 py-1 text-xs tracking-widest pointer-events-none">
              BEST SELLER
            </div>
          )}
        </div>

        <Link href={`/product/${product.slug}`}>
          <div>
            <h3 className="font-medium mb-1 group-hover:text-gold transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-soft-gray mb-2">{product.category}</p>
            <div className="flex items-center gap-2">
              <span className="font-medium">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-soft-gray line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}