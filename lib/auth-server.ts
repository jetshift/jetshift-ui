import { cookies } from 'next/headers'

// Simple JWT decode without verifying signature
function parseJwt(token: string) {
    try {
        return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    } catch {
        return null
    }
}

export function getUserFromCookie() {
    const token = cookies().get('auth_token')?.value
    if (!token) return null

    return parseJwt(token)
}
