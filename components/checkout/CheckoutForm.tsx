'use client'

import { useState } from 'react'
import { useCartStore } from '@/lib/store/cart-store'
import { formatPrice } from '@/lib/utils'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { loadStripe } from '@stripe/stripe-js'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  company: z.string().optional(),
  street: z.string().min(1, 'Street address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zipCode: z.string().min(1, 'ZIP code is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

interface CheckoutFormProps {
  user?: any
  settings: {
    shippingStandard: number
    shippingExpress: number
    freeShippingThreshold: number
    taxRate: number
  }
}

export default function CheckoutForm({ user, settings }: CheckoutFormProps) {
  const { items, getTotal, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: 'United States',
    },
  })

  const subtotal = getTotal()
  const shipping = subtotal > settings.freeShippingThreshold ? 0 : settings.shippingStandard
  const tax = Math.round(subtotal * (settings.taxRate / 100))
  const total = subtotal + shipping + tax

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true)

    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.product.id,
            variantId: item.variant.id,
            quantity: item.quantity,
          })),
          shippingAddress: data,
          email: data.email,
        }),
      })

      const { sessionId } = await response.json()

      // Redirect to Stripe Checkout
      const stripe = await stripePromise
      const { error } = await stripe!.redirectToCheckout({ sessionId })

      if (error) {
        console.error('Stripe error:', error)
        alert('Payment failed. Please try again.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Something went wrong. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-2 gap-12">
      {/* Shipping Information */}
      <div className="space-y-8">
        <div>
          <h2 className="font-serif text-2xl mb-6">Contact Information</h2>
          <Input
            label="Email"
            type="email"
            {...register('email')}
            error={errors.email?.message}
          />
        </div>

        <div>
          <h2 className="font-serif text-2xl mb-6">Shipping Address</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Last Name"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>

            <Input
              label="Company (optional)"
              {...register('company')}
            />

            <Input
              label="Street Address"
              {...register('street')}
              error={errors.street?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
              />
              <Input
                label="State"
                {...register('state')}
                error={errors.state?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="ZIP Code"
                {...register('zipCode')}
                error={errors.zipCode?.message}
              />
              <Input
                label="Country"
                {...register('country')}
                error={errors.country?.message}
              />
            </div>

            <Input
              label="Phone"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div>
        <div className="bg-stone/20 p-8 sticky top-24">
          <h2 className="font-serif text-2xl mb-6">Order Summary</h2>

          {/* Items */}
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.variant.id} className="flex gap-4">
                <div className="relative w-20 h-24 flex-shrink-0 bg-white">
                  <Image
                    src={item.product.images[0]}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                  <div className="absolute -top-2 -right-2 bg-charcoal text-ivory text-xs w-6 h-6 rounded-full flex items-center justify-center">
                    {item.quantity}
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-soft-gray">
                    {item.variant.color} / {item.variant.size}
                  </p>
                  <p className="mt-1">{formatPrice(item.product.price)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-3 border-t border-charcoal/10 pt-6 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-soft-gray">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-soft-gray">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-soft-gray">Tax</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="border-t border-charcoal/10 pt-3 flex justify-between text-lg font-medium">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </Button>

          <p className="text-xs text-soft-gray text-center mt-4">
            Your payment information is secure and encrypted
          </p>
        </div>
      </div>
    </form>
  )
}