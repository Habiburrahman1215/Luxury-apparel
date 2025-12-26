import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'
import { ArrowLeft, Download } from 'lucide-react'

export const metadata = {
    title: 'Order Details',
}

async function getOrder(id: string) {
    return await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                    variant: true,
                },
            },
            shippingAddress: true,
        },
    })
}

export default async function OrderDetailPage({
    params,
}: {
    params: { id: string }
}) {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const order = await getOrder(params.id)

    if (!order) {
        notFound()
    }

    return (
        <div className="container-luxury max-w-4xl">
            <Link
                href="/admin/orders"
                className="inline-flex items-center gap-2 text-sm mb-6 hover:text-gold"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
            </Link>

            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="font-serif text-4xl mb-2">Order {order.orderNumber}</h1>
                    <p className="text-soft-gray">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <Link
                    href={`/admin/orders/${order.id}/invoice`}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal text-ivory hover:bg-charcoal/90 transition-colors"
                >
                    <Download className="h-4 w-4" />
                    Download Invoice
                </Link>
            </div>

            <div className="grid gap-6">
                {/* Order Status */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-serif text-2xl mb-4">Order Status</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-soft-gray mb-1">Payment Status</p>
                            <span
                                className={`inline-block px-3 py-1 text-sm rounded ${order.paymentStatus === 'PAID'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {order.paymentStatus}
                            </span>
                        </div>
                        <div>
                            <p className="text-sm text-soft-gray mb-1">Order Status</p>
                            <span
                                className={`inline-block px-3 py-1 text-sm rounded ${order.orderStatus === 'DELIVERED'
                                        ? 'bg-green-100 text-green-800'
                                        : order.orderStatus === 'SHIPPED'
                                            ? 'bg-blue-100 text-blue-800'
                                            : order.orderStatus === 'PROCESSING'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {order.orderStatus}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Customer Information */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-serif text-2xl mb-4">Customer Information</h2>
                    <div className="space-y-2">
                        <p>
                            <span className="font-medium">Email:</span> {order.email}
                        </p>
                        <p>
                            <span className="font-medium">Name:</span>{' '}
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </p>
                        {order.shippingAddress?.phone && (
                            <p>
                                <span className="font-medium">Phone:</span> {order.shippingAddress.phone}
                            </p>
                        )}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-serif text-2xl mb-4">Shipping Address</h2>
                    <div className="text-soft-gray">
                        <p>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                        {order.shippingAddress?.company && <p>{order.shippingAddress.company}</p>}
                        <p>{order.shippingAddress?.street}</p>
                        <p>
                            {order.shippingAddress?.city}, {order.shippingAddress?.state}{' '}
                            {order.shippingAddress?.zipCode}
                        </p>
                        <p>{order.shippingAddress?.country}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-serif text-2xl mb-4">Order Items</h2>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div
                                key={item.id}
                                className="flex gap-4 pb-4 border-b border-charcoal/10 last:border-0"
                            >
                                <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-20 h-24 object-cover"
                                />
                                <div className="flex-1">
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <p className="text-sm text-soft-gray">
                                        {item.variant.color} / {item.variant.size}
                                    </p>
                                    <p className="text-sm text-soft-gray">SKU: {item.variant.sku}</p>
                                    <p className="text-sm">Quantity: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                                    <p className="text-sm text-soft-gray">
                                        {formatPrice(item.price)} each
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="font-serif text-2xl mb-4">Order Summary</h2>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{formatPrice(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
