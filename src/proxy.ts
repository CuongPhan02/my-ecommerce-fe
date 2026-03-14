// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname

  // Check flag cookies
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const userRole = request.cookies.get('userRole')?.value

  console.log(
    `---> [Middleware] Request tới: ${path} | LoggedIn: ${isLoggedIn} | Role: ${userRole}`,
  )

  // 1. Kiểm tra các vùng bảo vệ
  const isProtectedRoute =
    path.startsWith('/dashboard') ||
    path.startsWith('/admin') ||
    path.startsWith('/profile')

  // 1.1 Nếu vào trang Sign-in mà đã có Token -> Về trang chủ
  if (path === '/auth/sign-in' && isLoggedIn) {
    if (
      userRole === 'ADMIN' ||
      userRole === 'SUPER_ADMIN' ||
      userRole === 'STAFF'
    ) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 2. CHẶN PHÂN QUYỀN (USER vs ADMIN)
  if (isProtectedRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/auth/sign-in', request.url))
    }

    // LOGIN PHÂN QUYỀN
    if (path.startsWith('/admin')) {
      // chỉ admin và super admin (và staff nếu cần) mới được vào
      if (
        userRole !== 'ADMIN' &&
        userRole !== 'SUPER_ADMIN' &&
        userRole !== 'STAFF'
      ) {
        return NextResponse.redirect(new URL('/error-403', request.url))
      }
    }

    // Bạn có thể thêm các vùng chỉ dành riêng cho SUPER-ADMIN ở đây
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
    /*
     * 1. Áp dụng cho các route cụ thể mà bạn đang xử lý logic:
     */
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/sign-in',
    '/profile',

    /*
     * 2. Loại trừ các file hệ thống để tăng tốc độ tải trang (Optional nhưng nên dùng):
     * Đoạn regex dưới đây giúp Middleware KHÔNG chạy vào:
     * - _next/static (file js/css tĩnh)
     * - _next/image (ảnh tối ưu)
     * - favicon.ico (icon trình duyệt)
     * - public (các file trong thư mục public như robots.txt)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
