// lib/axios.ts
import axios from 'axios'
import { getSession } from 'next-auth/react'

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
