import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body

    // Forward to your backend login API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const data = await res.json()

    // Set access token cookie
    cookies().set('auth_token', data.access, {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
        // maxAge: 60 // testing
    })

    // Set refresh token cookie
    cookies().set('refresh_token', data.refresh, {
        httpOnly: true,
        secure: process.env.APP_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
    })

    return NextResponse.json({ message: 'Login successful' })
}
