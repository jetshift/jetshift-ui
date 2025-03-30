import axios from 'axios'

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`, // Django API URL
})

// Add access token to every request
api.interceptors.request.use(config => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Handle response errors (e.g., expired token)
api.interceptors.response.use(
    response => response,
    error => {
        const errData = error?.response?.data

        if (errData?.code === 'token_not_valid' || errData?.detail === 'Given token not valid for any token type') {
            // Optional: Clear tokens
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')

            // Redirect to login
            if (typeof window !== 'undefined') {
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)

export default api
