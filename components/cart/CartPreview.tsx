'use client'

import { useCartStore } from '@/lib/store/cart-store'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { buttonVariants } from '../ui/button-variants'

export default function CartPreview({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) {
    const { items, removeItem, getTotal } = useCartStore()

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    onMouseEnter={() => setIsOpen(true)}
                    onMouseLeave={() => setIsOpen(false)}
                    className="absolute right-0 top-full mt-2 w-96 bg-ivory border border-charcoal/10 shadow-2xl z-[60] overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-serif text-lg uppercase tracking-widest">Your Bag</h3>
                            <span className="text-xs text-soft-gray uppercase tracking-widest">
                                {items.length} {items.length === 1 ? 'Item' : 'Items'}
                            </span>
                        </div>

                        {items.length === 0 ? (
                            <div className="py-12 text-center">
                                <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-charcoal/20" />
                                <p className="text-soft-gray font-light uppercase tracking-widest text-sm">
                                    Your bag is empty
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="max-h-[400px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                                    {items.map((item) => (
                                        <div key={item.variant.id} className="flex gap-4 group">
                                            <div className="relative h-24 w-20 flex-shrink-0 bg-stone/20 overflow-hidden">
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="text-sm uppercase tracking-wider font-medium line-clamp-1">
                                                            {item.product.name}
                                                        </h4>
                                                        <button
                                                            onClick={() => removeItem(item.variant.id)}
                                                            className="text-soft-gray hover:text-charcoal transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-soft-gray mt-1 uppercase tracking-widest">
                                                        {item.variant.color} / {item.variant.size}
                                                    </p>
                                                    <p className="text-xs text-soft-gray mt-1 uppercase tracking-widest">
                                                        Qty: {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-medium">
                                                    {formatPrice((item.variant.price || item.product.price) * item.quantity)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 pt-6 border-t border-charcoal/10">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-serif text-charcoal uppercase tracking-widest">Subtotal</span>
                                        <span className="text-lg font-medium">{formatPrice(getTotal())}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Link
                                            href="/cart"
                                            className={buttonVariants({ variant: 'outline', size: 'md' })}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            View Bag
                                        </Link>
                                        <Link
                                            href="/checkout"
                                            className={buttonVariants({ variant: 'gold', size: 'md' })}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Checkout
                                        </Link>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Creative element: bottom gradient line */}
                    <div className="h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
