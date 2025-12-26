import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const { items, shippingAddress, email } = await request.json()

    // Calculate totals
    let subtotal = 0
    const lineItems = []

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true }
      })

      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        )
      }

      const variant = product.variants.find(v => v.id === item.variantId) as any
      const price = variant?.price || product.price
      const images = (variant?.images && variant.images.length > 0) ? variant.images : product.images

      const itemTotal = price * item.quantity
      subtotal += itemTotal

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.name}${variant ? ` - ${variant.color} / ${variant.size}` : ''}`,
            images: [images[0]],
          },
          unit_amount: price,
        },
        quantity: item.quantity,
      })
    }

    // Fetch store settings
    const settings = await prisma.storeSettings.findFirst()
    const shippingCost = settings?.shippingStandard ?? 1500
    const freeShippingThreshold = settings?.freeShippingThreshold ?? 20000

    // Add shipping
    const shipping = subtotal > freeShippingThreshold ? 0 : shippingCost

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: shipping,
        },
        quantity: 1,
      })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
      customer_email: email,
      metadata: {
        items: JSON.stringify(items),
        shippingAddress: JSON.stringify(shippingAddress),
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Checkout failed' },
      { status: 500 }
    )
  }
}