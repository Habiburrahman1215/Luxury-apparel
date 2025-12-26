'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/lib/store/cart-store'

export default function CartSync() {
    const { items, syncCart } = useCartStore()
    const hasSynced = useRef(false)

    useEffect(() => {
        // Only sync once per session/mount to avoid spamming
        // In a real app, you might want more complex logic (e.g. sync on focus or interval)
        if (hasSynced.current || items.length === 0) return

        const syncItems = async () => {
            try {
                const payload = items.map((item) => ({
                    productId: item.product.id,
                    variantId: item.variant.id,
                }))

                const response = await fetch('/api/cart/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: payload }),
                })

                if (!response.ok) throw new Error('Failed to sync cart')

                const data = await response.json()
                if (data.items) {
                    syncCart(data.items)
                    hasSynced.current = true
                }
            } catch (error) {
                console.error('Cart sync failed:', error)
            }
        }

        syncItems()
    }, [items, syncCart])

    return null
}
