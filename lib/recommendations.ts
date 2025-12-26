// Personalized recommendation engine
import { Product, ProductVariant } from '@prisma/client'

type ProductWithVariants = Product & { variants: ProductVariant[] }

interface UserActivity {
    viewedProducts: string[] // product IDs
    wishlistItems: string[]
    purchasedProducts: string[]
    categories: string[]
    colors: string[]
}

export function getPersonalizedRecommendations(
    allProducts: ProductWithVariants[],
    userActivity: UserActivity,
    currentProductId?: string,
    limit: number = 6
): ProductWithVariants[] {
    // Exclude current product and already viewed
    let candidates = allProducts.filter(p =>
        p.id !== currentProductId &&
        !userActivity.viewedProducts.includes(p.id)
    )

    if (candidates.length === 0) {
        candidates = allProducts.filter(p => p.id !== currentProductId)
    }

    // Score each product based on user preferences
    const scoredProducts = candidates.map(product => {
        let score = 0

        // Category preference (highest weight)
        if (userActivity.categories.includes(product.category)) {
            score += 40
        }

        // Color preference
        const productColors = Array.isArray(product.colors)
            ? (product.colors as any[]).map(c => c.name)
            : []
        const matchingColors = productColors.filter(c =>
            userActivity.colors.includes(c)
        )
        score += matchingColors.length * 15

        // Gender matching (if user has a clear preference)
        const genderCounts = allProducts
            .filter(p => userActivity.viewedProducts.includes(p.id))
            .reduce((acc, p) => {
                acc[p.gender] = (acc[p.gender] || 0) + 1
                return acc
            }, {} as Record<string, number>)

        const preferredGender = Object.entries(genderCounts)
            .sort(([, a], [, b]) => b - a)[0]?.[0]

        if (preferredGender && product.gender === preferredGender) {
            score += 20
        }

        // Price range preference
        const viewedPrices = allProducts
            .filter(p => userActivity.viewedProducts.includes(p.id))
            .map(p => p.price)

        if (viewedPrices.length > 0) {
            const avgPrice = viewedPrices.reduce((a, b) => a + b, 0) / viewedPrices.length
            const priceDiff = Math.abs(product.price - avgPrice)
            const priceScore = Math.max(0, 20 - (priceDiff / avgPrice) * 20)
            score += priceScore
        }

        // Boost featured and bestsellers slightly
        if (product.featured) score += 5
        if (product.bestSeller) score += 5

        // Boost if in user's wishlist categories
        const wishlistProducts = allProducts.filter(p =>
            userActivity.wishlistItems.includes(p.id)
        )
        const wishlistCategories = wishlistProducts.map(p => p.category)
        if (wishlistCategories.includes(product.category)) {
            score += 25
        }

        return { product, score }
    })

    // Sort by score and return top items
    return scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.product)
}

export function getSimilarProducts(
    currentProduct: ProductWithVariants,
    allProducts: ProductWithVariants[],
    limit: number = 4
): ProductWithVariants[] {
    const candidates = allProducts.filter(p => p.id !== currentProduct.id)

    const scoredProducts = candidates.map(product => {
        let score = 0

        // Same category (highest priority)
        if (product.category === currentProduct.category) {
            score += 50
        }

        // Same gender
        if (product.gender === currentProduct.gender) {
            score += 30
        }

        // Similar price range (within 30%)
        const priceDiff = Math.abs(product.price - currentProduct.price)
        const priceRatio = priceDiff / currentProduct.price
        if (priceRatio < 0.3) {
            score += 20
        }

        // Similar colors
        const currentColors = Array.isArray(currentProduct.colors)
            ? (currentProduct.colors as any[]).map(c => c.name)
            : []
        const productColors = Array.isArray(product.colors)
            ? (product.colors as any[]).map(c => c.name)
            : []
        const commonColors = currentColors.filter(c => productColors.includes(c))
        score += commonColors.length * 10

        // Same materials
        if (product.materials && product.materials === currentProduct.materials) {
            score += 15
        }

        return { product, score }
    })

    return scoredProducts
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(item => item.product)
}

export function getFrequentlyBoughtTogether(
    productId: string,
    orderHistory: any[], // Array of orders with items
    allProducts: ProductWithVariants[],
    limit: number = 3
): ProductWithVariants[] {
    // Find orders containing this product
    const relatedOrders = orderHistory.filter(order =>
        order.items.some((item: any) => item.productId === productId)
    )

    // Count how often other products appear with this one
    const productCounts: Record<string, number> = {}

    relatedOrders.forEach(order => {
        order.items.forEach((item: any) => {
            if (item.productId !== productId) {
                productCounts[item.productId] = (productCounts[item.productId] || 0) + 1
            }
        })
    })

    // Sort by frequency and get products
    const topProductIds = Object.entries(productCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([id]) => id)

    return allProducts.filter(p => topProductIds.includes(p.id))
}
