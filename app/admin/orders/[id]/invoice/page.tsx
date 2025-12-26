'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils'

interface OrderData {
    id: string
    orderNumber: string
    email: string
    createdAt: string
    subtotal: number
    shipping: number
    tax: number
    total: number
    paymentStatus: string
    stripePaymentId: string | null
    shippingAddress: {
        firstName: string
        lastName: string
        company?: string
        street: string
        city: string
        state: string
        zipCode: string
        country: string
        phone: string
    }
    items: Array<{
        id: string
        quantity: number
        price: number
        product: {
            name: string
        }
        variant: {
            color: string
            size: string
            sku: string
        }
    }>
}

export default function InvoicePage({ params }: { params: { id: string } }) {
    const [order, setOrder] = useState<OrderData | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        async function fetchOrder() {
            try {
                const response = await fetch(`/api/orders/${params.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setOrder(data)
                } else {
                    router.push('/admin/orders')
                }
            } catch (error) {
                console.error('Error fetching order:', error)
                router.push('/admin/orders')
            } finally {
                setLoading(false)
            }
        }

        fetchOrder()
    }, [params.id, router])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!order) {
        return null
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Print Button */}
            <div className="print:hidden fixed top-4 right-4 z-10">
                <button
                    onClick={() => window.print()}
                    className="px-6 py-3 bg-charcoal text-ivory hover:bg-charcoal/90 transition-colors rounded"
                >
                    Print / Download PDF
                </button>
            </div>

            {/* Invoice Content */}
            <div className="max-w-4xl mx-auto p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="font-serif text-4xl mb-2">INVOICE</h1>
                        <p className="text-soft-gray">Invoice #: {order.orderNumber}</p>
                        <p className="text-soft-gray">
                            Date: {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <h2 className="font-serif text-2xl mb-2">Luxury Apparel</h2>
                        <p className="text-sm text-soft-gray">123 Fashion Avenue</p>
                        <p className="text-sm text-soft-gray">New York, NY 10001</p>
                        <p className="text-sm text-soft-gray">hello@luxuryapparel.com</p>
                        <p className="text-sm text-soft-gray">+1 (555) 123-4567</p>
                    </div>
                </div>

                {/* Bill To */}
                <div className="mb-12">
                    <h3 className="font-medium mb-3">BILL TO:</h3>
                    <div className="text-soft-gray">
                        <p className="font-medium text-charcoal">
                            {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                        {order.shippingAddress.company && <p>{order.shippingAddress.company}</p>}
                        <p>{order.shippingAddress.street}</p>
                        <p>
                            {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                            {order.shippingAddress.zipCode}
                        </p>
                        <p>{order.shippingAddress.country}</p>
                        <p className="mt-2">{order.email}</p>
                        <p>{order.shippingAddress.phone}</p>
                    </div>
                </div>

                {/* Items Table */}
                <table className="w-full mb-12">
                    <thead>
                        <tr className="border-b-2 border-charcoal">
                            <th className="text-left py-3">Item</th>
                            <th className="text-left py-3">SKU</th>
                            <th className="text-center py-3">Qty</th>
                            <th className="text-right py-3">Unit Price</th>
                            <th className="text-right py-3">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.items.map((item) => (
                            <tr key={item.id} className="border-b border-charcoal/10">
                                <td className="py-4">
                                    <p className="font-medium">{item.product.name}</p>
                                    <p className="text-sm text-soft-gray">
                                        {item.variant.color} / {item.variant.size}
                                    </p>
                                </td>
                                <td className="py-4 text-sm text-soft-gray">{item.variant.sku}</td>
                                <td className="py-4 text-center">{item.quantity}</td>
                                <td className="py-4 text-right">{formatPrice(item.price)}</td>
                                <td className="py-4 text-right font-medium">
                                    {formatPrice(item.price * item.quantity)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mb-12">
                    <div className="w-64">
                        <div className="flex justify-between py-2">
                            <span>Subtotal:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Shipping:</span>
                            <span>{formatPrice(order.shipping)}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span>Tax:</span>
                            <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between py-3 border-t-2 border-charcoal font-bold text-lg">
                            <span>Total:</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Payment Status */}
                <div className="mb-12">
                    <div className="bg-stone/10 p-4 rounded">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Payment Status:</span>
                            <span
                                className={`px-4 py-2 rounded ${order.paymentStatus === 'PAID'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {order.paymentStatus}
                            </span>
                        </div>
                        {order.stripePaymentId && (
                            <p className="text-sm text-soft-gray mt-2">
                                Transaction ID: {order.stripePaymentId}
                            </p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-soft-gray pt-8 border-t border-charcoal/10">
                    <p className="mb-2">Thank you for your business!</p>
                    <p>
                        For questions about this invoice, please contact us at
                        support@luxuryapparel.com
                    </p>
                </div>
            </div>
        </div>
    )
}
