'use client'

import { useEffect } from 'react'

import axiosInstance from '@/libs/axios'

export default function Page() {
  useEffect(() => {
    const fetchProtectedData = async () => {
      try {
        const res = await axiosInstance.get('/api/Licenses/registrations')

        console.log('res', res)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }

    fetchProtectedData()
  }, [])

  return <h1>Home page!</h1>
}
