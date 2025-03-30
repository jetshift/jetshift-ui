'use client'
export async function login(username: string, password: string) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username, password}),
    })

    return res.ok
}

export async function logout() {
    await fetch('/api/logout', {
        method: 'POST',
    })

    // Optionally: redirect to login page
    window.location.href = '/login'
}
