// lib/axios.ts
import axios from 'axios'
import { getSession, signOut } from 'next-auth/react'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000
})

axiosInstance.interceptors.request.use(async request => {
  const session = await getSession()

  if (session) {
    request.headers['Authorization'] = `Bearer ${session.accessToken}`
  }

  return request
})

export default axiosInstance

// Response interceptor: if we still get 401 after NextAuth tried to refresh,
// assume refresh token is invalid/expired and force sign out.
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const status = error?.response?.status

    if (status === 401) {
      const currentPath = window.location.pathname
      const redirectUrl = `/login?redirectTo=${encodeURIComponent(currentPath)}`
      await signOut({ callbackUrl: redirectUrl })
    }

    return Promise.reject(error)
  }
)
