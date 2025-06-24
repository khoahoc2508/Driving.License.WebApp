// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Grid from '@mui/material/Grid2'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import ElementOne from '@/assets/svg/front-pages/landing-page/ElementOne'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

type FaqsDataTypes = {
  id: string
  question: string
  active?: boolean
  answer: string
}

const FaqsData: FaqsDataTypes[] = [
  {
    id: 'panel1',
    question: 'Tôi có cần cài đặt phần mềm không?',
    answer:
      'Không. Công cụ của chúng tôi hoạt động hoàn toàn trên nền tảng web. Bạn chỉ cần trình duyệt và kết nối internet để sử dụng mọi tính năng.'
  },
  {
    id: 'panel2',
    question: 'Dữ liệu hồ sơ có được lưu trữ an toàn không?',
    active: true,
    answer:
      'Có. Chúng tôi sử dụng hệ thống lưu trữ bảo mật theo tiêu chuẩn hiện đại. Dữ liệu được sao lưu định kỳ và chỉ người được phân quyền mới có quyền truy cập.'
  },
  {
    id: 'panel3',
    question: 'Tôi có thể phân quyền tuyển cộng tác viên không?',
    answer:
      'Hoàn toàn được. Hệ thống cho phép tạo tài khoản với vai trò khác nhau như quản trị viên, cộng tác viên, v.v.'
  },
  {
    id: 'panel4',
    question: 'Phần mềm có dùng được trên điện thoại hoặc máy tính bảng không?',
    answer:
      'Có. Giao diện được tối ưu cho cả thiết bị di động lẫn máy tính, giúp bạn có thể kiểm tra và thao tác ở bất kỳ đâu.'
  }
]

const Faqs = () => {
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
    <section
      id='faq'
      ref={ref}
      className={classnames('flex flex-col gap-16 plb-[100px]', frontCommonStyles.layoutSpacing)}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center items-center relative'>
          <ElementOne className='absolute inline-end-0' />
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography variant='h6' className='uppercase'>
              FAQ
            </Typography>
          </div>
        </div>
        <div className='flex items-baseline flex-wrap gap-2 mbe-3 sm:mbe-1'>

          <Typography variant='h4' className='font-bold'>
            Câu Hỏi
          </Typography>
          <Typography variant='h5'>Thường Gặp</Typography>
        </div>
        <Typography className='font-medium text-center'>
          Dưới đây là những câu hỏi phổ biến từ người dùng. Nếu bạn còn điều gì thắc mắc, đừng ngần ngại liên hệ với chúng tôi.
        </Typography>
      </div>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, lg: 5 }} className='text-center'>
          <img
            src='/images/front-pages/landing-page/sitting-girl-with-laptop.png'
            alt='girl with laptop'
            className='is-[80%] max-is-[320px]'
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          {FaqsData.map((data, index) => {
            return (
              <Accordion key={index} defaultExpanded={data.active}>
                <AccordionSummary aria-controls={data.id + '-content'} id={data.id + '-header'}>
                  {data.question}
                </AccordionSummary>
                <AccordionDetails>{data.answer}</AccordionDetails>
              </Accordion>
            )
          })}
        </Grid>
      </Grid>
    </section>
  )
}

export default Faqs
