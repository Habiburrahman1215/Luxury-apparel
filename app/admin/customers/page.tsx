import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export const metadata = {
    title: 'Customers',
}

async function getCustomers() {
    return await prisma.user.findMany({
        where: { role: 'CUSTOMER' },
        include: {
            _count: {
                select: { orders: true },
            },
            orders: {
                select: {
                    total: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' },
    })
}

export default async function AdminCustomersPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.role || session.user.role !== 'ADMIN') {
        redirect('/')
    }

    const customers = await getCustomers()

    return (
        <div className="container-luxury max-w-7xl">
            <h1 className="font-serif text-4xl mb-8">Customers</h1>

            {customers.length === 0 ? (
                <div className="bg-white p-12 text-center">
                    <p className="text-soft-gray">No customers yet</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-stone/20 border-b border-charcoal/10">
                                <tr>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Name</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Email</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Joined</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Orders</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Total Spent</th>
                                    <th className="text-left py-4 px-6 text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-charcoal/5">
                                {customers.map((customer) => {
                                    const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0)

                                    return (
                                        <tr key={customer.id} className="hover:bg-stone/10 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <p className="font-medium">{customer.firstName || ''} {customer.lastName || ''}</p>
                                                    {!customer.firstName && !customer.lastName && (
                                                        <p className="text-sm text-soft-gray">No name</p>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                {customer.email}
                                            </td>
                                            <td className="py-4 px-6 text-sm text-soft-gray">
                                                {new Date(customer.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-sm">
                                                {customer._count.orders}
                                            </td>
                                            <td className="py-4 px-6 font-medium">
                                                ${(totalSpent / 100).toFixed(2)}
                                            </td>
                                            <td className="py-4 px-6">
                                                <Link
                                                    href={`/admin/customers/${customer.id}`}
                                                    className="text-sm text-charcoal hover:text-gold underline"
                                                >
                                                    View Details
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Summary */}
                    <div className="border-t border-charcoal/10 p-6 bg-stone/10">
                        <div className="grid grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-2xl font-bold">{customers.length}</p>
                                <p className="text-sm text-soft-gray">Total Customers</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {customers.reduce((sum, c) => sum + c._count.orders, 0)}
                                </p>
                                <p className="text-sm text-soft-gray">Total Orders</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    ${(customers.reduce((sum, c) => sum + c.orders.reduce((s, o) => s + o.total, 0), 0) / 100).toFixed(2)}
                                </p>
                                <p className="text-sm text-soft-gray">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
