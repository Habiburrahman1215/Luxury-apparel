'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [passwords, setPasswords] = useState({
        password: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!token) {
            toast.error('Invalid reset link')
            router.push('/login')
        }
    }, [token, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwords.password !== passwords.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        if (passwords.password.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: passwords.password,
                }),
            })

            const data = await response.json()
            if (response.ok) {
                toast.success('Password reset successfully')
                router.push('/login')
            } else {
                toast.error(data.error || 'Failed to reset password')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center section-padding bg-stone/10">
            <div className="max-w-md w-full bg-ivory p-8 md:p-12 border border-charcoal/10 shadow-sm">
                <h1 className="font-serif text-3xl mb-4 text-center">Reset Password</h1>
                <p className="text-soft-gray mb-8 text-center text-sm">
                    Please enter your new password below.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest">New Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={passwords.password}
                            onChange={(e) => setPasswords({ ...passwords, password: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest">Confirm New Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={passwords.confirmPassword}
                            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Reset Password
                    </Button>
                </form>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-2 border-charcoal border-t-transparent rounded-full" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
