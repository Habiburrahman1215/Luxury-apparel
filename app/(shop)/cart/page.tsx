import { Metadata } from 'next'
import CartContent from '@/components/cart/CartContent'

export const metadata: Metadata = {
  title: 'Shopping Cart',
  description: 'Review your selected items',
}

import { prisma } from '@/lib/prisma'

export default async function CartPage() {
  const settings = await prisma.storeSettings.findFirst()

  const safeSettings = {
    shippingStandard: settings?.shippingStandard ?? 1500,
    shippingExpress: settings?.shippingExpress ?? 3000,
    freeShippingThreshold: settings?.freeShippingThreshold ?? 20000,
    taxRate: settings?.taxRate ?? 8.0,
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-luxury max-w-6xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">Shopping Cart</h1>
        <CartContent settings={safeSettings} />
      </div>
    </div>
  )
}