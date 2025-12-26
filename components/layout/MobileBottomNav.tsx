'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useSession } from 'next-auth/react'

export default function MobileBottomNav() {
    const pathname = usePathname()
    const { getItemCount } = useCartStore()
    const { items: wishlistItems } = useWishlistStore()
    const { data: session } = useSession()

    const cartCount = getItemCount()

    // Don't show on admin or auth pages
    if (pathname?.startsWith('/admin') || pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
        return null
    }

    const navItems = [
        {
            name: 'Home',
            href: '/',
            icon: Home,
            isActive: pathname === '/',
        },
        {
            name: 'Search',
            href: '/search',
            icon: Search,
            isActive: pathname === '/search',
        },
        {
            name: 'Cart',
            href: '/cart',
            icon: ShoppingBag,
            badge: cartCount,
            isActive: pathname === '/cart',
        },
        {
            name: 'Wishlist',
            href: '/account/wishlist',
            icon: Heart,
            badge: wishlistItems.length,
            isActive: pathname === '/account/wishlist',
        },
        {
            name: 'Account',
            href: session ? '/account' : '/login',
            icon: User,
            isActive: pathname?.startsWith('/account'),
        },
    ]

    return (
        <nav className="mobile-break:hidden fixed bottom-0 left-0 right-0 z-50 bg-ivory border-t border-charcoal/10 safe-area-inset-bottom">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center justify-center min-w-0 flex-1 py-2 transition-colors ${item.isActive
                                ? 'text-charcoal'
                                : 'text-charcoal/60 hover:text-charcoal'
                                }`}
                        >
                            <div className="relative">
                                <Icon className="h-5 w-5" />
                                {item.badge && item.badge > 0 ? (
                                    <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-charcoal text-ivory text-xs flex items-center justify-center">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                ) : null}
                            </div>
                            <span className={`text-xs mt-1 ${item.isActive ? 'font-medium' : ''}`}>
                                {item.name}
                            </span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}
