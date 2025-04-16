import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const data = await res.json()

    const isProd = process.env.APP_ENV === 'production'
    const cookieDomain = process.env.COOKIE_DOMAIN || 'localhost'
    const cookieSameSite = (process.env.COOKIE_SAMESITE || 'lax') as 'lax' | 'strict' | 'none'

    cookies().set('auth_token', data.access, {
        httpOnly: true,
        secure: isProd,
        sameSite: cookieSameSite,
        domain: cookieDomain,
        path: '/',
        maxAge: 60 * 30,
    })

    cookies().set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: isProd,
        sameSite: cookieSameSite,
        domain: cookieDomain,
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
    })

    return NextResponse.json({ message: 'Login successful' })
}
