import {NextResponse} from 'next/server'
import type {NextRequest} from 'next/server'

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value
    const refreshToken = request.cookies.get('refresh_token')?.value
    const {pathname} = request.nextUrl

    // Allow public paths
    if (pathname.startsWith('/login') || pathname.startsWith('/_next')) {
        return NextResponse.next()
    }

    // If no token but refresh token exists, attempt refresh
    if (!token && refreshToken) {
        try {
            const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({refresh: refreshToken}),
            })

            if (refreshRes.ok) {
                const data = await refreshRes.json()
                const response = NextResponse.next()

                const isProd = process.env.APP_ENV === 'production'
                const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost'
                const cookieSameSite = (process.env.COOKIE_SAMESITE || 'lax') as 'lax' | 'strict' | 'none'

                response.cookies.set('auth_token', data.access, {
                    httpOnly: true,
                    secure: isProd,
                    sameSite: cookieSameSite,
                    domain: cookieDomain,
                    path: '/',
                    maxAge: 60 * 30, // 30 minutes
                })

                return response
            }
        } catch (err) {
            console.error('Token refresh failed:', err)
        }
    }

    // If no valid tokens, redirect to login
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

// Match all routes except API, _next, favicon
export const config = {
    matcher: ['/((?!api|_next|public|favicon.ico).*)'],
}
