import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { pathname } = req.nextUrl

  // In development, allow all access (dev bypass is in tRPC context)
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/inloggen' || pathname.startsWith('/inloggen/') || pathname === '/registreren') {
    if (req.auth) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    return NextResponse.next()
  }

  // Protect admin and business routes in production
  if (pathname.startsWith('/admin') || pathname.startsWith('/business')) {
    if (!req.auth) {
      return NextResponse.redirect(new URL('/inloggen', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/business/:path*', '/inloggen/:path*', '/registreren'],
}
