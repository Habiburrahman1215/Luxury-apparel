import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistStore {
  items: string[] // product IDs
  addItem: (productId: string) => void
  removeItem: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
  syncWithServer: () => Promise<void>
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (productId) => {
        set((state) => ({
          items: [...new Set([...state.items, productId])],
        }))

        try {
          await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
          })
        } catch (error) {
          console.error('Failed to sync wishlist addition')
        }
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }))

        try {
          await fetch(`/api/wishlist?productId=${productId}`, {
            method: 'DELETE',
          })
        } catch (error) {
          console.error('Failed to sync wishlist removal')
        }
      },

      isInWishlist: (productId) => {
        return get().items.includes(productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },
      syncWithServer: async () => {
        try {
          const response = await fetch('/api/wishlist')
          const data = await response.json()
          if (data.items) {
            set({ items: data.items })
          }
        } catch (error) {
          console.error('Failed to sync wishlist with server', error)
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
)