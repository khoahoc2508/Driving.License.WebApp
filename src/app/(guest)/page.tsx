import { getServerMode } from "@/@core/utils/serverHelpers"
import Home from "@/views/home"

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

const Page = async () => {

  const mode = await getServerMode()

  return <Home mode={mode} />
}

export default Page
