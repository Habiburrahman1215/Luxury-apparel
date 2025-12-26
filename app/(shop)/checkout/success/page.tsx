import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Order Confirmed',
}

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { session_id: string }
}) {
  return (
    <div className="min-h-screen section-padding flex items-center justify-center">
      <div className="max-w-md text-center">
        <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
        <h1 className="font-serif text-4xl mb-4">Order Confirmed!</h1>
        <p className="text-soft-gray mb-8">
          Thank you for your purchase. We've sent a confirmation email with your order details.
        </p>
        <div className="space-y-3">
          <Link href="/account/orders">
            <Button className="w-full">View Order Status</Button>
          </Link>
          <Link href="/shop/women">
            <Button variant="ghost" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}