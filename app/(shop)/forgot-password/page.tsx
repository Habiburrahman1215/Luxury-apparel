'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            if (response.ok) {
                setIsSubmitted(true)
            } else {
                const data = await response.json()
                toast.error(data.error || 'Failed to send reset link')
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
                <h1 className="font-serif text-3xl mb-4 text-center">Forgot Password</h1>

                {isSubmitted ? (
                    <div className="text-center">
                        <p className="text-soft-gray mb-8">
                            If an account exists for {email}, we've sent a password reset link. Please check your inbox.
                        </p>
                        <Link href="/login">
                            <Button variant="secondary" className="w-full">Back to Login</Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="text-soft-gray mb-8 text-center text-sm">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-widest">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <Button type="submit" className="w-full" isLoading={isLoading}>
                                Send Reset Link
                            </Button>

                            <div className="text-center">
                                <Link href="/login" className="text-sm text-soft-gray hover:text-charcoal transition-colors">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    )
}
