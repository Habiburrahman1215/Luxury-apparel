import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { buttonVariants } from '@/components/ui/button-variants'
import { Package, Heart, User, MapPin } from 'lucide-react'

export const metadata = {
  title: 'My Account',
}

async function getUserData(userId: string) {
  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: { addresses: true },
    }),
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return { user, orders }
}

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { user, orders } = await getUserData(session.user.id)

  return (
    <div className="min-h-screen section-padding">
      <div className="container-luxury max-w-6xl">
        <h1 className="font-serif text-4xl md:text-5xl mb-12">My Account</h1>

        {/* Account Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Link
            href="/account/orders"
            className="bg-stone/20 p-6 hover:bg-stone/30 transition-colors"
          >
            <Package className="h-8 w-8 mb-4" />
            <h3 className="font-medium mb-1">Orders</h3>
            <p className="text-sm text-soft-gray">{orders.length} total</p>
          </Link>

          <Link
            href="/account/wishlist"
            className="bg-stone/20 p-6 hover:bg-stone/30 transition-colors"
          >
            <Heart className="h-8 w-8 mb-4" />
            <h3 className="font-medium mb-1">Wishlist</h3>
            <p className="text-sm text-soft-gray">View saved items</p>
          </Link>

          <Link
            href="/account/profile"
            className="bg-stone/20 p-6 hover:bg-stone/30 transition-colors"
          >
            <User className="h-8 w-8 mb-4" />
            <h3 className="font-medium mb-1">Profile</h3>
            <p className="text-sm text-soft-gray">Edit your details</p>
          </Link>

          <Link
            href="/account/addresses"
            className="bg-stone/20 p-6 hover:bg-stone/30 transition-colors"
          >
            <MapPin className="h-8 w-8 mb-4" />
            <h3 className="font-medium mb-1">Addresses</h3>
            <p className="text-sm text-soft-gray">
              {user?.addresses.length || 0} saved
            </p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-serif text-2xl">Recent Orders</h2>
            <Link href="/account/orders" className={buttonVariants({ variant: 'ghost' })}>
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 bg-stone/10">
              <p className="text-soft-gray mb-4">No orders yet</p>
              <Link href="/shop/women" className={buttonVariants()}>
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="block bg-stone/20 p-6 hover:bg-stone/30 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-medium mb-1">Order #{order.orderNumber}</p>
                      <p className="text-sm text-soft-gray">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${(order.total / 100).toFixed(2)}
                      </p>
                      <p className="text-sm text-soft-gray capitalize">
                        {order.orderStatus.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-soft-gray">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}