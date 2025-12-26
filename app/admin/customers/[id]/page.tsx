import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Mail, Calendar, Hash, ShoppingBag, MapPin } from 'lucide-react'

export const metadata = {
    title: 'Customer Details',
}

async function getCustomer(id: string) {
    return await prisma.user.findUnique({
        where: { id },
        include: {
            orders: {
                include: {
                    items: true,
                },
                orderBy: { createdAt: 'desc' },
            },
            addresses: true,
        },
    })
}

export default async function CustomerDetailPage({
    params,
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const customer = await getCustomer(params.id)

    if (!customer) {
        notFound()
    }

    const totalSpentPaid = customer.orders
        .filter(o => o.paymentStatus === 'PAID')
        .reduce((sum, order) => sum + order.total, 0)

    const totalRefunded = customer.orders
        .filter(o => o.paymentStatus === 'REFUNDED')
        .reduce((sum, order) => sum + order.total, 0)

    const totalOrders = customer.orders.length

    const defaultAddress = customer.addresses.find(a => a.isDefault) || customer.addresses[0]
    const phoneNumber = defaultAddress?.phone || 'N/A'

    return (
        <div className="container-luxury max-w-4xl">
            <Link
                href="/admin/customers"
                className="inline-flex items-center gap-2 text-sm mb-6 hover:text-gold transition-colors"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Customers
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12">
                <div>
                    <h1 className="font-serif text-4xl mb-4">
                        {customer.firstName && customer.lastName
                            ? `${customer.firstName} ${customer.lastName}`
                            : customer.email}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-soft-gray text-sm">
                        <span className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {customer.email}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Joined {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                        {phoneNumber !== 'N/A' && (
                            <span className="flex items-center gap-1 text-charcoal">
                                <Hash className="h-4 w-4" />
                                <span>{phoneNumber}</span>
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <Hash className="h-4 w-4" />
                            ID: {customer.id}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-soft-gray text-[10px] mb-1 uppercase tracking-wider">Total Orders</p>
                    <p className="text-2xl font-serif">{totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-soft-gray text-[10px] mb-1 uppercase tracking-wider">Total Spent</p>
                    <p className="text-2xl font-serif text-gold">{formatPrice(totalSpentPaid)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-soft-gray text-[10px] mb-1 uppercase tracking-wider">Total Refunded</p>
                    <p className="text-2xl font-serif text-red-600">{formatPrice(totalRefunded)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-soft-gray text-[10px] mb-1 uppercase tracking-wider">Avg Order Val</p>
                    <p className="text-2xl font-serif">
                        {totalOrders > 0 ? formatPrice(Math.round(totalSpentPaid / totalOrders)) : formatPrice(0)}
                    </p>
                </div>
            </div>

            <div className="space-y-12">
                {/* Addresses */}
                <section>
                    <h2 className="font-serif text-2xl mb-6 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Addresses & Contact
                    </h2>
                    {customer.addresses.length === 0 ? (
                        <p className="text-soft-gray italic">No saved addresses</p>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-4">
                            {customer.addresses.map((address) => (
                                <div key={address.id} className="bg-white p-6 rounded-lg shadow-sm border border-charcoal/5 relative">
                                    {address.isDefault && (
                                        <span className="absolute top-4 right-4 text-[10px] uppercase bg-gold text-white px-2 py-0.5 rounded">
                                            Default
                                        </span>
                                    )}
                                    <p className="font-medium mb-2">{address.firstName} {address.lastName}</p>
                                    <div className="text-sm text-soft-gray space-y-1">
                                        {address.company && <p>{address.company}</p>}
                                        <p>{address.street}</p>
                                        <p>{address.city}, {address.state} {address.zipCode}</p>
                                        <p>{address.country}</p>
                                        <p className="pt-2 text-charcoal font-medium">{address.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Returns & Refunds History */}
                {totalRefunded > 0 && (
                    <section>
                        <h2 className="font-serif text-2xl mb-6 flex items-center gap-2 text-red-600">
                            <ShoppingBag className="h-5 w-5" />
                            Returns & Refunds
                        </h2>
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-red-100">
                            <table className="w-full">
                                <thead className="bg-red-50 border-b border-red-100">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-medium">Order #</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium text-red-600">Refund Amount</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-red-50">
                                    {customer.orders.filter(o => o.paymentStatus === 'REFUNDED').map((order) => (
                                        <tr key={order.id} className="hover:bg-red-50/50 transition-colors">
                                            <td className="py-4 px-6 text-sm font-medium">
                                                {order.orderNumber}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-red-600 font-bold">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="py-4 px-6 text-right text-sm text-soft-gray">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}

                {/* Order History */}
                <section>
                    <h2 className="font-serif text-2xl mb-6 flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Full Order History
                    </h2>
                    {customer.orders.length === 0 ? (
                        <p className="text-soft-gray italic">No orders found</p>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-stone/20 border-b border-charcoal/10">
                                    <tr>
                                        <th className="text-left py-4 px-6 text-sm font-medium">Order #</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium">Date</th>
                                        <th className="text-left py-4 px-6 text-sm font-medium">Status</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium">Amount</th>
                                        <th className="text-right py-4 px-6 text-sm font-medium"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-charcoal/5">
                                    {customer.orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-stone/10 transition-colors">
                                            <td className="py-4 px-6 text-sm font-medium">
                                                {order.orderNumber}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-soft-gray">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`text-[10px] uppercase px-2 py-1 rounded ${order.paymentStatus === 'REFUNDED' ? 'bg-red-100 text-red-800' :
                                                        order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                                                            order.orderStatus === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.paymentStatus === 'REFUNDED' ? 'REFUNDED' : order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-right font-medium">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-xs text-soft-gray hover:text-gold underline"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}
