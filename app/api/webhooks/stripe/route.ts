import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils'
import { headers } from 'next/headers'
import { sendOrderConfirmation } from '@/lib/email'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as any

    try {
      // Parse metadata
      const items = JSON.parse(session.metadata.items)
      const shippingAddress = JSON.parse(session.metadata.shippingAddress)

      // Create address
      const address = await prisma.address.create({
        data: {
          firstName: shippingAddress.firstName,
          lastName: shippingAddress.lastName,
          company: shippingAddress.company,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country,
          phone: shippingAddress.phone,
          userId: session.client_reference_id || undefined,
        },
      })

      // Calculate totals
      let subtotal = 0
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        })
        subtotal += product!.price * item.quantity
      }

      const shipping = subtotal > 20000 ? 0 : 1500
      const tax = Math.round(subtotal * 0.08)
      const total = subtotal + shipping + tax

      // Create order
      const order = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          email: session.customer_email,
          userId: session.client_reference_id || undefined,
          subtotal,
          tax,
          shipping,
          total,
          paymentStatus: 'PAID',
          stripePaymentId: session.payment_intent,
          shippingAddressId: address.id,
          items: {
            create: items.map((item: any) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      })

      // Update inventory
      for (const item of items) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Send confirmation email
      await sendOrderConfirmation(order)

      console.log('Order created:', order.orderNumber)
    } catch (error) {
      console.error('Error processing order:', error)
      return NextResponse.json(
        { error: 'Failed to process order' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}