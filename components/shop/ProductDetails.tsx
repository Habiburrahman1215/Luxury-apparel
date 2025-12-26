'use client'

import { Product, ProductVariant } from '@prisma/client'
import { formatPrice } from '@/lib/utils'
import Button from '../ui/Button'
import { Heart, Truck, RefreshCw } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { toast } from 'react-hot-toast'

interface ProductDetailsProps {
  product: Product & { variants: ProductVariant[] }
  selectedColor: string
  setSelectedColor: (color: string) => void
  selectedSize: string
  setSelectedSize: (size: string) => void
}

export default function ProductDetails({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize
}: ProductDetailsProps) {
  const { addItem } = useCartStore()
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore()

  const inWishlist = isInWishlist(product.id)

  // Get unique colors and sizes
  const colors = Array.from(
    new Set(product.variants.map((v) => v.color))
  )
  const sizes = Array.from(
    new Set(product.variants.map((v) => v.size))
  ).sort()

  // Find selected variant
  const selectedVariant = product.variants.find(
    (v: any) => v.color === selectedColor && v.size === selectedSize
  ) as any

  const canAddToCart = selectedColor && selectedSize && selectedVariant && selectedVariant.inventory > 0

  const handleAddToCart = () => {
    if (!canAddToCart || !selectedVariant) return

    addItem(product, selectedVariant)
    toast.success('Added to cart')
  }

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id)
      toast.success('Removed from wishlist')
    } else {
      addToWishlist(product.id)
      toast.success('Added to wishlist')
    }
  }

  return (
    <div className="space-y-8">
      {/* Product Info */}
      <div>
        <p className="text-sm tracking-widest uppercase text-soft-gray mb-2">
          {product.category}
        </p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">
          {product.name}
        </h1>
        <div className="flex items-center gap-3 mb-6">
          <span className="text-2xl font-medium">
            {formatPrice(selectedVariant?.price || product.price)}
          </span>
          {(selectedVariant?.price || product.compareAtPrice) && (
            <span className="text-xl text-soft-gray line-through">
              {formatPrice(selectedVariant?.price ? product.price : product.compareAtPrice || 0)}
            </span>
          )}
        </div>
        <p className="text-soft-gray leading-relaxed">
          {product.description}
        </p>
      </div>

      {/* Color Selection */}
      <div>
        <label className="block font-medium mb-3">
          Color{selectedColor && `: ${selectedColor}`}
        </label>
        <div className="flex gap-3">
          {colors.map((color) => {
            const colorData = (product.colors as any[]).find(
              (c) => c.name === color
            )
            return (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color)
                  // When color changes, we might want to reset size if not available for this color
                  const availableForSize = product.variants.find(v => v.color === color && v.size === selectedSize)
                  if (!availableForSize) setSelectedSize('')
                }}
                className={`w-12 h-12 rounded-full border-2 transition-all ${selectedColor === color
                    ? 'border-charcoal scale-110'
                    : 'border-charcoal/20'
                  }`}
                style={{ backgroundColor: colorData?.hex || '#000' }}
                title={color}
              />
            )
          })}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <label className="block font-medium mb-3">
          Size{selectedSize && `: ${selectedSize}`}
        </label>
        <div className="flex gap-3">
          {sizes.map((size) => {
            const variant = product.variants.find(
              (v) => v.size === size && v.color === selectedColor
            )
            const isAvailable = variant && variant.inventory > 0
            const isDisabled = !selectedColor || !isAvailable

            return (
              <button
                key={size}
                onClick={() => !isDisabled && setSelectedSize(size)}
                disabled={isDisabled}
                className={`px-6 py-3 border-2 transition-all ${selectedSize === size
                    ? 'border-charcoal bg-charcoal text-ivory'
                    : isDisabled
                      ? 'border-charcoal/10 text-charcoal/30 cursor-not-allowed'
                      : 'border-charcoal/20 hover:border-charcoal'
                  }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Stock Status */}
      {selectedVariant && (
        <div>
          {selectedVariant.inventory > 0 ? (
            <p className="text-sm text-green-700">
              {selectedVariant.inventory < 5
                ? `Only ${selectedVariant.inventory} left in stock`
                : 'In stock'}
            </p>
          ) : (
            <p className="text-sm text-red-700">Out of stock</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="w-full"
          size="lg"
        >
          Add to Cart
        </Button>

        <Button
          onClick={handleWishlistToggle}
          variant="secondary"
          className="w-full"
          size="lg"
        >
          <Heart
            className={`h-5 w-5 mr-2 ${inWishlist ? 'fill-charcoal' : ''
              }`}
          />
          {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        </Button>
      </div>

      {/* Features */}
      <div className="border-t border-charcoal/10 pt-8 space-y-4">
        <div className="flex gap-4">
          <Truck className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-medium">Free Shipping</p>
            <p className="text-sm text-soft-gray">
              On orders over $200
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <RefreshCw className="h-6 w-6 flex-shrink-0" />
          <div>
            <p className="font-medium">Free Returns</p>
            <p className="text-sm text-soft-gray">
              30-day return policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}