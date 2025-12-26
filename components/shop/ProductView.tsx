'use client'

import { useState, useEffect } from 'react'
import { Product, ProductVariant } from '@prisma/client'
import ProductImageGallery from './ProductImageGallery'
import ProductDetails from './ProductDetails'

interface ProductViewProps {
    product: Product & { variants: ProductVariant[] }
}

export default function ProductView({ product }: ProductViewProps) {
    const [selectedColor, setSelectedColor] = useState('')
    const [selectedSize, setSelectedSize] = useState('')
    const [displayImages, setDisplayImages] = useState<string[]>(product.images)

    // Find selected variant
    const selectedVariant = product.variants.find(
        (v: any) => v.color === selectedColor && v.size === selectedSize
    ) as any

    useEffect(() => {
        if (selectedVariant?.images && selectedVariant.images.length > 0) {
            setDisplayImages(selectedVariant.images)
        } else {
            setDisplayImages(product.images)
        }
    }, [selectedVariant, product.images])

    return (
        <div className="grid md:grid-cols-2 gap-12">
            <ProductImageGallery images={displayImages} productName={product.name} />
            <ProductDetails
                product={product}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
            />
        </div>
    )
}
