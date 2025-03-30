import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body

    // Forward to your backend login API
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const data = await res.json()

    // Set token in secure cookie
    cookies().set('auth_token', data.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
    })

    return NextResponse.json({ message: 'Login successful' })
}
