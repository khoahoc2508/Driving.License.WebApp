// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import LaptopCharging from '@assets/svg/front-pages/landing-page/LaptopCharging'
import TransitionUp from '@assets/svg/front-pages/landing-page/TransitionUp'
import Edit from '@assets/svg/front-pages/landing-page/Edit'
import Cube from '@assets/svg/front-pages/landing-page/Cube'
import LifeBuoy from '@assets/svg/front-pages/landing-page/Lifebuoy'
import Document from '@assets/svg/front-pages/landing-page/Document'

// Styles Imports
import styles from './styles.module.css'
import frontCommonStyles from '@views/home/styles.module.css'

// Data
const feature = [
  {
    icon: <LaptopCharging />,
    title: 'Đa Nền Tảng',
    description: 'Tương thích nhiều thiết bị như điện thoại, máy tính bảng, laptop.'
  },
  {
    icon: <TransitionUp />,
    title: 'Thống kê & Báo cáo',
    description: 'Thống kê & Báo cáo chính xác, không cần Excel, không cần tổng hợp thủ công.'
  },
  {
    icon: <Edit />,
    title: 'Tra cứu đơn giản',
    description: 'Phục vụ tra cứu nhanh, tiện theo tên, số CMND/CCCD, loại giấy phép'
  },
  {
    icon: <Cube />,
    title: 'Phần quyền linh hoạt',
    description: 'Cho quản trị viên, nhân viên tiếp nhận, người kiểm tra.'
  },
  {
    icon: <Document />,
    title: 'Quản lý tập trung',
    description: 'Toàn bộ hồ sơ quản lý theo thời gian, theo loại xe, theo từng học viên'
  },
  {
    icon: <LifeBuoy />,
    title: 'Tiết kiệm thời gian',
    description: 'Tiết kiệm đến 70% thời gian xử lý hồ sơ mỗi ngày.'
  },

]

const UsefulFeature = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  // Hooks
  const { updateIntersections } = useIntersection()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (skipIntersection.current) {
          skipIntersection.current = false

          return
        }

        updateIntersections({ [entry.target.id]: entry.isIntersecting })
      },
      { threshold: 0.35 }
    )

    ref.current && observer.observe(ref.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section id='features' ref={ref} className='bg-backgroundPaper'>
      <div className={classnames('flex flex-col gap-12 plb-[100px]', frontCommonStyles.layoutSpacing)}>
        <div className='flex flex-col items-center justify-center'>
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography color='text.primary' className='font-medium uppercase'>
              Lợi Ích Nổi Bật
            </Typography>
          </div>
          <div className='flex items-center justify-center flex-wrap gap-2 mbe-2 sm:mbe-1'>
            <Typography variant='h4' className='font-bold'>
              Tất cả những gì bạn cần
            </Typography>
            <Typography variant='h5'>để quản lý hồ sơ lái xe hiệu quả</Typography>
          </div>
          <Typography className='font-medium text-center'>
            Một nền tảng hoàn chỉnh giúp bạn dễ dàng bắt đầu, kiểm soát và theo dõi quá trình thu nhận hồ sơ GPLX.
          </Typography>
        </div>
        <div>
          <Grid container columnSpacing={6} rowSpacing={12}>
            {feature.map((item, index) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={index}>
                <div className='flex flex-col gap-2 justify-center items-center'>
                  <div className={classnames('mbe-2', styles.featureIcon)}>
                    <div className='flex items-center border-2 rounded-full p-5 is-[82px] bs-[82px]'>{item.icon}</div>
                  </div>
                  <Typography variant='h5'>{item.title}</Typography>
                  <Typography className='max-is-[364px] text-center'>{item.description}</Typography>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </section>
  )
}

export default UsefulFeature
