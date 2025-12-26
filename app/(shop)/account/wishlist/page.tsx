'use client'

import { useEffect, useState } from 'react'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import ProductCard from '@/components/shop/ProductCard'
import { Product, ProductVariant } from '@prisma/client'
import Button from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/button-variants'
import Link from 'next/link'
import { useCartStore } from '@/lib/store/cart-store'
import { toast } from 'react-hot-toast'

type ProductWithVariants = Product & { variants: ProductVariant[] }

export default function WishlistPage() {
  const { items: wishlistIds, removeItem, syncWithServer } = useWishlistStore()
  const { addItem: addToCart } = useCartStore()
  const [products, setProducts] = useState<ProductWithVariants[]>([])
  const [recommendations, setRecommendations] = useState<ProductWithVariants[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initial sync with server
  useEffect(() => {
    if (isMounted) {
      syncWithServer()
    }
  }, [syncWithServer, isMounted])

  // Fetch products when wishlist IDs change
  useEffect(() => {
    async function fetchWishlistData() {
      if (!isMounted) return
      if (wishlistIds.length === 0) {
        setProducts([])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/products?ids=${wishlistIds.join(',')}`)
        const wishlistData = await response.json()
        setProducts(wishlistData)
      } catch (error) {
        console.error('Error fetching wishlisted products:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWishlistData()
  }, [wishlistIds])

  // Fetch recommendations once
  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const response = await fetch('/api/products?featured=true')
        const data: ProductWithVariants[] = await response.json()

        // Filter out items already in wishlist (using current IDs)
        const filteredRecs = data.filter(p => !wishlistIds.includes(p.id)).slice(0, 4)
        setRecommendations(filteredRecs)
      } catch (error) {
        console.error('Error fetching recommendations:', error)
      }
    }

    fetchRecommendations()
  }, []) // Only fetch recommendations once on mount or when wishlistIds change if desired


  const handleMoveToBag = (product: ProductWithVariants) => {
    if (product.variants.length > 0) {
      const variant = product.variants[0]
      addToCart(product, variant, 1)
      removeItem(product.id)
      toast.success('Moved to bag')
    } else {
      toast.error('No variants found for this product')
    }
  }

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen section-padding flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-charcoal border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-luxury">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">My Wishlist</h1>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-stone/5 border border-dashed border-charcoal/20 mb-20">
            <p className="text-soft-gray mb-8 italic">Your wishlist is currently empty</p>
            <Link href="/shop/women" className={buttonVariants({ variant: 'secondary' })}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12 mb-20">
            {products.map((product) => (
              <div key={product.id} className="space-y-4">
                <ProductCard product={product} />
                <Button
                  onClick={() => handleMoveToBag(product)}
                  variant="secondary"
                  className="w-full text-xs"
                >
                  Move to Bag
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-serif text-2xl md:text-3xl">Recommended for You</h2>
              <Link href="/shop" className="text-sm text-soft-gray hover:text-charcoal transition-colors border-b border-charcoal/20 pb-1">
                View All Collection
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}