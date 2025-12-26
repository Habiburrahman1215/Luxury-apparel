// Enhanced search utility with fuzzy matching and relevance scoring
import { Product, ProductVariant } from '@prisma/client'

type ProductWithVariants = Product & { variants: ProductVariant[] }

interface SearchOptions {
    query?: string
    category?: string
    gender?: string
    minPrice?: number
    maxPrice?: number
    colors?: string[]
    sizes?: string[]
    featured?: boolean
    bestSeller?: boolean
}

interface SearchResult {
    product: ProductWithVariants
    score: number
    matchedFields: string[]
}

const RELATED_TERMS: Record<string, string[]> = {
    'shirt': ['top', 'blouse', 't-shirt', 'tee'],
    'pant': ['trouser', 'jean', 'slacks', 'bottom'],
    'dress': ['gown', 'frock'],
    'jacket': ['coat', 'outerwear', 'blazer'],
    'shoe': ['sneaker', 'boot', 'footwear', 'heel'],
    'bag': ['handbag', 'purse', 'tote'],
}

export function searchProducts(
    products: ProductWithVariants[],
    options: SearchOptions
): ProductWithVariants[] {
    const { query, category, gender, minPrice, maxPrice, colors, sizes, featured, bestSeller } = options

    let results: SearchResult[] = products.map(product => ({
        product,
        score: 0,
        matchedFields: [],
    }))

    // Apply filters first
    results = results.filter(({ product }) => {
        if (category && product.category !== category) return false
        if (gender && product.gender !== gender) return false
        if (featured !== undefined && product.featured !== featured) return false
        if (bestSeller !== undefined && product.bestSeller !== bestSeller) return false

        const productPrice = product.price / 100
        if (minPrice !== undefined && productPrice < minPrice) return false
        if (maxPrice !== undefined && productPrice > maxPrice) return false

        if (colors && colors.length > 0) {
            const productColors = Array.isArray(product.colors)
                ? (product.colors as any[]).map(c => c.name?.toLowerCase())
                : []
            if (!colors.some(color => productColors.includes(color.toLowerCase()))) return false
        }

        if (sizes && sizes.length > 0) {
            if (!sizes.some(size => product.sizes.includes(size))) return false
        }

        return true
    })

    // If no search query, return filtered results sorted by featured/bestseller/newest
    if (!query || query.trim() === '') {
        return results
            .sort((a, b) => {
                if (a.product.featured && !b.product.featured) return -1
                if (!a.product.featured && b.product.featured) return 1
                if (a.product.bestSeller && !b.product.bestSeller) return -1
                if (!a.product.bestSeller && b.product.bestSeller) return 1
                return new Date(b.product.createdAt).getTime() - new Date(a.product.createdAt).getTime()
            })
            .map(r => r.product)
    }

    // Search with scoring
    const queryLower = query.toLowerCase().trim()
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 1)

    results = results.map(({ product }) => {
        let score = 0
        const matchedFields: string[] = []
        const productNameLower = product.name.toLowerCase()
        const productCategoryLower = product.category.toLowerCase()
        const productDescriptionLower = product.description.toLowerCase()

        // Exact name match (highest priority)
        if (productNameLower === queryLower) {
            score += 200
            matchedFields.push('name-exact')
        }
        // Name contains full query
        else if (productNameLower.includes(queryLower)) {
            score += 100
            matchedFields.push('name-contains')
        }

        // Word-by-word matching
        let wordsMatched = 0
        queryWords.forEach(word => {
            let wordMatched = false
            if (productNameLower.includes(word)) {
                score += 40
                wordMatched = true
            }
            if (productCategoryLower.includes(word)) {
                score += 20
                wordMatched = true
            }

            // Check related terms
            Object.entries(RELATED_TERMS).forEach(([term, related]) => {
                if (word === term || related.includes(word)) {
                    if (productNameLower.includes(term) || productCategoryLower.includes(term)) {
                        score += 15
                        wordMatched = true
                    }
                }
            })

            if (wordMatched) wordsMatched++
        })

        // Multi-word bonus: if all words in query match, give a big boost
        if (queryWords.length > 1 && wordsMatched === queryWords.length) {
            score += 50
            matchedFields.push('all-words-match')
        }

        // Category direct match
        if (productCategoryLower === queryLower) {
            score += 80
            matchedFields.push('category-exact')
        }

        // Description match
        if (productDescriptionLower.includes(queryLower)) {
            score += 10
            matchedFields.push('description')
        }

        // Fuzzy matching for name (only if score is still low)
        if (score < 50) {
            const fuzzyScore = calculateFuzzyScore(queryLower, productNameLower)
            if (fuzzyScore > 0.7) {
                score += Math.round(fuzzyScore * 30)
                matchedFields.push('fuzzy')
            }
        }

        // Boosts
        if (product.featured) score += 10
        if (product.bestSeller) score += 10

        // Inventory boost: prioritize items with stock
        const totalStock = product.variants.reduce((acc, v) => acc + v.inventory, 0)
        if (totalStock > 0) score += 5
        if (totalStock > 10) score += 5

        // Newness boost: slightly boost newer items
        const daysOld = (Date.now() - new Date(product.createdAt).getTime()) / (1000 * 60 * 60 * 24)
        if (daysOld < 30) score += 10

        return { product, score, matchedFields }
    })

    // Filter out products with no matches and sort by score
    return results
        .filter(r => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(r => r.product)
}

// Simple fuzzy matching score (0 to 1)
function calculateFuzzyScore(s1: string, s2: string): number {
    const longer = s1.length > s2.length ? s1 : s2
    const shorter = s1.length > s2.length ? s2 : s1

    if (longer.length === 0) return 1.0

    const editDistance = levenshteinDistance(longer, shorter)
    return (longer.length - editDistance) / longer.length
}

// Levenshtein distance
function levenshteinDistance(s1: string, s2: string): number {
    const costs: number[] = []
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j
            } else if (j > 0) {
                let newValue = costs[j - 1]
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
                }
                costs[j - 1] = lastValue
                lastValue = newValue
            }
        }
        if (i > 0) costs[s2.length] = lastValue
    }
    return costs[s2.length]
}

// Get search suggestions based on partial query
export function getSearchSuggestions(
    products: ProductWithVariants[],
    query: string,
    limit: number = 5
): string[] {
    if (!query || query.length < 2) return []

    const queryLower = query.toLowerCase()
    const suggestions = new Set<string>()

    products.forEach(product => {
        // Product names
        if (product.name.toLowerCase().includes(queryLower)) {
            suggestions.add(product.name)
        }

        // Categories
        if (product.category.toLowerCase().includes(queryLower)) {
            suggestions.add(product.category)
        }

        // Materials
        if (product.materials?.toLowerCase().includes(queryLower)) {
            suggestions.add(product.materials)
        }
    })

    return Array.from(suggestions).slice(0, limit)
}
