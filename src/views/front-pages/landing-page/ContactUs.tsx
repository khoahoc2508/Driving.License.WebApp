// React Imports
import { useEffect, useRef } from 'react'

// MUI Imports
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import { useIntersection } from '@/hooks/useIntersection'

// SVG Imports
import ElementTwo from '@assets/svg/front-pages/landing-page/ElementTwo'
import Lines from '@assets/svg/front-pages/landing-page/Lines'

// Styles Imports
import frontCommonStyles from '@views/front-pages/styles.module.css'

const ContactUs = () => {
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
      id='contact-us'
      className={classnames('flex flex-col gap-14 plb-[100px]', frontCommonStyles.layoutSpacing)}
      ref={ref}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='flex is-full justify-center items-center relative'>
          <ElementTwo className='absolute inline-start-0' />
          <div className='flex items-center justify-center mbe-6 gap-3'>
            <Lines />
            <Typography variant='h6' className='uppercase'>
              Liên Hệ Với Chúng Tôi
            </Typography>
          </div>
        </div>
        <div className='flex items-baseline flex-wrap gap-2 mbe-3 sm:mbe-1'>
          <Typography variant='h5' className='font-bold'>
            Cùng hợp tác để đơn giản hóa việc quản lý hồ sơ
          </Typography>
        </div>
        <Typography className='font-medium text-center'>Có thắc mắc hoặc cần tư vấn thêm?
          Hãy để lại tin nhắn – chúng tôi sẽ phản hồi trong thời gian sớm nhất.</Typography>
      </div>
      <div>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12, md: 6, lg: 5 }}>
            <Card className='bg-primary'>
              <CardContent className='flex flex-col gap-5 pli-8 pbs-8 pbe-7'>
                <div className='flex flex-col gap-1.5'>
                  <Typography className='font-medium text-white'>Liên Hệ Với Chúng Tôi</Typography>
                  <Typography variant='h4' className='text-white'>
                    Chia sẻ nhu cầu hoặc ý tưởng của bạn cùng đội ngũ của chúng tôi.
                  </Typography>
                </div>
                <img src='/images/front-pages/landing-page/chat.png' alt='chat' className='is-full' />
                <Typography className='text-white'>
                  Cần tuỳ biến thêm, bổ sung tính năng riêng, hoặc có yêu cầu đặc thù? Đừng lo – đội ngũ giàu kinh nghiệm của chúng tôi luôn sẵn sàng đồng hành cùng bạn.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 7 }}>
            <Card>
              <CardContent>
                <Typography variant='h5' className='mbe-5'>
                  Liên hệ chúng tôi
                </Typography>
                <form className='flex flex-col items-start gap-5'>
                  <div className='flex gap-5 is-full'>
                    <TextField fullWidth label='Họ và tên' id='name-input' />
                    <TextField fullWidth label='Địa chỉ Email' id='email-input' type='email' />
                  </div>
                  <TextField fullWidth multiline rows={6} label='Tin nhắn' id='message-input' />
                  <Button variant='contained'>Gửi yêu cầu</Button>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </section>
  )
}

export default ContactUs
