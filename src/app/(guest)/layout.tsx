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



export const metadata = {
  description: 'Ôn luyện lý thuyết và thi thử bằng lái xe miễn phí. Bộ đề chuẩn của Bộ Giao Thông Vận Tải, có mẹo giải nhanh, kết quả tức thì.',
  openGraph: {
    title: ' Thi Thử Bằng Lái Xe Online – Đề Chuẩn Mới Nhất',
    description: 'Ôn luyện lý thuyết và thi thử bằng lái xe miễn phí. Bộ đề chuẩn của Bộ Giao Thông Vận Tải, có mẹo giải nhanh, kết quả tức thì.',
    url: process.env.NEXT_PUBLIC_APP_URL + '/on-thi-bang-lai-xe',
    siteName: process.env.NEXT_PUBLIC_APP_URL,
    images: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL + '/images/thumbnail.jpg',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
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
