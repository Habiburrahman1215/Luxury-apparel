'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const settingsSchema = z.object({
    storeName: z.string().min(1, 'Store name is required'),
    storeEmail: z.string().email('Invalid email address'),
    supportEmail: z.string().email('Invalid email address'),
    shippingStandard: z.number().min(0, 'Must be positive'),
    shippingExpress: z.number().min(0, 'Must be positive'),
    freeShippingThreshold: z.number().min(0, 'Must be positive'),
    taxRate: z.number().min(0).max(100),
    orderEmails: z.boolean(),
    shippingEmails: z.boolean(),
    marketingEmails: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface SettingsFormProps {
    initialData: any // Using any to avoid strict type issues if Prisma types aren't fully generated yet
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            storeName: initialData?.storeName || '',
            storeEmail: initialData?.storeEmail || '',
            supportEmail: initialData?.supportEmail || '',
            // Convert cents to dollars for display
            shippingStandard: (initialData?.shippingStandard || 0) / 100,
            shippingExpress: (initialData?.shippingExpress || 0) / 100,
            freeShippingThreshold: (initialData?.freeShippingThreshold || 0) / 100,
            taxRate: initialData?.taxRate || 0,
            orderEmails: initialData?.orderEmails ?? true,
            shippingEmails: initialData?.shippingEmails ?? true,
            marketingEmails: initialData?.marketingEmails ?? true,
        },
    })

    async function onSubmit(data: SettingsFormValues) {
        setIsLoading(true)
        try {
            // Convert dollars back to cents for storage
            const payload = {
                ...data,
                shippingStandard: Math.round(data.shippingStandard * 100),
                shippingExpress: Math.round(data.shippingExpress * 100),
                freeShippingThreshold: Math.round(data.freeShippingThreshold * 100),
            }

            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error('Failed to update settings')
            }

            toast.success('Settings updated successfully')
            router.refresh()
        } catch (error) {
            toast.error('Something went wrong')
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Store Information */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl mb-4">Store Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Store Name</label>
                        <input
                            {...form.register('storeName')}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={isLoading}
                        />
                        {form.formState.errors.storeName && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.storeName.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Store Email</label>
                        <input
                            {...form.register('storeEmail')}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={isLoading}
                        />
                        {form.formState.errors.storeEmail && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.storeEmail.message}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Support Email</label>
                        <input
                            {...form.register('supportEmail')}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={isLoading}
                        />
                        {form.formState.errors.supportEmail && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.supportEmail.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Shipping Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl mb-4">Shipping (USD)</h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Standard Shipping Cost</label>
                            <input
                                type="number"
                                step="0.01"
                                {...form.register('shippingStandard', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={isLoading}
                            />
                            {form.formState.errors.shippingStandard && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.shippingStandard.message}</p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Express Shipping Cost</label>
                            <input
                                type="number"
                                step="0.01"
                                {...form.register('shippingExpress', { valueAsNumber: true })}
                                className="w-full px-3 py-2 border rounded-md"
                                disabled={isLoading}
                            />
                            {form.formState.errors.shippingExpress && (
                                <p className="text-red-500 text-sm mt-1">{form.formState.errors.shippingExpress.message}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Free Shipping Threshold</label>
                        <input
                            type="number"
                            step="0.01"
                            {...form.register('freeShippingThreshold', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-soft-gray mt-1">Orders over this amount get free shipping</p>
                        {form.formState.errors.freeShippingThreshold && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.freeShippingThreshold.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Tax Settings */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl mb-4">Tax</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Default Tax Rate (%)</label>
                        <input
                            type="number"
                            step="0.1"
                            {...form.register('taxRate', { valueAsNumber: true })}
                            className="w-full px-3 py-2 border rounded-md"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-soft-gray mt-1">Applied to all orders</p>
                        {form.formState.errors.taxRate && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.taxRate.message}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Email Notifications */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="font-serif text-2xl mb-4">Email Notifications</h2>
                <div className="space-y-3">
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...form.register('orderEmails')}
                            disabled={isLoading}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">Send order confirmation emails</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...form.register('shippingEmails')}
                            disabled={isLoading}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">Send shipping notification emails</span>
                    </label>
                    <label className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            {...form.register('marketingEmails')}
                            disabled={isLoading}
                            className="h-4 w-4"
                        />
                        <span className="text-sm">Send newsletter emails</span>
                    </label>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    )
}
