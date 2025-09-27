import type { DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session {
    accessToken: string
    error?: string
    user: {
      id: string
      access_token: string
      role?: string
      username?: string
    } & DefaultUser['user']
  }
}
