import { Metadata } from 'next'
import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Sign in to your account',
}

export default function LoginPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl mb-2">Welcome Back</h1>
        <p className="text-soft-gray">Sign in to your account</p>
      </div>

      <LoginForm />

      <p className="text-center mt-6 text-sm text-soft-gray">
        Don't have an account?{' '}
        <Link href="/register" className="text-charcoal font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}