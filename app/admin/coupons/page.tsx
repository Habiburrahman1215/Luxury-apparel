'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Ticket, Calendar, Users as UsersIcon, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { format } from 'date-fns'

interface Coupon {
    id: string
    code: string
    discountType: 'PERCENT' | 'FIXED'
    value: number
    expiresAt: string | null
    usageLimit: number | null
    usageCount: number
    isActive: boolean
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const [newCoupon, setNewCoupon] = useState({
        code: '',
        discountType: 'PERCENT',
        value: 0,
        expiresAt: '',
        usageLimit: '',
        isActive: true,
    })

    useEffect(() => {
        fetchCoupons()
    }, [])

    const fetchCoupons = async () => {
        try {
            const response = await fetch('/api/admin/coupons')
            const data = await response.json()
            setCoupons(data)
        } catch (error) {
            toast.error('Failed to fetch coupons')
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/admin/coupons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newCoupon,
                    value: Number(newCoupon.value),
                    usageLimit: newCoupon.usageLimit ? Number(newCoupon.usageLimit) : null,
                }),
            })
            if (!response.ok) throw new Error()
            toast.success('Coupon created successfully')
            setIsAdding(false)
            setNewCoupon({ code: '', discountType: 'PERCENT', value: 0, expiresAt: '', usageLimit: '', isActive: true })
            fetchCoupons()
        } catch (error) {
            toast.error('Failed to create coupon')
        }
    }

    const handleToggle = async (coupon: Coupon) => {
        try {
            const response = await fetch('/api/admin/coupons', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: coupon.id, isActive: !coupon.isActive }),
            })
            if (!response.ok) throw new Error()
            toast.success(`Coupon ${!coupon.isActive ? 'activated' : 'deactivated'}`)
            fetchCoupons()
        } catch (error) {
            toast.error('Failed to update coupon')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return
        try {
            const response = await fetch(`/api/admin/coupons?id=${id}`, {
                method: 'DELETE',
            })
            if (!response.ok) throw new Error()
            toast.success('Coupon deleted')
            fetchCoupons()
        } catch (error) {
            toast.error('Failed to delete coupon')
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-serif mb-2">Coupons</h1>
                    <p className="text-soft-gray">Manage discount codes and promotions</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 bg-charcoal text-ivory px-4 py-2 hover:bg-charcoal/90 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Coupon
                </button>
            </div>

            {isAdding && (
                <div className="bg-stone/10 p-6 mb-8 border border-charcoal/10">
                    <h2 className="font-serif text-lg mb-4">New Coupon</h2>
                    <form onSubmit={handleCreate} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Code</label>
                            <input
                                type="text"
                                required
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none uppercase"
                                value={newCoupon.code}
                                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                                placeholder="LUXURY20"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Type</label>
                            <select
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newCoupon.discountType}
                                onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                            >
                                <option value="PERCENT">Percentage (%)</option>
                                <option value="FIXED">Fixed Amount ($)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Value ({newCoupon.discountType === 'PERCENT' ? '%' : 'Cents'})</label>
                            <input
                                type="number"
                                required
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newCoupon.value}
                                onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Expiry Date</label>
                            <input
                                type="date"
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newCoupon.expiresAt}
                                onChange={(e) => setNewCoupon({ ...newCoupon, expiresAt: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest">Usage Limit (Optional)</label>
                            <input
                                type="number"
                                className="w-full bg-ivory border border-charcoal/20 p-2 focus:border-charcoal outline-none"
                                value={newCoupon.usageLimit}
                                onChange={(e) => setNewCoupon({ ...newCoupon, usageLimit: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-4 items-end">
                            <button
                                type="submit"
                                className="bg-gold text-ivory px-6 py-2 hover:bg-gold/90 transition-colors h-10 flex-1"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="text-soft-gray px-6 py-2 hover:text-charcoal transition-colors h-10"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {isLoading ? (
                <div className="text-center py-12">Loading...</div>
            ) : coupons.length === 0 ? (
                <div className="text-center py-12 bg-stone/5 border border-dashed border-charcoal/20">
                    <Ticket className="h-12 w-12 mx-auto mb-4 text-charcoal/10" />
                    <p className="text-soft-gray">No coupons found</p>
                </div>
            ) : (
                <div className="bg-ivory border border-charcoal/10 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-charcoal/10 bg-stone/5">
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Code</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Discount</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Usage</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Expiry</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-xs uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-charcoal/5">
                            {coupons.map((coupon) => (
                                <tr key={coupon.id} className="hover:bg-stone/5 transition-colors">
                                    <td className="px-6 py-4 font-bold tracking-widest text-gold">{coupon.code}</td>
                                    <td className="px-6 py-4">
                                        {coupon.discountType === 'PERCENT'
                                            ? `${coupon.value}% OFF`
                                            : `$${(coupon.value / 100).toFixed(2)} OFF`}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-soft-gray">
                                        <div className="flex items-center gap-1">
                                            <UsersIcon className="h-3 w-3" />
                                            {coupon.usageCount} / {coupon.usageLimit || '∞'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-soft-gray">
                                        {coupon.expiresAt ? (
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {format(new Date(coupon.expiresAt), 'MMM dd, yyyy')}
                                            </div>
                                        ) : 'No expiry'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggle(coupon)}
                                            className={`flex items-center gap-2 text-xs uppercase tracking-widest font-medium ${coupon.isActive ? 'text-green-600' : 'text-red-400'}`}
                                        >
                                            {coupon.isActive ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : (
                                                <XCircle className="h-4 w-4" />
                                            )}
                                            {coupon.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(coupon.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 transition-colors rounded"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
