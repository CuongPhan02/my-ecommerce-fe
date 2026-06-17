import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const MANAGEMENT_ROLES = [
  'ADMIN',
  'SUPER_ADMIN',
  'STAFF',
  'SALES',
  'INVENTORY',
  'VENDOR',
  'EDITOR',
]

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const userRole = request.cookies.get('userRole')?.value

  if (path === '/admin' || path === '/admin/') {
    if (isLoggedIn) {
      if (userRole && MANAGEMENT_ROLES.includes(userRole)) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }
      return NextResponse.redirect(new URL('/error-403', request.url))
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  const isAdminAuthRoute =
    path === '/admin/login' || path === '/admin/forgot-password'

  const isProtectedRoute =
    (path.startsWith('/dashboard') ||
      path.startsWith('/admin') ||
      path.startsWith('/profile')) &&
    !isAdminAuthRoute

  if (path === '/admin/login' && isLoggedIn) {
    if (userRole && MANAGEMENT_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  if (path === '/auth/sign-in' && isLoggedIn) {
    if (userRole && MANAGEMENT_ROLES.includes(userRole)) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isProtectedRoute) {
    if (!isLoggedIn) {
      if (path.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    if (
      path.startsWith('/admin') &&
      (!userRole || !MANAGEMENT_ROLES.includes(userRole))
    ) {
      return NextResponse.redirect(new URL('/error-403', request.url))
    }

    if (
      path.startsWith('/admin/system-settings') &&
      userRole !== 'SUPER_ADMIN'
    ) {
      return NextResponse.redirect(new URL('/error-403', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin',
    '/admin/:path*',
    '/auth/sign-in',
    '/profile/:path*',
  ],
}
