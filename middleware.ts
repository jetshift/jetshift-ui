import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const { pathname } = request.nextUrl

    // Don't protect the login route
    if (pathname.startsWith('/login') || pathname.startsWith('/_next')) {
        return NextResponse.next()
    }

    // Protect everything else
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next|favicon.ico).*)'], // Match all routes except API, _next, favicon
}
