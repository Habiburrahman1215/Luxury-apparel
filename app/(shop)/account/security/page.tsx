'use client'

import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Button from '@/components/ui/Button'

export default function SecurityPage() {
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    })
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match')
            return
        }

        if (passwords.newPassword.length < 8) {
            toast.error('Password must be at least 8 characters')
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/account/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    currentPassword: passwords.currentPassword,
                    newPassword: passwords.newPassword,
                }),
            })

            const data = await response.json()
            if (response.ok) {
                toast.success('Password updated successfully')
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                toast.error(data.error || 'Failed to update password')
            }
        } catch (error) {
            toast.error('Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-md mx-auto py-12 px-6">
            <h1 className="font-serif text-3xl mb-8">Security Settings</h1>
            <p className="text-soft-gray mb-8">Change your password to keep your account secure.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest">Current Password</label>
                    <input
                        type="password"
                        required
                        className="input-field"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest">New Password</label>
                    <input
                        type="password"
                        required
                        className="input-field"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
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
                    Update Password
                </Button>
            </form>
        </div>
    )
}
