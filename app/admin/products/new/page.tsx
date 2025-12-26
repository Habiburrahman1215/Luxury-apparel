import { Metadata } from 'next/types'
import ProductForm from '@/components/admin/ProductForm'

export const metadata: Metadata = {
    title: 'Add New Product',
}

export default function NewProductPage() {
    return (
        <div className="container-luxury max-w-4xl">
            <h1 className="font-serif text-4xl mb-8">Add New Product</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <ProductForm />
            </div>
        </div>
    )
}
