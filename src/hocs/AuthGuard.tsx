// Third-party Imports
import { getServerSession } from 'next-auth'

// Type Imports
import type { ChildrenType } from '@core/types'

// Component Imports
import AuthRedirect from '@/components/AuthRedirect'

export default async function AuthGuard({ children }: ChildrenType) {
  const session = await getServerSession()

  // If no session or session is invalid, redirect to login
  if (!session) {
    return <AuthRedirect />
  }

  return <>{children}</>
}
