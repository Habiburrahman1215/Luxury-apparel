import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'
import { Product, ProductVariant } from '@prisma/client'

interface Coupon {
  code: string
  discountType: 'PERCENT' | 'FIXED'
  value: number
}

interface CartStore {
  items: CartItem[]
  coupon: Coupon | null
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
  getDiscount: () => number
  applyCoupon: (coupon: Coupon) => void
  removeCoupon: () => void
  syncCart: (updatedItems: any[]) => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,

      addItem: (product, variant, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.variant.id === variant.id
          )

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.variant.id === variant.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            }
          }

          return {
            items: [...state.items, { product, variant, quantity }],
          }
        })
      },

      removeItem: (variantId) => {
        set((state) => ({
          items: state.items.filter((item) => item.variant.id !== variantId),
        }))
      },

      updateQuantity: (variantId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.variant.id === variantId ? { ...item, quantity } : item
          ),
        }))
      },

      clearCart: () => {
        set({ items: [], coupon: null })
      },

      getDiscount: () => {
        const { items, coupon } = get()
        if (!coupon) return 0

        const subtotal = items.reduce((total, item) => {
          const price = (item.variant as any).price || item.product.price
          return total + price * item.quantity
        }, 0)

        if (coupon.discountType === 'PERCENT') {
          return Math.round(subtotal * (coupon.value / 100))
        } else {
          return coupon.value
        }
      },

      getTotal: () => {
        const { items } = get()
        const subtotal = items.reduce(
          (total, item) => {
            const price = (item.variant as any).price || item.product.price
            return total + price * item.quantity
          },
          0
        )
        const discount = get().getDiscount()
        return Math.max(0, subtotal - discount)
      },

      getItemCount: () => {
        const { items } = get()
        return items.reduce((count, item) => count + item.quantity, 0)
      },

      applyCoupon: (coupon) => {
        set({ coupon })
      },

      removeCoupon: () => {
        set({ coupon: null })
      },

      syncCart: (updatedItems: any[]) => {
        set((state) => {
          const newItems = state.items
            .map((item) => {
              const update = updatedItems.find(
                (u) => u.variantId === item.variant.id
              )

              if (!update) return item
              if (update.removed) return null

              return {
                ...item,
                product: {
                  ...item.product,
                  name: update.name,
                  price: update.price,
                  images: [update.image, ...item.product.images.slice(1)], // Update primary image
                },
                variant: {
                  ...item.variant,
                  price: update.price, // Update variant price if applicable
                  inventory: update.inventory,
                },
              }
            })
            .filter(Boolean) as CartItem[]

          return { items: newItems }
        })
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)