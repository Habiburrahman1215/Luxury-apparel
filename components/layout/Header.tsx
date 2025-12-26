'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, Heart, User, Search, Menu } from 'lucide-react'
import { useCartStore } from '@/lib/store/cart-store'
import { useWishlistStore } from '@/lib/store/wishlist-store'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession } from 'next-auth/react'
import CartPreview from '@/components/cart/CartPreview'

interface HeaderProps {
  storeName?: string
}

export default function Header({ storeName = 'LUXURY APPAREL' }: HeaderProps) {
  const pathname = usePathname()
  const { getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { data: session } = useSession()

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const cartCount = getItemCount()

  const navigation = [
    { name: 'Women', href: '/shop/women' },
    { name: 'Men', href: '/shop/men' },
    { name: 'About', href: '/about' },
    { name: 'Sustainability', href: '/sustainability' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    setIsSearchOpen(false)
  }


  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur-sm border-b border-charcoal/10">
      <div className="container-luxury">
        <div className="flex items-center justify-between h-20 px-6 mobile-break:px-12">
          {/* Mobile menu button */}
          <button
            className="mobile-break:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <h1 className="font-serif text-2xl mobile-break:text-3xl tracking-tight">
              {storeName}
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden mobile-break:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm tracking-widest uppercase transition-colors ${pathname === item.href
                  ? 'text-charcoal'
                  : 'text-charcoal/60 hover:text-charcoal'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4 mobile-break:gap-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden mobile-break:block hover:text-gold transition-colors"
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link href="/account/wishlist" className="hidden mobile-break:block relative hover:text-gold transition-colors">
              <Heart className="h-5 w-5" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-charcoal text-ivory text-[10px] flex items-center justify-center">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            <div
              className="relative hidden mobile-break:block"
              onMouseEnter={() => pathname !== '/cart' && setIsCartOpen(true)}
              onMouseLeave={() => setIsCartOpen(false)}
            >
              <Link href="/cart" className="relative hover:text-gold transition-colors">
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-charcoal text-ivory text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              <CartPreview isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
            </div>

            <Link href={session ? '/account' : '/login'} className="hidden mobile-break:block hover:text-gold transition-colors">
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute inset-x-0 top-0 h-20 bg-ivory z-50 flex items-center px-6 mobile-break:px-12 border-b border-charcoal/10"
            >
              <form onSubmit={handleSearch} className="flex-1 max-w-7xl mx-auto flex items-center gap-4">
                <Search className="h-5 w-5 text-soft-gray" />
                <input
                  autoFocus
                  type="text"
                  placeholder="SEARCH FOR PRODUCTS, CATEGORIES..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-lg tracking-widest uppercase font-serif"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-sm tracking-widest uppercase hover:text-gold transition-colors"
                >
                  Close
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mobile-break:hidden border-t border-charcoal/10 overflow-hidden"
            >
              <nav className="flex flex-col py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-6 py-3 text-sm tracking-widest uppercase hover:bg-stone/20"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}