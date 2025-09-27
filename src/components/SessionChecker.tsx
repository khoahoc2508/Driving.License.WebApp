'use client'

// React Imports
import { useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// NextAuth Imports
import { useSession, signOut } from 'next-auth/react'

// Config Imports
import CONFIG from '@/configs/config'

const SessionChecker = () => {
    const { data: session, status } = useSession()
    const router = useRouter()

    useEffect(() => {
        // Check if session has error (token expired)
        if (session?.error) {
            console.log('Session error detected:', session.error)

            // Sign out and redirect to login
            signOut({ callbackUrl: CONFIG.Routers.Login })
            
return
        }

        // If unauthenticated, redirect to login
        if (status === 'unauthenticated') {
            console.log('User is unauthenticated, redirecting to login')
            router.push(CONFIG.Routers.Login)
            
return
        }
    }, [session, status, router])

    // This component doesn't render anything
    return null
}

export default SessionChecker
