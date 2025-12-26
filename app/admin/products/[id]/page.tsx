import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProductForm from '@/components/admin/ProductForm'

export const metadata = {
    title: 'Edit Product',
}

async function getProduct(id: string) {
    return await prisma.product.findUnique({
        where: { id },
        include: { variants: true },
    })
}

export default async function EditProductPage({
    params,
}: {
    params: { id: string }
}) {
    const product = await getProduct(params.id)

    if (!product) {
        notFound()
    }

    return (
        <div className="container-luxury max-w-4xl">
            <h1 className="font-serif text-4xl mb-8">Edit Product</h1>
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <ProductForm product={product} />
            </div>
        </div>
    )
}
