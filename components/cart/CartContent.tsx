'use client'

import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import Button from '../ui/Button'
import { buttonVariants } from '../ui/button-variants'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface CartContentProps {
  settings: {
    shippingStandard: number
    freeShippingThreshold: number
    taxRate: number
  }
}

export default function CartContent({ settings }: CartContentProps) {
  const { items, removeItem, updateQuantity, getTotal, coupon, applyCoupon, removeCoupon, getDiscount } = useCartStore()
  const [couponCode, setCouponCode] = useState('')
  const [isApplying, setIsApplying] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setIsApplying(true)
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode }),
      })
      const data = await response.json()
      if (response.ok) {
        applyCoupon(data)
        setCouponCode('')
      } else {
        alert(data.error || 'Invalid coupon code')
      }
    } catch (error) {
      alert('Failed to validate coupon')
    } finally {
      setIsApplying(false)
    }
  }

  if (!isMounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-charcoal border-t-transparent rounded-full" />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-soft-gray mb-8">Your cart is empty</p>
        <Link href="/shop/women" className={buttonVariants()}>
          Start Shopping
        </Link>
      </div>
    )
  }

  const subtotal = getTotal()
  const shipping = subtotal > settings.freeShippingThreshold ? 0 : settings.shippingStandard
  const tax = Math.round(subtotal * (settings.taxRate / 100))
  const total = subtotal + shipping + tax

  return (
    <div className="grid lg:grid-cols-3 gap-12">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        {items.map((item) => (
          <motion.div
            key={item.variant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex gap-6 pb-6 border-b border-charcoal/10"
          >
            {/* Image */}
            <Link
              href={`/product/${item.product.slug}`}
              className="relative w-32 h-40 flex-shrink-0 bg-stone/20"
            >
              <Image
                src={item.product.images[0]}
                alt={item.product.name}
                fill
                className="object-cover"
                sizes="128px"
              />
            </Link>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <Link
                  href={`/product/${item.product.slug}`}
                  className="font-medium hover:text-gold transition-colors"
                >
                  {item.product.name}
                </Link>
                <p className="text-sm text-soft-gray mt-1">
                  {item.variant.color} / {item.variant.size}
                </p>
                <p className="text-sm text-soft-gray mt-1">
                  SKU: {item.variant.sku}
                </p>
              </div>

              {/* Quantity & Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.variant.id, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    className="p-1 hover:bg-stone/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.variant.id, item.quantity + 1)
                    }
                    disabled={item.quantity >= item.variant.inventory}
                    className="p-1 hover:bg-stone/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.variant.id)}
                    className="text-soft-gray hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-stone/20 p-8 sticky top-24">
          <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-soft-gray">Subtotal</span>
              <span>{formatPrice(subtotal + getDiscount())}</span>
            </div>
            {coupon && (
              <div className="flex justify-between text-gold">
                <span>Discount ({coupon.code})</span>
                <div className="flex items-center gap-2">
                  <span>-{formatPrice(getDiscount())}</span>
                  <button onClick={removeCoupon} className="text-[10px] uppercase underline">Remove</button>
                </div>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-soft-gray">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-soft-gray">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-charcoal/10 pt-4 flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {!coupon && (
            <div className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="input-field flex-1 text-sm uppercase"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <Button
                  variant="secondary"
                  className="shrink-0"
                  onClick={handleApplyCoupon}
                  isLoading={isApplying}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}

          {shipping > 0 && (
            <p className="text-sm text-soft-gray mb-6">
              Add {formatPrice(settings.freeShippingThreshold - subtotal)} more for free shipping
            </p>
          )}

          <Link href="/checkout" className={buttonVariants({ size: 'lg', className: 'w-full mb-4' })}>
            Proceed to Checkout
          </Link>

          <Link href="/shop/women" className={buttonVariants({ variant: 'ghost', className: 'w-full' })}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}