import { Product, User, Order, ProductVariant } from '@prisma/client'

export type ProductWithVariants = Product & {
  variants: ProductVariant[]
}

export type CartItem = {
  product: Product
  variant: ProductVariant
  quantity: number
}

export type WishlistProduct = {
  id: string
  product: Product
}

export interface FilterOptions {
  gender?: 'MEN' | 'WOMEN' | 'UNISEX'
  category?: string
  colors?: string[]
  sizes?: string[]
  priceRange?: [number, number]
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name'
}

export interface CheckoutFormData {
  email: string
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