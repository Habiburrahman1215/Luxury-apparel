import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/login') || 
                       req.nextUrl.pathname.startsWith('/register')
    const isAccountPage = req.nextUrl.pathname.startsWith('/account')
    const isAdminPage = req.nextUrl.pathname.startsWith('/admin')

    // Redirect authenticated users away from auth pages
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/account', req.url))
    }

    // Protect account pages
    if (isAccountPage && !isAuth) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // Protect admin pages
    if (isAdminPage) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Handle authorization in middleware function
    },
  }
)

export const config = {
  matcher: ['/account/:path*', '/admin/:path*', '/login', '/register'],
}