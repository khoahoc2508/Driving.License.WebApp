import type { Viewport } from 'next'

import LandingPageWrapper from '@/views/on-thi-bang-lai-xe'


export const metadata = {
  title: 'Thi Thử Bằng Lái Xe Online – Đề Chuẩn Mới Nhất | banglaixanh.vn',
  description: 'Ôn luyện lý thuyết và thi thử bằng lái xe miễn phí. Bộ đề chuẩn của Bộ Giao Thông Vận Tải, có mẹo giải nhanh, kết quả tức thì.',
  openGraph: {
    title: 'Thi Thử Bằng Lái Xe Online – Đề Chuẩn Mới Nhất',
    description: 'Ôn luyện lý thuyết và thi thử bằng lái xe miễn phí. Bộ đề chuẩn của Bộ Giao Thông Vận Tải, có mẹo giải nhanh, kết quả tức thì.',
    url: process.env.NEXT_PUBLIC_APP_URL + '/on-thi-bang-lai-xe',
    siteName: process.env.NEXT_PUBLIC_APP_URL + '/on-thi-bang-lai-xe',
    images: [
      {
        url: process.env.NEXT_PUBLIC_APP_URL + '/images/og_thumbnail_on_thi_bang_lai_xe.jpg',
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

const Page = async () => {
  return <LandingPageWrapper />
}

export default Page
