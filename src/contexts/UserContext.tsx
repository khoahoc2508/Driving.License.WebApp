'use client'

import { createContext, useContext, useState, useEffect } from 'react'

import { User } from '@/types/User'
import UserAPI from '@/libs/api/userAPI'

type UserContextType = {
  user: User
  setUser: (user: User) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await UserAPI.getUserInfo()
        const resData = res.data as unknown as {
          userName: string
          role: string[]
          avatarUrl: string,
          id: string
        }

        const user: User = {
          name: resData.userName,
          role: resData.role,
          avatar: resData.avatarUrl,
          id: resData.id
        }

        setUser(user)
      } catch (error) {
        console.error('Fetch user info failed:', error)
        setUser(null)
      }
    }

    fetchUser()
  }, [])

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>
}

export const useUser = () => {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }

  return context
}
