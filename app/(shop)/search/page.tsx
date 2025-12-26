'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Product, ProductVariant } from '@prisma/client'
import ProductCard from '@/components/shop/ProductCard'
import { Search as SearchIcon } from 'lucide-react'
import { searchProducts, getSearchSuggestions } from '@/lib/search'
import { buttonVariants } from '@/components/ui/button-variants'

type ProductWithVariants = Product & { variants: ProductVariant[] }

function SearchResults() {
    const searchParams = useSearchParams()
    const queryParam = searchParams.get('q') || ''

    const [searchQuery, setSearchQuery] = useState(queryParam)

    // Sync state with URL
    useEffect(() => {
        setSearchQuery(queryParam)
    }, [queryParam])
    const [products, setProducts] = useState<ProductWithVariants[]>([])
    const [allProducts, setAllProducts] = useState<ProductWithVariants[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Filters
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedGender, setSelectedGender] = useState('')
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])

    // Fetch all products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/products')
                const data = await response.json()
                setAllProducts(data)
            } catch (error) {
                console.error('Failed to fetch products:', error)
            }
        }
        fetchProducts()
    }, [])

    // Update suggestions as user types
    useEffect(() => {
        if (searchQuery.length >= 2) {
            const newSuggestions = getSearchSuggestions(allProducts, searchQuery, 5)
            setSuggestions(newSuggestions)
            setShowSuggestions(true)
        } else {
            setSuggestions([])
            setShowSuggestions(false)
        }
    }, [searchQuery, allProducts])

    // Search products
    const searchResults = useMemo(() => {
        return searchProducts(allProducts, {
            query: searchQuery,
            category: selectedCategory || undefined,
            gender: selectedGender || undefined,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        })
    }, [searchQuery, selectedCategory, selectedGender, priceRange, allProducts])

    const categories = useMemo(() => {
        return Array.from(new Set(allProducts.map(p => p.category)))
    }, [allProducts])

    const handleSuggestionClick = (suggestion: string) => {
        setSearchQuery(suggestion)
        setShowSuggestions(false)
    }

    return (
        <div className="min-h-screen section-padding">
            <div className="container-luxury">
                <h1 className="font-serif text-4xl md:text-5xl mb-8">Search</h1>

                {/* Search Input */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-soft-gray" />
                        <input
                            type="text"
                            placeholder="Search for products..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setShowSuggestions(true)}
                            className="w-full pl-12 pr-4 py-4 border border-charcoal/20 focus:border-charcoal focus:outline-none transition-colors"
                            autoFocus
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 bg-white border border-charcoal/20 mt-1 rounded shadow-lg z-10">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-4 py-3 hover:bg-stone/10 transition-colors"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <select
                        value={selectedGender}
                        onChange={(e) => setSelectedGender(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Genders</option>
                        <option value="MEN">Men</option>
                        <option value="WOMEN">Women</option>
                        <option value="UNISEX">Unisex</option>
                    </select>

                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="input-field"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-soft-gray">Price:</span>
                        <input
                            type="number"
                            value={priceRange[0]}
                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                            className="input-field w-24"
                            placeholder="Min"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                            className="input-field w-24"
                            placeholder="Max"
                        />
                    </div>
                </div>

                {/* Results */}
                {searchQuery.length >= 2 && searchResults.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-soft-gray">No results found for "{searchQuery}"</p>
                        <p className="text-sm text-soft-gray mt-2">
                            Try different keywords or browse our collections
                        </p>
                    </div>
                )}

                {searchResults.length > 0 && (
                    <div>
                        <p className="text-soft-gray mb-6">
                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                            {searchQuery && ` for "${searchQuery}"`}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {searchResults.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Searches when no query */}
                {searchQuery.length === 0 && (
                    <div>
                        <h2 className="font-serif text-2xl mb-6">Popular Searches</h2>
                        <div className="flex flex-wrap gap-3">
                            {['Cashmere', 'Silk Blouse', 'Wool Coat', 'Organic Cotton', 'Linen Dress', 'Leather Jacket'].map((term) => (
                                <button
                                    key={term}
                                    onClick={() => setSearchQuery(term)}
                                    className={buttonVariants({ variant: 'secondary', size: 'sm' })}
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
    )
}
