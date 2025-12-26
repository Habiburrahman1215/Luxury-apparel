'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, LogOut, Instagram, Share2, Ticket } from 'lucide-react'

export default function AdminNav() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Instagram', href: '/admin/instagram', icon: Instagram },
    { name: 'Social', href: '/admin/social', icon: Share2 },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <nav className="bg-charcoal text-ivory print:hidden">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-16 px-6">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="font-serif text-xl">
              ADMIN
            </Link>

            <div className="hidden mobile-break:flex gap-6">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm ${pathname === item.href
                      ? 'text-gold'
                      : 'text-ivory/60 hover:text-ivory'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-ivory/60 hover:text-ivory">
              View Site
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center gap-2 text-sm text-ivory/60 hover:text-ivory"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}