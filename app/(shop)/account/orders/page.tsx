import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/button-variants'

export const metadata = {
  title: 'My Orders',
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    redirect('/login')
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen section-padding">
      <div className="container-luxury max-w-4xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">Order History</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-soft-gray mb-8">You haven't placed any orders yet</p>
            <Link href="/shop/women" className={buttonVariants()}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.id}`}
                className="block bg-stone/20 p-6 hover:bg-stone/30 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                  <div>
                    <p className="font-medium mb-1">Order #{order.orderNumber}</p>
                    <p className="text-sm text-soft-gray">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Badge
                      variant={
                        order.orderStatus === 'DELIVERED'
                          ? 'success'
                          : order.orderStatus === 'CANCELLED'
                            ? 'error'
                            : 'default'
                      }
                    >
                      {order.orderStatus}
                    </Badge>
                    <Badge
                      variant={order.paymentStatus === 'PAID' ? 'success' : 'warning'}
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>

                <div className="border-t border-charcoal/10 pt-4">
                  <p className="text-sm text-soft-gray mb-2">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}