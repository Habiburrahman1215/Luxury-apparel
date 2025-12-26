import { Metadata } from 'next'
import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Register',
  description: 'Create your account',
}

export default function RegisterPage() {
  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="font-serif text-4xl mb-2">Create Account</h1>
        <p className="text-soft-gray">Join our community</p>
      </div>

      <RegisterForm />

      <p className="text-center mt-6 text-sm text-soft-gray">
        Already have an account?{' '}
        <Link href="/login" className="text-charcoal font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}