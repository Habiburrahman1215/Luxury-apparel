import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import { Package, ShoppingCart, Users, DollarSign } from 'lucide-react'
import RevenueChart from '@/components/admin/analytics/RevenueChart'
import CategoryChart from '@/components/admin/analytics/CategoryChart'
import TopProducts from '@/components/admin/analytics/TopProducts'
import { subDays, format } from 'date-fns'

async function getStats() {
  const [totalProducts, totalOrders, totalCustomers, revenueData] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: 'CUSTOMER' } }),
    prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalCustomers,
    totalRevenue: revenueData._sum.total || 0,
  }
}

async function getRevenueData() {
  const days = 30
  const data = []

  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const startOfDay = new Date(date.setHours(0, 0, 0, 0))
    const endOfDay = new Date(date.setHours(23, 59, 59, 999))

    const orders = await prisma.order.findMany({
      where: {
        paymentStatus: 'PAID',
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: { total: true },
    })

    const revenue = orders.reduce((sum, order) => sum + order.total, 0)

    data.push({
      date: format(date, 'MMM dd'),
      revenue,
    })
  }

  return data
}

async function getCategoryData() {
  const orders = await prisma.order.findMany({
    where: { paymentStatus: 'PAID' },
    include: {
      items: {
        include: { product: true },
      },
    },
  })

  const categoryStats: Record<string, { count: number; revenue: number }> = {}

  orders.forEach(order => {
    order.items.forEach(item => {
      const category = item.product.category
      if (!categoryStats[category]) {
        categoryStats[category] = { count: 0, revenue: 0 }
      }
      categoryStats[category].count += item.quantity
      categoryStats[category].revenue += item.price * item.quantity
    })
  })

  return Object.entries(categoryStats).map(([category, stats]) => ({
    category,
    value: stats.count,
    revenue: stats.revenue,
  }))
}

async function getTopProducts() {
  const orderItems = await prisma.orderItem.findMany({
    where: {
      order: {
        paymentStatus: 'PAID',
      },
    },
    include: {
      product: true,
      order: true,
    },
  })

  const productStats: Record<string, {
    product: any
    totalSold: number
    totalRevenue: number
  }> = {}

  orderItems.forEach(item => {
    const productId = item.productId
    if (!productStats[productId]) {
      productStats[productId] = {
        product: item.product,
        totalSold: 0,
        totalRevenue: 0,
      }
    }
    productStats[productId].totalSold += item.quantity
    productStats[productId].totalRevenue += item.price * item.quantity
  })

  return Object.values(productStats)
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 5)
    .map(stat => ({
      id: stat.product.id,
      name: stat.product.name,
      slug: stat.product.slug,
      category: stat.product.category,
      totalSold: stat.totalSold,
      totalRevenue: stat.totalRevenue,
      image: stat.product.images[0] || '',
    }))
}

async function getRecentOrders() {
  return await prisma.order.findMany({
    include: {
      items: {
        include: { product: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 5,
  })
}

export default async function AdminDashboard() {
  const [stats, revenueData, categoryData, topProducts, recentOrders] = await Promise.all([
    getStats(),
    getRevenueData(),
    getCategoryData(),
    getTopProducts(),
    getRecentOrders(),
  ])

  const statCards = [
    {
      name: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      name: 'Total Orders',
      value: stats.totalOrders.toString(),
      icon: ShoppingCart,
      color: 'text-blue-600',
    },
    {
      name: 'Total Products',
      value: stats.totalProducts.toString(),
      icon: Package,
      color: 'text-purple-600',
    },
    {
      name: 'Total Customers',
      value: stats.totalCustomers.toString(),
      icon: Users,
      color: 'text-orange-600',
    },
  ]

  return (
    <div className="container-luxury max-w-7xl">
      <h1 className="font-serif text-4xl mb-12">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-soft-gray">{stat.name}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <RevenueChart data={revenueData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Top Products and Recent Orders */}
      <div className="grid lg:grid-cols-2 gap-6 mb-12">
        <TopProducts products={topProducts} />

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-serif text-2xl mb-6">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center p-3 border-b border-charcoal/5 last:border-0">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-soft-gray">{order.email}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatPrice(order.total)}</p>
                  <span className={`text-xs px-2 py-1 rounded ${order.orderStatus === 'DELIVERED' ? 'bg-green-100 text-green-800' :
                    order.orderStatus === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}