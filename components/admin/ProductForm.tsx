'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Product, Gender } from '@prisma/client'
import { toast } from 'react-hot-toast'

const productSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().min(1, 'Description is required'),
    gender: z.enum(['MEN', 'WOMEN', 'UNISEX']),
    category: z.string().min(1, 'Category is required'),
    price: z.number().min(0, 'Price must be positive'),
    compareAtPrice: z.number().optional().nullable(),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    materials: z.string().optional(),
    careInstructions: z.string().optional(),
    featured: z.boolean().default(false),
    bestSeller: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

interface ProductFormProps {
    product?: Product
    onSuccess?: () => void
}

export default function ProductForm({ product, onSuccess }: ProductFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [imageUrls, setImageUrls] = useState<string[]>(product?.images || [])
    const [newImageUrl, setNewImageUrl] = useState('')
    const [newColorName, setNewColorName] = useState('')
    const [newColorHex, setNewColorHex] = useState('#000000')
    const [newSizeName, setNewSizeName] = useState('')
    const router = useRouter()

    const [colors, setColors] = useState<{ name: string, hex: string }[]>(
        (product?.colors as { name: string, hex: string }[]) || []
    )
    const [sizes, setSizes] = useState<string[]>(product?.sizes || [])
    const [variants, setVariants] = useState<any[]>((product as any)?.variants || [])

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: product ? {
            name: product.name,
            description: product.description,
            gender: product.gender,
            category: product.category,
            price: product.price / 100,
            compareAtPrice: product.compareAtPrice ? product.compareAtPrice / 100 : null,
            images: product.images,
            materials: product.materials || '',
            careInstructions: product.careInstructions || '',
            featured: product.featured,
            bestSeller: product.bestSeller,
            metaTitle: product.metaTitle || '',
            metaDescription: product.metaDescription || '',
        } : {
            gender: 'UNISEX',
            featured: false,
            bestSeller: false,
            price: 0,
            images: [],
        },
    })

    const addImage = () => {
        if (newImageUrl && !imageUrls.includes(newImageUrl)) {
            const updated = [...imageUrls, newImageUrl]
            setImageUrls(updated)
            setValue('images', updated)
            setNewImageUrl('')
        }
    }

    const removeImage = (index: number) => {
        const updated = imageUrls.filter((_, i) => i !== index)
        setImageUrls(updated)
        setValue('images', updated)
    }

    const addColor = (name: string, hex: string) => {
        if (!colors.find(c => c.name === name)) {
            setColors([...colors, { name, hex }])
        }
    }

    const removeColor = (name: string) => {
        setColors(colors.filter(c => c.name !== name))
    }

    const addSize = (size: string) => {
        if (!sizes.includes(size)) {
            setSizes([...sizes, size])
        }
    }

    const removeSize = (size: string) => {
        setSizes(sizes.filter(s => s !== size))
    }

    const generateVariants = () => {
        if (colors.length === 0 || sizes.length === 0) {
            toast.error('Please add at least one color and one size first')
            return
        }

        const nameSlug = product?.slug || 'new-product'
        const newVariants: any[] = []

        colors.forEach(color => {
            const colorSlug = color.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
            sizes.forEach(size => {
                const sizeSlug = size.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                const existing = variants.find(v => v.color === color.name && v.size === size)

                if (existing) {
                    newVariants.push(existing)
                } else {
                    newVariants.push({
                        color: color.name,
                        size,
                        sku: `${nameSlug}-${colorSlug}-${sizeSlug}`,
                        inventory: 0,
                        price: null,
                        images: []
                    })
                }
            })
        })

        setVariants(newVariants)
        toast.success(`${newVariants.length} variants generated`)
    }

    const updateVariant = (index: number, field: string, value: any) => {
        const updated = [...variants]
        updated[index] = { ...updated[index], [field]: value }
        setVariants(updated)
    }

    const onSubmit = async (data: ProductFormData) => {
        setIsLoading(true)
        setError('')

        try {
            const priceInCents = Math.round(data.price * 100)
            const compareAtPriceInCents = data.compareAtPrice
                ? Math.round(data.compareAtPrice * 100)
                : null

            const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

            const payload = {
                ...data,
                price: priceInCents,
                compareAtPrice: compareAtPriceInCents,
                slug: product ? product.slug : slug,
                images: imageUrls,
                colors,
                sizes,
                variants: variants.map(v => ({
                    id: v.id || undefined,
                    color: v.color,
                    size: v.size,
                    sku: v.sku || `${v.color}-${v.size}`,
                    inventory: parseInt(v.inventory?.toString() || '0') || 0,
                    price: (v.price && !isNaN(parseFloat(v.price.toString())))
                        ? Math.round(parseFloat(v.price.toString()) * 100)
                        : null,
                    images: Array.isArray(v.images) ? v.images : []
                }))
            }

            const url = product ? `/api/products/${product.id}` : '/api/products'
            const method = product ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errData = await response.json()
                throw new Error(errData.error || 'Failed to save product')
            }

            if (onSuccess) {
                toast.success('Product saved successfully')
                onSuccess()
            } else {
                toast.success('Product saved successfully')
                router.push('/admin/products')
                router.refresh()
            }
        } catch (err: any) {
            setError(err.message || 'Failed to save product. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12 pb-24">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Basic Info Section */}
            <section className="space-y-6">
                <h3 className="font-serif text-xl border-b pb-2">Basic Information</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <Input
                        label="Product Name"
                        {...register('name')}
                        error={errors.name?.message}
                    />

                    <div>
                        <label className="block text-sm font-medium mb-2">Gender</label>
                        <select
                            {...register('gender')}
                            className="input-field w-full"
                        >
                            <option value="MEN">Men</option>
                            <option value="WOMEN">Women</option>
                            <option value="UNISEX">Unisex</option>
                        </select>
                        {errors.gender && (
                            <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        {...register('description')}
                        rows={4}
                        className="input-field w-full"
                    />
                    {errors.description && (
                        <p className="text-red-600 text-sm mt-1">{errors.description.message}</p>
                    )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Input
                        label="Category"
                        {...register('category')}
                        error={errors.category?.message}
                        placeholder="e.g., Shirts, Dresses, Outerwear"
                    />

                    <Input
                        label="Materials"
                        {...register('materials')}
                        error={errors.materials?.message}
                        placeholder="e.g., 100% Cotton"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <Input
                        label="Base Price ($)"
                        type="number"
                        step="0.01"
                        {...register('price', { valueAsNumber: true })}
                        error={errors.price?.message}
                    />

                    <Input
                        label="Compare at Price ($)"
                        type="number"
                        step="0.01"
                        {...register('compareAtPrice', { valueAsNumber: true })}
                        error={errors.compareAtPrice?.message}
                    />
                </div>
            </section>

            {/* Media Section */}
            <section className="space-y-6">
                <h3 className="font-serif text-xl border-b pb-2">Global Images</h3>
                <div>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="url"
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="input-field flex-1"
                        />
                        <Button type="button" onClick={addImage} variant="secondary">
                            Add Image
                        </Button>
                    </div>
                    {imageUrls.length > 0 && (
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="relative group aspect-square">
                                    <img src={url} alt="" className="w-full h-full object-cover rounded" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {errors.images && (
                        <p className="text-red-600 text-sm mt-1">{errors.images.message}</p>
                    )}
                </div>
            </section>

            {/* Options Section */}
            <section className="space-y-6">
                <h3 className="font-serif text-xl border-b pb-2">Options (Colors & Sizes)</h3>

                <div className="grid md:grid-cols-2 gap-12">
                    <div>
                        <label className="block text-sm font-medium mb-2">Available Colors</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {colors.map((c) => (
                                <span key={c.name} className="inline-flex items-center gap-2 bg-stone/20 px-3 py-1 rounded-full text-sm">
                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c.hex }} />
                                    {c.name}
                                    <button type="button" onClick={() => removeColor(c.name)} className="text-soft-gray hover:text-red-600">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newColorName}
                                onChange={(e) => setNewColorName(e.target.value)}
                                placeholder="Color name"
                                className="input-field text-sm w-1/2"
                            />
                            <input
                                type="color"
                                value={newColorHex}
                                onChange={(e) => setNewColorHex(e.target.value)}
                                className="h-10 w-12 border rounded cursor-pointer"
                            />
                            <Button type="button" variant="secondary" onClick={() => {
                                if (newColorName) {
                                    addColor(newColorName, newColorHex)
                                    setNewColorName('')
                                }
                            }}>Add</Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Available Sizes</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {sizes.map((s) => (
                                <span key={s} className="inline-flex items-center gap-2 bg-stone/20 px-3 py-1 rounded-full text-sm">
                                    {s}
                                    <button type="button" onClick={() => removeSize(s)} className="text-soft-gray hover:text-red-600">&times;</button>
                                </span>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newSizeName}
                                onChange={(e) => setNewSizeName(e.target.value)}
                                placeholder="e.g., M, 42, XS"
                                className="input-field text-sm w-1/2"
                            />
                            <Button type="button" variant="secondary" onClick={() => {
                                if (newSizeName) {
                                    addSize(newSizeName)
                                    setNewSizeName('')
                                }
                            }}>Add</Button>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button type="button" variant="secondary" className="w-full" onClick={generateVariants}>
                        Update / Generate Variants
                    </Button>
                </div>
            </section>

            {/* Variants Section */}
            {variants.length > 0 && (
                <section className="space-y-6">
                    <h3 className="font-serif text-xl border-b pb-2">Variants Inventory & Pricing</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-stone/20 border-b">
                                <tr>
                                    <th className="py-2 px-4 text-left">Variant</th>
                                    <th className="py-2 px-4 text-left">SKU</th>
                                    <th className="py-2 px-4 text-left">Inventory</th>
                                    <th className="py-2 px-4 text-left">Custom Price ($)</th>
                                    <th className="py-2 px-4 text-left">Custom Images (URLs)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {variants.map((variant, idx) => (
                                    <tr key={idx}>
                                        <td className="py-2 px-4 whitespace-nowrap">
                                            <span className="font-medium">{variant.color} / {variant.size}</span>
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="text"
                                                value={variant.sku}
                                                onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                                                className="bg-transparent border-b border-charcoal/10 focus:border-gold outline-none w-full"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                value={variant.inventory}
                                                onChange={(e) => updateVariant(idx, 'inventory', e.target.value)}
                                                className="bg-transparent border-b border-charcoal/10 focus:border-gold outline-none w-24"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Default"
                                                value={variant.price || ''}
                                                onChange={(e) => updateVariant(idx, 'price', e.target.value)}
                                                className="bg-transparent border-b border-charcoal/10 focus:border-gold outline-none w-24"
                                            />
                                        </td>
                                        <td className="py-2 px-4">
                                            <textarea
                                                placeholder="Comma separated URLs"
                                                value={variant.images?.join(', ') || ''}
                                                onChange={(e) => updateVariant(idx, 'images', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                                                className="bg-transparent border-b border-charcoal/10 focus:border-gold outline-none w-full h-8 text-xs"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* SEO & Other */}
            <section className="space-y-6">
                <h3 className="font-serif text-xl border-b pb-2">SEO & Additional Info</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <Input
                        label="Meta Title (SEO)"
                        {...register('metaTitle')}
                        error={errors.metaTitle?.message}
                    />

                    <Input
                        label="Meta Description (SEO)"
                        {...register('metaDescription')}
                        error={errors.metaDescription?.message}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Care Instructions</label>
                    <textarea
                        {...register('careInstructions')}
                        rows={3}
                        className="input-field w-full"
                        placeholder="e.g., Machine wash cold, tumble dry low"
                    />
                </div>

                <div className="flex gap-6">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...register('featured')} className="h-4 w-4" />
                        <span className="text-sm">Featured Product</span>
                    </label>

                    <label className="flex items-center gap-2">
                        <input type="checkbox" {...register('bestSeller')} className="h-4 w-4" />
                        <span className="text-sm">Best Seller</span>
                    </label>
                </div>
            </section>

            <div className="flex gap-4 justify-end pt-6 border-t">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                    {product ? 'Update Product' : 'Create Product'}
                </Button>
            </div>
        </form>
    )
}
