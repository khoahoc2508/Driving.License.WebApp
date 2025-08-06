// React Imports
import { useEffect, useRef, useState } from 'react'

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
import frontCommonStyles from '@views/home/styles.module.css'
import { Controller, useForm } from 'react-hook-form'
import contactAPI from '@/libs/api/contactAPI'
import { toast } from 'react-toastify'

type FormValues = {
  fullName: string
  email: string
  message: string
}


const ContactUs = () => {
  // Refs
  const skipIntersection = useRef(true)
  const ref = useRef<null | HTMLDivElement>(null)

  const [loading, setLoading] = useState(false)

  // Form hooks
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      message: ''
    },
    mode: 'onChange'
  })

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

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true)

      await contactAPI.CreateContact({
        fullName: data.fullName,
        email: data.email,
        message: data.message
      })

      reset()
      toast.success('Gửi yêu cầu thành công!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Đã xảy ra lỗi')
    } finally {
      setLoading(false)
    }
  }


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
                <form className='flex flex-col items-start gap-5' onSubmit={handleSubmit(onSubmit)}>
                  <div className='flex gap-5 is-full'>
                    <Controller
                      name="fullName"
                      control={control}
                      rules={{
                        required: 'Vui lòng nhập họ và tên',
                        minLength: {
                          value: 3,
                          message: 'Họ và tên phải có ít nhất 3 ký tự'
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Họ và tên'
                          error={!!errors.fullName}
                          helperText={errors.fullName?.message}
                        />
                      )}
                    />
                    <Controller
                      name="email"
                      control={control}
                      rules={{
                        required: 'Vui lòng nhập email',
                        pattern: {
                          value: /^\S+@\S+\.\S+$/,
                          message: 'Email không hợp lệ'
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label='Địa chỉ Email'
                          type='email'
                          error={!!errors.email}
                          helperText={errors.email?.message}
                        />
                      )}
                    />
                  </div>
                  <Controller
                    name="message"
                    control={control}
                    rules={{
                      required: 'Vui lòng nhập tin nhắn',
                      minLength: {
                        value: 10,
                        message: 'Tin nhắn phải có ít nhất 10 ký tự'
                      }
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={6}
                        label='Tin nhắn'
                        error={!!errors.message}
                        helperText={errors.message?.message}
                      />
                    )}
                  />
                  <Button
                    variant='contained'
                    type='submit'
                    disabled={loading}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                  </Button>
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
