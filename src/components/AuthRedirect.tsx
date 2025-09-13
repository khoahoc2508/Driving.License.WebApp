'use client'

// Next Imports
import { redirect, usePathname } from 'next/navigation'

// Type Imports

// Config Imports
import themeConfig from '@configs/themeConfig'
import CONFIG from '@/configs/config'

// Util Imports

const AuthRedirect = () => {
  const pathname = usePathname()

  const redirectUrl = `${CONFIG.Routers.Login}?redirectTo=${encodeURIComponent(pathname)}`
  const login = CONFIG.Routers.Login
  const homePage = themeConfig.homePageUrl

  return redirect(pathname === login ? login : pathname === homePage ? login : redirectUrl)
}

export default AuthRedirect
