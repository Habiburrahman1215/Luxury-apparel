import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const metadata = {
    title: 'Orders',
}

async function getOrders() {
    return await prisma.order.findMany({
        include: {
            items: {
                include: {
                    product: true,
                },
            },
            shippingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function AdminOrdersPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const orders = await getOrders()

    return (
        <div className="container-luxury max-w-7xl">
            <h1 className="font-serif text-4xl mb-8">Orders Management</h1>

            {orders.length === 0 ? (
                <div className="bg-white p-12 text-center">
                    <p className="text-soft-gray">No orders yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone/20 border-b border-charcoal/10">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Order #</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Customer</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Date</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Items</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Total</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Status</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Payment</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/5">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-stone/10 transition-colors">
                                        <td className="py-4 px-6">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-medium text-charcoal hover:text-gold"
                                            >
                                                {order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div>
                                                <p className="text-sm">{order.email}</p>
                                                <p className="text-xs text-soft-gray">
                                                    {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-soft-gray">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                        </td>
                                        <td className="py-4 px-6 font-medium">
                                            {formatPrice(order.total)}
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-block px-3 py-1 text-xs rounded ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                    order.orderStatus === 'PROCESSING' ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                }`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-block px-3 py-1 text-xs rounded ${order.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="text-sm text-charcoal hover:text-gold underline"
                                            >
                                                View Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
