import { Metadata } from 'next'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your purchase',
}

import { prisma } from '@/lib/prisma'

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)
  const settings = await prisma.storeSettings.findFirst()

  const safeSettings = {
    shippingStandard: settings?.shippingStandard ?? 1500,
    shippingExpress: settings?.shippingExpress ?? 3000,
    freeShippingThreshold: settings?.freeShippingThreshold ?? 20000,
    taxRate: settings?.taxRate ?? 8.0,
  }

  return (
    <div className="min-h-screen section-padding bg-stone/10">
      <div className="container-luxury max-w-6xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-12 text-center">
          Checkout
        </h1>
        <CheckoutForm user={session?.user} settings={safeSettings} />
      </div>
    </div>
  )
}