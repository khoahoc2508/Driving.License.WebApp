// MUI Imports
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'

// Third-party Imports
import 'react-perfect-scrollbar/dist/css/styles.css'

// Type Imports
import type { ChildrenType } from '@core/types'

// Context Imports

// Component Imports
import Providers from '@components/Providers'
import BlankLayout from '@layouts/BlankLayout'
import FrontLayout from '@/components/layout/home'

// Util Imports
import { getSystemMode } from '@core/utils/serverHelpers'

// Style Imports
import '@/app/globals.css'

// Generated Icon CSS Imports
import '@assets/iconify-icons/generated-icons.css'
import { IntersectionProvider } from '@/contexts/intersectionContext'
import ScrollToTopClient from '@/components/ScrollToTopClient'
import { Viewport } from 'next'

export const metadata = {
  title: 'Giải Pháp Quản Lý Hồ Sơ Thông Minh – Tiết Kiệm Thời Gian & Chi Phí | banglaixanh.vn',
  description: 'Quản lý hồ sơ nhanh chóng, bảo mật và hiệu quả. Hỗ trợ lưu trữ, tra cứu, xử lý hồ sơ trực tuyến mọi lúc, mọi nơi.',
  openGraph: {
    title: 'Giải Pháp Quản Lý Hồ Sơ Thông Minh – Tiết Kiệm Thời Gian & Chi Phí',
    description: 'Quản lý hồ sơ nhanh chóng, bảo mật và hiệu quả. Hỗ trợ lưu trữ, tra cứu, xử lý hồ sơ trực tuyến mọi lúc, mọi nơi.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL + '/images/og_thumbnail_home.jpg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false
}

const Layout = async ({ children }: ChildrenType) => {
  // Vars
  const systemMode = await getSystemMode()

  return (
    <html id='__next' suppressHydrationWarning>
      <body className='flex is-full min-bs-full flex-auto flex-col'>
        <InitColorSchemeScript attribute='data' defaultMode={systemMode} />
        <Providers direction='ltr'>
          <BlankLayout systemMode={systemMode}>
            <IntersectionProvider>
              <FrontLayout>
                {children}
                <ScrollToTopClient />
              </FrontLayout>
            </IntersectionProvider>
          </BlankLayout>
        </Providers>
      </body>
    </html>
  )
}

export default Layout
