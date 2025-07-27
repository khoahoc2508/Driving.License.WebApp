// React Imports
import { useState } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Badge from '@mui/material/Badge'
import Rating from '@mui/material/Rating'

// Third-party Imports
import type { TrackDetails } from 'keen-slider/react'
import { useKeenSlider } from 'keen-slider/react'
import classnames from 'classnames'

// Styled Component Imports
import AppKeenSlider from '@/libs/styles/AppKeenSlider'

// SVG Imports
import Lines from '@assets/svg/front-pages/landing-page/Lines'
import Levis from '@assets/svg/front-pages/landing-page/Levis'
import Continental from '@assets/svg/front-pages/landing-page/Continental'
import Eckerd from '@assets/svg/front-pages/landing-page/Eckerd'
import Dribbble from '@assets/svg/front-pages/landing-page/Dribbble'
import Airbnb from '@assets/svg/front-pages/landing-page/Airbnb'

// Styles Imports
import frontCommonStyles from '@views/home/styles.module.css'


// Data
const data = [
  {
    desc: "Chúng tôi từng gặp rất nhiều khó khăn khi thu hồ sơ học viên, nhưng từ khi sử dụng phần mềm này, mọi thứ trở nên rõ ràng và dễ kiểm soát hơn rất nhiều.",
    svg: <Eckerd color='#2882C3' />,
    rating: 5,
    name: 'Nguyễn Văn Hải',
    position: 'Giám đốc Trung tâm Đào tạo Lái xe Hòa Bình'
  },
  {
    desc: "Giao diện thân thiện, dễ dùng, nhân viên tiếp nhận hồ sơ mới vào là làm được ngay. Tôi rất hài lòng về tính năng xuất báo cáo.",
    svg: <Levis color='#A8112E' />,
    rating: 5,
    name: 'Lê Thị Thanh',
    position: 'Quản lý hành chính - Trung tâm GPLX Quang Minh'
  },
  {
    desc: "Phần mềm giúp chúng tôi tiết kiệm hàng giờ mỗi tuần so với việc làm thủ công bằng Excel. Tìm kiếm và phân loại hồ sơ cực kỳ nhanh.",
    svg: <Airbnb color='#FF5A60' />,
    rating: 4,
    name: 'Phạm Văn Nam',
    position: 'Trưởng phòng đào tạo - Trường dạy lái Thành Công'
  },
  {
    desc: "Tôi rất ấn tượng với cách hệ thống hỗ trợ phân quyền rõ ràng cho nhân viên. Điều đó giúp kiểm soát dữ liệu tốt hơn nhiều.",
    svg: <Continental color='#F39409' />,
    rating: 5,
    name: 'Ngô Thị Mai',
    position: 'Phó Giám đốc Trung tâm GPLX Bình Dương'
  },
  {
    desc: "Chúng tôi có thể theo dõi tiến độ xử lý hồ sơ của từng đợt một cách trực quan. Đây thực sự là công cụ không thể thiếu.",
    svg: <Dribbble color='#ea4c89' />,
    rating: 5,
    name: 'Vũ Đức Anh',
    position: 'Cán bộ hồ sơ - Sở GTVT Hà Tĩnh'
  }
]

const CustomerReviews = () => {
  // States
  const [loaded, setLoaded] = useState<boolean>(false)
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [details, setDetails] = useState<TrackDetails>()

  // Hooks
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      slideChanged: slider => setCurrentSlide(slider.track.details.rel),
      created: () => setLoaded(true),
      detailsChanged: s => setDetails(s.track.details),
      slides: {
        perView: 4,
        origin: 'center'
      },
      breakpoints: {
        '(max-width: 1200px)': {
          slides: {
            perView: 3,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 900px)': {
          slides: {
            perView: 2,
            spacing: 26,
            origin: 'center'
          }
        },
        '(max-width: 600px)': {
          slides: {
            perView: 1,
            spacing: 26,
            origin: 'center'
          }
        }
      }
    },
    [
      slider => {
        let timeout: ReturnType<typeof setTimeout>
        const mouseOver = false

        function clearNextTimeout() {
          clearTimeout(timeout)
        }

        function nextTimeout() {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }

        slider.on('created', nextTimeout)
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  const scaleStyle = (idx: number) => {
    if (!details) return {}
    const activeSlideIndex = details.rel

    return {
      transition: 'transform 0.2s ease-in-out, opacity 0.2s ease-in-out',
      ...(activeSlideIndex === idx ? { transform: 'scale(1)', opacity: 1 } : { transform: 'scale(0.9)', opacity: 0.5 })
    }
  }

  return (
    <section className='flex flex-col gap-16 plb-[100px]'>
      <div className={classnames('flex flex-col items-center justify-center', frontCommonStyles.layoutSpacing)}>
        <div className='flex items-center justify-center mbe-6 gap-3'>
          <Lines />
          <Typography color='text.primary' className='font-medium uppercase'>
            Đánh Giá Khách Hàng
          </Typography>
        </div>
        <div className='flex items-center gap-2 mbe-1'>
          <Typography variant='h4' className='font-bold'>
            Những câu chuyện thành công
          </Typography>
          <Typography variant='h5'>từ người dùng thực tế</Typography>
        </div>
        <Typography className='font-medium text-center'>
          Xem các trung tâm đào tạo và đơn vị hành chính nói gì về trải nghiệm sử dụng phần mềm quản lý hồ sơ của chúng tôi.
        </Typography>
      </div>
      <AppKeenSlider>
        <>
          <div ref={sliderRef} className='keen-slider mbe-6'>
            {data.map((item, index) => (
              <div key={index} className='keen-slider__slide flex p-6 sm:p-4'>
                <Card elevation={8} className='flex items-center' style={scaleStyle(index)}>
                  <CardContent className='p-8 items-center mlb-auto'>
                    <div className='flex flex-col gap-4 items-center justify-center text-center'>
                      {item.svg}
                      <Typography color='text.primary'>{item.desc}</Typography>
                      <Rating value={item.rating} readOnly />
                      <div>
                        <Typography variant='h6'>{item.name}</Typography>
                        <Typography variant='body2'>{item.position}</Typography>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
          {loaded && instanceRef.current && (
            <div className='swiper-dots'>
              {[...Array(instanceRef.current.track.details.slides.length).keys()].map(idx => {
                return (
                  <Badge
                    key={idx}
                    variant='dot'
                    component='div'
                    className={classnames({ active: currentSlide === idx })}
                    onClick={() => instanceRef.current?.moveToIdx(idx)}
                  />
                )
              })}
            </div>
          )}
        </>
      </AppKeenSlider>
      <div className='flex flex-wrap items-center justify-center gap-x-16 gap-y-6 mli-3'>
        <Levis color='var(--mui-palette-text-secondary)' />
        <Continental color='var(--mui-palette-text-secondary)' />
        <Airbnb color='var(--mui-palette-text-secondary)' />
        <Eckerd color='var(--mui-palette-text-secondary)' />
        <Dribbble color='var(--mui-palette-text-secondary)' />
      </div>
    </section>
  )
}

export default CustomerReviews
